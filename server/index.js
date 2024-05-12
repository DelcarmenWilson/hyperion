const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors());
const baseUrl = "http://localhost";
const domain = "localhost";
const port = 4000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: `${baseUrl}:3000`, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log(`client Connected:${socket.id}`);
  socket.emit("connected");
  // socket.on("new-call", (call) => {
  //   console.log("call has been emmited");
  //   socket.emit("new-call", call);
  // });
  //CONFERENCES
  socket.on("coach-request", (lead, conference) => {
    io.emit("coach-request-received", lead, conference);
    console.log("coach requested");
  });
  socket.on("coach-joined", (conferenceId, coachId, coachName) => {
    io.emit("coach-joined-recieved", conferenceId, coachId, coachName);
    console.log("coach joined");
  });
  socket.on("coach-reject", (coachName, reason) => {
    io.emit("coach-reject-recieved", coachName, reason);
    console.log("coach reject a call");
  });
  //TEST
  socket.on("test", () => {
    console.log("test emmited");
    io.emit("test-recieved");
  });
});

server.listen(port, domain, () => {
  console.log(`Server listening on Port ${port}`);
});
