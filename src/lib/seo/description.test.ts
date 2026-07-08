import assert from "node:assert/strict";
import test from "node:test";
import { deriveDescription } from "./description.ts";

test("deriveDescription returns explicit frontmatter description when present", () => {
  assert.equal(
    deriveDescription("Body text ignored.", "Curated Kotlin reference for engineers."),
    "Curated Kotlin reference for engineers."
  );
});

test("deriveDescription derives from first non-heading paragraph", () => {
  const body = `# Title\n\nFirst paragraph about Kotlin syntax and idioms.\n\nSecond paragraph.`;
  assert.equal(
    deriveDescription(body),
    "First paragraph about Kotlin syntax and idioms."
  );
});

test("deriveDescription trims long paragraphs to 155 characters with ellipsis", () => {
  const longParagraph = "word ".repeat(80).trim();
  const result = deriveDescription(longParagraph);
  assert.equal(result.length, 155);
  assert.ok(result.endsWith("…"));
});

test("deriveDescription returns empty string for whitespace-only body", () => {
  assert.equal(deriveDescription("   \n\n  "), "");
});

test("deriveDescription skips fenced code blocks when deriving", () => {
  const body = "```kotlin\nval x = 1\n```\n\nReal intro paragraph for readers.";
  assert.equal(deriveDescription(body), "Real intro paragraph for readers.");
});
