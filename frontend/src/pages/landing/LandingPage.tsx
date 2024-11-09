import { FC, lazy, useEffect, useState } from "react";
import { Challenge, SocketData } from "../../../../shared/types";
import Footer from "../../components/Footer";
import { socket } from "../../socket";
import Lobby from "../lobby/Lobby";
import "./LandingPage.css"; // Ensure this path is correct

const GamePage = lazy(() => import("../game/GamePage"));

const LandingPage: FC = () => {
  const [gameTime, setGameTime] = useState<number>(0);
  const [inGame, setInGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<SocketData[]>([]);
  const [player, setPlayer] = useState<SocketData | undefined>(undefined);
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [gameMode, setGameMode] = useState<string>("");

  function updatePlayers(p: SocketData[]) {
    setPlayers(p);
  }

  function updatePlayer(p: SocketData | undefined) {
    setPlayer(p);
  }

  function gameModeEvent(mode: string) {
    setGameMode(mode);
  }

  function playerJoinedLobby(p: SocketData) {
    console.log("Player joined the lobby: ", p);
    let playersUpdated: SocketData[] = [...players];
    console.log("playerJoinedLobby ", updatePlayers);
    playersUpdated.push(p);
    console.log("updated players: ", playersUpdated);
    updatePlayers(playersUpdated);
  }

  function playerLeftLobby(player: SocketData) {
    console.log("Player left the lobby: ", player);
    let playersUpdated = [...players];
    playersUpdated = playersUpdated.filter((p) => player.userID !== p.userID);
    console.log("player.userID ", player.userID);
    console.log("updated players: ", playersUpdated);
    updatePlayers(playersUpdated);
  }

  function gameJoined(gameRoomID: string) {
    console.log("Joined game with ID: ", gameRoomID);
  }

  function lobbyJoined(p: SocketData, ps: SocketData[]) {
    console.log("You have joined the lobby, here are the players: ", ps);
    updatePlayer(p);
    updatePlayers(ps);
  }

  function gameStart(ch: Challenge, gameTime: number) {
    console.log("Game started! Task: ", ch);
    setChallenge(ch);
    setGameTime(gameTime);
    setInGame(true);
  }

  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    socket.on("lobbyJoined", lobbyJoined);
    socket.on("playerJoinedLobby", playerJoinedLobby);
    socket.on("playerLeftLobby", playerLeftLobby);
    socket.on("gameJoined", gameJoined);
    socket.on("gameStart", gameStart);
    socket.on("gameMode", gameModeEvent);

    return () => {
      socket.off("lobbyJoined", lobbyJoined);
      socket.off("playerJoinedLobby", playerJoinedLobby);
      socket.off("playerLeftLobby", playerLeftLobby);
      socket.off("gameJoined", gameJoined);
      socket.off("gameStart", gameStart);
      socket.off("gameMode", gameModeEvent);
    };
  }, [player, players, inGame]);

  return (
    <>
      {inGame ? (
        <GamePage
          challenge={challenge}
          gameMode={gameMode}
          gameTime={gameTime}
          player={player}
        />
      ) : (
        <Lobby
          gameMode={gameMode}
          updatePlayer={updatePlayer}
          player={player}
          players={players}
        />
      )}
      {!inGame && <Footer />}
    </>
  );
};

export default LandingPage;
