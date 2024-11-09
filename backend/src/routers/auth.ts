import {TRPCError} from "@trpc/server"
import { sign as signJwt } from "jsonwebtoken";
import type { User } from "../../../shared/types";
import {EMAIL_REGEX, JWT_EXPIRESIN} from "../const"
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
).mutation( async ({input}) => {
  
  const {username, password, email} = input;

  const hashedPassword = await argon2.hash(password);

  try {
    const newUser = new UserSchema({username: username, hashedPassword: hashedPassword, email: email});
    const user = await newUser.save();
    
    if(user){
      
      const userToken : User = {username: user.username, id: user._id.toString(), email: user.email};

      const jwt = signJwt(userToken, JWT_SECRET, {
        expiresIn: JWT_EXPIRESIN
      });
      
      return jwt;
    }
  } catch (error) {
    throw new TRPCError({code: "CONFLICT"});
  }

});

const login = publicProcedure.input(
  z.object({
    user: z.string().min(1, "Username or email is required"),
    password: z.string()
  })
).mutation(async ({input}) => {
  const {user, password} = input;

  let userID : {email?: string, username?: string};
  if(EMAIL_REGEX.test(user)){
    userID = {email: user};
  } else {
    userID = {username: user};
  }

  const userDocument = await UserSchema.findOne(userID);
  if(!userDocument){
    throw new TRPCError({code: "UNAUTHORIZED"});
  }

  const hashedPassword = await argon2.hash(password);
  if(!hashedPassword){
    throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
  }

  const correctPassword : boolean = await argon2.verify(userDocument.hashedPassword, password);
  if(!correctPassword){
    throw new TRPCError({code: "UNAUTHORIZED"})
  }
  const userToken : User = {username: userDocument.username, id: userDocument._id.toString(), email: userDocument.email};

  const jwt = signJwt(userToken, JWT_SECRET, {
    expiresIn: JWT_EXPIRESIN
  });

  return jwt;
  
})

export const authRouter = router({
  register,
  login
});
