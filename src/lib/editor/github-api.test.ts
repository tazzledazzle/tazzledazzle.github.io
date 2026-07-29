import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  getMainSHA,
  createBranch,
  createOrUpdateFile,
  createPR,
  fetchFileTree,
  fetchFileContent,
} from "./github-api.ts";

const TOKEN = "ghp_testtoken";
const REPO = "owner/repo";

/** Build a mock fetcher that records calls and returns predetermined responses. */
function makeFetcher(responses: Record<string, unknown>) {
  const calls: Array<{ url: string; init: RequestInit }> = [];

  const fetcher = async (url: string, init: RequestInit): Promise<Response> => {
    calls.push({ url, init });
    const urlKey = Object.keys(responses).find((k) => url.includes(k));
    const body = urlKey !== undefined ? responses[urlKey] : {};
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  return { fetcher, calls };
}

// ---- getMainSHA ----

describe("getMainSHA", () => {
  test("calls correct URL with Authorization header", async () => {
    const { fetcher, calls } = makeFetcher({
      "/git/ref/heads/main": { object: { sha: "abc123sha" } },
    });
    await getMainSHA(TOKEN, REPO, fetcher);
    assert.equal(calls.length, 1);
    assert.ok(calls[0].url.includes(`/repos/${REPO}/git/ref/heads/main`));
    assert.equal(
      (calls[0].init.headers as Record<string, string>)["Authorization"],
      `Bearer ${TOKEN}`
    );
  });

  test("returns the commit SHA from the response", async () => {
    const { fetcher } = makeFetcher({
      "/git/ref/heads/main": { object: { sha: "deadbeef" } },
    });
    const sha = await getMainSHA(TOKEN, REPO, fetcher);
    assert.equal(sha, "deadbeef");
  });
});

// ---- createBranch ----

describe("createBranch", () => {
  test("POSTs to the correct URL with body", async () => {
    const { fetcher, calls } = makeFetcher({ "/git/refs": {} });
    await createBranch(TOKEN, REPO, "post/2026-07-28-my-post", "sha123", fetcher);
    assert.equal(calls.length, 1);
    assert.ok(calls[0].url.includes(`/repos/${REPO}/git/refs`));
    assert.equal(calls[0].init.method, "POST");
    const body = JSON.parse(calls[0].init.body as string);
    assert.equal(body.ref, "refs/heads/post/2026-07-28-my-post");
    assert.equal(body.sha, "sha123");
  });

  test("sends Authorization header", async () => {
    const { fetcher, calls } = makeFetcher({ "/git/refs": {} });
    await createBranch(TOKEN, REPO, "branch", "sha", fetcher);
    assert.equal(
      (calls[0].init.headers as Record<string, string>)["Authorization"],
      `Bearer ${TOKEN}`
    );
  });
});

// ---- createOrUpdateFile ----

describe("createOrUpdateFile", () => {
  test("PUTs to correct URL with base64 content and commit message", async () => {
    const { fetcher, calls } = makeFetcher({ "/contents/": {} });
    const content = "# Hello World\n";
    const path = "src/content/blog/2026-07-28-hello.md";
    await createOrUpdateFile(TOKEN, REPO, path, content, "post: Hello World", undefined, fetcher);
    assert.equal(calls.length, 1);
    assert.ok(calls[0].url.includes(`/repos/${REPO}/contents/${path}`));
    assert.equal(calls[0].init.method, "PUT");
    const body = JSON.parse(calls[0].init.body as string);
    assert.equal(body.message, "post: Hello World");
    // content should be base64 encoded
    assert.equal(Buffer.from(body.content, "base64").toString("utf-8"), content);
  });

  test("includes sha when updating existing file", async () => {
    const { fetcher, calls } = makeFetcher({ "/contents/": {} });
    await createOrUpdateFile(TOKEN, REPO, "path/file.md", "body", "msg", "existingsha123", fetcher);
    const body = JSON.parse(calls[0].init.body as string);
    assert.equal(body.sha, "existingsha123");
  });

  test("omits sha when creating new file", async () => {
    const { fetcher, calls } = makeFetcher({ "/contents/": {} });
    await createOrUpdateFile(TOKEN, REPO, "path/file.md", "body", "msg", undefined, fetcher);
    const body = JSON.parse(calls[0].init.body as string);
    assert.equal(body.sha, undefined);
  });
});

// ---- createPR ----

describe("createPR", () => {
  test("POSTs to correct URL and returns PR html_url", async () => {
    const prUrl = "https://github.com/owner/repo/pull/42";
    const { fetcher, calls } = makeFetcher({ "/pulls": { html_url: prUrl } });
    const result = await createPR(TOKEN, REPO, "post: Hello", "post/branch", "main", fetcher);
    assert.equal(result, prUrl);
    assert.ok(calls[0].url.includes(`/repos/${REPO}/pulls`));
    assert.equal(calls[0].init.method, "POST");
  });

  test("sends correct head, base, title, and draft flag", async () => {
    const { fetcher, calls } = makeFetcher({ "/pulls": { html_url: "https://example.com" } });
    await createPR(TOKEN, REPO, "My Post", "post/my-branch", "main", fetcher);
    const body = JSON.parse(calls[0].init.body as string);
    assert.equal(body.title, "My Post");
    assert.equal(body.head, "post/my-branch");
    assert.equal(body.base, "main");
    assert.equal(body.draft, true);
  });
});

// ---- fetchFileTree ----

describe("fetchFileTree", () => {
  test("calls tree endpoint with recursive=1", async () => {
    const { fetcher, calls } = makeFetcher({
      "/git/trees/main": {
        tree: [
          { path: "src/content/blog/2026-07-28-post.md", type: "blob" },
          { path: "src/content/blog/2025-01-01-old.md", type: "blob" },
          { path: "src/pages/index.astro", type: "blob" },
          { path: "src/content/blog", type: "tree" },
        ],
      },
    });
    const paths = await fetchFileTree(TOKEN, REPO, fetcher);
    assert.ok(calls[0].url.includes(`/repos/${REPO}/git/trees/main?recursive=1`));
    assert.deepEqual(paths, [
      "src/content/blog/2026-07-28-post.md",
      "src/content/blog/2025-01-01-old.md",
    ]);
  });

  test("returns empty array when no blog posts found", async () => {
    const { fetcher } = makeFetcher({
      "/git/trees/main": { tree: [{ path: "README.md", type: "blob" }] },
    });
    const paths = await fetchFileTree(TOKEN, REPO, fetcher);
    assert.deepEqual(paths, []);
  });
});

// ---- fetchFileContent ----

describe("fetchFileContent", () => {
  test("calls contents endpoint and returns decoded content + sha", async () => {
    const rawContent = "# My Post\n\nHello world";
    const encoded = Buffer.from(rawContent).toString("base64");
    const { fetcher, calls } = makeFetcher({
      "/contents/": { content: encoded, sha: "filesha456" },
    });
    const result = await fetchFileContent(TOKEN, REPO, "src/content/blog/post.md", fetcher);
    assert.ok(calls[0].url.includes(`/repos/${REPO}/contents/src/content/blog/post.md`));
    assert.equal(result.content, rawContent);
    assert.equal(result.sha, "filesha456");
  });

  test("sends Authorization header", async () => {
    const { fetcher, calls } = makeFetcher({
      "/contents/": { content: Buffer.from("x").toString("base64"), sha: "s" },
    });
    await fetchFileContent(TOKEN, REPO, "path.md", fetcher);
    assert.equal(
      (calls[0].init.headers as Record<string, string>)["Authorization"],
      `Bearer ${TOKEN}`
    );
  });
});
