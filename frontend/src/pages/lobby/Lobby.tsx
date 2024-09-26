import {useEffect, useState} from 'react'
import {socket} from '../../socket'
import { SocketData } from '../landing/types'

interface LobbyProps {
    players : SocketData[];
    player : SocketData | undefined;
}

export default function Lobby({players, player} : LobbyProps){
    const [countdownLobby, setCountdownLobby] = useState<string>("");
    const [countdownStartGame, setCountdownStartGame] = useState<string>("");

    
    const [amountPlayersLobby, setAmountPlayersLobby] = useState(0);
    const [totalPlayersLobby, setTotalPlayersLobby] = useState(0);
    

    useEffect(()=>{
        function lobbyCountdown(counter : string){
            setCountdownLobby(counter);
        }

        socket.on("lobbyCountdown", lobbyCountdown)
        socket.on("lobbyUpdate", lobbyUpdate)

        socket.on("countdown", startGameCountdown)

        return ()=>{
            socket.off("lobbyCountdown", lobbyCountdown);
            socket.off("lobbyUpdate", lobbyUpdate)
            socket.off("countdown", startGameCountdown)
            
        };

    }, [countdownLobby])

    

    function joinLobby(){
        socket.emit("joinLobby");
    }

    function lobbyUpdate(amountPlayers : number, totalPlayers : number){
        setAmountPlayersLobby(amountPlayers);
        setTotalPlayersLobby(totalPlayers);
    }

    function startGameCountdown(counter : string){
        console.log("Counter", counter);
        setCountdownStartGame(counter)
    }

    

    return (
        
        <div className="landingPage">
            {countdownStartGame !== "" && (<p>Game starts in: {countdownStartGame}</p>)}
            {countdownStartGame == "" && (<>
            
                <header>
                    <h1>KodeKamp Lobby</h1>
                    <p>Compete together, grow together</p>
                </header>
                {/* Lobby section, placeholder for real one for now, fix some way of adding the game mode and mby showing some other info, like difficulty, if there is time */}
                <div className="lobbyContainer">
                    <div className="lobbyHeader">
                    <h3>🧑‍🤝‍🧑 Public lobby</h3>
                    <p>Join the upcoming challenge and compete with others</p>
                    </div>
                    {/* Players section, placeholder for real one for now, here we see how many players are in the lobby, could just be a number out of 4 or 8 based on lobby size for now */}
                    <div className="playerGrid">
                    {Array.from({ length: totalPlayersLobby }, (_, index) => (
                        <div key={index} className="playerSlot">
                        {index < amountPlayersLobby && players[index] ? (
                            <span role="img" aria-label="Player icon">
                            {players[index].emoji}
                                <p>{players[index].userName}</p>
                            </span>
                            
                        ) : (
                            <div className="emptySlot" />
                        )}
                        </div>
                    ))}
                    </div>
                    
                    <p>{amountPlayersLobby}/{totalPlayersLobby} Players in lobby</p>
                    <p>{countdownLobby}</p>
                    

                    {/* Join button, fix this so that this sends you to the correct game based on gameID */}
                    <button className="joinButton" onClick={()=>{joinLobby()}}>Join</button>

                </div>

                <footer>
                    <p>© 2020 Your Company, Inc. All rights reserved.</p>
                    <a href="#terms">Terms of Service</a>
                </footer>
            
            </>)}
        </div>
    )
}