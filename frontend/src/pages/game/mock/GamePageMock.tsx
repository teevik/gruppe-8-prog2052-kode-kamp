import GamePage from "../GamePage";
import challenge from "./challenge.toml";

export function GamePageMock() {
  return (
    <GamePage
      challenge={challenge as any}
      gameMode="First to finish"
      gameTime={360}
      player={undefined}
      defaultTestResults={{
        executionTimeUs: 142,
        passedTests: 1,
        totalTests: 3,
        results: [
          {
            kind: "Success",
          },
          {
            kind: "Error",
            message: "Error: invalid syntax",
          },
          {
            kind: "FailedTests",
            differences: {
              expected: ["Hello, World!"],
              actual: ["Hello, World"],
            },
          },
        ],
      }}
    />
  );
}
