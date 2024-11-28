import { lazy, useEffect, useState } from "react";
import { GameMode } from "../../../../shared/const";
import { Challenge, SocketData } from "../../../../shared/types";
import { socket } from "../../socket";
import Lobby from "../lobby/Lobby";
import "./LandingPage.css"; // Ensure this path is correct

const GamePage = lazy(() => import("../game/GamePage"));

const LandingPage = () => {
  const [gameTime, setGameTime] = useState<number>(0);
  const [inGame, setInGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<SocketData[]>([]);
  const [player, setPlayer] = useState<SocketData | undefined>(undefined);
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [gameMode, setGameMode] = useState<GameMode>("First to finish"); // Show this until the game mode is received

  function updatePlayers(p: SocketData[]) {
    setPlayers(p);
  }

  function updatePlayer(p: SocketData | undefined) {
    setPlayer(p);
  }

  function gameModeEvent(mode: GameMode) {
    setGameMode(mode);
  }

  function playerJoinedLobby(p: SocketData) {
    let playersUpdated: SocketData[] = [...players];
    playersUpdated.push(p);
    updatePlayers(playersUpdated);
  }

  function playerLeftLobby(player: SocketData) {
    let playersUpdated = [...players];
    playersUpdated = playersUpdated.filter((p) => player.userID !== p.userID);
    updatePlayers(playersUpdated);
  }

  function lobbyJoined(p: SocketData, ps: SocketData[]) {
    updatePlayer(p);
    updatePlayers(ps);
  }

  function gameStart(ch: Challenge, gameTime: number) {
    setChallenge(ch);
    setGameTime(gameTime);
    setInGame(true);
  }

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("lobbyJoined", lobbyJoined);
    socket.on("playerJoinedLobby", playerJoinedLobby);
    socket.on("playerLeftLobby", playerLeftLobby);
    socket.on("gameStart", gameStart);
    socket.on("gameMode", gameModeEvent);

    return () => {
      socket.off("lobbyJoined", lobbyJoined);
      socket.off("playerJoinedLobby", playerJoinedLobby);
      socket.off("playerLeftLobby", playerLeftLobby);
      socket.off("gameStart", gameStart);
      socket.off("gameMode", gameModeEvent);
    };
  }, [player, players, inGame]);

  return inGame ? (
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
  );
};

export default LandingPage;
