interface Score{
    userID : string;
    time : number;
}

interface ServerToClientEvents {
    lobbyJoined: (gameMode : string) => void;
    gameStarted: (gameRoomID : string) => void;
    gameOver: (gameRoomID : string, scores : [Score]) => void;
}

interface ClientToServerEvents {
    submitCode: () => void;
}

interface SocketData {
    userID : string;
}

export type {
    ServerToClientEvents,
    ClientToServerEvents,
    SocketData
}