import fs from "node:fs/promises";
import path from "node:path";
import {
  buildPublicRedirects,
  loadInventory
} from "./legacy-redirect-map.mjs";

const root = process.cwd();
const publicDir = path.join(root, "public");
const inventory = loadInventory(root);
const redirects = buildPublicRedirects(inventory);

const html = (target) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta http-equiv="refresh" content="0; url=${target}"/><link rel="canonical" href="${target}"/><title>Redirecting</title></head><body><a href="${target}">Continue</a></body></html>`;

for (const [from, to] of Object.entries(redirects)) {
  const outputPath = path.join(publicDir, from.replace(/^\//, ""), "index.html");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html(to), "utf8");
}

console.log(`Generated ${Object.keys(redirects).length} public/ redirect stubs.`);
