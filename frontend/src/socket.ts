import { io } from 'socket.io-client';




function getUrl(){
  let URL ='';
  if (!import.meta.env.PROD){
    URL = "http://localhost:3000";
  }
  
  //Handle whether dev or prod
  return URL
}

export const socket = io(getUrl(), {
    autoConnect: false //must set to false so that we can connect to the lobby later, when the user has pressed "join lobby"
  });