import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
// import {login,logoff} from "./db"
type User = {
  id: string;
  sid: string;
  role: string;
  userName: string;
};

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  /** Master list of all connected users */
  public users: User[];

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = [];
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
          //origin: "https://hperioncrm.com", // Replace with your frontend's origin
          origin: "*", 
          methods: ["GET", "POST"],
          credentials: false // If you're using cookies or authentication        
      },
    });

    this.io.on("connect", this.StartListeners);
  }
  Actions = (userId: string, type: string, dt: any, dt1: any) => {    
    const sid = this.GetSocketIdFromUid(userId);
    switch (type) {
      case "conversation:updated":
        this.SendUserMessage("conversation-updated-recieved", sid, {
          dt,
        });
        this.SendUserMessage("conversation-message-notify", sid);
        break;
        case "conversation-messages:new":
        this.SendUserMessage("conversation-messages-new", sid, {
          dt
        });
        break
        case "calllog:new":
          this.SendUserMessage("calllog-new", sid,{dt});
        break;
        case "leads:new":
        this.SendUserMessage("leads-new", sid,{dt});
      break;
    }
  };
  StartListeners = (socket: Socket) => {
    console.info("Message received from " + socket.id);

    socket.on(
      "handshake",
      (
        userId,
        role,
        userName,
        callback: (uid: string, users: User[]) => void
      ) => {
        console.info("Handshake received from: " + socket.id, userId);

        const reconnected = this.users.find((e) => e.sid == socket.id);

        if (reconnected) {
          console.info("This user has reconnected.");

          const uid = this.GetUidFromSocketId(socket.id);
          if (uid) {
            console.info("Sending callback for reconnect ...");
            // logoff(uid)
            callback(uid, this.users);
            return;
          }
        }
        this.users.push({ id: userId, sid: socket.id, role, userName });

        console.info("Sending callback ...");
        callback(userId, this.users);
        //  login(userId)

        this.SendMessage(
          "user_connected",
          this.users.filter((e) => e.sid !== socket.id),
          this.users
        );
      }
    );

    socket.on("disconnect", () => {
      console.info("Disconnect received from: " + socket.id);

      const uid = this.GetUidFromSocketId(socket.id);
      if (uid) {
        // logoff(uid)
        this.SendMessage("user_disconnected", this.users, uid);
      }
      this.users = this.users.filter((e) => e.sid != socket.id);
    });
    //GROUP MESSAGE
    socket.on("group-message-sent", (message) => {
      const uid = this.GetUidFromSocketId(socket.id);
      const username=this.users.find(e=>e.id==uid)?.userName
      const users = this.users.filter((e) => e.id != uid);
      this.SendMessage("group-message-received", users, { message,username });
    });
    //CONFERENCE
    socket.on("coach-request", (conference) => {
      const uid = this.GetUidFromSocketId(socket.id);
      const users = this.users.filter((e) => e.role == "admin" && e.id != uid);
      this.SendMessage("coach-request-received", users, { conference });
    });
    socket.on("coach-joined", (userId, conferenceId, coachId, coachName) => {
      const uid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("coach-joined-received", uid, {
        conferenceId,
        coachId,
        coachName,
      });
    });
    socket.on("coach-reject", (userId, coachName, reason) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("coach-reject-received", sid, {
        coachName,
        reason,
      });
    });
    //CHAT MESSAGES
    socket.on("chat-message-sent", (userId, message) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("chat-message-received", sid, {
        message,
      });
    });
    //LEAD SHARING
    socket.on("lead-shared", (userId, agentName, leadId, leadFirstName) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("lead-shared-received", sid, {
        agentName,
        leadId,
        leadFirstName,
      });
    });
    socket.on("lead-unshared", (userId, agentName, leadId, leadFirstName) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("lead-unshared-received", sid, {
        agentName,
        leadId,
        leadFirstName,
      });
    });
    //LEAD TRANSFER
    socket.on(
      "lead-transfered",
      (userId, agentName, leadIds, leadFirstName) => {
        const sid = this.GetSocketIdFromUid(userId);
        this.SendUserMessage("lead-transfered-received", sid, {
          agentName,
          leadIds,
          leadFirstName,
        });
      }
    );
    //LEAD ASSISTANT
    socket.on(
      "lead-assistant-added",
      (userId, agentName, leadId, leadFirstName) => {
        const sid = this.GetSocketIdFromUid(userId);
        this.SendUserMessage("lead-assistant-added-received", sid, {
          agentName,
          leadId,
          leadFirstName,
        });
      }
    );
    socket.on(
      "lead-assistant-removed",
      (userId, agentName, leadId, leadFirstName) => {
        const sid = this.GetSocketIdFromUid(userId);
        this.SendUserMessage("lead-assistant-removed-received", sid, {
          agentName,
          leadId,
          leadFirstName,
        });
      }
    );
  };

  GetUidFromSocketId = (sid: string) => {
    return this.users.find((e) => e.sid == sid)?.id;
  };
  GetSocketIdFromUid = (uid: string) => {
    return this.users.find((e) => e.id == uid)?.sid;
  };

  SendMessage = (name: string, users: User[], payload?: Object) => {
    console.info("Emitting event: " + name + " to", users);
    users.forEach((user) =>
      payload
        ? this.io.to(user.sid).emit(name, payload)
        : this.io.to(user.sid).emit(name)
    );
  };
  SendUserMessage = (
    name: string,
    sid: string | undefined,
    payload?: Object
  ) => {
    if (!sid) return;
    console.info("Emitting event: " + name + " to", sid);

    payload ? this.io.to(sid).emit(name, payload) : this.io.to(sid).emit(name);
  };
}
