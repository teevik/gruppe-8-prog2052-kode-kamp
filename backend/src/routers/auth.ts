import {TRPCError} from "@trpc/server"
import { sign as signJwt } from "jsonwebtoken";
import type { User } from "../../../shared/types";
import {JWT_EXPIRESIN} from "../const"
import {MIN_PASSWORD_LENGTH} from "../../../shared/const"
import {User as UserSchema} from "../database/model/user"
import { JWT_SECRET } from "../env";
import { publicProcedure, router } from "../trpc";
import {z} from "zod"
import argon2 from "argon2"

const register = publicProcedure.input(
  z.object({
    username: z.string(),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Must be ${MIN_PASSWORD_LENGTH} or more characters long`),
    email: z.string().email()
  })
).mutation( async ({input, ctx}) => {
  
  const {username, password, email} = input;

  const hashedPassword = await argon2.hash(password);

  try {
    const newUser = new UserSchema({username, hashedPassword, email});
    const user = await newUser.save();
    
    if(user){
      
      const userToken : User = {username: user.username, id: user._id.toString()};

      const jwt = signJwt(userToken, JWT_SECRET, {
        expiresIn: JWT_EXPIRESIN
      });
      
      return jwt;
    }
  } catch (error) {
    throw new TRPCError({code: "CONFLICT"});
  }

});

export const authRouter = router({
  register,
});
