import dotenv from "dotenv";
import { exit } from "process";
import { z } from "zod";
import { fromError } from "zod-validation-error";

dotenv.config();
dotenv.config({ path: ".secrets" });

// Define the schema as an object with all of the env
// variables and their types
const envSchema = z.object({
  PORT: z.coerce.number(),
  SERVER_URL: z.string().url(),
  DATABASE_URL: z.string().url(),
  CODE_RUNNER_URL: z.string().url(),
  JWT_SECRET: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  NODE_ENV: z
    .union([
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("development"),
  // ...
});

// Validate `process.env` against our schema
// and return the result

const validatedEnv = envSchema.safeParse(process.env);

if (!validatedEnv.success) {
  console.error(
    "Invalid environment variables: " +
      fromError(validatedEnv.error, { prefix: null }).toString()
  );

  exit(1);
}

export const env = validatedEnv.data!;
