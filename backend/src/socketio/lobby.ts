import {Socket} from 'socket.io'
import {v4 as uuidv4} from 'uuid';

import {EMOJIS, GAME_MODES, RANDOM_USERNAMES, MAX_PLAYERS_PR_GAME, LOBBY_TIMER_SECONDS} from './const'
import type {Lobby} from './types'
import {io} from '../index'
import {createGameRoom} from './game'

// Function to randomly pick an emoji
function getRandomEmoji() : string {
    return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
};


let lobby : Lobby = {
    players : [],
    gameMode: GAME_MODES[0],
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

function initLobby(socket : Socket){
    console.log("client with socket.id: ", socket.id, " connected!");
    emitLobbyUpdate();

    socket.on('joinLobby', ()=>{

        //Makes sure that each user can only fill one spot in the lobby
        if(!lobby.players.find(p=>socket.id == p.id)){
            joinLobby(socket);
            handleLobbyCountdown();
        }
    })
    
    socket.on('disconnect', ()=>{
        console.log("client with socket.id: ", socket.id, " disconnected");
    })
}

function joinLobby(socket : Socket){

    //TODO: call middleware function to validate jwt token and set socket.data.userID to the ID of the player
    //This is so that we can track the stats of the player
    socket.data.userID = uuidv4();
    socket.data.userName = RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
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
    socket.emit('lobbyJoined', socket.data, lobby.players.map(player=>player.data));

    //Emit to entire lobby that player has joined (does not emit to itself)
    socket.broadcast.to('lobby').emit('playerJoinedLobby', socket.data);

    //Emit to all clients that amount of players in lobby is updated
    emitLobbyUpdate()

    //Create game room if lobby is full createGameRoom()
    if(lobby.players.length == MAX_PLAYERS_PR_GAME){
        createGameRoom();
    }

    socket.on('leaveLobby', ()=>{
        leaveLobby(socket);
    })

    //Listen for disconnect event and remove from lobby
    socket.on('disconnect', ()=>{
        leaveLobby(socket);
        console.log("client with socket.id", socket.id, " disconnected")
    })
}

function leaveLobby(socket : Socket){
    lobby.players = lobby.players.filter(player => player !== socket)
    io.to('lobby').emit('playerLeftLobby', socket.data);
    emitLobbyUpdate()
    handleLobbyCountdown()
}


function handleLobbyCountdown(){
    if (!lobbyInterval && lobby.players.length > 1){
        lobbyInterval = setInterval(lobbyCountdown, 1000);
    } else if (lobby.players.length < 2){
        resetLobbyCountdown()
    }
}

function emitLobbyUpdate(){
    io.emit('lobbyUpdate', lobby.players.length, MAX_PLAYERS_PR_GAME )
}

function resetLobbyCountdown(){
    clearInterval(lobbyInterval)
    lobbyInterval = null;
    lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
    io.emit('lobbyCountdown', "")
}

export {
    emitLobbyUpdate,
    initLobby,
    lobby
}