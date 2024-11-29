import ResultsPage, { ResultPageProps } from "../ResultsPage";

const resultMockProps: ResultPageProps = {
  scoreboard: [
    {
      socket: {
        points: 10,
        userName: "Primeagen",
        emoji: "🐱",
        userID: "1",
        complete: true,
        registeredUser: false,
      },
      stats: {
        usedTime: 1000,
        executionTime: 2000,
      },
      solution: "console.log('Hello World');",
      results: {
        totalTests: 1,
        passedTests: 1,
        executionTimeUs: 1000,
        results: [
          {
            kind: "Success",
          },
        ],
      },
    },
    {
      stats: {
        usedTime: 234560,
        executionTime: 5000,
      },
      solution: "console.log('Goodbye World');",
      results: {
        totalTests: 1,
        passedTests: 1,
        executionTimeUs: 1000,
        results: [
          {
            kind: "Success",
          },
        ],
      },
      socket: {
        points: 10,
        userName: "Jon Gjengset",
        emoji: "😀",
        userID: "2",
        complete: false,
        registeredUser: false,
      },
    },
  ],
  gameMode: "Test Gamemode",
  initialTimer: 60,
  gameIsOver: true,
  player: {
    points: 10,
    registeredUser: true,
    userName: "MEGGG",
    emoji: "😡",
    userID: "3",
    complete: true,
  },
};

export default function ResultsPageMock() {
  return <ResultsPage {...resultMockProps}></ResultsPage>;
}
