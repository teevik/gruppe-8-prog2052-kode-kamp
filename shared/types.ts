import type { GameMode } from "./const";

/**
 * Contains all type interfaces that are used on both frontend and backend
 */
export interface SocketData {
  userID: string;
  userName: string;
  emoji: string;
  complete: boolean;
  registeredUser: boolean;
  points: number | undefined;
}

export interface Participant {
  socket: SocketData;
  stats: Stats;
  solution: string;
  results: TestResults;
}

export interface Stats {
  executionTime: number;
  usedTime: number;
}

export interface Test {
  input: string[];
  output: string[];
}

export interface Challenge {
  title: string;
  license: string;
  attribution: { name: string; url: string }[];
  description: string;
  input: string;
  output: string;
  template: string;
  sampleTests: Test[];
  tests: Test[];
}

/** User that can be stored in a JWT (must contain no sensitive data) */
export type UserJWT = {
  id: string;
  username: string;
  email: string;
};

export type TestResult =
  | {
      kind: "Success";
    }
  | {
      kind: "Error";
      message: string;
    }
  | {
      kind: "FailedTests";
      differences: {
        expected: string[];
        actual: string[];
      };
    };

export interface TestResults {
  totalTests: number;
  passedTests: number;
  executionTimeUs: number;
  results: TestResult[];
}

export interface ServerToClientEvents {
  lobbyJoined: (player: SocketData, players: SocketData[]) => void;
  playerJoinedLobby: (playerData: SocketData) => void;
  playerLeftLobby: (playerData: SocketData) => void;
  gameJoined: (gameRoomID: string) => void;
  gameMode: (mode: GameMode) => void;
  gameStart: (challenge: Challenge, gameTimeSeconds: number) => void;
  gameOver: (resultPageCountdown: number) => void;
  countdown: (counter: number) => void;
  task: (taskID: string) => void;
  success: () => void;
  runResults: (results: TestResults) => void;
  updateScoreboard: (scores: Participant[]) => void;
  lobbyUpdate: (amountPlayers: number, totalPlayers: number) => void;
  lobbyCountdown: (counter: string) => void;
}

export interface ClientToServerEvents {
  submitCode: (code: string) => void;
  joinLobby: (jwtToken: string) => void;
  leaveLobby: () => void;
  runCode: (code: string) => void;
}

export interface Milestone {
  text: string;
  imageSrc: string;
}
