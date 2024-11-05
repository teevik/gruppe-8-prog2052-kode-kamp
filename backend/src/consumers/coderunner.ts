import type { Test } from "../../../shared/types";
import { CODE_RUNNER_URL } from "../const";
import type { TestResults } from "../socketio/types";

async function submitCode(
  code: string,
  tests: Test[]
): Promise<TestResults | undefined> {
  //Send code
  try {
    const req = await fetch(CODE_RUNNER_URL, {
      method: "POST",
      body: JSON.stringify({ code: code, tests: tests }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await req.json();

    if (res) {
      const testResults: TestResults = {
        totalTests: res.totalTests,
        passedTests: res.passedTests,
        executionTimeUs: res.executionTimeUs,
        results: res.results,
      };
      return testResults;
    }
  } catch (e) {
    console.log(e);
    return undefined;
  }
  //Parse results
}

export { submitCode };
