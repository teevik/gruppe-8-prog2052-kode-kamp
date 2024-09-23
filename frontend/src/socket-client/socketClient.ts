import {io} from 'socket.io-client';

function joinLobby(){

    const socket = io("http://localhost:3000");
    
    socket.on("lobbyJoined", (args)=>{
        console.log("Joined lobby!", args);
    })

    socket.on("gameJoined", (args)=>{
        console.log("Joined game!", args);
    })

    socket.on("countdown", (args)=>{
        console.log("countdown", args);
    })
}

export {
    joinLobby
}