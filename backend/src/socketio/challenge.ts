import * as fs from "fs";
import toml from "toml";

import type { Challenge } from "./types";

let challenges: Challenge[] = [];

function initChallenges() {
  const challengePath = "./challenges";
  //Function that parses all the challenges and stores them in memory
  fs.readdirSync(challengePath).forEach((file) => {
    const fileContents = fs.readFileSync(challengePath + "/" + file, "utf-8");
    const challenge: Challenge = toml.parse(fileContents);
    challenges.push(challenge);
  });
}

function getRandomChallenge(): Challenge {
  //Function that returns a randomly chosen challenge
  return challenges[Math.floor(Math.random() * challenges.length)];
}

export { initChallenges, getRandomChallenge };
