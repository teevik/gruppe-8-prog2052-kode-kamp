import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import { Server as Httpserver } from "http";
import {Server, Socket} from 'socket.io'

import {socketAllowOrigin} from './middleware/socket'
import {randomUsernames} from './socketio/usernames'

import type { ServerToClientEvents, ClientToServerEvents, SocketData } from './socketio/types';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS_PR_GAME : number = 4;
const COUNTDOWN_LENGTH_SECONDS : number = 5;
const TIME_AT_ENDSCREEN_SECONDS : number = 60;
const GAME_LENGTH_MINUTES : number = 15;
const LOBBY_TIMER_SECONDS : number = 30;

const app : Express = express();
const gameModes : string[] = ["First to finish"];

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



interface Game {
    scoreboard : SocketData[],
}


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

let lobbyCountdownCounter : number = LOBBY_TIMER_SECONDS;

let lobbyInterval : any = null;

function lobbyCountdown (){
    //Emit countdown event to all cients
    let countDownValue = `${lobbyCountdownCounter}s`;
    

    //Check if there are any players in the lobby, if not, clear this interval and reset lobbyCountdownCounter
    if(lobby.players.length == 0){
        lobbyInterval = null;
        lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
        countDownValue = ""
    } else {
        lobbyCountdownCounter--;
    }

    if(lobbyCountdownCounter == 0){
        createGameRoom()
        lobbyInterval = null;
        lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
        countDownValue = ""
    }
    io.emit('lobbyCountdown', countDownValue)
}

io.on('connection', (socket)=>{
    console.log("client with socket.id: ", socket.id, " connected!");
    emitLobbyUpdate()

    socket.on('joinLobby', ()=>{
        if (!lobbyInterval){
            lobbyInterval = setInterval(lobbyCountdown, 1000);
        }
        joinLobby(socket)
    })
    
    socket.on('disconnect', ()=>{
        console.log("client with socket.id: ", socket.id, " disconnected");
    })
})

function joinLobby(socket : Socket){
    //TODO: call middleware function to validate jwt token and set socket.data.userID to the ID of the player
    //This is so that we can track the stats of the player
    socket.data.userID = randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
    
    // const rejoinGameRoomID = socket.handshake.query.gameRoomID;
    // if(typeof rejoinGameRoomID === "string"){
    //     if(io.sockets.adapter.rooms.get(rejoinGameRoomID)){
    //         socket.join(rejoinGameRoomID);
    //         joinGame(socket);
    //     }
    // }
    
    // Add player to lobby
    lobby.players.push(socket);
    socket.join('lobby');

    //Confirmation to user that lobby was joined successfully and returning the name of all the players
    socket.emit('lobbyJoined', lobby.players.map(player=>player.data.userID));

    //Emit to entire lobby that player has joined
    io.to('lobby').emit('playerJoinedLobby', socket.data.userID);

    //Emit to all clients that amount of players in lobby is updated
    emitLobbyUpdate()

    //Create game room if lobby is full createGameRoom()
    if(lobby.players.length == MAX_PLAYERS_PR_GAME){
        createGameRoom();
    }

    //Listen for disconnect event and remove from lobby
    socket.on('disconnect', ()=>{
        lobby.players = lobby.players.filter(player => player !== socket)
        console.log("client with socket.id", socket.id, " disconnected")
        io.to('lobby').emit('playerLeftLobby', socket.data.userID);
        emitLobbyUpdate()
    })
}

function emitLobbyUpdate(){
    io.emit('lobbyUpdate', `${lobby.players.length}/${MAX_PLAYERS_PR_GAME}`)
}

function createGameRoom(){
    
    let gameRoomID = `${++gameCount}`;
    
    //Move players into gameroom
    let players : Socket[] = lobby.players.splice(0, MAX_PLAYERS_PR_GAME);
    emitLobbyUpdate()
    
    players.forEach((socket)=>{
        socket.leave('lobby');
        socket.join(gameRoomID);
        socket.emit('gameJoined', gameRoomID);
    })

    let countDown = COUNTDOWN_LENGTH_SECONDS;
    const countDownInterval = setInterval(()=>{
        io.to(gameRoomID).emit('countdown', countDown);
        countDown--;
    }, 1000);

    setTimeout(()=>{
        clearInterval(countDownInterval);
        startGame(gameRoomID, players, lobby.gameMode);
    }, COUNTDOWN_LENGTH_SECONDS * 1000 + 1000)

    //Change gamemode for the refreshed lobby
    lobby.gameMode = gameModes[Math.floor(Math.random() * gameModes.length)];
    
}

function startGame(gameRoomID : string, players : Socket[], gameMode : string){

    //Initialize som datastructure to hold gameresults ???
    let game : Game = {scoreboard:[]};

    //Choose a task for this game (task of the given gameMode)
    let taskID = "123"; //Change to actual taskIDs 

    //Emit the taskID so that the client can fetch the
    io.to(gameRoomID).emit('gameStart', taskID);

    players.forEach((socket)=>{
        
        socket.on('submitCode', async (code)=>{

            //Server-side validation so that the user dont spam the scoreboard
            if(socket.data.complete){
                return
            }
            

            //Handling code submission differently based on gamemode
            switch (gameMode) {
                case gameModes[0]:
                    //Send code to code runner
                    
                    //Handle result (amount of tests passed/total amount of tests)
                    let testsPassed = 100;
                    let totalTests = 100;
                    
                    let result = `${testsPassed}/${totalTests}`
                    
                    //if all tests passed, push player onto scoreboard
                    if(testsPassed == totalTests) {
                        //Updating the scoreboard
                        game.scoreboard.push(socket.data);

                        //Emitting to the client that code ran successfully for all the tests
                        socket.emit('success', result)
                        socket.data.complete = true;

                        //Emitting to all clients that the scoreboard is updated
                        io.to(gameRoomID).emit('updateScoreboard', game.scoreboard)

                        if(game.scoreboard.length == players.length){
                            endGame(gameRoomID, players);
                        }
                    } else {
                        socket.emit('fail', result)
                    }                
            }
        })

        socket.on('disconnect', ()=>{
            
        })
    })

    //Listen for game events (and disconnect), and broadcast the events to the same room
        //When code is submitted, pass the code to code runner, 
        //if the code is accepted by the code runner
            //emit to all sockets that a user has completed
    
    //Start timeout to finish the game
        //When the game is finished, emit gameOver event to all clients, together with data for scores and scoreboard
        //Also register statistics for all sockets that has a userID, use the userID to update stats in the database
        //Start new timeout for terminating the game by making all sockets to leave the current room
    setTimeout(()=>{
        endGame(gameRoomID, players);
    }, GAME_LENGTH_MINUTES * 60 * 1000)
}

function endGame(gameRoomID : string, players: Socket[]) {

    //TODO: update stats and give points

    io.to(gameRoomID).emit('gameOver')

    setTimeout(()=>{
        players.forEach((socket)=>{
            socket.disconnect(true);
        })
    }, TIME_AT_ENDSCREEN_SECONDS * 1000)
}