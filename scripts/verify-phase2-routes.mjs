import fs from "node:fs/promises";
import path from "node:path";
import * as yaml from "js-yaml";

const root = process.cwd();
const check = process.argv[3];
const inventory = yaml.load(await fs.readFile(path.join(root, "src/data/blog-inventory.yml"), "utf8"));
const archived = new Set((inventory.posts ?? []).filter((p) => p.tier === "archived").map((p) => p.permalink));

const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};

if (check === "rss-sitemap" || check === "smoke10") {
  const rss = await fs.readFile(path.join(root, "dist/rss.xml"), "utf8");
  for (const link of archived) {
    if (rss.includes(link)) fail(`Archived permalink leaked in RSS: ${link}`);
  }
  const sitemap = await fs.readFile(path.join(root, "dist/sitemap-index.xml"), "utf8");
  for (const link of archived) {
    if (sitemap.includes(link)) fail(`Archived permalink leaked in sitemap: ${link}`);
  }
}

if (check === "redirects" || check === "smoke10") {
  const mustExist = [
    "public/projects/index.html",
    "public/About/index.html",
    "public/Projects/index.html",
    "public/Career/index.html",
    "public/Blog/index.html"
  ];
  for (const file of mustExist) {
    await fs.access(path.join(root, file)).catch(() => fail(`Missing redirect file: ${file}`));
  }
}

if (check === "smoke10") {
  const smoke = (inventory.posts ?? [])
    .filter((p) => ["featured", "standard", "archived"].includes(p.tier))
    .slice(0, 10);
  if (smoke.length !== 10) fail("Smoke10 inventory set was not 10 links.");
}

console.log(`check '${check}' passed`);
