import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  extractFrontmatter,
  stripBearSyntax,
  stripObsidianSyntax,
  inferTitle,
} from "./preprocessors.ts";

// ---- extractFrontmatter ----

describe("extractFrontmatter", () => {
  test("extracts YAML frontmatter block from markdown", () => {
    const content = `---
title: My Post
pubDate: 2026-07-28
tags: [astro, typescript]
---

# My Post

Body content here.`;
    const { frontmatter, body } = extractFrontmatter(content);
    assert.equal(frontmatter.title, "My Post");
    assert.equal(frontmatter.pubDate, "2026-07-28");
    assert.deepEqual(frontmatter.tags, ["astro", "typescript"]);
    assert.ok(body.includes("# My Post"));
    assert.ok(!body.includes("---"));
  });

  test("returns empty frontmatter object when no frontmatter block present", () => {
    const content = "# Just a heading\n\nSome body text.";
    const { frontmatter, body } = extractFrontmatter(content);
    assert.deepEqual(frontmatter, {});
    assert.equal(body, content);
  });

  test("handles frontmatter with optional fields absent", () => {
    const content = `---
title: Minimal Post
pubDate: 2026-01-01
---

Body`;
    const { frontmatter } = extractFrontmatter(content);
    assert.equal(frontmatter.title, "Minimal Post");
    assert.equal(frontmatter.description, undefined);
  });

  test("strips frontmatter delimiters from body", () => {
    const content = `---
title: Test
---

Body here`;
    const { body } = extractFrontmatter(content);
    assert.ok(!body.startsWith("---"));
    assert.ok(body.trim().startsWith("Body here"));
  });

  test("handles frontmatter-only file (empty body)", () => {
    const content = `---
title: Only Meta
---`;
    const { frontmatter, body } = extractFrontmatter(content);
    assert.equal(frontmatter.title, "Only Meta");
    assert.equal(body.trim(), "");
  });

  test("does not treat a non-leading --- block as frontmatter", () => {
    const content = "# Heading\n\n---\n\nRule above is a divider";
    const { frontmatter, body } = extractFrontmatter(content);
    assert.deepEqual(frontmatter, {});
    assert.equal(body, content);
  });
});

// ---- stripBearSyntax ----

describe("stripBearSyntax", () => {
  test("removes ::highlight:: wrappers, preserving inner text", () => {
    const result = stripBearSyntax("Some ::important:: word here");
    assert.equal(result, "Some important word here");
  });

  test("removes multiple highlight markers in one pass", () => {
    const result = stripBearSyntax("::First:: and ::Second:: things");
    assert.equal(result, "First and Second things");
  });

  test("removes trailing hashtag-only lines (Bear tags)", () => {
    const content = "# My Post\n\nBody content.\n\n#tag1 #tag2";
    const result = stripBearSyntax(content);
    assert.ok(!result.includes("#tag1"));
    assert.ok(result.includes("Body content."));
  });

  test("does NOT remove hashtags that are mid-document headings", () => {
    const content = "# Heading\n\nSome paragraph.\n\n## Sub-heading\n\nMore text.";
    const result = stripBearSyntax(content);
    assert.ok(result.includes("# Heading"));
    assert.ok(result.includes("## Sub-heading"));
  });

  test("handles content with no Bear syntax unchanged", () => {
    const content = "# Hello\n\nJust regular markdown.";
    assert.equal(stripBearSyntax(content), content);
  });

  test("handles multiple lines of trailing tags", () => {
    const content = "Body text.\n\n#tag1\n#tag2\n#tag3";
    const result = stripBearSyntax(content);
    assert.ok(!result.includes("#tag1"));
    assert.ok(result.trim().endsWith("Body text."));
  });
});

// ---- stripObsidianSyntax ----

describe("stripObsidianSyntax", () => {
  test("converts [[page name]] to plain text", () => {
    const result = stripObsidianSyntax("See [[My Page]] for details.");
    assert.equal(result, "See My Page for details.");
  });

  test("converts [[Page|Alias]] to alias text", () => {
    const result = stripObsidianSyntax("See [[My Page|click here]] for details.");
    assert.equal(result, "See click here for details.");
  });

  test("removes ![[embed]] entirely", () => {
    const result = stripObsidianSyntax("Before\n\n![[embedded-note]]\n\nAfter");
    assert.ok(!result.includes("embedded-note"));
    assert.ok(!result.includes("![["));
    assert.ok(result.includes("Before"));
    assert.ok(result.includes("After"));
  });

  test("handles multiple wikilinks in one pass", () => {
    const result = stripObsidianSyntax("[[A]] and [[B]] and [[C]]");
    assert.equal(result, "A and B and C");
  });

  test("handles content with no Obsidian syntax unchanged", () => {
    const content = "# Hello\n\nJust [regular](https://example.com) markdown.";
    assert.equal(stripObsidianSyntax(content), content);
  });
});

// ---- inferTitle ----

describe("inferTitle", () => {
  test("extracts first H1 from body", () => {
    const body = "# My Amazing Post\n\nSome intro text.";
    assert.equal(inferTitle(body, "2026-07-28-my-amazing-post.md"), "My Amazing Post");
  });

  test("falls back to filename when no H1 present", () => {
    const body = "## Subheading only\n\nNo H1 here.";
    assert.equal(inferTitle(body, "2026-07-28-my-post.md"), "my post");
  });

  test("strips date prefix from filename fallback", () => {
    assert.equal(inferTitle("", "2025-01-15-some-cool-post.md"), "some cool post");
  });

  test("handles filename without date prefix", () => {
    assert.equal(inferTitle("", "just-a-slug.md"), "just a slug");
  });

  test("converts kebab-case filename to title with spaces", () => {
    assert.equal(inferTitle("", "building-with-astro-7.md"), "building with astro 7");
  });

  test("returns empty string for empty body and empty filename", () => {
    assert.equal(inferTitle("", ""), "");
  });

  test("H1 takes precedence over filename", () => {
    const body = "# Real Title\n\nBody.";
    assert.equal(inferTitle(body, "2026-07-28-different-slug.md"), "Real Title");
  });

  test("handles H1 with extra whitespace", () => {
    const body = "#   Spaced Title   \n\nBody.";
    assert.equal(inferTitle(body, "filename.md"), "Spaced Title");
  });
});
