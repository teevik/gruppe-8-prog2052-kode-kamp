import { useState } from "react";
import { atomOneDark, CodeBlock } from "react-code-blocks";
import CountDown, { formatSeconds } from "../../components/CountDown";
import type { Participant, SocketData } from "../../../../shared/types";
import { GAME_MODES } from "../../../../shared/const";
import "./ResultsPage.css";
import { Button } from "../../components/Button";
import { calculatePoints } from "../../../../shared/functions";
import { LinkButton } from "../../components/LinkButton";

export interface ResultPageProps {
  scoreboard: Participant[] | undefined;
  gameMode: string;
  initialTimer: number;
  gameIsOver: boolean;
  player: SocketData | undefined;
}

export default function ResultsPage({
  scoreboard,
  gameMode,
  initialTimer,
  gameIsOver,
  player,
}: ResultPageProps) {
  const [solution, setSolution] = useState<string>("");
  const [showSolution, setDisplaySolution] = useState<boolean>();
  const [solutionNumber, setSolutionNumber] = useState<number>(0);

  return (
    <div className="resultsPage">
      {/* Results section, placeholder for real one for now*/}
      <section className="resultsContainer">
        <h2>Results</h2>
        {/* {gameIsOver && <CountDown initialCounter={initialTimer} />} */}
        <ul className="resultsList">
          {scoreboard &&
            scoreboard.map((score, index) => (
              <li
                key={index}
                className={
                  index == 0 ? "resultsItem winnerResultsItem" : "resultsItem"
                }
              >
                <div className="resultData">
                  <span className="colorBox">{index + 1}</span>
                  {index == 0 && <span>🏆</span>}
                  <span className="resultsName">
                    {score.socket.userName}
                    {score.socket.emoji}
                    {score.socket.userID == player?.userID && (
                      <span className="green-label resultLabel">you</span>
                    )}

                    {score.socket.points !== undefined && (
                      <>
                        <span className="resultLabel">
                          {score.socket.points} points
                          <span className="green-label point-label">
                            +{calculatePoints(scoreboard.length, index + 1)}{" "}
                            point
                          </span>
                        </span>
                      </>
                    )}
                  </span>

                  <span
                    className={`resultLabel score score-${score.results.passedTests}`}
                  >
                    {score.results.passedTests}/{score.results.totalTests}
                  </span>

                  <span className="resultLabel">
                    {gameMode == GAME_MODES[0] &&
                      `${formatSeconds(
                        Math.round(score.stats.usedTime / 1000)
                      )}`}
                    {gameMode == GAME_MODES[1] &&
                      `Execution time: ${score.stats.executionTime / 1000} ms`}
                  </span>
                  <Button
                    onClick={() => {
                      setSolution(score.solution);
                      setSolutionNumber(index);
                      setDisplaySolution(true);
                    }}
                  >
                    Submission
                  </Button>
                </div>
                {showSolution && solutionNumber == index && (
                  <div className="code">
                    <CodeBlock
                      text={solution}
                      theme={atomOneDark}
                      language="javascript"
                      wrapLongLines
                    />
                  </div>
                )}
              </li>
            ))}
        </ul>
        <div className="buttonsContainer">
          <LinkButton variant="secondary" to="/">
            Home
          </LinkButton>
          <Button
            onClick={() => {
              location.reload();
            }}
          >
            Play again
          </Button>
        </div>
      </section>
      {/* TODO: add link to the "/"" page (landing) */}
    </div>
  );
}
