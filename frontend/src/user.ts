import { ACCESS_TOKEN } from "./const";
import type {User} from "../../shared/types"


export function isUserLoggedIn() : User | null {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(!token){
        return null;
    }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (!payload.exp) {
      return null;
    }

    const expirationTime = payload.exp * 1000;
    
    if(Date.now() <= expirationTime){
        return {username: payload.username, id: payload.id, email: payload.email};
    } else {
        return null;
    }
  } catch (error) {
    return null; 
  }
}