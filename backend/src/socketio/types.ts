interface Score{
    userID : string;
    time : number;
}

interface ServerToClientEvents {
    lobbyJoined : (playerIDs : string[]) => void;
    playerJoinedLobby: (playerID : string) => void;
    playerLeftLobby : (playerID : string) => void;
    gameStart: (taskID : string) => void;
    gameOver: () => void;
    countdown : (counter : number) => void;
    task : (taskID : string) => void;
    updateScoreboard : (scores : SocketData[]) => void;
    lobbyUpdate : (amountPlayers : string) => void;
    lobbyCountdown : (counter : string) => void;
}

interface ClientToServerEvents {
    submitCode: () => void;
    joinLobby : () => void;
}

interface SocketData {
    userID : string;
    complete : boolean;
}

export type {
    ServerToClientEvents,
    ClientToServerEvents,
    SocketData
}