import type { GameSocket } from "..";
import type { GameMode } from "../../../shared/const";
import type { Participant } from "../../../shared/types";

interface Game {
  scoreboard: Participant[];
}

interface Lobby {
  players: GameSocket[];
  gameMode: GameMode;
}

export type { Game, Lobby };
