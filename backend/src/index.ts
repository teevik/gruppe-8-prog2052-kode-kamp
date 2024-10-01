import type { Express } from "express";
import express from "express";
import { Server } from "socket.io";
import { Server as Httpserver } from "http";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./socketio/types";
import type { SocketData } from "../../shared/types";

import { initChallenges } from "./socketio/challenge";
import { initLobby } from "./socketio/lobby";
import path from "path";

initChallenges();

const app: Express = express();
const PORT = 3000;

const root = process.cwd();

app.use(express.static(path.join(root, "./public")));

app.get("/", (req, res) => {
  console.log(path.join(root, "./public/index.html"));
  res.sendFile(path.join(root, "./public/index.html"));
});

let server: Httpserver = app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  server,
  {
    cors: {
      origin: "http://localhost:5173", // Allow all origins, or specify a specific origin if needed
      methods: ["GET", "POST"],
    },
  },
);

io.on("connection", initLobby);

export { io };
