import http from "http";
import express from "express";
import { ServerSocket } from "./socket";
import { runJobs } from "./schedule";

const app = express();

/** Server Handling */
const server = http.createServer(app);

/** Start Socket */
new ServerSocket(server);

/** Start job scheduler */
runJobs();


/** Log the request */
app.use((req, res, next) => {
  console.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    console.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
    );
  });

  next();
});

/** Parse the body of the request */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Rules of our API */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res, next) => {
  return res.status(200).json({ hello: "Entry point working fine!" });
});

app.get("/socket", (req, res, next) => {
  return res.status(200).json({ hello: "Socket is working!" });
});

app.post("/socket", async (req, res, next) => {
    const { userId, type, dt, dt1 } = await req.body;
    ServerSocket.instance.Actions(userId, type, dt, dt1);
    return res.status(200).json({ hello: "Socket is working!" });
  });


/** Healthcheck */
app.get("/ping", (req, res, next) => {
  return res.status(200).json({ hello: "world!" });
});

/** Socket Information */
app.get("/status", (req, res, next) => {
  return res.status(200).json({ users: ServerSocket.instance.users });
});

/** Error handling */
app.use((req, res, next) => {
  const error = new Error("Not found");

  res.status(404).json({
    message: error.message,
  });
});

/** Listen */
server.listen(4000, () => console.info(`Server is running`));
