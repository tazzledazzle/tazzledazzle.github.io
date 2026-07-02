import assert from "node:assert/strict";
import test from "node:test";
import { formatLongDate } from "./dates.ts";

test("formatLongDate returns long month format per D-65", () => {
  assert.equal(formatLongDate(new Date("2025-01-08")), "January 8, 2025");
});

test("formatLongDate handles single-digit days without leading zero", () => {
  assert.equal(formatLongDate(new Date("2025-03-05")), "March 5, 2025");
});
