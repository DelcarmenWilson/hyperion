const io = require("socket.io")(4000, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("A user has connected.");
});
console.log("hello");
