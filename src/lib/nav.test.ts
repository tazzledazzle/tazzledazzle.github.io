import assert from "node:assert/strict";
import test from "node:test";
import { isActiveNavPath } from "./nav.ts";

test("isActiveNavPath matches exact section URL", () => {
  assert.equal(isActiveNavPath("/work/", "/work/"), true);
});

test("isActiveNavPath matches nested section paths", () => {
  assert.equal(isActiveNavPath("/work/foo/", "/work/"), true);
});

test("isActiveNavPath rejects unrelated sections", () => {
  assert.equal(isActiveNavPath("/about/", "/work/"), false);
});

test("isActiveNavPath treats home as exact match only", () => {
  assert.equal(isActiveNavPath("/", "/blog/"), false);
  assert.equal(isActiveNavPath("/blog/", "/blog/"), true);
});

test("isActiveNavPath matches blog tag pages under /blog/", () => {
  assert.equal(isActiveNavPath("/blog/tags/foo/", "/blog/"), true);
});
