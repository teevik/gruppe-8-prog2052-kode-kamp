/**
 * This component is the main lobby page where users can join and leave the lobby, and see how many players are currently in the lobby
 * @param gameMode The game mode of the current lobby
 * @param updatePlayer A function that updates the user's player data
 * @param players An array of all players in the lobby
 * @param player The user's player data
 * @returns A component that displays the lobby and allows users to join and leave
 */
import { useEffect, useState } from "react";
import { GameMode } from "../../../../shared/const";
import { SocketData } from "../../../../shared/types";
import { useAuth } from "../../auth";
import { Button } from "../../components/Button";
import { Layout } from "../../components/Layout";
import { socket } from "../../socket";
import ModeExplanation from "../mode-explanation/ModeExplanation";
import "./Lobby.css";

interface LobbyProps {
  gameMode: GameMode;
  updatePlayer: (p: SocketData | undefined) => void;
  players: SocketData[];
  player: SocketData | undefined;
}

export default function Lobby({
  gameMode,
  updatePlayer,
  players,
  player,
}: LobbyProps) {
  const [countdownLobby, setCountdownLobby] = useState<string>("");
  const [countdownStartGame, setCountdownStartGame] = useState<string>("");

  const [amountPlayersLobby, setAmountPlayersLobby] = useState(0);
  const [totalPlayersLobby, setTotalPlayersLobby] = useState(0);
  const { token } = useAuth();

  // Set up socket event listeners
  useEffect(() => {
    socket.on("lobbyCountdown", setCountdownLobby);
    socket.on("lobbyUpdate", lobbyUpdate);

    socket.on("countdown", startGameCountdown);

    return () => {
      socket.off("lobbyCountdown", setCountdownLobby);
      socket.off("lobbyUpdate", lobbyUpdate);
      socket.off("countdown", startGameCountdown);
    };
  }, [countdownLobby]);

  // Join lobby function
  const joinLobby = () => {
    socket.emit("joinLobby", token || "");
  };

  // Leave lobby function
  const leaveLobby = () => {
    socket.emit("leaveLobby");
    updatePlayer(undefined);
  };

  // Update lobby function
  function lobbyUpdate(amountPlayers: number, totalPlayers: number) {
    setAmountPlayersLobby(amountPlayers);
    setTotalPlayersLobby(totalPlayers);
  }

  // Start game countdown function
  function startGameCountdown(counter: number) {
    setCountdownStartGame(counter.toString());
  }

  return (
    <>
      {/* If the game has started, show the game mode explanation component */}
      {countdownStartGame !== "" && (
        <ModeExplanation
          gameMode={gameMode}
          //TODO: change countdownStartGame to int from backend
          time={parseInt(countdownStartGame)}
        />
      )}

      {/* If the game has not started, show the lobby page */}
      {countdownStartGame == "" && (
        <Layout showNav showFooter className="landingPage">
          <header>
            <h1>KodeKamp Lobby</h1>
            <p>Compete together, grow together</p>
          </header>

          {/* Lobby section, placeholder for real one for now, fix some way of adding the game mode and mby showing some other info, like difficulty, if there is time */}
          <div className="lobbyContainer">
            <div className="lobbyHeader">
              <h3>Public lobby</h3>
              <p>Join the upcoming challenge and compete with others</p>
            </div>

            {/* Players section, placeholder for real one for now, here we see how many players are in the lobby, could just be a number out of 4 or 8 based on lobby size for now */}

            <div className="playerGrid">
              {player !== undefined &&
                Array.from({ length: totalPlayersLobby }, (_, index) => (
                  <div key={index}>
                    {index < amountPlayersLobby && players[index] ? (
                      <div
                        role="img"
                        aria-label="Player icon"
                        className={
                          player.userID == players[index].userID
                            ? "playerYou"
                            : "playerSlot"
                        }
                      >
                        {players[index].emoji}
                      </div>
                    ) : (
                      <div className="emptySlot" />
                    )}
                  </div>
                ))}
            </div>

            <p>
              {amountPlayersLobby}/{totalPlayersLobby} Players in lobby
            </p>
            <p>{countdownLobby}</p>
            {/* Join button, fix this so that this sends you to the correct game based on gameID */}
            {player == undefined ? (
              <Button onClick={joinLobby}>Join</Button>
            ) : (
              <Button onClick={leaveLobby} variant="secondary">
                Leave
              </Button>
            )}
          </div>
        </Layout>
      )}
    </>
  );
}
