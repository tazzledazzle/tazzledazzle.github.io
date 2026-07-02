import assert from "node:assert/strict";
import test from "node:test";
import type { BlogPostEntry } from "./posts.ts";
import {
  getDiscoverablePosts,
  getFeaturedPosts,
  getPrevNextPosts,
  getStandardPosts
} from "./posts.ts";

const d = (iso: string) => new Date(iso);

const fixture: BlogPostEntry[] = [
  {
    id: "a",
    data: {
      title: "Featured Old",
      pubDate: d("2024-01-01"),
      tags: [],
      tier: "featured",
      permalink: "/2024/01/01/featured-old/"
    }
  },
  {
    id: "b",
    data: {
      title: "Featured New",
      pubDate: d("2025-01-01"),
      tags: [],
      tier: "featured",
      permalink: "/2025/01/01/featured-new/"
    }
  },
  {
    id: "c",
    data: {
      title: "Standard",
      pubDate: d("2024-06-01"),
      tags: [],
      tier: "standard",
      permalink: "/2024/06/01/standard/"
    }
  },
  {
    id: "d",
    data: {
      title: "Archived",
      pubDate: d("2023-01-01"),
      tags: [],
      tier: "archived",
      permalink: "/2023/01/01/archived/"
    }
  }
];

test("getDiscoverablePosts excludes archived tier", () => {
  const result = getDiscoverablePosts(fixture);
  assert.equal(result.length, 3);
  assert.ok(result.every((p) => p.data.tier !== "archived"));
});

test("getFeaturedPosts returns only featured sorted pubDate desc", () => {
  const result = getFeaturedPosts(fixture);
  assert.deepEqual(
    result.map((p) => p.id),
    ["b", "a"]
  );
});

test("getStandardPosts returns only standard sorted pubDate desc", () => {
  const result = getStandardPosts(fixture);
  assert.deepEqual(result.map((p) => p.id), ["c"]);
});

test("getPrevNextPosts returns adjacent discoverable posts by pubDate", () => {
  const { prev, next } = getPrevNextPosts(fixture, "/2024/06/01/standard/");
  assert.equal(prev?.id, "a");
  assert.equal(next?.id, "b");
});

test("getPrevNextPosts never includes archived in sequence", () => {
  const { prev, next } = getPrevNextPosts(fixture, "/2024/01/01/featured-old/");
  assert.equal(prev, null);
  assert.equal(next?.id, "c");
});

test("getPrevNextPosts first post has prev undefined", () => {
  const { prev } = getPrevNextPosts(fixture, "/2024/01/01/featured-old/");
  assert.equal(prev, null);
});

test("getPrevNextPosts last post has next undefined", () => {
  const { next } = getPrevNextPosts(fixture, "/2025/01/01/featured-new/");
  assert.equal(next, null);
});
