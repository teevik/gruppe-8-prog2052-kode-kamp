import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import type { SocketServer } from "..";
import { GAME_MODES } from "../../../shared/const";
import type {
  Challenge,
  Participant,
  TestResults,
} from "../../../shared/types";
import type { GameMode } from "../../../shared/const";
import {
  COUNTDOWN_LENGTH_SECONDS,
  GAME_LENGTH_MINUTES,
  MAX_PLAYERS_PR_GAME,
  TIME_AT_ENDSCREEN_SECONDS,
} from "../const";
import { submitCode } from "../consumers/coderunner";
import { getRandomChallenge } from "./challenge";
import { emitLobbyUpdate, lobby } from "./lobby";
import type { Game } from "./types";

function startGame(
  gameRoomID: string,
  players: Socket[],
  gameMode: GameMode,
  io: SocketServer
) {
  let timeOfStart: number = performance.now();

  //Initialize som datastructure to hold gameresults ???
  let game: Game = { scoreboard: [] };

  const challenge: Challenge = getRandomChallenge();

  //Emit the taskID so that the client can fetch the
  io.to(gameRoomID).emit("gameStart", challenge, GAME_LENGTH_MINUTES * 60);

  players.forEach((socket) => {
    socket.on("runCode", async (code: string) => {
      try {
        const testResults: TestResults | undefined = await submitCode(
          code,
          challenge.sampleTests
        );
        if (testResults) {
          socket.emit("runResults", testResults);
        }
      } catch (_) {
        console.error("Failed when running code");
      }
    });

    socket.on("submitCode", async (code: string) => {
      //Server-side validation so that the user dont spam the scoreboard
      if (socket.data.complete) {
        return;
      }

      try {
        //Send code to code runner
        const testResults: TestResults | undefined = await submitCode(
          code,
          challenge.tests
        );
        if (testResults) {
          let now: number = performance.now();

          //Creating the scoreboard entry
          let scoreboardEntry: Participant = {
            socket: socket.data,
            stats: {
              executionTime: testResults.executionTimeUs,
              usedTime: now - timeOfStart,
            },
            solution: code,
            results: testResults,
          };

          //Handling code submission differently based on gamemode
          game.scoreboard = updateScoreboard(
            [...game.scoreboard],
            scoreboardEntry,
            gameMode
          );

          //Emitting to the client that code ran successfully for all the tests
          socket.emit(
            "success",
            `${testResults.passedTests}/${testResults.totalTests}`
          );
          socket.data.complete = true;

          //Emitting to all clients that the scoreboard is updated
          io.to(gameRoomID).emit("updateScoreboard", game.scoreboard);

          if (game.scoreboard.length == players.length) {
            endGame(gameRoomID, players, io);
          }
        }
      } catch {
        console.error("Failed when submitting code");
      }
    });
  });
  //Listen for game events (and disconnect), and broadcast the events to the same room
  //When code is submitted, pass the code to code runner,
  //if the code is accepted by the code runner
  //emit to all sockets that a user has completed

  //Start timeout to finish the game
  //When the game is finished, emit gameOver event to all clients, together with data for scores and scoreboard
  //Also register statistics for all sockets that has a userID, use the userID to update stats in the database
  //Start new timeout for terminating the game by making all sockets to leave the current room
  setTimeout(() => {
    endGame(gameRoomID, players, io);
  }, GAME_LENGTH_MINUTES * 60 * 1000);
}

function createGameRoom(io: SocketServer) {
  let gameRoomID: string = uuidv4();

  //Move players into gameroom
  let players: Socket[] = lobby.players.splice(0, MAX_PLAYERS_PR_GAME);

  players.forEach((socket) => {
    socket.leave("lobby");
    socket.join(gameRoomID);
    socket.emit("gameJoined", gameRoomID);
  });

  //Emitting the gamemode to gameroom so that they see the gamemode already before the game begins

  let countDown = COUNTDOWN_LENGTH_SECONDS;
  const countDownInterval = setInterval(() => {
    io.to(gameRoomID).emit("countdown", countDown);
    countDown--;
  }, 1000);

  emitLobbyUpdate(io);

  let currentGameMode: GameMode = lobby.gameMode;

  io.to(gameRoomID).emit("gameMode", currentGameMode);
  setTimeout(() => {
    clearInterval(countDownInterval);
    startGame(gameRoomID, players, currentGameMode, io);
  }, COUNTDOWN_LENGTH_SECONDS * 1000 + 1000);

  //Change gamemode for the refreshed lobby
  lobby.gameMode = GAME_MODES[Math.floor(Math.random() * GAME_MODES.length)];
}

function endGame(gameRoomID: string, players: Socket[], io: SocketServer) {
  //TODO: update stats and give points

  io.to(gameRoomID).emit("gameOver", TIME_AT_ENDSCREEN_SECONDS);

  // setTimeout(()=>{
  //     players.forEach((socket)=>{
  //         socket.disconnect(true);
  //     })
  // }, TIME_AT_ENDSCREEN_SECONDS * 1000)
}

/**
 * Function that updates the scoreboard based on the results of the new
 * scoreboard-entry (game-participant with corresponding game results) by inserting
 * the scoreboard-entry into the correct position regarding the execution time of the code
 *
 * Time complexity
 * Best: O(log n)
 * Worst: O(n)
 *
 * Space complexity O(n)
 *
 * @param scoreboardEntry
 * @param currentScoreboard
 * @return The updated scoreboard
 */
function binaryUpdateScoreboard(
  currentScoreboard: Participant[],
  scoreboardEntry: Participant
): Participant[] {
  let left = 0;
  let right = currentScoreboard.length - 1;
  let mid;

  while (left <= right) {
    mid = Math.floor((left + right) / 2);

    if (
      currentScoreboard[mid].stats.executionTime ===
      scoreboardEntry.stats.executionTime
    ) {
      left = mid + 1; // If the element is already in the array, we can decide to insert it next to it
      break;
    } else if (
      currentScoreboard[mid].stats.executionTime <
      scoreboardEntry.stats.executionTime
    ) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Insert the element at the correct position
  currentScoreboard.splice(left, 0, scoreboardEntry);

  return currentScoreboard;
}

/**
 * Function that updates the scoreboard based on the results of the new
 * scoreboard-entry (game-participant with corresponding game results) by inserting
 * the scoreboard-entry into the correct position regarding the execution time of the code
 *
 * Time complexity
 * Best: O(n)
 * Worst: O(n)
 *
 * Space complexity O(n)
 *
 * @param scoreboardEntry
 * @param currentScoreboard
 * @return The updated scoreboard
 */
function updateScoreboard(
  currentScoreboard: Participant[],
  scoreboardEntry: Participant,
  gameMode: GameMode
): Participant[] {
  let newScoreboard: Participant[] = [];
  let scoreboardEntryInserted: boolean = false;

  if (currentScoreboard.length == 0) {
    newScoreboard.push(scoreboardEntry);
  } else {
    for (let participant of currentScoreboard) {
      let gameCondition: boolean;
      if (gameMode == GAME_MODES[0]) {
        gameCondition =
          scoreboardEntry.stats.executionTime < participant.stats.executionTime;
      } else {
        gameCondition =
          scoreboardEntry.stats.usedTime < participant.stats.usedTime;
      }

      if (
        !scoreboardEntryInserted &&
        scoreboardEntry.results.passedTests > participant.results.passedTests
      ) {
        newScoreboard.push(scoreboardEntry);
        scoreboardEntryInserted = true;
      } else if (
        !scoreboardEntryInserted &&
        scoreboardEntry.results.passedTests == participant.results.passedTests
      ) {
        if (gameCondition) {
          newScoreboard.push(scoreboardEntry);
          scoreboardEntryInserted = true;
        }
      }
      newScoreboard.push(participant);
    }
    if (!scoreboardEntryInserted) {
      newScoreboard.push(scoreboardEntry);
    }
  }

  console.log("new scoreboard", newScoreboard);

  return newScoreboard;
}

export { binaryUpdateScoreboard, createGameRoom, updateScoreboard };
