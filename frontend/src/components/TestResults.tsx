/**
 * A component that renders the results of a challenge.
 * The component displays the test results in a scrollable div.
 * If the test result is a failure, it displays a diff of the expected and actual output.
 * If the test result is a success, it displays a success message.
 * If the test result is an error, it displays the error message.
 */
import classNames from "classnames";
import { TestResult, TestResults } from "../../../shared/types";
import "./TestResults.css";

/**
 * A component that renders the result of a single test.
 * The component takes a test result and an index as props.
 * If the test result is a failure, it displays a diff of the expected and actual output.
 * If the test result is a success, it displays a success message.
 * If the test result is an error, it displays the error message.
 */
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

/**
 * A component that renders the results of a challenge.
 * The component takes the test results as a prop.
 * It renders a scrollable div with the test results.
 */
interface TestResultsProps {
  testResults: TestResults;
}

/**
 * The main component of the test results page.
 * The component renders the test results in a scrollable div.
 */
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

