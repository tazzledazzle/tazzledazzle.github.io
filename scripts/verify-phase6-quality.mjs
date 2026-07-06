import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();
const HOME = "dist/index.html";
const ABOUT = "dist/about/index.html";
const SAMPLE_POST = "dist/2024/11/08/kotlin-cheatsheet/index.html";
const ARCHIVED_POST = "dist/2015/12/03/welcome-to-jekyll/index.html";

const fail = (msg) => {
  console.error(`verify:phase6 FAILED — ${msg}`);
  process.exit(1);
};

const readText = async (relativePath) => {
  try {
    return await fs.readFile(path.join(root, relativePath), "utf8");
  } catch {
    return null;
  }
};

const assertIncludes = (haystack, needle, label) => {
  if (!haystack || !haystack.includes(needle)) {
    fail(`${label}: missing "${needle}"`);
  }
};

const assertExcludes = (haystack, needle, label) => {
  if (haystack?.includes(needle)) {
    fail(`${label}: should not include "${needle}"`);
  }
};

const assertExists = async (relativePath, label) => {
  try {
    await fs.access(path.join(root, relativePath));
  } catch {
    fail(`${label}: missing ${relativePath}`);
  }
};

// Prior phase regressions
try {
  execSync("node scripts/verify-phase3-hiring.mjs", { cwd: root, stdio: "pipe" });
  execSync("node scripts/verify-phase4-blog.mjs", { cwd: root, stdio: "pipe" });
  execSync("node scripts/verify-phase5-design.mjs", { cwd: root, stdio: "pipe" });
} catch (error) {
  const stderr = error.stderr?.toString() ?? error.message;
  fail(`prior phase regression failed: ${stderr.trim()}`);
}

// QUAL-03 / D-112–D-114
const home = await readText(HOME);
assertIncludes(home, 'meta name="description"', "QUAL-03 home meta description");
assertIncludes(home, "og:title", "QUAL-03 home og:title");
assertIncludes(home, "og:description", "QUAL-03 home og:description");
assertIncludes(home, "twitter:card", "QUAL-03 home twitter:card");
assertIncludes(home, "og:image", "QUAL-03 home og:image");
assertIncludes(home, "og-default.png", "QUAL-03 default OG image");

// QUAL-04 / D-116–D-119
const samplePost = await readText(SAMPLE_POST);
assertIncludes(samplePost, "application/ld+json", "QUAL-04 kotlin Article JSON-LD");
assertIncludes(samplePost, "Article", "QUAL-04 Article schema type");

const about = await readText(ABOUT);
assertIncludes(about, "application/ld+json", "QUAL-04 about Person JSON-LD");
assertIncludes(about, "Person", "QUAL-04 Person schema type");
assertIncludes(about, "sameAs", "QUAL-04 Person sameAs");

const archived = await readText(ARCHIVED_POST);
assertExcludes(archived, "og:description", "D-115 archived no og:description");
assertExcludes(archived, "application/ld+json", "D-119 archived no JSON-LD");

// QUAL-01 / D-110, D-129
assertIncludes(home, "preload", "QUAL-01 font preload");
assertIncludes(home, "woff2", "QUAL-01 woff2 preload");
await assertExists("public/fonts/inter-latin-400.woff2", "QUAL-01 Inter 400 font");

// QUAL-06 / D-128
await assertExists("public/og-default.png", "QUAL-06 og-default.png");

// QUAL-02 / D-124
try {
  execSync("npm run audit:contrast", { cwd: root, stdio: "pipe" });
} catch (error) {
  fail(`QUAL-02 contrast audit failed: ${error.stderr?.toString() ?? error.message}`);
}

// QUAL-05 CI wiring smoke (D-120–D-123)
await assertExists("lychee.toml", "QUAL-05 lychee.toml");
await assertExists("lighthouserc.cjs", "QUAL-05 lighthouserc.cjs");
await assertExists("tests/a11y/key-pages.spec.ts", "QUAL-05 axe tests");
await assertExists(".github/workflows/deploy-pages.yml", "QUAL-05 deploy workflow");

const workflow = await readText(".github/workflows/deploy-pages.yml");
assertIncludes(workflow, "test:a11y", "QUAL-05 workflow axe step");
assertIncludes(workflow, "lychee", "QUAL-05 workflow lychee step");
assertIncludes(workflow, "npm run build", "QUAL-05 workflow build step");

console.log("verify:phase6 passed — QUAL-01 through QUAL-06 smoke markers satisfied");
