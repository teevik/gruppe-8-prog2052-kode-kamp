import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import { Server as Httpserver } from "http";
import {Server} from 'socket.io'

import {socketAllowOrigin} from './middleware/socket'

import type { ServerToClientEvents, ClientToServerEvents, SocketData } from './socketio/types';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app : Express = express();

app.use(socketAllowOrigin);

app.get("/", (req : Request,res : Response)=>{
    res.send("hello world");
})

const server : Httpserver = app.listen(PORT, ()=>{
    console.log(`Server is listening on port: ${PORT}`);
})

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData
>(server, {
    cors: {
        origin: "http://localhost:5173",  // Allow all origins, or specify a specific origin if needed
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket)=>{
    console.log("client with socket.id: ", socket.id, " connected!");
})