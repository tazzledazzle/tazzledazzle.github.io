import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const FEATURED_TITLES = [
  "Native macOS Log Analyzer",
  "ImgAnnotator",
  "WebSocket Chat (FastAPI)",
  "Online Bookstore",
  "OpenTelemetry Demo Stack"
];

const TEASE_TITLES = [
  "Native macOS Log Analyzer",
  "OpenTelemetry Demo Stack",
  "WebSocket Chat"
];

const HIRING_PAGES = [
  "dist/index.html",
  "dist/work/index.html",
  "dist/career/index.html",
  "dist/about/index.html"
];

const fail = (msg) => {
  console.error(`verify:phase3 FAILED — ${msg}`);
  process.exit(1);
};

const readText = async (relativePath) => {
  try {
    return await fs.readFile(path.join(root, relativePath), "utf8");
  } catch {
    return null;
  }
};

const countMatches = (haystack, pattern) => {
  const flags = pattern.global ? "" : "g";
  const re = pattern.global ? pattern : new RegExp(pattern.source, `${pattern.flags}${flags}`);
  return (haystack.match(re) ?? []).length;
};

const assertIncludes = (html, needle, label) => {
  if (!html || !html.includes(needle)) {
    fail(`${label}: missing "${needle}"`);
  }
};

const assertFooterSocial = (html, label) => {
  const footerMatch = html.match(/<footer[^>]*class="[^"]*site-footer[^"]*"[\s\S]*?<\/footer>/);
  if (!footerMatch) {
    fail(`${label}: missing site-footer region`);
  }
  const footer = footerMatch[0];
  assertIncludes(footer, "github.com/tazzledazzle", `${label} footer GitHub`);
  assertIncludes(footer, "linkedin.com/in/terenceschumacher", `${label} footer LinkedIn`);
  assertIncludes(footer, "mailto:terenceschumacher@gmail.com", `${label} footer email`);
};

const home = await readText("dist/index.html");
if (!home) fail("dist/index.html missing");

// HIRE-01
assertIncludes(home, "Platform-focused Software Engineer", "HIRE-01 role label");
if (!/observability|infrastructure/i.test(home)) {
  fail("HIRE-01: missing infrastructure/observability specialty keywords");
}
if (!/platform|tooling|DX/i.test(home)) {
  fail("HIRE-01: missing platform/tooling/DX specialty keywords");
}
if (!/reliable platforms teams ship on/i.test(home)) {
  fail("HIRE-01: missing value-proposition framing");
}

// HIRE-02
assertIncludes(home, "Download Resume", "HIRE-02 resume CTA");
assertIncludes(home, 'href="/resume.pdf"', "HIRE-02 resume href");
const teaseCount = TEASE_TITLES.reduce(
  (sum, title) => sum + countMatches(home, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")),
  0
);
if (teaseCount < 2) {
  fail(`HIRE-02: expected >= 2 featured project tease titles, found ${teaseCount}`);
}

// HIRE-03
const work = await readText("dist/work/index.html");
if (!work) fail("dist/work/index.html missing");
for (const title of FEATURED_TITLES) {
  assertIncludes(work, title, `HIRE-03 featured project "${title}"`);
}
if (!/grid/i.test(work)) {
  fail("HIRE-03: missing grid layout marker");
}
const githubCount = countMatches(work, /github\.com\/tazzledazzle/g);
if (githubCount < 5) {
  fail(`HIRE-03: expected >= 5 GitHub links on /work/, found ${githubCount}`);
}

// HIRE-04
if (/Live demo/i.test(work)) {
  fail("HIRE-04: unexpected demo links for code_only featured projects");
}

// HIRE-05
const career = await readText("dist/career/index.html");
if (!career) fail("dist/career/index.html missing");
assertIncludes(career, "Invisible Technologies", "HIRE-05 employer");
assertIncludes(career, "Tableau Software", "HIRE-05 employer");
assertIncludes(career, "Designed a platform-wide maturity audit", "HIRE-05 quantified bullet");
assertIncludes(career, "University of Washington", "HIRE-05 education");
assertIncludes(career, "Jan 2025", "HIRE-05 formatted date");

// HIRE-06
try {
  const resumeStat = await fs.stat(path.join(root, "dist/resume.pdf"));
  if (resumeStat.size <= 0) fail("HIRE-06: dist/resume.pdf is empty");
} catch {
  fail("HIRE-06: dist/resume.pdf missing");
}
const about = await readText("dist/about/index.html");
if (!about) fail("dist/about/index.html missing");
assertIncludes(about, "Download Resume", "HIRE-06 about header resume");
assertIncludes(about, 'href="/resume.pdf"', "HIRE-06 about resume href");

// HIRE-07
for (const pagePath of HIRING_PAGES) {
  const html = await readText(pagePath);
  const label = pagePath.replace("dist/", "").replace("/index.html", "");
  if (!html) fail(`${label}: missing built page`);
  assertIncludes(html, "github.com/tazzledazzle", `${label} GitHub`);
  assertIncludes(html, "linkedin.com/in/terenceschumacher", `${label} LinkedIn`);
  assertIncludes(html, "mailto:terenceschumacher@gmail.com", `${label} email`);
  assertFooterSocial(html, label);
}

// D-59 mobile nav
if (!/details|aria-label="Menu"|mobile-nav/i.test(home)) {
  fail("D-59: missing mobile navigation marker");
}

// D-60 About Connect
assertIncludes(about, "Connect", "D-60 about Connect heading");
assertIncludes(about, "github.com/tazzledazzle", "D-60 about body GitHub");
assertIncludes(about, "linkedin.com/in/terenceschumacher", "D-60 about body LinkedIn");
assertIncludes(about, "mailto:terenceschumacher@gmail.com", "D-60 about body email");
if (!/technical writing|software engineer/i.test(about)) {
  fail("D-60: about bio missing expected keywords");
}

// Archive section
assertIncludes(work, "More projects", "D-52 archive section");
assertIncludes(work, "Project Generator", "D-52 archive project");

console.log("verify:phase3 passed — HIRE-01 through HIRE-07 markers satisfied");
