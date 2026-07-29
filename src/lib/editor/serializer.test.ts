import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { serializePost, type PostMetadata } from "./serializer.ts";

// Helper: parse the output back into frontmatter + body sections
function splitOutput(output: string): { fmLines: string[]; body: string } {
  const lines = output.split("\n");
  // First line should be ---
  assert.equal(lines[0], "---", "Should start with ---");
  const closingIdx = lines.indexOf("---", 1);
  assert.ok(closingIdx > 0, "Should have closing ---");
  return {
    fmLines: lines.slice(1, closingIdx),
    body: lines.slice(closingIdx + 2).join("\n"), // skip blank line after ---
  };
}

describe("serializePost", () => {
  test("produces output starting with YAML frontmatter block", () => {
    const meta: PostMetadata = {
      title: "Hello World",
      pubDate: "2026-07-28",
    };
    const output = serializePost(meta, "# Hello World\n\nBody text.");
    assert.ok(output.startsWith("---\n"));
  });

  test("includes title and pubDate in frontmatter", () => {
    const meta: PostMetadata = {
      title: "My Post",
      pubDate: "2026-07-28",
    };
    const { fmLines } = splitOutput(serializePost(meta, "Body."));
    const fm = fmLines.join("\n");
    assert.ok(fm.includes("title: My Post"), `frontmatter missing title: ${fm}`);
    assert.ok(fm.includes("pubDate: 2026-07-28"), `frontmatter missing pubDate: ${fm}`);
  });

  test("includes optional description when provided", () => {
    const meta: PostMetadata = {
      title: "Post",
      pubDate: "2026-07-28",
      description: "A great post about things.",
    };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    const fm = fmLines.join("\n");
    assert.ok(fm.includes("description:"), `frontmatter missing description: ${fm}`);
    assert.ok(fm.includes("A great post about things."));
  });

  test("omits description when not provided", () => {
    const meta: PostMetadata = { title: "Post", pubDate: "2026-07-28" };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    const fm = fmLines.join("\n");
    assert.ok(!fm.includes("description:"), `frontmatter should not have description: ${fm}`);
  });

  test("includes tags array when provided", () => {
    const meta: PostMetadata = {
      title: "Post",
      pubDate: "2026-07-28",
      tags: ["astro", "typescript", "blog"],
    };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    const fm = fmLines.join("\n");
    assert.ok(fm.includes("tags:"), `frontmatter missing tags: ${fm}`);
    assert.ok(fm.includes("astro"));
    assert.ok(fm.includes("typescript"));
  });

  test("omits tags when not provided", () => {
    const meta: PostMetadata = { title: "Post", pubDate: "2026-07-28" };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    assert.ok(!fmLines.join("\n").includes("tags:"));
  });

  test("omits tags when empty array provided", () => {
    const meta: PostMetadata = { title: "Post", pubDate: "2026-07-28", tags: [] };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    assert.ok(!fmLines.join("\n").includes("tags:"));
  });

  test("includes tier when provided", () => {
    const meta: PostMetadata = {
      title: "Post",
      pubDate: "2026-07-28",
      tier: "featured",
    };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    const fm = fmLines.join("\n");
    assert.ok(fm.includes("tier: featured"), `frontmatter missing tier: ${fm}`);
  });

  test("omits tier when not provided", () => {
    const meta: PostMetadata = { title: "Post", pubDate: "2026-07-28" };
    const { fmLines } = splitOutput(serializePost(meta, ""));
    assert.ok(!fmLines.join("\n").includes("tier:"));
  });

  test("appends markdown body after frontmatter with blank line separator", () => {
    const meta: PostMetadata = { title: "Post", pubDate: "2026-07-28" };
    const body = "# Post\n\nFirst paragraph.\n\n## Section\n\nMore text.";
    const output = serializePost(meta, body);
    // After the closing ---, there should be exactly one blank line then the body
    const parts = output.split("\n---\n");
    assert.equal(parts.length, 2);
    assert.ok(parts[1].startsWith("\n"), "Should have blank line after ---");
    assert.ok(parts[1].includes("# Post"));
    assert.ok(parts[1].includes("First paragraph."));
  });

  test("handles special characters in title (quotes)", () => {
    const meta: PostMetadata = {
      title: 'It\'s a "great" post',
      pubDate: "2026-07-28",
    };
    const output = serializePost(meta, "");
    // Should not throw and should contain the title somehow
    assert.ok(output.includes("title:"));
  });

  test("handles all fields present", () => {
    const meta: PostMetadata = {
      title: "Full Post",
      pubDate: "2026-07-28",
      description: "Desc",
      tags: ["a", "b"],
      tier: "standard",
    };
    const output = serializePost(meta, "Body text.");
    const { fmLines, body } = splitOutput(output);
    const fm = fmLines.join("\n");
    assert.ok(fm.includes("title:"));
    assert.ok(fm.includes("pubDate:"));
    assert.ok(fm.includes("description:"));
    assert.ok(fm.includes("tags:"));
    assert.ok(fm.includes("tier:"));
    assert.ok(body.includes("Body text."));
  });
});
