import assert from "node:assert/strict";
import test from "node:test";
import { resolvePostTags, tagToSlug } from "./tags.ts";

test("tagToSlug normalizes underscores to hyphens", () => {
  assert.equal(tagToSlug("machine_learning"), "machine-learning");
});

test("tagToSlug normalizes spaces to hyphens", () => {
  assert.equal(tagToSlug("Data Science"), "data-science");
});

test("resolvePostTags returns frontmatter tags when non-empty", () => {
  assert.deepEqual(resolvePostTags(["algorithms"], ["blogging"]), ["algorithms"]);
});

test("resolvePostTags returns backfill when frontmatter tags empty", () => {
  assert.deepEqual(resolvePostTags([], ["blogging", "posts"]), ["blogging", "posts"]);
});

test("resolvePostTags returns empty array when no tags and no backfill", () => {
  assert.deepEqual(resolvePostTags([]), []);
});
