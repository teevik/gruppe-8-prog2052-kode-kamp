import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import { Server as Httpserver } from "http";
import path from "path";
import { Server, Socket, type DefaultEventsMap } from "socket.io";
import { VERIFY_ROUTE } from "../../shared/const";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/types";
import { RATE_LIMIT_MAX, RATE_LIMIT_MINUTE_INTERVAL } from "./const";
import connectdb from "./database/db";
import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { verifyHandler } from "./routers/verify";
import { initLobby } from "./socketio/lobby";
import { createContext, publicProcedure, router } from "./trpc";
import { env } from "./env";

const app: Express = express();

const root = process.cwd();
const limiter = rateLimit({
  windowMs: RATE_LIMIT_MINUTE_INTERVAL * 60 * 1000,
  max: RATE_LIMIT_MAX,
});

connectdb();

app.use(limiter);

app.use(express.static(path.join(root, "./public")));

// tRPC router
const appRouter = router({
  ping: publicProcedure.query(() => "pong"),
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.get(`${VERIFY_ROUTE}/:jwtToken`, verifyHandler);

app.get("*", (req, res) => {
  res.sendFile(path.join(root, "./public/index.html"));
});

let server: Httpserver = app.listen(env.PORT, () => {
  console.log(`Server is listening on port: ${env.PORT}`);
});

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>;

export type GameSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;

const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  server,
  {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  },
);

io.on("connection", (socket) => initLobby(socket, io));
