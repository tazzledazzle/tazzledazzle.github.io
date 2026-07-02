import fs from "node:fs/promises";
import path from "node:path";
import {
  ASTRO_NAV_REDIRECTS,
  SMOKE10_MATRIX,
  buildDuplicateRedirects,
  buildPublicRedirects,
  loadInventory,
  permalinkToDistPath,
  redirectSourceToDistPath,
  redirectSourceToPublicPath
} from "./legacy-redirect-map.mjs";

const root = process.cwd();
const check = process.argv[3];
const inventory = loadInventory(root);
const postsById = new Map((inventory.posts ?? []).map((post) => [post.id, post]));
const archived = new Set(
  (inventory.posts ?? []).filter((p) => p.tier === "archived").map((p) => p.permalink)
);
const publicRedirects = buildPublicRedirects(inventory);

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

const readText = async (relativePath) => {
  try {
    return await fs.readFile(path.join(root, relativePath), "utf8");
  } catch {
    return null;
  }
};

const assertRedirectHtml = (html, target, label) => {
  if (!html) fail(`Missing redirect artifact: ${label}`);
  if (!html.includes(`url=${target}`)) {
    fail(`Redirect ${label} missing meta refresh target ${target}`);
  }
  if (!html.includes(`href="${target}"`)) {
    fail(`Redirect ${label} missing canonical href ${target}`);
  }
};

const assertBlogRoute = async (permalink, label) => {
  const distPath = permalinkToDistPath(permalink);
  const html = await readText(distPath);
  if (!html || html.length < 50) {
    fail(`Missing or empty blog route in dist: ${permalink} (${distPath})`);
  }
};

if (check === "routes51" || check === "smoke10") {
  const expected = inventory.posts?.length ?? 0;
  if (expected !== 51) fail(`Expected 51 inventory posts, got ${expected}`);

  for (const post of inventory.posts ?? []) {
    await assertBlogRoute(post.permalink, post.id);
  }
}

if (check === "rss-sitemap" || check === "smoke10") {
  const rss = await readText("dist/rss.xml");
  if (!rss) fail("Missing dist/rss.xml");
  for (const link of archived) {
    if (rss.includes(link)) fail(`Archived permalink leaked in RSS: ${link}`);
  }

  const featured = (inventory.posts ?? []).find((p) => p.tier === "featured");
  if (featured && !rss.includes(featured.permalink)) {
    fail(`Featured permalink missing from RSS: ${featured.permalink}`);
  }

  const sitemap = await readText("dist/sitemap-index.xml");
  if (!sitemap) fail("Missing dist/sitemap-index.xml");
  for (const link of archived) {
    if (sitemap.includes(link)) fail(`Archived permalink leaked in sitemap: ${link}`);
  }
}

if (check === "redirects" || check === "smoke10") {
  for (const [from, to] of Object.entries(buildDuplicateRedirects(inventory))) {
    const html = await readText(redirectSourceToPublicPath(from));
    assertRedirectHtml(html, to, `public duplicate ${from}`);
  }

  for (const [from, to] of Object.entries(ASTRO_NAV_REDIRECTS)) {
    const html = await readText(redirectSourceToDistPath(from));
    assertRedirectHtml(html, to, `dist astro alias ${from}`);
  }

  const conflictingPublic = ["public/About/index.html", "public/Blog/index.html", "public/Career/index.html", "public/Projects/index.html", "public/projects/index.html"];
  for (const file of conflictingPublic) {
    const html = await readText(file);
    if (html) {
      fail(`Nav alias redirect must not live in public/ (${file}); use astro.config redirects.`);
    }
  }
}

if (check === "smoke10") {
  if (SMOKE10_MATRIX.length !== 10) fail("Smoke matrix must contain exactly 10 entries.");

  for (const entry of SMOKE10_MATRIX) {
    if (entry.id) {
      const post = postsById.get(entry.id);
      if (!post) fail(`Smoke matrix id not found in inventory: ${entry.id}`);
      await assertBlogRoute(post.permalink, entry.id);
      continue;
    }

    if (entry.from?.startsWith("/projects/")) {
      const html = await readText(redirectSourceToDistPath(entry.from));
      assertRedirectHtml(html, entry.to, entry.category);
      continue;
    }

    if (entry.from) {
      const html = await readText(redirectSourceToDistPath(entry.from));
      assertRedirectHtml(html, entry.to, entry.category);
    }
  }

  const duplicateEntry = SMOKE10_MATRIX.find((e) => e.category === "duplicate-2015");
  const canonicalEntry = SMOKE10_MATRIX.find((e) => e.category === "canonical-2024");
  if (duplicateEntry?.id && canonicalEntry?.id) {
    const duplicate = postsById.get(duplicateEntry.id);
    const canonical = postsById.get(canonicalEntry.id);
    const expected = publicRedirects[duplicate.permalink];
    if (expected !== canonical.permalink) {
      fail("Duplicate smoke pair canonical target mismatch in redirect map.");
    }
  }
}

console.log(`check '${check}' passed`);
