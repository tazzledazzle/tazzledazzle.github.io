import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";

/** Legacy nav aliases emitted via Astro build-time redirects (D-29, D-31). */
export const ASTRO_NAV_REDIRECTS = {
  "/projects/": "/work/",
  "/About/": "/about/",
  "/Projects/": "/work/",
  "/Career/": "/career/",
  "/Blog/": "/blog/"
};

/** Fixed D-23 smoke matrix IDs — category-driven, locked for script/doc parity. */
export const SMOKE10_MATRIX = [
  { category: "featured", id: "2015-02-18-binary-search" },
  { category: "featured-alt-year", id: "2024-11-08-kotlin-cheatsheet" },
  { category: "standard", id: "2015-04-17-computer-science-rant" },
  { category: "standard-alt-year", id: "2025-01-08-cloud-comp" },
  { category: "archived", id: "2015-08-08-ea-forge-stuff" },
  { category: "archived-alt-year", id: "2024-11-20-clickops" },
  { category: "duplicate-2015", id: "2015-08-08-design-document-for-automating-macos-i" },
  { category: "canonical-2024", id: "2024-12-09-design-document-for-automating-macos" },
  { category: "mixed-case-nav", from: "/About/", to: "/about/" },
  { category: "projects-alias", from: "/projects/", to: "/work/" }
];

export function loadInventory(root = process.cwd()) {
  const file = path.join(root, "src/data/blog-inventory.yml");
  return yaml.load(fs.readFileSync(file, "utf8"));
}

export function buildDuplicateRedirects(inventory) {
  const map = {};
  for (const post of inventory.posts ?? []) {
    if (!post.canonical_slug) continue;
    const canonical = (inventory.posts ?? []).find((item) => item.id === post.canonical_slug);
    if (!canonical) continue;
    map[post.permalink] = canonical.permalink;
  }
  return map;
}

export function buildAstroRedirects() {
  return { ...ASTRO_NAV_REDIRECTS };
}

/** Duplicate 2015 design-doc URLs only — safe under public/ without nav path collisions. */
export function buildPublicRedirects(inventory) {
  return buildDuplicateRedirects(inventory);
}

export function permalinkToDistPath(permalink) {
  return path.join("dist", permalink.replace(/^\//, ""), "index.html");
}

export function redirectSourceToDistPath(fromPath) {
  const trimmed = fromPath.replace(/^\//, "").replace(/\/$/, "");
  return path.join("dist", trimmed, "index.html");
}

export function redirectSourceToPublicPath(fromPath) {
  return path.join("public", fromPath.replace(/^\//, ""), "index.html");
}
