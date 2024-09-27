import {Socket} from 'socket.io'

interface Score{
    userID : string;
    time : number;
}

interface ServerToClientEvents {
    lobbyJoined : (playerIDs : string[]) => void;
    playerJoinedLobby: (playerData : SocketData) => void;
    playerLeftLobby : (playerData : SocketData) => void;
    gameStart: (challenge : Challenge, gameMode : string) => void;
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


interface TestResults {
    totalTests : number;
    passedTests : number;
    executionTimeUs : number;
}


interface Challenge {
    title : string;
    license : string;
    attribution : {name : string, url : string}[];
    description : string;
    input : string;
    output : string;
    template : string;
    sample_tests : Test[];
    tests : Test[];
}

interface Test {
    input : string[];
    output : string[];
}

export type {
    ServerToClientEvents,
    ClientToServerEvents,
    SocketData,
    Game,
    Lobby,
    Challenge,
    Test,
    TestResults
}