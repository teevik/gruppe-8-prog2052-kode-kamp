import type { Test, TestResults } from "../../../shared/types";
import { env } from "../env";

/**
 * Function to the send the code to the code-runner through HTTP request
 *
 * @param code Javascript code from the player
 * @param tests List of all tests that the code will be tested for
 * @returns Either the testresults, or undefined to indicate that something went wrong with the request
 */
async function submitCode(
  code: string,
  tests: Test[]
): Promise<TestResults | undefined> {
  try {
    const req = await fetch(`${env.CODE_RUNNER_URL}/execute`, {
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
}

export { submitCode };
