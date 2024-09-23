import {useEffect, useState} from 'react'
import {socket} from '../socket'

function SocketClient(){
    const [inLobby, setInLobby] = useState(false);

    useEffect(()=>{

        socket.connect();
    
        socket.on("lobbyJoined", (args)=>{
            console.log("You have joined the lobby, here are the players: ", args);
            setInLobby(true);
        })

        socket.on("playerJoinedLobby", (args)=>{
            console.log("Player joined the lobby: ", args);
            
        })

        socket.on("playerLeftLobby", (args)=>{
            console.log("Player left the lobby: ", args);
        })

        socket.on("gameJoined", (args)=>{
            console.log("Joined game: ", args);
        })

        socket.on("gameStart", (args)=>{
            console.log("Game started! Task ID: ", args);
        })

        socket.on("countdown", (args)=>{
            console.log("Counter", args);
        })

        socket.on("scoreboard", (args)=>{
            console.log("Scoreboard is updated", args)
        })

        

        // Event to emit when code is to be submitted
        // socket.emit("submitCode", code);
        socket.on("success", (args)=>{
            console.log("Success! Results: ", args)
        })

        socket.on("fail", (args)=>{
            console.log("Fail... Results: ", args)
        })

        socket.on("gameOver", (_)=>{
            //Display end screen with scoreboard and such
        })
    }, [])

    return (
        <>
            {/*inLobby ? <Lobby/>:<Game/> */}
            {inLobby ? 
            
            <button onClick={()=>{
                let code = "your code here";
                socket.emit("submitCode", code);
            }}>Submit code</button>
            : "Joining game..."}
        </>
    )
    

    
}

export {
    SocketClient
}