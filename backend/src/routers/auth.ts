import {TRPCError} from "@trpc/server"
import { sign as signJwt } from "jsonwebtoken";
import type { User } from "../../../shared/types";
import {MIN_PASSWORD_LENGTH} from "../const"
import {User as UserSchema} from "../database/model/user"
import { JWT_SECRET } from "../env";
import { publicProcedure, router } from "../trpc";
import {z} from "zod"
import argon2 from "argon2"

const register = publicProcedure.input(
  z.object({
    username: z.string(),
    password: z.string().min(MIN_PASSWORD_LENGTH, `Must be ${MIN_PASSWORD_LENGTH} or more characters long`),
  })
).mutation( async ({input, ctx}) => {
  // const id = crypto.randomUUID();
  const {username, password} = input;
  
  const hashedPassword = await argon2.hash(password);

  //TODO: Check if user with username exists already
  if((await UserSchema.find({username: username})).length > 0) {
    throw new TRPCError({code: "CONFLICT"});
  }

  const newUser = new UserSchema({username: username, hashedPassword: hashedPassword});
  const user = await newUser.save();
  
  if(user.username){
    
    const userToken : User = {username: user.username, id: user._id.toString()};

    const jwt = signJwt(userToken, JWT_SECRET, {
      expiresIn: "12h"
    });
    
    return jwt;
  }

});

export const authRouter = router({
  register,
});