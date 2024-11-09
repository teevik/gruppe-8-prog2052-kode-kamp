/**
 * Contains all type interfaces that are used on both frontend and backend
 */
interface SocketData {
  userID: string;
  userName: string;
  emoji: string;
  complete: boolean;
}

interface Participant {
  socket: SocketData;
  stats: Stats;
  solution: string;
}

interface Stats {
  executionTime: number;
  usedTime: number;
}

interface Test {
  input: string[];
  output: string[];
}

interface Challenge {
  title: string;
  license: string;
  attribution: { name: string; url: string }[];
  description: string;
  input: string;
  output: string;
  template: string;
  sampleTests: Test[];
  tests: Test[];
}

type TestResult =
  | {
      kind: "Success";
    }
  | {
      kind: "Error";
      message: string;
    }
  | {
      kind: "FailedTests";
      differences: {
        expected: string[];
        actual: string[];
      };
    };

interface TestResults {
  totalTests: number;
  passedTests: number;
  executionTimeUs: number;
  results: TestResult[];
}

export type UserJWT = {
  id: string;
  username: string;
};

export type { Challenge, Participant, SocketData, Test, TestResults };
