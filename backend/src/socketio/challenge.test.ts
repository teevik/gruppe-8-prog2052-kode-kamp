import { describe, expect, it } from "vitest";
import { challenges } from "./challenge";

describe("challenges", () => {
  it("should be an array of challenges", () => {
    expect(challenges).toBeInstanceOf(Array);
    expect(challenges.length).toBeGreaterThan(0);
  });
});
