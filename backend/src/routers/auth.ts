import { TRPCError } from "@trpc/server";
import { sign as signJwt } from "jsonwebtoken";
import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "../../../shared/const";
import type { User } from "../../../shared/types";
import { EMAIL_REGEX, JWT_EXPIRESIN } from "../const";
import { User as UserSchema } from "../database/model/user";
import { JWT_SECRET } from "../env";
import { publicProcedure, router } from "../trpc";
import { sendVerifyEmail } from "../mailer/mailer";

const register = publicProcedure
  .input(
    z.object({
      username: z.string().min(1, "Username is required"),
      password: z
        .string()
        .min(
          MIN_PASSWORD_LENGTH,
          `Must be ${MIN_PASSWORD_LENGTH} or more characters long`
        ),
      email: z.string().email().min(1, "Email is required"),
    })
  )
  .mutation(async ({ input }) => {
    const { username, password, email } = input;

    if ((await UserSchema.find({ username: username })).length > 0) {
      throw new TRPCError({ code: "CONFLICT" });
    }

    try {
      const hashedPassword = await Bun.password.hash(password);

      const newUser = new UserSchema({ username, hashedPassword, email });
      const userDoc = await newUser.save();

      if (userDoc) {
        const user: User = {
          username: userDoc.username,
          id: userDoc._id.toString(),
          email: userDoc.email,
          verified: userDoc.verified,
        };

        const jwtToken = getToken(user);

        try {
          sendVerifyEmail(user);
        } catch (error) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return jwtToken;
      }
    } catch (error) {
      throw new TRPCError({ code: "CONFLICT" });
    }
  });

const login = publicProcedure
  .input(
    z.object({
      user: z.string().min(1, "Username or email is required"),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    const { user, password } = input;

    let userID: { email?: string; username?: string };
    if (EMAIL_REGEX.test(user)) {
      userID = { email: user };
    } else {
      userID = { username: user };
    }

    const userDocument = await UserSchema.findOne(userID);
    if (!userDocument) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const correctPassword: boolean = await Bun.password.verify(
      userDocument.hashedPassword,
      password
    );
    if (!correctPassword) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const jwtToken = getToken({
      username: userDocument.username,
      id: userDocument._id.toString(),
      email: userDocument.email,
      verified: userDocument.verified,
    });

    return jwtToken;
  });

function getToken(user: User) {
  const jwt = signJwt(user, JWT_SECRET, {
    expiresIn: JWT_EXPIRESIN,
  });
  return jwt;
}

export const authRouter = router({
  register,
  login,
});

export { getToken };
