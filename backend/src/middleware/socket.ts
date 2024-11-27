import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { env } from "../env";

dotenv.config();

function socketAllowOrigin(req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV == "development") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  next();
}

export { socketAllowOrigin };
