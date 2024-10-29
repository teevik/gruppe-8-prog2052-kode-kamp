import {test, expect} from 'vitest'
import {binaryUpdateScoreboard, fastestCodeUpdateScoreboard} from './game'
import type { Participant } from '../../../shared/types'


test("Testing scoreboard binary search and insert function w only different execution time", () => {
    //Creates mock data for current scoreboard (this must be sorted)
    let scoreboard : Participant[] = [];
    scoreboard.push({stats: {executionTime:1000, usedTime: 428743248}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});
    scoreboard.push({stats: {executionTime:3000, usedTime: 428743248}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});
    scoreboard.push({stats: {executionTime:4000, usedTime: 428743248}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});

    let newScoreboardEntry = {stats: {executionTime:2000, usedTime: 428743248}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}};

    let updateScoreboard = binaryUpdateScoreboard([...scoreboard], newScoreboardEntry);
    expect(updateScoreboard[0]).toBe(scoreboard[0]);
    expect(updateScoreboard[1]).toBe(newScoreboardEntry);
    expect(updateScoreboard[2]).toBe(scoreboard[1]);
    expect(updateScoreboard[3]).toBe(scoreboard[2]);
})

test("Testing edge-case scoreboard binary search and insert function w only different execution time", () => {
    //Creates mock data for current scoreboard (this must be sorted)
    let scoreboard : Participant[] = [];
    scoreboard.push({stats: {executionTime:3000, usedTime: 428743248}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});

    let newScoreboardEntry = {stats: {executionTime:2000, usedTime: 428743248}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}};

    let updateScoreboard = binaryUpdateScoreboard([...scoreboard], newScoreboardEntry);
    expect(updateScoreboard[0]).toBe(newScoreboardEntry);
    expect(updateScoreboard[1]).toBe(scoreboard[0]);
})

test("Testing scoreboard binary search and insert function w some that have same execution time", () => {
    //Creates mock data for current scoreboard (this must be sorted)
    let scoreboard : Participant[] = [
        {stats: {executionTime:1000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}},
        {stats: {executionTime:2000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}},
        {stats: {executionTime:3000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}},
        {stats: {executionTime:4000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}}
    ];

    let newScoreboardEntry = {stats: {executionTime:2000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}};

    let updateScoreboard = binaryUpdateScoreboard([...scoreboard], newScoreboardEntry);
    expect(updateScoreboard[2]).toBe(newScoreboardEntry);
})

test("Testing scoreboard insert function w different execution time", ()=>{
    let scoreboard : Participant[] = [];
    scoreboard.push({stats: {executionTime:1000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});
    scoreboard.push({stats: {executionTime:3000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});
    scoreboard.push({stats: {executionTime:4000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}});

    let newScoreboardEntry = {stats: {executionTime:2000, usedTime: 0}, solution: "", socket: {userID: "", emoji: "", complete: false, userName: ""}};

    let updateScoreboard = fastestCodeUpdateScoreboard([...scoreboard], newScoreboardEntry);
    expect(updateScoreboard[0]).toBe(scoreboard[0]);
    expect(updateScoreboard[1]).toBe(newScoreboardEntry);
    expect(updateScoreboard[2]).toBe(scoreboard[1]);
    expect(updateScoreboard[3]).toBe(scoreboard[2]);
})