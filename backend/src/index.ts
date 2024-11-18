import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import { Server as Httpserver } from "http";
import path from "path";
import { Server } from "socket.io";
import type { SocketData } from "../../shared/types";
import {
  RATE_LIMIT_MAX,
  RATE_LIMIT_MINUTE_INTERVAL,
  PORT,
  VERIFY_ROUTE,
} from "./const";
import connectdb from "./database/db";
import { authRouter } from "./routers/auth";
import { initLobby } from "./socketio/lobby";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./socketio/types";
import { createContext, publicProcedure, router } from "./trpc";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./env";
import { userSchema } from "./user";
import { User as UserSchema } from "./database/model/user";
import { verifyHandler } from "./routers/verify";

const app: Express = express();

const root = process.cwd();
const limiter = rateLimit({
  windowMs: RATE_LIMIT_MINUTE_INTERVAL * 60 * 1000,
  max: RATE_LIMIT_MAX,
});

connectdb();
// const testUser = new User({username: "testuser", points: 0, hashedPassword: "fefef", email: "hello@gmail.com"});
// testUser.save();

// sendVerifyEmail({
//   username: "Ulrik",
//   email: "ulrik.hesmyr@gmail.com",
//   id: "testid",
// });

app.use(limiter);

app.use(express.static(path.join(root, "./public")));

// tRPC router
const appRouter = router({
  ping: publicProcedure.query(() => "pong"),
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

app.use(cors());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.get(`${VERIFY_ROUTE}/:jwtToken`, verifyHandler);

app.get("/", (req, res) => {
  res.sendFile(path.join(root, "./public/index.html"));
});

let server: Httpserver = app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>;

const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(
  server,
  {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  }
);

io.on("connection", (socket) => initLobby(socket, io));
