import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Client connnected: ${socket.id}`);
    //CONFERENCES
    socket.on("coach-request", (agent, lead, conference) => {
      io.emit("coach-request-received", agent, lead, conference);
    });
    socket.on("coach-joined", (conferenceId) => {
      io.emit("coach-joined-recieved", conferenceId);
    });
    socket.on("test", () => {
      console.log("test emmited");
      io.emit("test-recieved");
    });
  });
  res.end();
}
