import { TestResults } from "../../../shared/types";

interface TestResultsProps {
  testResults: TestResults;
}

export default function TestResultsComponent({
  testResults,
}: TestResultsProps) {
  return (
    <>
      {testResults.results.map((testResult, index) => {
        if (testResult.kind === "FailedTests") {
          return (
            <div key={index}>
              <p>Actual: {testResult.differences.actual.join(" ")}</p>
              <p>Expected: {testResult.differences.expected.join(" ")}</p>
            </div>
          );
        } else if (testResult.kind === "Success") {
          return <p key={index}>Success</p>;
        } else if (testResult.kind === "Error") {
          return <p key={index}>{testResult.message}</p>;
        }
        return null; // Return null if none of the conditions match
      })}
    </>
  );
}
