import {Socket} from 'socket.io'

interface Score{
    userID : string;
    time : number;
}

interface ServerToClientEvents {
    lobbyJoined : (playerIDs : string[]) => void;
    playerJoinedLobby: (playerData : SocketData) => void;
    playerLeftLobby : (playerData : SocketData) => void;
    gameStart: (taskID : string, gameMode : string) => void;
    gameOver: () => void;
    countdown : (counter : number) => void;
    task : (taskID : string) => void;
    updateScoreboard : (scores : SocketData[]) => void;
    lobbyUpdate : (amountPlayers : number, totalPlayers : number) => void;
    lobbyCountdown : (counter : string) => void;
}

interface ClientToServerEvents {
    submitCode: () => void;
    joinLobby : () => void;
    leaveLobby : ()=>void;
}

interface SocketData {
    userID : string;
    userName : string;
    complete : boolean;
    emoji : string;
}

interface Game {
    scoreboard : SocketData[],
}


interface Lobby {
    players : Socket[],
    gameMode : string,
    // taskID : string
}

export type {
    ServerToClientEvents,
    ClientToServerEvents,
    SocketData,
    Game,
    Lobby
}