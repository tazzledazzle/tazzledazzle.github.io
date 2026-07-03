import assert from "node:assert/strict";
import test from "node:test";
import { formatCareerDate, formatCareerRange } from "./formatCareerDate.ts";

test("formatCareerDate formats YYYY-MM as short month and year", () => {
  assert.equal(formatCareerDate("2025-01"), "Jan 2025");
});

test('formatCareerDate passes through "Present"', () => {
  assert.equal(formatCareerDate("Present"), "Present");
});

test("formatCareerRange joins start and end with en dash", () => {
  assert.equal(formatCareerRange("2021-01", "2024-07"), "Jan 2021 – Jul 2024");
});
