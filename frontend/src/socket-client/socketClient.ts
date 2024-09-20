import {io} from 'socket.io-client';

function joinLobby(){

    const socket = io("ws://localhost:3000");
    
    socket.on("hello", (args)=>{
        console.log(args);
    })
}

export {
    joinLobby
}