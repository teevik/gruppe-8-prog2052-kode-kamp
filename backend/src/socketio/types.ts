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
    scoreboard : (scoreboard : SocketData[]) => void;
}

interface ClientToServerEvents {
    submitCode: () => void;
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