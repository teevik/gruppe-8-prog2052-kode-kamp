import classNames from "classnames";
import { TestResult, TestResults } from "../../../shared/types";
import "./TestResults.css";

interface ResultByKindProps {
  testResult: TestResult;
  index: number;
}

function ResultByKind(props: ResultByKindProps) {
  const { testResult, index } = props;

  if (testResult.kind === "FailedTests") {
    return (
      <>
        <p className="title">Sample test {index + 1}: Failed</p>

        <div className="failed">
          <div className="differences">
            <p>Got:</p>
            <div className="io">
              {testResult.differences.actual.map((input) => (
                <p key={input}>{input}</p>
              ))}
            </div>
          </div>

          <div className="differences">
            <p>Expected:</p>
            <div className="io">
              {testResult.differences.expected.map((input) => (
                <p key={input}>{input}</p>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  } else if (testResult.kind === "Success") {
    return <p className="title">Sample test {index + 1}: Successful</p>;
  } else if (testResult.kind === "Error") {
    return (
      <>
        <p className="title">Sample test {index + 1}: Error</p>
        <p>{testResult.message}</p>
      </>
    );
  }
}

interface TestResultsProps {
  testResults: TestResults;
}

export default function TestResultsComponent({
  testResults,
}: TestResultsProps) {
  return (
    <>
      <h1 className="taskTitle">Test Results</h1>
      <div className="testResults">
        {testResults.results.map((testResult, index) => (
          <div className={classNames("entry", testResult.kind)} key={index}>
            <ResultByKind testResult={testResult} index={index} />
          </div>
        ))}
      </div>
    </>
  );
}
