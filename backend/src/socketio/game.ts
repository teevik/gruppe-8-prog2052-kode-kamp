import { v4 as uuidv4 } from "uuid";
import type { GameSocket, SocketServer } from "..";
import type { GameMode } from "../../../shared/const";
import { GAME_MODES } from "../../../shared/const";
import { calculatePoints } from "../../../shared/functions";
import type {
  Challenge,
  Participant,
  TestResults,
} from "../../../shared/types";
import {
  COUNTDOWN_LENGTH_SECONDS,
  GAME_LENGTH_MINUTES,
  MAX_PLAYERS_PR_GAME,
  TIME_AT_ENDSCREEN_SECONDS,
} from "../const";
import { submitCode } from "../consumers/coderunner";
import { UserModel } from "../database/model/user";
import { getRandomChallenge } from "./challenge";
import { emitLobbyUpdate, lobby } from "./lobby";
import { updateScoreboard } from "./scoreboard";
import type { Game } from "./types";

function startGame(
  gameRoomID: string,
  players: GameSocket[],
  gameMode: GameMode,
  io: SocketServer
) {
  let timeOfStart: number = performance.now();

  //Initialize som datastructure to hold gameresults ???
  let game: Game = { scoreboard: [] };

  let gameEnded: boolean = false;

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

    socket.on("submitCode", async (code) => {
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

          //Emitting to the client that code ran successfully
          socket.emit("success");
          socket.data.complete = true;

          //Emitting to all clients that the scoreboard is updated
          io.to(gameRoomID).emit("updateScoreboard", game.scoreboard);

          if (game.scoreboard.length == players.length) {
            endGame(gameRoomID, game.scoreboard, io);
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
    //Check if game is not already ended if all players have left
    if (!gameEnded) {
      endGame(gameRoomID, game.scoreboard, io);
    }
  }, GAME_LENGTH_MINUTES * 60 * 1000);
}

function createGameRoom(io: SocketServer) {
  let gameRoomID: string = uuidv4();

  //Move players into gameroom
  let players: GameSocket[] = lobby.players.splice(0, MAX_PLAYERS_PR_GAME);

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

  emitLobbyUpdate(io);

  //Emitting the gamemode to gameroom so that they see the gamemode already before the game begins
  let currentGameMode: GameMode = lobby.gameMode;

  io.to(gameRoomID).emit("gameMode", currentGameMode);
  setTimeout(() => {
    clearInterval(countDownInterval);
    startGame(gameRoomID, players, currentGameMode, io);
  }, COUNTDOWN_LENGTH_SECONDS * 1000 + 1000);

  //Change gamemode for the refreshed lobby
  lobby.gameMode = GAME_MODES[Math.floor(Math.random() * GAME_MODES.length)];
}

function endGame(gameRoomID: string, players: Participant[], io: SocketServer) {
  //TODO: update stats and give points

  players.forEach(async (player, index) => {
    if (player.socket.registeredUser) {
      //Give the user the amount of points based on amount of players
      const amountPoints = calculatePoints(players.length, index + 1);
      const updatedUser = await UserModel.updateOne(
        { _id: player.socket.userID },
        { $inc: { points: amountPoints } }
      );
      if (!updatedUser.acknowledged) {
        throw new Error("Failed to update points of a player");
      }
    }
  });

  io.to(gameRoomID).emit("gameOver", TIME_AT_ENDSCREEN_SECONDS);
}

export { createGameRoom };
