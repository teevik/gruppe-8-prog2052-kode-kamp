import mongoose, { Mongoose } from "mongoose";
import { env } from "../env";

export default async function connectdb(): Promise<Mongoose> {
  return await mongoose.connect(env.DATABASE_URL);
}
