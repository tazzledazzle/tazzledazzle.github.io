import fs from "node:fs/promises";
import path from "node:path";
import * as yaml from "js-yaml";

const root = process.cwd();
const publicDir = path.join(root, "public");
const inventory = yaml.load(await fs.readFile(path.join(root, "src/data/blog-inventory.yml"), "utf8"));

const redirects = new Map([
  ["/projects/", "/work/"],
  ["/About/", "/about/"],
  ["/Projects/", "/work/"],
  ["/Career/", "/career/"],
  ["/Blog/", "/blog/"]
]);

for (const post of inventory.posts ?? []) {
  if (!post.canonical_slug) continue;
  const canonical = (inventory.posts ?? []).find((item) => item.id === post.canonical_slug);
  if (!canonical) continue;
  redirects.set(post.permalink, canonical.permalink);
}

const html = (target) => `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta http-equiv="refresh" content="0; url=${target}"/><link rel="canonical" href="${target}"/><title>Redirecting</title></head><body><a href="${target}">Continue</a></body></html>`;

for (const [from, to] of redirects) {
  const outputPath = path.join(publicDir, from.replace(/^\//, ""), "index.html");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html(to), "utf8");
}

console.log(`Generated ${redirects.size} redirects.`);
