import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import {
  MAX_PLAYERS_PR_GAME,
  COUNTDOWN_LENGTH_SECONDS,
  GAME_MODES,
  GAME_LENGTH_MINUTES,
  TIME_AT_ENDSCREEN_SECONDS,
} from "./const";
import type { Game, TestResults } from "./types";
import type { Challenge } from "../../../shared/types";
import { lobby, emitLobbyUpdate } from "./lobby";
import { getRandomChallenge } from "./challenge";
import { submitCode } from "../consumers/coderunner";
import { io } from "../index";

function createGameRoom() {
  let gameRoomID: string = uuidv4();

  //Move players into gameroom
  let players: Socket[] = lobby.players.splice(0, MAX_PLAYERS_PR_GAME);

  players.forEach((socket) => {
    socket.leave("lobby");
    socket.join(gameRoomID);
    socket.emit("gameJoined", gameRoomID);
  });

  let countDown = COUNTDOWN_LENGTH_SECONDS;
  const countDownInterval = setInterval(() => {
    io.to(gameRoomID).emit("countdown", countDown);
    countDown--;
  }, 1000);

  emitLobbyUpdate();

  setTimeout(
    () => {
      clearInterval(countDownInterval);
      startGame(gameRoomID, players, lobby.gameMode);
    },
    COUNTDOWN_LENGTH_SECONDS * 1000 + 1000,
  );

  //Change gamemode for the refreshed lobby
  lobby.gameMode = GAME_MODES[Math.floor(Math.random() * GAME_MODES.length)];
}

function startGame(gameRoomID: string, players: Socket[], gameMode: string) {
  let timeOfStart: number = performance.now();

  //Initialize som datastructure to hold gameresults ???
  let game: Game = { scoreboard: [] };

  const challenge: Challenge = getRandomChallenge();

  //Emit the taskID so that the client can fetch the
  io.to(gameRoomID).emit(
    "gameStart",
    challenge,
    gameMode,
    GAME_LENGTH_MINUTES * 60,
  );

  players.forEach((socket) => {
    socket.on("runCode", async (code: string) => {
      try {
        const testResults: TestResults | undefined = await submitCode(
          code,
          challenge.sample_tests,
        );
        if (testResults) {
          let result = `${testResults.passedTests}/${testResults.totalTests}`;
          socket.emit("runResults", result);
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

      //Handling code submission differently based on gamemode
      switch (gameMode) {
        case GAME_MODES[0]:
          //Send code to code runner
          try {
            const testResults: TestResults | undefined = await submitCode(
              code,
              challenge.tests,
            );
            if (testResults) {
              let result = `${testResults.passedTests}/${testResults.totalTests}`;

              //if all tests passed, push player onto scoreboard
              if (testResults.passedTests == testResults.totalTests) {
                let now: number = performance.now();
                //Updating the scoreboard
                game.scoreboard.push({
                  socket: socket.data,
                  stats: {
                    executionTime: testResults.executionTimeUs,
                    usedTime: now - timeOfStart,
                  },
                  solution: code,
                });

                //Emitting to the client that code ran successfully for all the tests
                socket.emit("success", result);
                socket.data.complete = true;

                //Emitting to all clients that the scoreboard is updated
                io.to(gameRoomID).emit("updateScoreboard", game.scoreboard);

                if (game.scoreboard.length == players.length) {
                  endGame(gameRoomID, players);
                }
              } else {
                socket.emit("fail", result);
              }
            }
          } catch {
            console.error("Failed when submitting code");
          }
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
  setTimeout(
    () => {
      endGame(gameRoomID, players);
    },
    GAME_LENGTH_MINUTES * 60 * 1000,
  );
}

function endGame(gameRoomID: string, players: Socket[]) {
  //TODO: update stats and give points

  io.to(gameRoomID).emit("gameOver", TIME_AT_ENDSCREEN_SECONDS);

  // setTimeout(()=>{
  //     players.forEach((socket)=>{
  //         socket.disconnect(true);
  //     })
  // }, TIME_AT_ENDSCREEN_SECONDS * 1000)
}

export { createGameRoom };
