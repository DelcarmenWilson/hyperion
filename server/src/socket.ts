import { Server as HttpServer } from "http";
import { Socket, Server } from "socket.io";
// import {login,logoff} from "./db"
type User = {
  id: string;
  sid: string;
  role: string;
  userName: string;
  orgId: string;
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
        credentials: false, // If you're using cookies or authentication
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
          dt,
        });
        break;
      case "calllog:new":
        this.SendUserMessage("calllog-new", sid, { dt });
        break;
      case "leads:new":
        this.SendUserMessage("leads-new", sid, { dt });
        break;
        case "notification:new":
        this.SendUserMessage("notification-recieved", sid, { dt });
        break;
        case "todo:reminder":
        this.SendUserMessage("todo-reminder-recieved", sid, { dt });
        break;
    }
  };
  StartListeners = (socket: Socket) => {
    this.Log("Message received from " + socket.id);

    socket.on(
      "handshake",
      (
        userId,
        role,
        userName,
        orgId,
        callback: (uid: string, users: User[]) => void
      ) => {
        this.Log("Handshake received from: " + socket.id, userId);

        const reconnected = this.users.find((e) => e.sid == socket.id);
        let organizationUsers = this.GetOrganizationUsers(orgId);

        if (reconnected) {
          this.Log("This user has reconnected.");

          const uid = this.GetUidFromSocketId(socket.id);
          if (uid) {
            this.Log("Sending callback for reconnect ...");
            // logoff(uid)
            callback(uid, organizationUsers);
            return;
          }
        }
        this.users.push({ id: userId, sid: socket.id, role, userName, orgId });

        this.Log("Sending callback ...");
        organizationUsers = this.GetOrganizationUsers(orgId);
        callback(userId, organizationUsers);
        
         const users = organizationUsers.filter((e) => e.sid !== socket.id);
        //  login(userId)
        this.SendMessage("user_connected", users, userId);
      }
    );

    socket.on("disconnect", () => {
      this.Log("Disconnect received from: " + socket.id);

      const user = this.GetUserFromSocketId(socket.id);

      if (user?.id) {
        const organizationUsers = this.GetOrganizationUsers(user.orgId);
        // logoff(uid)
        this.SendMessage("user_disconnected", organizationUsers, user.id);
      }
      this.users = this.users.filter((e) => e.sid != socket.id);
    });
    //GROUP MESSAGE
    socket.on("group-message-sent", (message) => {
      const user = this.GetUserFromSocketId(socket.id);
      if (user) {
        const organizationUsers = this.GetOrganizationUsers(user.orgId);
        const users = organizationUsers.filter((e) => e.id != user.id);
        this.SendMessage("group-message-received", users, {
          message,
          username: user.userName,
        });
      }
    });
    //CONFERENCE
    socket.on("coach-request", (conference) => {
      const user = this.GetUserFromSocketId(socket.id);
      if (user) {
        const organizationUsers = this.GetOrganizationUsers(user.orgId);
        const users = organizationUsers.filter(
          (e) => e.role == "admin" && e.id != user.id
        );
        this.SendMessage("coach-request-received", users, { conference });
      }
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
    // CHAT ACTIONS
    socket.on("chat-action-sent", (userId,chatId, action) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("chat-action-received", sid, {
        chatId,
        action,
      });
    });
    //CHAT MESSAGES
    socket.on("chat-message-sent", (userId, message) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("chat-message-received", sid, {
        message,
      });
    });
    socket.on("chat-is-typing-sent", (userId,myUserId) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("chat-is-typing-received", sid, {myUserId});
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
    //ADMIN FUNCTIONS
     //CHAT MESSAGES
     socket.on("account-suspended-sent", (userId) => {
      const sid = this.GetSocketIdFromUid(userId);
      this.SendUserMessage("account-suspended-recieved", sid, {});
    });
  };

  GetOrganizationUsers = (orgId: string) => {
    return this.users.filter((e) => e.orgId == orgId);
  };
  GetUserFromSocketId = (sid: string) => {
    return this.users.find((e) => e.sid == sid);
  };
  GetUidFromSocketId = (sid: string) => {
    return this.users.find((e) => e.sid == sid)?.id;
  };
  GetSocketIdFromUid = (uid: string) => {
    return this.users.find((e) => e.id == uid)?.sid;
  };

  SendMessage = (name: string, users: User[], payload?: Object) => {
    this.Log("Emitting event: " + name + " to", users);
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
    this.Log("Emitting event: " + name + " to", sid);

    payload ? this.io.to(sid).emit(name, payload) : this.io.to(sid).emit(name);
  };
  Log=(message:string,extramessage?:any)=>{
    console.info(message,extramessage)
  }
}
