import { useEffect, useState } from "react";
import type {
  Challenge,
  Participant,
  SocketData,
  TestResults,
} from "../../../../shared/types";
import CodeEditor from "../../components/CodeEditor";
import CountDown from "../../components/CountDown";
import { socket } from "../../socket";
import TestResultsComponent from "../../components/TestResults";
import ResultPage from "../results/ResultsPage";
import "./GamePage.css"; // Import the CSS file

export interface GameProps {
  challenge: Challenge | undefined;
  gameMode: string;
  gameTime: number;
  player: SocketData | undefined;
}

/**
 * SpeedCodingPage is a React component for the Speed Coding page
 * which consists of a header, main content section, and footer.
 * The main content section contains a task description and a code editor.
 * The footer contains buttons for running test cases and submitting code.
 */
export default function SpeedCodingPage({
  challenge,
  gameMode,
  gameTime,
  player,
}: GameProps) {
  const [code, setCode] = useState<string>(challenge?.template || "");
  const [amountTestsPassed, setAmountTestsPassed] = useState<string>("");
  const [submittedCode, setSubmittedCode] = useState<boolean>(false);

  const [scoreboard, setScoreboard] = useState<Participant[]>();

  const [showResultPage, setShowResultPage] = useState<boolean>(false);
  const [gameIsOver, setGameIsOver] = useState<boolean>(false);

  const [testResults, setTestResults] = useState<TestResults | undefined>();

  const [timeAtResultPage, setTimeAtResultPage] = useState<number>(0);
  function updateScoreboard(scores: Participant[]) {
    console.log("Scoreboard is updated", scores);
    setScoreboard(scores);
  }

  function success() {
    setShowResultPage(true);
  }

  function runResults(result: TestResults) {
    setAmountTestsPassed(`${result.passedTests}/${result.totalTests}`);
    setTestResults(result);
    setSubmittedCode(false);
  }

  function gameOver(countdownResultPage: number) {
    //Display end screen with scoreboard
    setShowResultPage(true);
    setTimeAtResultPage(countdownResultPage);
    setGameIsOver(true);
    setTimeout(() => {
      location.reload();
    }, countdownResultPage * 1000);
  }

  useEffect(() => {
    socket.on("updateScoreboard", updateScoreboard);
    // Event to emit when code is to be submitted
    // socket.emit("submitCode", code);
    socket.on("success", success);
    socket.on("runResults", runResults);

    socket.on("gameOver", gameOver);

    return () => {
      socket.off("updateScoreboard", updateScoreboard);
      socket.off("success", success);
      socket.off("gameOver", gameOver);
      socket.off("runResults", runResults);
    };
  }, []);

  useEffect(() => {
    const mathJax = (window as any).MathJax;

    if (typeof mathJax !== "undefined") {
      mathJax.typeset();
    }
  }, [challenge]);

  return (
    <div className="gamePageContainer">
      {showResultPage && (
        <ResultPage
          scoreboard={scoreboard}
          gameMode={gameMode}
          initialTimer={timeAtResultPage}
          gameIsOver={gameIsOver}
          player={player}
        />
      )}
      {challenge && !showResultPage && (
        <>
          {/* Header Section */}
          <div className="gamePageHeader">
            <div className="gamePageHeaderTitle">KodeKamp</div>
            <div className="gamePageHeaderMode">
              <p>gamemode</p>
              <p className="gamePageHeaderTitle">{gameMode}</p>
            </div>
            <CountDown initialCounter={gameTime} />
          </div>

          {/* Main Content Section */}
          <div className="gamePageMain">
            {/* Left Section: Task Description */}
            <div className="gamePageTaskDescription">
              <div className="gamePageTaskTitle">{challenge.title}</div>

              {testResults && (
                <TestResultsComponent testResults={testResults} />
              )}

              <div
                dangerouslySetInnerHTML={{ __html: challenge.description }}
              ></div>
              <h2>Input:</h2>
              <div dangerouslySetInnerHTML={{ __html: challenge.input }}></div>
              <h2>Output:</h2>
              <div dangerouslySetInnerHTML={{ __html: challenge.output }}></div>

              <h2>Examples:</h2>
              <section>
                {challenge.sampleTests.map((test, index) => (
                  <div key={index}>
                    <section className="examples">
                      <div>
                        <p>Samle input {index + 1}:</p>
                        <div className="io">
                          {test.input.map((input) => (
                            <p key={input}>{input}</p>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p>Sample output {index + 1}:</p>
                        <div className="io">
                          {test.output.map((output) => (
                            <p key={output}>{output}</p>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                ))}
              </section>
              <cite>
                Attribution:
                {challenge.attribution.map((attr) => (
                  <a key={attr.name} href={attr.url}>
                    {attr.name}
                  </a>
                ))}
              </cite>
              <p>
                License:
                {challenge.license}
              </p>
            </div>

            {/* Right Section: Code Editor */}
            <div className="gamePageEditor">
              <p className="testResults">
                {amountTestsPassed !== "" &&
                  `Tests passed: ${amountTestsPassed}`}
              </p>
              {submittedCode && <div className="loader"></div>}
              <CodeEditor
                code={code}
                setCode={setCode}
                template={challenge.template}
                submittedCode={submittedCode}
                setSubmittedCode={setSubmittedCode}
              />
            </div>
          </div>

          {/* Footer Section */}
          <div className="gamePageFooter"></div>
        </>
      )}
    </div>
  );
}
