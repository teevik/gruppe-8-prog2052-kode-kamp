import { useEffect, useState } from "react";
import Resizable from "react-resizable-layout";
import type {
  Challenge,
  Participant,
  SocketData,
  TestResults,
} from "../../../../shared/types";
import { Button } from "../../components/Button";
import CodeEditor from "../../components/CodeEditor";
import CountDown from "../../components/CountDown";
import TestResultsComponent from "../../components/TestResults";
import { socket } from "../../socket";
import ResultPage from "../results/ResultsPage";
import "./GamePage.css"; // Import the CSS file

export interface GameProps {
  challenge: Challenge | undefined;
  gameMode: string;
  gameTime: number;
  player: SocketData | undefined;
  defaultTestResults?: TestResults;
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
  defaultTestResults,
}: GameProps) {
  const [code, setCode] = useState<string>(challenge?.template || "");
  const [amountTestsPassed, setAmountTestsPassed] = useState<string>("");
  const [submittedCode, setSubmittedCode] = useState<boolean>(false);

  const [scoreboard, setScoreboard] = useState<Participant[]>();

  const [showResultPage, setShowResultPage] = useState<boolean>(false);
  const [gameIsOver, setGameIsOver] = useState<boolean>(false);

  const [testResults, setTestResults] = useState<TestResults | undefined>(
    defaultTestResults
  );

  const [timeAtResultPage, setTimeAtResultPage] = useState<number>(0);
  function updateScoreboard(scores: Participant[]) {
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

  function runCode(code: string) {
    socket.emit("runCode", code);
  }

  function submitCode(code: string) {
    socket.emit("submitCode", code);
  }

  return (
    <div className="layout gamePage">
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
          <div className="header">
            <h2>KodeKamp: {gameMode}</h2>

            <div className="headerRow">
              <CountDown initialCounter={gameTime} />

              <Button
                onClick={() => setCode(challenge.template)}
                variant="secondary"
              >
                Reset
              </Button>
              <Button
                variant="secondary"
                disabled={submittedCode}
                onClick={() => {
                  if (code) {
                    setSubmittedCode(true);
                    runCode(code);
                  }
                }}
              >
                Run
              </Button>
              <Button
                disabled={submittedCode}
                onClick={() => {
                  if (code) {
                    setSubmittedCode(true);
                    submitCode(code);
                  }
                }}
              >
                Submit
              </Button>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="mainContainer">
            <Resizable axis={"x"} initial={600} min={300}>
              {({ position, separatorProps }) => (
                <>
                  <div className="taskDescription" style={{ width: position }}>
                    {testResults && (
                      <TestResultsComponent testResults={testResults} />
                    )}

                    <div className="taskTitle">{challenge.title}</div>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: challenge.description,
                      }}
                    ></div>
                    <h2>Input:</h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: challenge.input }}
                    ></div>
                    <h2>Output:</h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: challenge.output }}
                    ></div>

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

                  <div className="separator" {...separatorProps} />
                  {/* Right Section: Code Editor */}
                  <div
                    className="editor"
                    style={{
                      width: `calc(100% - ${position}px`,
                    }}
                  >
                    {/* {amountTestsPassed !== "" && ( */}
                    {/*   <p className="testResults"> */}
                    {/*     Tests passed: ${amountTestsPassed} */}
                    {/*   </p> */}
                    {/* )} */}

                    {/* {submittedCode && <div className="loader"></div>} */}
                    <CodeEditor
                      code={code}
                      setCode={setCode}
                      template={challenge.template}
                      submittedCode={submittedCode}
                      setSubmittedCode={setSubmittedCode}
                    />
                  </div>
                </>
              )}
            </Resizable>
          </div>
        </>
      )}
    </div>
  );
}
