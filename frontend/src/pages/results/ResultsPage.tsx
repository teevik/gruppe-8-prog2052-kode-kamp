import { useState } from "react";
import { atomOneDark, CodeBlock } from "react-code-blocks";
import CountDown, { formatSeconds } from "../../components/CountDown";
import type { Participant, SocketData } from "../../../../shared/types";
import { GAME_MODES } from "../../../../shared/const";
import "./ResultsPage.css";

interface ResultPageProps {
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
      <header>
        <h1>KodeKamp</h1>
        <p>Compete together, grow together</p>
      </header>
      {/* Results section, placeholder for real one for now*/}
      <section className="resultsContainer">
        <h2>Results</h2>
        <p>gamemode</p>
        <h3>{gameMode}</h3>
        {gameIsOver && <CountDown initialCounter={initialTimer} />}
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
                      <span className="you-label resultLabel">you</span>
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
                  <button
                    className="solutionButton"
                    onClick={() => {
                      setSolution(score.solution);
                      setSolutionNumber(index);
                      setDisplaySolution(true);
                    }}
                  >
                    Submission
                  </button>
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
      </section>
      <button
        className="resultsPlayAgain"
        onClick={() => {
          location.reload();
        }}
      >
        Play again
      </button>{" "}
      {/* TODO: add link to the "/"" page (landing) */}
    </div>
  );
}
