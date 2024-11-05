import { Socket } from "socket.io";
import type { SocketData, Challenge, Participant } from "../../../shared/types";

interface Score {
  userID: string;
  time: number;
}

interface ServerToClientEvents {
  lobbyJoined: (playerIDs: string[]) => void;
  playerJoinedLobby: (playerData: SocketData) => void;
  playerLeftLobby: (playerData: SocketData) => void;
  gameMode: (mode: string) => void;
  gameStart: (
    challenge: Challenge,
    gameTimeSeconds: number,
  ) => void;
  gameOver: (resultPageCountdown: number) => void;
  countdown: (counter: number) => void;
  task: (taskID: string) => void;
  updateScoreboard: (scores: Participant[]) => void;
  lobbyUpdate: (amountPlayers: number, totalPlayers: number) => void;
  lobbyCountdown: (counter: string) => void;
}

interface ClientToServerEvents {
  submitCode: () => void;
  joinLobby: () => void;
  leaveLobby: () => void;
}

interface Game {
  scoreboard: Participant[];
}

interface Lobby {
  players: Socket[];
  gameMode: string;
  // taskID : string
}

interface TestResults {
  totalTests: number;
  passedTests: number;
  executionTimeUs: number;
}

export type {
  ServerToClientEvents,
  ClientToServerEvents,
  Game,
  Lobby,
  TestResults,
};
