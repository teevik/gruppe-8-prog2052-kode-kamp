import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/types";

export function getUrl() {
  return !import.meta.env.PROD ? "http://localhost:3000" : "";
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  getUrl(),
  {
    autoConnect: false, //must set to false so that we can connect to the lobby later, when the user has pressed "join lobby"
  }
);
