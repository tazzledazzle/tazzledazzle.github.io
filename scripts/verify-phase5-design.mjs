import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

const root = process.cwd();

const SAMPLE_POST_PATH = "dist/2024/11/08/kotlin-cheatsheet/index.html";
const NAV_PATHS = ["/about/", "/work/", "/career/", "/blog/"];

const fail = (msg) => {
  console.error(`verify:phase5 FAILED — ${msg}`);
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

const assertRegex = (haystack, pattern, label) => {
  if (!haystack || !pattern.test(haystack)) {
    fail(`${label}: pattern ${pattern} not matched`);
  }
};

const readMainCss = async () => {
  const astroDir = path.join(root, "dist/_astro");
  const files = await fs.readdir(astroDir);
  const mainCss = files.find((f) => f.startsWith("MainLayout") && f.endsWith(".css"));
  if (!mainCss) fail("setup: dist/_astro/MainLayout*.css missing");
  return readText(`dist/_astro/${mainCss}`);
};

// Run prior phase regressions first
try {
  execSync("node scripts/verify-phase3-hiring.mjs", { cwd: root, stdio: "pipe" });
  execSync("node scripts/verify-phase4-blog.mjs", { cwd: root, stdio: "pipe" });
} catch (error) {
  const stderr = error.stderr?.toString() ?? error.message;
  fail(`prior phase regression failed: ${stderr.trim()}`);
}

const css = await readMainCss();
if (!css) fail("setup: could not read MainLayout CSS");

// DESN-01 / D-85–D-89, D-97–D-98
assertRegex(css, /--border/, "DESN-01 --border token");
assertRegex(css, /--surface/, "DESN-01 --surface token");
assertRegex(css, /\.btn-primary/, "DESN-01 .btn-primary class");
assertRegex(css, /\.card/, "DESN-01 .card class");

// DESN-03 / D-85
assertRegex(css, /color-scheme:\s*dark/, "DESN-03 color-scheme dark");

// DESN-04 / D-91, D-94
assertRegex(css, /65ch/, "DESN-04 65ch prose width");
const samplePost = await readText(SAMPLE_POST_PATH);
if (!samplePost) fail(`${SAMPLE_POST_PATH} missing`);
assertIncludes(samplePost, "post-body", "DESN-04 post-body region");
assertRegex(samplePost, /layout-prose/, "DESN-04 layout-prose on blog post");

// DESN-05 / D-105–D-106
const home = await readText("dist/index.html");
if (!home) fail("dist/index.html missing");
for (const navPath of NAV_PATHS) {
  assertIncludes(home, `href="${navPath}"`, `DESN-05 nav link ${navPath}`);
}
assertIncludes(home, "Work", "DESN-05 Work nav label");
assertRegex(home, /site-header|site-header__nav/, "DESN-05 header nav region");

// DESN-02 / D-101–D-103, D-104
assertRegex(css, /position:\s*sticky/, "DESN-02 sticky header");
assertIncludes(home, "mobile-nav", "DESN-02 mobile-nav marker");
assertRegex(css, /:focus-visible/, "DESN-02/D-104 focus-visible rings");

// D-93 hiring layout width
assertRegex(css, /72rem/, "D-93 72rem hiring layout");

// D-100 Hero scoped styles removed
const heroSource = await readText("src/components/Hero.astro");
if (!heroSource) fail("src/components/Hero.astro missing");
if (/<style>/.test(heroSource)) {
  fail("D-100: Hero.astro still contains scoped <style> block");
}

console.log("verify:phase5 passed — DESN-01 through DESN-05 markers satisfied");
