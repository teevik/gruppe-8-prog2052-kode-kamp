import {useEffect, useState} from 'react'
import {socket} from '../socket'

function SocketClient(){
    const [inLobby, setInLobby] = useState(false);
    const [players, setPlayers] = useState([""]);
    const [player, setPlayer] = useState("");

    const [countdownLobby, setCountdownLobby] = useState("");
    const [amountPlayersLobby, setAmountPlayersLobby] = useState("0/8");

    function updatePlayers(p : string[]){
        setPlayers(p);
    }

    function updatePlayer(p : string){
        setPlayer(p);
    }

    useEffect(()=>{
        socket.connect();
    }, [])

    useEffect(()=>{

        function playerJoinedLobby(args : string){
            {
                if (player === "") {
                    console.log("You have joined the lobby, userID: ", args)
                    updatePlayer(args)
                } else {
                    console.log("Player joined the lobby: ", args);
                    let playersUpdated : string[] = [...players];
                    playersUpdated.push(args)
                    console.log("updated players: ", playersUpdated)
                    updatePlayers(playersUpdated)
                }
                
            }
        }

        function playerLeftLobby(player : string) {
            console.log("Player left the lobby: ", player);
            updatePlayers(players.filter(player=> player!=player));
        }

        function gameJoined(gameRoomID : string){
            console.log("Joined game with ID: ", gameRoomID);
        }

        function lobbyJoined(players : string[]){
            console.log("You have joined the lobby, here are the players: ", players);
            updatePlayers(players);
            setInLobby(true);
        }

        function gameStart(taskID : string){
            console.log("Game started! Task ID: ", taskID);
        }

        function countdown(counter : string){
            console.log("Counter", counter);
        }

        function updateScoreboard(scores : string[]){
            console.log("Scoreboard is updated", scores)
        }

        function success(result : string){
            console.log("Success! Results: ", result)
        }

        function fail(result : string){
            console.log("Fail... Results: ", result)
        }

        function gameOver(){
            //Display end screen with scoreboard and such
        }

        function lobbyCountdown(counter : string){
            setCountdownLobby(counter);
        }

        function lobbyUpdate(amountPlayers : string){
            setAmountPlayersLobby(amountPlayers);
        }
    
        socket.on("lobbyJoined", lobbyJoined)
        socket.on("playerJoinedLobby", playerJoinedLobby)
        socket.on("playerLeftLobby", playerLeftLobby)
        socket.on("gameJoined", gameJoined)
        socket.on("gameStart", gameStart)
        socket.on("countdown", countdown)
        socket.on("updateScoreboard", updateScoreboard)
        // Event to emit when code is to be submitted
        // socket.emit("submitCode", code);
        socket.on("success", success)
        socket.on("fail", fail)
        socket.on("gameOver", gameOver)

        socket.on("lobbyCountdown", lobbyCountdown)
        socket.on("lobbyUpdate", lobbyUpdate)

        return () => {
            socket.off("lobbyJoined", lobbyJoined)
            socket.off("playerJoinedLobby", playerJoinedLobby)
            socket.off("playerLeftLobby", playerLeftLobby)
            socket.off("gameJoined", gameJoined)
            socket.off("gameStart", gameStart)
            socket.off("countdown", countdown)
            socket.off("updateScoreboard", updateScoreboard)
            socket.off("success", success)
            socket.off("fail", fail)
            socket.off("gameOver", gameOver)
        };
    }, [player, players, inLobby, countdownLobby])

    function joinLobby(){
        socket.emit("joinLobby");
    }

    return (
        <>
            <p>Amount of players in lobby: {amountPlayersLobby}</p>
            {countdownLobby != "" && <p>Lobby starts in {countdownLobby}</p>}
            {players.length > 0 && players.map(player=>{
                return <p key={player}>{player}</p>
            })}
            {/*inLobby ? <Lobby/>:<Game/> */}
            {inLobby ? 
            
            <button onClick={()=>{
                let code = "your code here";
                socket.emit("submitCode", code);
            }}>Submit code</button>
            : <button onClick={()=>{
                joinLobby()
            }}>Join lobby</button>}
        </>
    )
    

    
}



export {
    SocketClient
}