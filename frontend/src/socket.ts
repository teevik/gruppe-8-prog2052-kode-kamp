import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';

export const socket = io(URL, {
    autoConnect: false //must set to false so that we can connect to the lobby later, when the user has pressed "join lobby"
  });