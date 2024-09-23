import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import { Server as Httpserver } from "http";
import {Server, Socket} from 'socket.io'

import {socketAllowOrigin} from './middleware/socket'

import type { ServerToClientEvents, ClientToServerEvents, SocketData } from './socketio/types';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS_PR_GAME : number = 4;
const COUNTDOWN_LENGTH_SECONDS : number = 5;

const app : Express = express();
const gameModes : string[] = ["First to finish", "Fastest code"];

let gameCount = 0;

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

interface Player extends Socket {

}

// interface Game extends Lobby {
//     gameRoomID : string,
// }



interface Lobby {
    players : Socket[],
    gameMode : string,
    // taskID : string
}


let lobby : Lobby = {
    players : [],
    gameMode: gameModes[0],
    // taskID : "1"
};

io.on('connection', (socket)=>{
    console.log("client with socket.id: ", socket.id, " connected!");

    //TODO: call middleware function to validate jwt token and set socket.data.userID to the ID of the player
    //This is so that we can track the stats of the player

    
    const rejoinGameRoom = socket.handshake.query.gameRoomID;
    if(typeof rejoinGameRoom === "string"){
        if(io.sockets.adapter.rooms.get(rejoinGameRoom)){
            socket.join(rejoinGameRoom);
        }
    }
    
    // Add player to lobby
    lobby.players.push(socket);
    socket.join('lobby');


    //Emit lobbyJoined event
    socket.to('lobby').emit('lobbyJoined', lobby.gameMode);

    //Create game room if lobby is full createGameRoom()
    if(lobby.players.length == MAX_PLAYERS_PR_GAME){
        createGameRoom();
    }

    //Listen for disconnect event and remove from lobby
    socket.on('disconnect', ()=>{
        lobby.players = lobby.players.filter(player => player !== socket)
        console.log("client with socket.id", socket.id, " disconnected")
    })
})

function createGameRoom(){
    
    let gameRoomID = `${++gameCount}`;
    
    //Move players into gameroom
    let players : Socket[] = lobby.players.splice(0, MAX_PLAYERS_PR_GAME);
    
    players.forEach((socket)=>{
        socket.leave('lobby');
        socket.join(gameRoomID);
        socket.to(gameRoomID).emit('gameJoined', gameRoomID);
    })

    let countDown = COUNTDOWN_LENGTH_SECONDS;
    const countDownInterval = setInterval(()=>{
        players.forEach((socket)=>{
            socket.to(gameRoomID).emit('countdown', countDown)
        })
        countDown--;
    }, 1000);

    setTimeout(()=>{
        clearInterval(countDownInterval);
        startGame(gameRoomID, players, lobby.gameMode);
    }, COUNTDOWN_LENGTH_SECONDS * 1000 + 1000)

    //Change gamemode and task of lobby
    lobby.gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    
}

function startGame(gameRoomID : string, players : Socket[], gameMode : string){
    //Choose a task for this game (task of the given gameMode)

    //Emit the taskID so that the client can fetch the 

    //Listen for game events (and disconnect), and broadcast the events to the same room
    
    //Start timeout to finish the game and 
}