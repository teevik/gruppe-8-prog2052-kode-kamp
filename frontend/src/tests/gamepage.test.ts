import { test, expect } from "vitest";
import { formatSeconds } from "../components/CountDown";

test("Test countdown converter", () => {
  expect(formatSeconds(72)).toBe("1m 12s");
  expect(formatSeconds(60)).toBe("1m 0s");
  expect(formatSeconds(50)).toBe("50s");
  expect(formatSeconds(0)).toBe("0s");
});
