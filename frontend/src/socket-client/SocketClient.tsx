import {useEffect, useState} from 'react'
import {socket} from '../socket'
//import {SocketData} from '@backend/socketio/types'

interface SocketData {
    userID : string;
    userName : string;
}

function SocketClient(){
    const [inLobby, setInLobby] = useState<boolean>(false);
    const [players, setPlayers] = useState<SocketData[]>([]);
    const [player, setPlayer] = useState<SocketData | undefined>(undefined);

    const [countdownLobby, setCountdownLobby] = useState("");
    const [amountPlayersLobby, setAmountPlayersLobby] = useState(0);
    const [totalPlayersLobby, setTotalPlayersLobby] = useState(0);

    function updatePlayers(p : SocketData[]){
        setPlayers(p);
    }

    function updatePlayer(p : SocketData){
        setPlayer(p);
    }

    useEffect(()=>{
        socket.connect();
    }, [])

    useEffect(()=>{

        function playerJoinedLobby(args : SocketData){
            {
                if (player === undefined) {
                    console.log("You have joined the lobby, userID: ", args)
                    updatePlayer(args)
                } else {
                    console.log("Player joined the lobby: ", args);
                    let playersUpdated : SocketData[] = [...players];
                    playersUpdated.push(args)
                    console.log("updated players: ", playersUpdated)
                    updatePlayers(playersUpdated)
                }
                
            }
        }

        function playerLeftLobby(player : SocketData) {
            console.log("Player left the lobby: ", player);
            let playersUpdated = [...players];
            playersUpdated = playersUpdated.filter(p=> player.userID !== p.userID)
            console.log("player.userID ", player.userID);
            console.log("updated players: ", playersUpdated)
            updatePlayers(playersUpdated);
        }

        function gameJoined(gameRoomID : string){
            console.log("Joined game with ID: ", gameRoomID);
        }

        function lobbyJoined(players : SocketData[]){
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

        function lobbyUpdate(amountPlayers : number, totalPlayers : number){
            setAmountPlayersLobby(amountPlayers);
            setTotalPlayersLobby(totalPlayers);
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
            <p>Amount of players in lobby: {amountPlayersLobby}/{totalPlayersLobby}</p>
            {countdownLobby != "" && <p>Lobby starts in {countdownLobby}</p>}
            {players.length > 0 && players.map(player=>{
                return <p key={player.userID}>{player.userName}</p>
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