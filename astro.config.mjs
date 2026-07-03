import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import astroExpressiveCode from "astro-expressive-code";
import {
  buildAstroRedirects,
  loadInventory
} from "./scripts/legacy-redirect-map.mjs";

const inventory = loadInventory();
const archivedPermalinks = new Set(
  (inventory?.posts ?? [])
    .filter((post) => post.tier === "archived")
    .map((post) => post.permalink)
);

export default defineConfig({
  site: "https://tazzledazzle.github.io",
  output: "static",
  redirects: buildAstroRedirects(process.cwd()),
  integrations: [
    astroExpressiveCode({
      themes: ["github-dark"],
      frames: {
        showCopyToClipboardButton: false
      }
    }),
    mdx(),
    sitemap({
      filter: (page) => !archivedPermalinks.has(page.pathname)
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
