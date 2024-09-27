import { FC, useState, useEffect } from "react";
import "./LandingPage.css"; // Ensure this path is correct
import {socket} from '../../socket'
import { SocketData } from "./types";

import GamePage from "../game/GamePage";
import Lobby from "../lobby/Lobby";

const LandingPage: FC = () => {

  

  

  const [inGame, setInGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<SocketData[]>([]);
  const [player, setPlayer] = useState<SocketData | undefined>(undefined);
  const [taskID, setTaskID] = useState<string>("");
  const [gameMode, setGameMode] = useState<string>("");
    

  function updatePlayers(p : SocketData[]){
    setPlayers(p);
  }

  function updatePlayer(p : SocketData | undefined){
    setPlayer(p);
  }

  useEffect(()=>{
      socket.connect();
  }, [])

    useEffect(()=>{

        function playerJoinedLobby(p : SocketData){
            {
              console.log("Player joined the lobby: ", p);
              let playersUpdated : SocketData[] = [...players];
              console.log("playerJoinedLobby ", updatePlayers)
              playersUpdated.push(p)
              console.log("updated players: ", playersUpdated)
              updatePlayers(playersUpdated)
                
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

        function lobbyJoined(p : SocketData, ps : SocketData[]){
          console.log("You have joined the lobby, here are the players: ", ps);
          updatePlayer(p);
          updatePlayers(ps);
        }

        function gameStart(taskID : string, gameMode : string){
          console.log("Game started! Task ID: ", taskID);
          setTaskID(taskID);
          setGameMode(gameMode);
          setInGame(true);
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
    
        socket.on("lobbyJoined", lobbyJoined)
        socket.on("playerJoinedLobby", playerJoinedLobby)
        socket.on("playerLeftLobby", playerLeftLobby)
        socket.on("gameJoined", gameJoined)
        socket.on("gameStart", gameStart)
        
        socket.on("updateScoreboard", updateScoreboard)
        // Event to emit when code is to be submitted
        // socket.emit("submitCode", code);
        socket.on("success", success)
        socket.on("fail", fail)
        socket.on("gameOver", gameOver)

        
        

        return () => {
            socket.off("lobbyJoined", lobbyJoined)
            socket.off("playerJoinedLobby", playerJoinedLobby)
            socket.off("playerLeftLobby", playerLeftLobby)
            socket.off("gameJoined", gameJoined)
            socket.off("gameStart", gameStart)
            
            socket.off("updateScoreboard", updateScoreboard)
            socket.off("success", success)
            socket.off("fail", fail)
            socket.off("gameOver", gameOver)
        };
    }, [player, players, inGame])


  return (
    <>
      {inGame ? <GamePage taskID={taskID} gameMode={gameMode} /> : <Lobby updatePlayer={updatePlayer} player={player} players={players}/>}
      <footer>
        <p>© 2020 Your Company, Inc. All rights reserved.</p>
        <a href="#terms">Terms of Service</a>
      </footer>
    </>
  );
};

export default LandingPage;
