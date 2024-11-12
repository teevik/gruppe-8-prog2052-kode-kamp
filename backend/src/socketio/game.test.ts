import { test, expect } from "vitest";
import { binaryUpdateScoreboard, updateScoreboard } from "./game";
import type { Participant } from "../../../shared/types";
import { GAME_MODES } from "../../../shared/const";

test("Testing scoreboard binary search and insert function w only different execution time", () => {
  //Creates mock data for current scoreboard (this must be sorted)
  let scoreboard: Participant[] = [];
  scoreboard.push({
    stats: { executionTime: 1000, usedTime: 428743248 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 3000, usedTime: 428743248 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 4000, usedTime: 428743248 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 428743248 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updateScoreboard = binaryUpdateScoreboard(
    [...scoreboard],
    newScoreboardEntry
  );
  expect(updateScoreboard[0]).toBe(scoreboard[0]);
  expect(updateScoreboard[1]).toBe(newScoreboardEntry);
  expect(updateScoreboard[2]).toBe(scoreboard[1]);
  expect(updateScoreboard[3]).toBe(scoreboard[2]);
});

test("Testing edge-case scoreboard binary search and insert function w only different execution time", () => {
  //Creates mock data for current scoreboard (this must be sorted)
  let scoreboard: Participant[] = [];
  scoreboard.push({
    stats: { executionTime: 3000, usedTime: 428743248 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 428743248 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updateScoreboard = binaryUpdateScoreboard(
    [...scoreboard],
    newScoreboardEntry
  );
  expect(updateScoreboard[0]).toBe(newScoreboardEntry);
  expect(updateScoreboard[1]).toBe(scoreboard[0]);
});

test("Testing scoreboard binary search and insert function w some that have same execution time", () => {
  //Creates mock data for current scoreboard (this must be sorted)
  let scoreboard: Participant[] = [
    {
      stats: { executionTime: 1000, usedTime: 0 },
      solution: "",
      socket: { userID: "", emoji: "", complete: false, userName: "" },
      results: {
        passedTests: 10,
        executionTimeUs: 1000,
        totalTests: 10,
        results: [{ kind: "Success" }],
      },
    },
    {
      stats: { executionTime: 2000, usedTime: 0 },
      solution: "",
      socket: { userID: "", emoji: "", complete: false, userName: "" },
      results: {
        passedTests: 10,
        executionTimeUs: 1000,
        totalTests: 10,
        results: [{ kind: "Success" }],
      },
    },
    {
      stats: { executionTime: 3000, usedTime: 0 },
      solution: "",
      socket: { userID: "", emoji: "", complete: false, userName: "" },
      results: {
        passedTests: 10,
        executionTimeUs: 1000,
        totalTests: 10,
        results: [{ kind: "Success" }],
      },
    },
    {
      stats: { executionTime: 4000, usedTime: 0 },
      solution: "",
      socket: { userID: "", emoji: "", complete: false, userName: "" },
      results: {
        passedTests: 10,
        executionTimeUs: 1000,
        totalTests: 10,
        results: [{ kind: "Success" }],
      },
    },
  ];

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updateScoreboard = binaryUpdateScoreboard(
    [...scoreboard],
    newScoreboardEntry
  );
  expect(updateScoreboard[2]).toBe(newScoreboardEntry);
});

test("Testing scoreboard insert function w different execution time", () => {
  let scoreboard: Participant[] = [];
  scoreboard.push({
    stats: { executionTime: 1000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 3000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 4000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updatedScoreboard = updateScoreboard(
    [...scoreboard],
    newScoreboardEntry,
    GAME_MODES[0]
  );
  expect(updatedScoreboard[0]).toBe(scoreboard[0]);
  expect(updatedScoreboard[1]).toBe(newScoreboardEntry);
  expect(updatedScoreboard[2]).toBe(scoreboard[1]);
  expect(updatedScoreboard[3]).toBe(scoreboard[2]);
});

test("Testing scoreboard insert function w different amount passed tests", () => {
  let scoreboard: Participant[] = [];
  scoreboard.push({
    stats: { executionTime: 1000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 3000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 4000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 9,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 8,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updatedScoreboard = updateScoreboard(
    [...scoreboard],
    newScoreboardEntry,
    GAME_MODES[0]
  );
  expect(updatedScoreboard[0]).toBe(scoreboard[0]);
  expect(updatedScoreboard[1]).toBe(scoreboard[1]);
  expect(updatedScoreboard[2]).toBe(scoreboard[2]);
  expect(updatedScoreboard[3]).toBe(newScoreboardEntry);
});

test("Testing scoreboard insert function w different amount passed tests and different execution time", () => {
  let scoreboard: Participant[] = [];
  scoreboard.push({
    stats: { executionTime: 1000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 3000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 4000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 9,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 0 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 9,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updatedScoreboard = updateScoreboard(
    [...scoreboard],
    newScoreboardEntry,
    GAME_MODES[0]
  );
  expect(updatedScoreboard[0]).toBe(scoreboard[0]);
  expect(updatedScoreboard[1]).toBe(scoreboard[1]);
  expect(updatedScoreboard[2]).toBe(newScoreboardEntry);
  expect(updatedScoreboard[3]).toBe(scoreboard[2]);
});

test("Testing scoreboard insert function w different amount passed tests and different used time", () => {
  let scoreboard: Participant[] = [];
  scoreboard.push({
    stats: { executionTime: 1000, usedTime: 1 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 3000, usedTime: 4 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });
  scoreboard.push({
    stats: { executionTime: 4000, usedTime: 8 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 9,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  });

  let newScoreboardEntry: Participant = {
    stats: { executionTime: 2000, usedTime: 2 },
    solution: "",
    socket: { userID: "", emoji: "", complete: false, userName: "" },
    results: {
      passedTests: 10,
      executionTimeUs: 1000,
      totalTests: 10,
      results: [{ kind: "Success" }],
    },
  };

  let updatedScoreboard = updateScoreboard(
    [...scoreboard],
    newScoreboardEntry,
    GAME_MODES[1]
  );
  expect(updatedScoreboard[0]).toBe(scoreboard[0]);
  expect(updatedScoreboard[1]).toBe(newScoreboardEntry);
  expect(updatedScoreboard[2]).toBe(scoreboard[1]);
  expect(updatedScoreboard[3]).toBe(scoreboard[2]);
});
