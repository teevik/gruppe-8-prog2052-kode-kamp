import express from "express";
import type { Express, Request, Response } from "express";
import dotenv from 'dotenv';
import { Server as Httpserver } from "http";
import {Server, Socket} from 'socket.io'
import {v4 as uuidv4} from 'uuid';

import {socketAllowOrigin} from './middleware/socket'

import {randomUsernames, 
    PORT, 
    MAX_PLAYERS_PR_GAME, 
    COUNTDOWN_LENGTH_SECONDS, 
    TIME_AT_ENDSCREEN_SECONDS, 
    GAME_LENGTH_MINUTES,
    LOBBY_TIMER_SECONDS,
    GAME_MODES
} from './socketio/const'

import type { ServerToClientEvents, ClientToServerEvents, SocketData, Game, Lobby} from './socketio/types';

dotenv.config();

const app : Express = express();

let gameCount = 0;

app.use(socketAllowOrigin);

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



let lobby : Lobby = {
    players : [],
    gameMode: GAME_MODES[0],
    // taskID : "1"
};

let lobbyCountdownCounter : number = LOBBY_TIMER_SECONDS;

let lobbyInterval : any = null;

function lobbyCountdown (){
    //Emit countdown event to all cients
    let countDownValue = `${lobbyCountdownCounter}s`;
    

    //Check if there are any players in the lobby, if not, clear this interval and reset lobbyCountdownCounter
    if(lobby.players.length == 0 || lobby.players.length == 1){
        lobbyInterval = null;
        lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
        countDownValue = ""
    } else {
        lobbyCountdownCounter--;
    }

    if(lobbyCountdownCounter == 0){
        createGameRoom()
        resetLobbyCountdown()
    } else {
        io.emit('lobbyCountdown', countDownValue)
    }
    
}

const emojiList = ["🧑", "🐸", "🐱", "🐶", "🦄", "🐼", "🐧", "🦁", "🐝", "🐢"];

// Function to randomly pick an emoji
const getRandomEmoji = () => {
    return emojiList[Math.floor(Math.random() * emojiList.length)];
};

io.on('connection', (socket)=>{
    console.log("client with socket.id: ", socket.id, " connected!");
    emitLobbyUpdate()

    socket.on('joinLobby', ()=>{
        joinLobby(socket)
        handleLobbyCountdown()
    })
    
    socket.on('disconnect', ()=>{
        console.log("client with socket.id: ", socket.id, " disconnected");
    })
})

function handleLobbyCountdown(){
    if (!lobbyInterval && lobby.players.length > 1){
        lobbyInterval = setInterval(lobbyCountdown, 1000);
    } else if (lobby.players.length < 2){
        resetLobbyCountdown()
    }
}

function resetLobbyCountdown(){
    clearInterval(lobbyInterval)
    lobbyInterval = null;
    lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
    io.emit('lobbyCountdown', "")
}

function joinLobby(socket : Socket){
    //TODO: call middleware function to validate jwt token and set socket.data.userID to the ID of the player
    //This is so that we can track the stats of the player
    socket.data.userID = uuidv4();
    socket.data.userName = randomUsernames[Math.floor(Math.random() * randomUsernames.length)];
    socket.data.emoji = getRandomEmoji();
    
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
    socket.emit('lobbyJoined', lobby.players.map(player=>player.data));

    //Emit to entire lobby that player has joined
    io.to('lobby').emit('playerJoinedLobby', socket.data);

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
        io.to('lobby').emit('playerLeftLobby', socket.data);
        emitLobbyUpdate()
        handleLobbyCountdown()
    })
}

function emitLobbyUpdate(){
    io.emit('lobbyUpdate', lobby.players.length, MAX_PLAYERS_PR_GAME )
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
    lobby.gameMode = GAME_MODES[Math.floor(Math.random() * GAME_MODES.length)];
    
}

function startGame(gameRoomID : string, players : Socket[], gameMode : string){

    //Initialize som datastructure to hold gameresults ???
    let game : Game = {scoreboard:[]};

    //Choose a task for this game (task of the given gameMode)
    let taskID = "123"; //Change to actual taskIDs 

    //Emit the taskID so that the client can fetch the
    io.to(gameRoomID).emit('gameStart', taskID, gameMode);

    players.forEach((socket)=>{
        
        socket.on('submitCode', async (code)=>{

            //Server-side validation so that the user dont spam the scoreboard
            if(socket.data.complete){
                return
            }
            

            //Handling code submission differently based on gamemode
            switch (gameMode) {
                case GAME_MODES[0]:
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