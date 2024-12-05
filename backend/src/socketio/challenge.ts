import * as fs from "fs";
import toml from "toml";
import { z } from "zod";
import type { Challenge } from "../../../shared/types";

const testSchema = z.object({
  input: z.array(z.string()),
  output: z.array(z.string()),
});

const challengeSchema: z.ZodType<Challenge> = z.object({
  title: z.string(),
  license: z.string(),
  attribution: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
    })
  ),
  description: z.string(),
  input: z.string(),
  output: z.string(),
  template: z.string(),
  sampleTests: z.array(testSchema),
  tests: z.array(testSchema),
});

let challenges: Challenge[] = [];

// Parses all the challenges
const challengePath = "./challenges";
fs.readdirSync(challengePath).forEach((file) => {
  const fileContents = fs.readFileSync(challengePath + "/" + file, "utf-8");
  const rawChallenge: unknown = toml.parse(fileContents);
  const challenge = challengeSchema.safeParse(rawChallenge);

  if (!challenge.success) {
    console.error(`Error parsing challenge at ${challengePath}/${file}`);
    console.error(challenge.error.flatten());
    process.exit(1);
  } else {
    challenges.push(challenge.data);
  }
});

/**
 * Function that returns a randomly chosen challenge
 * @returns The randomly chosen challenge
 */
export function getRandomChallenge(): Challenge {
  return challenges[Math.floor(Math.random() * challenges.length)];
}

export { challenges };
