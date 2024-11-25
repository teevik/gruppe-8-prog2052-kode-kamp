import GamePage from "../GamePage";
import challenge from "./challenge.toml";

export function GamePageMock() {
  return (
    <GamePage
      challenge={challenge as any}
      gameMode="First to finish"
      gameTime={360}
      player={undefined}
    />
  );
}
