const MAX_PLAYERS_PR_GAME: number = 8;
const COUNTDOWN_LENGTH_SECONDS: number = 10;
const TIME_AT_ENDSCREEN_SECONDS: number = 180;
const GAME_LENGTH_MINUTES: number = 10;
const LOBBY_TIMER_SECONDS: number = 30;
const RATE_LIMIT_MINUTE_INTERVAL : number = 1;
const RATE_LIMIT_MAX : number = 100;
const MIN_PASSWORD_LENGTH : number = 8;
const JWT_EXPIRESIN : string = "12h"
const GAME_MODES: string[] = ["First to finish", "Fastest code"];
const CODE_RUNNER_URL: string =
  process.env.NODE_ENV === "production"
    ? "http://192.168.10.180/execute"
    : "https://code-runner-small-sky-5409.fly.dev/execute";

const EMOJIS = ["🧑", "🐸", "🐱", "🐶", "🦄", "🐼", "🐧", "🦁", "🐝", "🐢"];
const RANDOM_USERNAMES: string[] = [
  "ShadowHunter",
  "LightningBolt",
  "MaverickX",
  "SilentStorm",
  "NightWolf",
  "PixelWizard",
  "ThunderStrike",
  "GhostRider",
  "BlazePhoenix",
  "IronHeart",
  "CyberNinja",
  "LunarEclipse",
  "RapidFire",
  "NeonTiger",
  "WildCard",
  "DarkPhantom",
  "FrostByte",
  "EpicSurge",
  "StormBreaker",
  "VortexMaster",
  "SolarFlare",
  "VenomFang",
  "CrimsonShade",
  "SteelFalcon",
  "HyperViper",
  "ShadowRaven",
  "GalacticWolf",
  "SilverScorpion",
  "BlizzardFury",
  "ChaosKnight",
  "NebulaWraith",
  "DragonSlayer",
  "AtomicBlaze",
  "SpectralBlade",
  "DarkInferno",
  "IronShadow",
  "ZenithWarrior",
  "TidalSurge",
  "OmegaStrike",
  "CosmicPhantom",
  "VoidHunter",
  "StormRider",
  "ThunderWolf",
  "PhantomSpecter",
  "IronTiger",
  "LightningFury",
  "SkyBreaker",
  "EclipseWarrior",
  "FlameRider",
  "LunarKnight",
  "NeonViper",
  "NovaSurge",
  "DarkRider",
  "SilverPhoenix",
  "InfernoKnight",
  "ViperShadow",
  "WildStrike",
  "GhostBlade",
  "CyberPhantom",
  "FrostTiger",
  "StormChaser",
  "ShadowPhoenix",
  "RapidViper",
  "ThunderBlade",
  "VenomRider",
  "BlazeTiger",
  "IronKnight",
  "NeonShadow",
  "FrostViper",
  "DarkTiger",
  "VortexRider",
  "CosmicKnight",
  "ThunderViper",
  "ShadowFury",
  "SilverBlade",
  "BlazeRider",
  "LunarFury",
  "NebulaKnight",
  "WildPhantom",
  "StormViper",
];

export {
  RANDOM_USERNAMES,
  MAX_PLAYERS_PR_GAME,
  COUNTDOWN_LENGTH_SECONDS,
  TIME_AT_ENDSCREEN_SECONDS,
  GAME_LENGTH_MINUTES,
  LOBBY_TIMER_SECONDS,
  GAME_MODES,
  CODE_RUNNER_URL,
  EMOJIS,
  RATE_LIMIT_MINUTE_INTERVAL,
  RATE_LIMIT_MAX,
  MIN_PASSWORD_LENGTH,
  JWT_EXPIRESIN
};
