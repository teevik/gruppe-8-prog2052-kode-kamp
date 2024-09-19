import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import { Server as Httpserver } from "http";
import {Server} from 'socket.io'

import type { ServerToClientEvents, ClientToServerEvents, SocketData } from './socketio/types';

dotenv.config();

const app : Express = express();
const PORT = process.env.PORT || 3000;

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
>(server);

io.on('connection', (socket)=>{
    console.log(socket.id);
    
})