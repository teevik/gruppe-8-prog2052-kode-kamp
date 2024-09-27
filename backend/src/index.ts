import type {Express} from 'express'
import express from 'express'
import {Server} from 'socket.io'
import { Server as Httpserver } from "http";
import type {ClientToServerEvents, ServerToClientEvents, SocketData} from './socketio/types'

import {initChallenges, getRandomChallenge} from './socketio/challenge'
import {initLobby} from './socketio/lobby'
import { socketAllowOrigin } from './middleware/socket'

initChallenges();

const app : Express = express();
const PORT = 3000;

app.use(socketAllowOrigin);

let server : Httpserver = app.listen(PORT, ()=>{
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

io.on('connection', initLobby)

export {
    io
}