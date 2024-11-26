import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  hashedPassword: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  verified: { type: Boolean, default: false },
});

export const UserModel = model("User", userSchema);
