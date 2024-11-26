import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { CLIENT_URL } from "../const";
import { UserModel } from "../database/model/user";
import { JWT_SECRET } from "../env";

import type { JwtPayload } from "jsonwebtoken";

export async function verifyHandler(
  req: Request,
  res: Response
): Promise<Response> {
  const { jwtToken } = req.params;

  try {
    const user = jwt.verify(jwtToken, JWT_SECRET);

    if (typeof user === "object" && user !== null && "userID" in user) {
      const userDoc = await UserModel.updateOne(
        { _id: (user as JwtPayload).userID },
        { verified: true }
      );

      if (!userDoc.acknowledged) {
        return res.sendStatus(400);
      } else {
        res.redirect(CLIENT_URL + "/");
        return res;
      }
    } else {
      return res.sendStatus(400); // Invalid token structure
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.sendStatus(401); // Unauthorized
  }
}
