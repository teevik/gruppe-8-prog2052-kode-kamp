import mongoose, { Mongoose } from "mongoose";
import { env } from "../env";

export default async function connectdb(): Promise<Mongoose> {
  return await mongoose.connect(env.DATABASE_URL);
  // await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');
}
