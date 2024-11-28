import { TRPCError } from "@trpc/server";
import { UserModel } from "../database/model/user";
import { authenticatedProcedure, router } from "../trpc";

const isVerified = authenticatedProcedure.query(async ({ ctx }) => {
  const { user } = ctx;

  const userDocument = await UserModel.findById(user.id);
  if (!userDocument) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return userDocument.verified;
});

const points = authenticatedProcedure.query(async ({ ctx }) => {
  const { user } = ctx;

  const userDocument = await UserModel.findById(user.id);
  if (!userDocument) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return userDocument.points;
});

export const userRouter = router({
  isVerified,
  points,
});
