import fs from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();

const FEATURED_TITLE = "Kotlin Cheatsheet";
const ARCHIVED_TITLE = "Welcome to Jekyll";
const FEATURED_POST_PATH = "dist/2024/11/08/kotlin-cheatsheet/index.html";
const POST_WITH_TAGS_PATH = "dist/2015/02/18/searching-and-sorting-binary-search/index.html";
const SAMPLE_POST_WITH_CODE = "dist/2025/01/08/cloud-computing-notes/index.html";

const fail = (msg) => {
  console.error(`verify:phase4 FAILED — ${msg}`);
  process.exit(1);
};

const readText = async (relativePath) => {
  try {
    return await fs.readFile(path.join(root, relativePath), "utf8");
  } catch {
    return null;
  }
};

const assertIncludes = (html, needle, label) => {
  if (!html || !html.includes(needle)) {
    fail(`${label}: missing "${needle}"`);
  }
};

const assertRegex = (html, pattern, label) => {
  if (!html || !pattern.test(html)) {
    fail(`${label}: pattern ${pattern} not matched`);
  }
};

const findArchivedPostPath = () => {
  const output = execSync(
    `rg -l 'tier: "archived"' src/content/blog | head -1`,
    { cwd: root, encoding: "utf8" }
  ).trim();
  if (!output) fail("setup: no archived post in content");
  const basename = path.basename(output, ".md");
  const content = readFileSync(path.join(root, output), "utf8");
  const match = content.match(/permalink:\s*"([^"]+)"/);
  if (!match) fail("setup: archived post missing permalink");
  const slug = match[1].replace(/^\//, "").replace(/\/$/, "");
  return `dist/${slug}/index.html`;
};

const findTagIndex = async () => {
  const tagsDir = path.join(root, "dist/blog/tags");
  try {
    const entries = await fs.readdir(tagsDir);
    for (const entry of entries) {
      const indexPath = path.join(tagsDir, entry, "index.html");
      try {
        await fs.access(indexPath);
        return `dist/blog/tags/${entry}/index.html`;
      } catch {
        // continue
      }
    }
  } catch {
    fail("BLOG-04: dist/blog/tags/ missing");
  }
  fail("BLOG-04: no tag index pages built");
};

// BLOG-01 / D-61–D-64, D-80
const blogIndex = await readText("dist/blog/index.html");
if (!blogIndex) fail("dist/blog/index.html missing");
assertIncludes(blogIndex, "Featured", "BLOG-01 Featured section");
assertIncludes(blogIndex, FEATURED_TITLE, "BLOG-01 featured post title");
if (blogIndex.includes(ARCHIVED_TITLE)) {
  fail("BLOG-01: archived title present on blog index");
}
assertRegex(blogIndex, /min read/i, "BLOG-01 read time marker");
assertIncludes(blogIndex, "/blog/archive/", "D-80 archive link");

// BLOG-02 / D-65–D-66
const featuredPost = await readText(FEATURED_POST_PATH);
if (!featuredPost) fail(`${FEATURED_POST_PATH} missing`);
assertRegex(
  featuredPost,
  /January|February|March|April|May|June|July|August|September|October|November|December/,
  "BLOG-02 long date"
);
assertRegex(featuredPost, /min read/i, "BLOG-02 read time");

// BLOG-03 / D-69–D-71
const codePost = await readText(SAMPLE_POST_WITH_CODE);
if (!codePost) fail(`${SAMPLE_POST_WITH_CODE} missing`);
if (!/ec-|expressive-code/i.test(codePost)) {
  fail("BLOG-03: missing expressive-code markers in post HTML");
}
try {
  const astroDir = path.join(root, "dist/_astro");
  const files = await fs.readdir(astroDir);
  if (!files.some((f) => f.startsWith("ec") && f.endsWith(".css"))) {
    fail("BLOG-03: missing dist/_astro/ec*.css");
  }
} catch {
  fail("BLOG-03: dist/_astro missing");
}

// BLOG-04 / D-73–D-75
const tagIndexPath = await findTagIndex();
const tagIndex = await readText(tagIndexPath);
if (!tagIndex) fail(`${tagIndexPath} missing`);
const postWithTags = await readText(POST_WITH_TAGS_PATH);
if (!postWithTags) fail(`${POST_WITH_TAGS_PATH} missing`);
assertRegex(postWithTags, /\/blog\/tags\//, "BLOG-04 post-tags links");
assertIncludes(postWithTags, "post-tags", "BLOG-04 post-tags region");

// BLOG-05 / D-77–D-79
const archive = await readText("dist/blog/archive/index.html");
if (!archive) fail("dist/blog/archive/index.html missing");
assertRegex(archive, />(2024|2025|2023|2015|2016)</, "BLOG-05 year heading");

// BLOG-06 / D-81–D-82
assertRegex(featuredPost, /post-nav|Previous:|Next/i, "BLOG-06 post navigation");

// BLOG-07 / D-83–D-84
const home = await readText("dist/index.html");
if (!home) fail("dist/index.html missing");
for (const [label, html] of [
  ["homepage", home],
  ["blog index", blogIndex],
  ["sample post", featuredPost]
]) {
  assertRegex(html, /rel="alternate"[^>]*application\/rss\+xml/i, `BLOG-07 ${label} rss rel`);
  assertIncludes(html, 'href="/rss.xml"', `BLOG-07 ${label} rss href`);
}

// D-67 / D-68
const archivedPath = findArchivedPostPath();
const archivedHtml = await readText(archivedPath);
if (!archivedHtml) fail(`${archivedPath} missing`);
assertIncludes(archivedHtml, "noindex", "D-67 archived noindex");
assertIncludes(archivedHtml, "Archived post", "D-67 archived banner");

console.log("verify:phase4 passed — BLOG-01 through BLOG-07 markers satisfied");
