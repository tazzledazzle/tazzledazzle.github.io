import assert from "node:assert/strict";
import test from "node:test";
import { calculateReadTime } from "./readTime.ts";

test("calculateReadTime returns 1 minute for 225 words at 225 WPM", () => {
  const body = Array.from({ length: 225 }, () => "word").join(" ");
  assert.equal(calculateReadTime(body), 1);
});

test("calculateReadTime returns 2 minutes for 226 words (ceiling rounding)", () => {
  const body = Array.from({ length: 226 }, () => "word").join(" ");
  assert.equal(calculateReadTime(body), 2);
});

test("calculateReadTime strips fenced code blocks from word count", () => {
  const body = `${"word ".repeat(50)}\n\`\`\`js\n${"code ".repeat(500)}\n\`\`\``;
  assert.equal(calculateReadTime(body), 1);
});

test("calculateReadTime strips HTML tags from word count", () => {
  const body = `${"word ".repeat(50)}<p>${"hidden ".repeat(500)}</p>`;
  assert.equal(calculateReadTime(body), 1);
});
