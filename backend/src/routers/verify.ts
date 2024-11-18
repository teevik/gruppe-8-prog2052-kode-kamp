import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User as UserSchema } from "../database/model/user";
import { userSchema } from "../user";
import { JWT_SECRET } from "../env";

export async function verifyHandler(
  req: Request,
  res: Response
): Promise<Response> {
  const { jwtToken } = req.params;
  const userToken = jwt.verify(jwtToken, JWT_SECRET);
  const userData = userSchema.parse(userToken);
  const userDoc = await UserSchema.updateOne(
    { _id: userData.id },
    { verified: true }
  );
  if (!userDoc.acknowledged) {
    return res.sendStatus(400);
  } else {
    return res.send("Your account is successfully verified!");
  }
}
