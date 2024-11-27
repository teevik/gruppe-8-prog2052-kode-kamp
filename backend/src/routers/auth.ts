import { TRPCError } from "@trpc/server";
import { sign as signJwt } from "jsonwebtoken";
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "../../../shared/const";
import type { UserJWT } from "../../../shared/types";
import { EMAIL_REGEX, JWT_EXPIRESIN } from "../const";
import { UserModel } from "../database/model/user";
import { env } from "../env";
import { sendVerifyEmail } from "../mailer/mailer";
import { publicProcedure, router } from "../trpc";

const register = publicProcedure
  .input(
    z.object({
      username: z.string().min(1, "Username is required"),
      password: z
        .string()
        .min(
          MIN_PASSWORD_LENGTH,
          `Must be ${MIN_PASSWORD_LENGTH} or more characters long`,
        ),
      email: z.string().email().min(1, "Email is required"),
    }),
  )
  .mutation(async ({ input }) => {
    const { username, password, email } = input;

    const hashedPassword = await Bun.password.hash(password);

    let userDoc = undefined;
    try {
      const newUser = new UserModel({ username, hashedPassword, email });
      userDoc = await newUser.save();
    } catch (error) {
      throw new TRPCError({ code: "CONFLICT" });
    }

    if (userDoc) {
      const user: UserJWT = {
        username: userDoc.username,
        id: userDoc._id.toString(),
        email: userDoc.email,
      };

      const jwtToken = getToken(user);

      try {
        sendVerifyEmail(user);
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return jwtToken;
    }
  });

const login = publicProcedure
  .input(
    z.object({
      user: z.string().min(1, "Username or email is required"),
      password: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const { user, password } = input;

    let userID: { email?: string; username?: string };
    if (EMAIL_REGEX.test(user)) {
      userID = { email: user };
    } else {
      userID = { username: user };
    }

    const userDocument = await UserModel.findOne(userID);
    if (!userDocument) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const correctPassword: boolean = await Bun.password.verify(
      password,
      userDocument.hashedPassword,
    );
    if (!correctPassword) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const jwtToken = getToken({
      username: userDocument.username,
      id: userDocument._id.toString(),
      email: userDocument.email,
    });

    return jwtToken;
  });

export function getToken(user: UserJWT) {
  const jwt = signJwt(user, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRESIN,
  });
  return jwt;
}

export function getEmailToken(userID: string) {
  const jwt = signJwt({ userID: userID }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRESIN,
  });
  return jwt;
}

export const authRouter = router({
  register,
  login,
});
