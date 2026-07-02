import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import * as yaml from "js-yaml";

const inventory = yaml.load(fs.readFileSync("src/data/blog-inventory.yml", "utf8"));
const archivedPermalinks = new Set(
  (inventory?.posts ?? [])
    .filter((post) => post.tier === "archived")
    .map((post) => post.permalink)
);

export default defineConfig({
  site: "https://tazzledazzle.github.io",
  output: "static",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !archivedPermalinks.has(page.pathname)
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
