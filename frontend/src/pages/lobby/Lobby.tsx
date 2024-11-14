import { useEffect, useState } from "react";
import { socket } from "../../socket";
import { SocketData } from "../../../../shared/types";
import ModeExplanation from "../mode-explanation/ModeExplanation";
import { Button } from "../../components/Button";
import { ACCESS_TOKEN } from "../../const";

interface LobbyProps {
  gameMode: string;
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

  const joinLobby = () => {
    const jwtToken = localStorage.getItem(ACCESS_TOKEN);
    socket.emit("joinLobby", jwtToken || "");
  };

  const leaveLobby = () => {
    socket.emit("leaveLobby");
    updatePlayer(undefined);
  };

  function lobbyUpdate(amountPlayers: number, totalPlayers: number) {
    setAmountPlayersLobby(amountPlayers);
    setTotalPlayersLobby(totalPlayers);
  }

  function startGameCountdown(counter: string) {
    setCountdownStartGame(counter);
  }

  return (
    <div className="landingPage">
      {gameMode !== "" && (
        <div>
          <p>gamemode</p>
          <h1>{gameMode}</h1>
        </div>
      )}

      {countdownStartGame !== "" && (
        <ModeExplanation
          gameMode={gameMode}
          //TODO: change countdownStartGame to int from backend
          time={parseInt(countdownStartGame)}
          explanation="bingo"
        />
      )}

      {countdownStartGame == "" && (
        <>
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
              {player !== undefined &&
                Array.from({ length: totalPlayersLobby }, (_, index) => (
                  <div key={index}>
                    {index < amountPlayersLobby && players[index] ? (
                      <span
                        role="img"
                        aria-label="Player icon"
                        className={
                          player.userID == players[index].userID
                            ? "playerYou"
                            : "playerSlot"
                        }
                      >
                        {players[index].emoji}
                      </span>
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
        </>
      )}
    </div>
  );
}
