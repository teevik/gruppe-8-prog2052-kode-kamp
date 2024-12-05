import { lazy, useEffect, useState } from "react";
import { GameMode } from "../../../../shared/const";
import { Challenge, SocketData } from "../../../../shared/types";
import { socket } from "../../socket";
import Lobby from "../lobby/Lobby";
import "./LandingPage.css"; // Ensure this path is correct

// Lazy load the GamePage component
const GamePage = lazy(() => import("../game/GamePage"));

/**
 * LandingPage component serves as the main entry point for the app.
 * It manages the state for game settings and players, and decides
 * whether to render the Lobby or GamePage based on the game state.
 */
const LandingPage = () => {
  const [gameTime, setGameTime] = useState<number>(0);
  const [inGame, setInGame] = useState<boolean>(false);
  const [players, setPlayers] = useState<SocketData[]>([]);
  const [player, setPlayer] = useState<SocketData | undefined>(undefined);
  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [gameMode, setGameMode] = useState<GameMode>("First to finish"); // Default game mode until received

  /**
   * Updates the list of players in the lobby.
   * @param p - Array of SocketData representing players.
   */
  function updatePlayers(p: SocketData[]) {
    setPlayers(p);
  }

  /**
   * Updates the current player data.
   * @param p - SocketData of the current player.
   */
  function updatePlayer(p: SocketData | undefined) {
    setPlayer(p);
  }

  /**
   * Sets the current game mode.
   * @param mode - The GameMode to be set.
   */
  function gameModeEvent(mode: GameMode) {
    setGameMode(mode);
  }

  /**
   * Handles the event when a player joins the lobby.
   * @param p - SocketData of the player joining the lobby.
   */
  function playerJoinedLobby(p: SocketData) {
    let playersUpdated: SocketData[] = [...players];
    playersUpdated.push(p);
    updatePlayers(playersUpdated);
  }

  /**
   * Handles the event when a player leaves the lobby.
   * @param player - SocketData of the player leaving the lobby.
   */
  function playerLeftLobby(player: SocketData) {
    let playersUpdated = [...players];
    playersUpdated = playersUpdated.filter((p) => player.userID !== p.userID);
    updatePlayers(playersUpdated);
  }

  /**
   * Handles the lobby joined event.
   * @param p - SocketData of the current player.
   * @param ps - Array of SocketData representing players in the lobby.
   */
  function lobbyJoined(p: SocketData, ps: SocketData[]) {
    updatePlayer(p);
    updatePlayers(ps);
  }

  /**
   * Handles the start of the game.
   * @param ch - Challenge data for the game.
   * @param gameTime - Time allocated for the game.
   */
  function gameStart(ch: Challenge, gameTime: number) {
    setChallenge(ch);
    setGameTime(gameTime);
    setInGame(true);
  }

  // Connect socket on mount, disconnect on unmount
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  // Set up socket event listeners
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

  // Render GamePage if in-game, otherwise render Lobby
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

