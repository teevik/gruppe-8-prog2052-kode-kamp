const GAME_MODES = ["First to finish", "Fastest code"] as const;
export type GameMode = (typeof GAME_MODES)[number];
const MIN_PASSWORD_LENGTH: number = 8;
const VERIFY_ROUTE = "/verify";

export { GAME_MODES, MIN_PASSWORD_LENGTH, VERIFY_ROUTE };
