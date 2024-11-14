import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { GAME_MODES } from "../../../shared/const";
import jwt from "jsonwebtoken";

import type { SocketServer } from "..";
import {
  EMOJIS,
  LOBBY_TIMER_SECONDS,
  MAX_PLAYERS_PR_GAME,
  RANDOM_USERNAMES,
} from "../const";
import { createGameRoom } from "./game";
import type { Lobby } from "./types";
import { JWT_SECRET } from "../env";
import type { User } from "../../../shared/types";
import { userSchema } from "../user";
import { User as UserSchema } from "../database/model/user";

// Function to randomly pick an emoji
function getRandomEmoji(): string {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

let lobby: Lobby = {
  players: [],
  gameMode: GAME_MODES[0],
};

let lobbyCountdownCounter: number = LOBBY_TIMER_SECONDS;

let lobbyInterval: ReturnType<typeof setTimeout> | null = null;

function lobbyCountdown(io: SocketServer) {
  //Emit countdown event to all cients
  let countDownValue = `${lobbyCountdownCounter}s`;

  //Check if there are any players in the lobby, if not, clear this interval and reset lobbyCountdownCounter
  if (lobby.players.length == 0 || lobby.players.length == 1) {
    lobbyInterval = null;
    lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
    countDownValue = "";
  } else {
    lobbyCountdownCounter--;
  }

  if (lobbyCountdownCounter == 0) {
    createGameRoom(io);
    resetLobbyCountdown(io);
  } else {
    io.emit("lobbyCountdown", countDownValue);
  }
}

function initLobby(socket: Socket, io: SocketServer) {
  console.log("client with socket.id: ", socket.id, " connected!");
  emitLobbyUpdate(io);

  socket.on("joinLobby", async (jwtToken) => {
    //This is so that we can track the stats of the player

    if (jwtToken !== "") {
      try {
        const userData = jwt.verify(jwtToken, JWT_SECRET);
        const user = userSchema.parse(userData);
        socket.data.registeredUser = true;
        socket.data.userID = user.id;
        socket.data.userName = user.username;

        const userDb = await UserSchema.findOne({ _id: user.id });
        if (userDb) {
          socket.data.points = userDb.points;
        }
      } catch (error) {
        playAsGuest(socket);
      }
    } else {
      playAsGuest(socket);
    }

    //Makes sure that each user can only fill one spot in the lobby
    if (!lobby.players.find((p) => socket.data.userID == p.data.userID)) {
      joinLobby(socket, io);
      handleLobbyCountdown(io);
    }
  });

  socket.on("disconnect", () => {
    console.log("client with socket.id: ", socket.id, " disconnected");
  });
}

function joinLobby(socket: Socket, io: SocketServer) {
  socket.data.emoji = getRandomEmoji();

  // Add player to lobby
  lobby.players.push(socket);
  socket.join("lobby");

  //Confirmation to user that lobby was joined successfully and returning the name of all the players
  socket.emit(
    "lobbyJoined",
    socket.data,
    lobby.players.map((player) => player.data)
  );

  //Emit to entire lobby that player has joined (does not emit to itself)
  socket.broadcast.to("lobby").emit("playerJoinedLobby", socket.data);

  //Emit to all clients that amount of players in lobby is updated
  emitLobbyUpdate(io);

  //Create game room if lobby is full createGameRoom()
  if (lobby.players.length == MAX_PLAYERS_PR_GAME) {
    createGameRoom(io);
  }

  socket.on("leaveLobby", () => {
    leaveLobby(socket, io);
  });

  //Listen for disconnect event and remove from lobby
  socket.on("disconnect", () => {
    leaveLobby(socket, io);
    console.log("client with socket.id", socket.id, " disconnected");
  });
}

function leaveLobby(socket: Socket, io: SocketServer) {
  lobby.players = lobby.players.filter((player) => player !== socket);
  io.to("lobby").emit("playerLeftLobby", socket.data);
  emitLobbyUpdate(io);
  handleLobbyCountdown(io);
}

function handleLobbyCountdown(io: SocketServer) {
  if (!lobbyInterval && lobby.players.length > 1) {
    lobbyInterval = setInterval(() => lobbyCountdown(io), 1000);
  } else if (lobby.players.length < 2) {
    resetLobbyCountdown(io);
  }
}

function emitLobbyUpdate(io: SocketServer) {
  io.emit("lobbyUpdate", lobby.players.length, MAX_PLAYERS_PR_GAME);
}

function resetLobbyCountdown(io: SocketServer) {
  if (lobbyInterval) {
    clearInterval(lobbyInterval);
  }
  lobbyInterval = null;
  lobbyCountdownCounter = LOBBY_TIMER_SECONDS;
  io.emit("lobbyCountdown", "");
}

function playAsGuest(socket: Socket): Socket {
  socket.data.registeredUser = false;
  socket.data.userID = uuidv4();
  socket.data.userName =
    RANDOM_USERNAMES[Math.floor(Math.random() * RANDOM_USERNAMES.length)];
  return socket;
}

export { emitLobbyUpdate, initLobby, lobby };
