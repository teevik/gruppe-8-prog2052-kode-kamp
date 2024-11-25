export const GAME_MODES = ["First to finish", "Fastest code"] as const;
export type GameMode = (typeof GAME_MODES)[number];
export const MIN_PASSWORD_LENGTH: number = 8;
export const MAX_POINTS: number = 250;
export const VERIFY_ROUTE = "/verify";

export const MODE_DESCRIPTION: Record<GameMode, string> = {
  "Fastest code": "Write the fastest code possible",
  "First to finish": "Make a solution as fast as possible",
};
