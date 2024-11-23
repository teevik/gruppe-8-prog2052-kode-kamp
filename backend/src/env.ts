import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

if (!(JWT_SECRET && EMAIL_USER && EMAIL_PASS)) {
  throw new Error("An environment variable is not set");
}

export { JWT_SECRET, EMAIL_USER, EMAIL_PASS };

export const PORT = process.env.PORT || 3000;
