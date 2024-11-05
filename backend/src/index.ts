import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import { Server as Httpserver } from "http";
import path from "path";
import { Server } from "socket.io";
import type { SocketData } from "../../shared/types";
import { RATE_LIMIT_MAX, RATE_LIMIT_MINUTE_INTERVAL } from "./const";
import connectdb from "./database/db";
import { initLobby } from "./socketio/lobby";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./socketio/types";

const app: Express = express();
const PORT = 3000;

const root = process.cwd();
const limiter = rateLimit({
  windowMs: RATE_LIMIT_MINUTE_INTERVAL * 60 * 1000,
  max: RATE_LIMIT_MAX,
});

connectdb();
// const testUser = new User({username: "testuser", points: 0, hashedPassword: "fefef", email: "hello@gmail.com"});
// testUser.save();

app.use(limiter);

app.use(express.static(path.join(root, "./public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "./public/index.html"));
});

let server: Httpserver = app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  server,
  {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  }
);

io.on("connection", initLobby);

export { io };
