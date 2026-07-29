import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { generateSlug, generateFilename, generateBranchName } from "./slug.ts";

describe("generateSlug", () => {
  test("converts spaces to hyphens", () => {
    assert.equal(generateSlug("Hello World"), "hello-world");
  });

  test("lowercases all characters", () => {
    assert.equal(generateSlug("UPPER CASE"), "upper-case");
  });

  test("strips non-alphanumeric characters except hyphens", () => {
    assert.equal(generateSlug("Hello, World!"), "hello-world");
  });

  test("handles apostrophes and quotes", () => {
    // Apostrophe is non-alphanumeric → becomes hyphen, then collapsed
    assert.equal(generateSlug("It's a Test"), "it-s-a-test");
  });

  test("handles numbers in title", () => {
    assert.equal(generateSlug("Top 10 Tips"), "top-10-tips");
  });

  test("collapses multiple spaces into single hyphen", () => {
    assert.equal(generateSlug("Too   Many   Spaces"), "too-many-spaces");
  });

  test("collapses multiple hyphens into single hyphen", () => {
    assert.equal(generateSlug("Hello -- World"), "hello-world");
  });

  test("strips leading and trailing hyphens", () => {
    assert.equal(generateSlug("  Hello World  "), "hello-world");
  });

  test("handles title with only punctuation → empty string", () => {
    assert.equal(generateSlug("!!!"), "");
  });

  test("returns empty string for empty input", () => {
    assert.equal(generateSlug(""), "");
  });

  test("handles mixed alphanumeric and special chars", () => {
    assert.equal(generateSlug("C2C Marketplace: A Deep Dive"), "c2c-marketplace-a-deep-dive");
  });

  test("handles dots and slashes", () => {
    // Dots and slashes are non-alphanumeric → replaced with hyphens then collapsed
    assert.equal(generateSlug("astro.build/blog"), "astro-build-blog");
    assert.equal(generateSlug("v1.0 release"), "v1-0-release");
  });
});

describe("generateFilename", () => {
  test("returns YYYY-MM-DD-slug.md format", () => {
    assert.equal(
      generateFilename("2026-07-28", "my-first-post"),
      "2026-07-28-my-first-post.md"
    );
  });

  test("uses pubDate as-is (YYYY-MM-DD expected)", () => {
    assert.equal(
      generateFilename("2025-01-01", "hello"),
      "2025-01-01-hello.md"
    );
  });

  test("handles slug with numbers", () => {
    assert.equal(
      generateFilename("2026-07-28", "top-10-tips"),
      "2026-07-28-top-10-tips.md"
    );
  });

  test("handles empty slug", () => {
    assert.equal(generateFilename("2026-07-28", ""), "2026-07-28-.md");
  });
});

describe("generateBranchName", () => {
  test("returns post/YYYY-MM-DD-slug for new posts", () => {
    assert.equal(
      generateBranchName("new", "2026-07-28", "my-first-post"),
      "post/2026-07-28-my-first-post"
    );
  });

  test("returns edit/YYYY-MM-DD-slug for edits", () => {
    assert.equal(
      generateBranchName("edit", "2026-07-28", "my-first-post"),
      "edit/2026-07-28-my-first-post"
    );
  });

  test("uses provided date without modification", () => {
    assert.equal(
      generateBranchName("new", "2025-12-31", "year-end"),
      "post/2025-12-31-year-end"
    );
  });

  test("handles slug with numbers", () => {
    assert.equal(
      generateBranchName("new", "2026-01-15", "top-10-posts"),
      "post/2026-01-15-top-10-posts"
    );
  });
});
