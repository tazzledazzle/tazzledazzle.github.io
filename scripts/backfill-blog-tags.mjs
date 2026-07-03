#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";
import * as yaml from "js-yaml";

const root = process.cwd();
const blogDir = path.join(root, "src/content/blog");
const inventoryPath = path.join(root, "src/data/blog-inventory.yml");
const LEGACY_COMMIT = "4dd48dcc^";

const summary = {
  updated: 0,
  skipped_has_tags: 0,
  skipped_no_legacy_categories: 0,
  skipped_no_git_source: 0
};

const inventoryRaw = await fs.readFile(inventoryPath, "utf8");
const inventory = yaml.load(inventoryRaw);
const filenameById = new Map(
  (inventory?.posts ?? []).map((post) => [post.id, post.filename])
);

function parseFrontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
  if (!match) return { frontmatter: {}, body: content, raw: "" };
  const raw = match[1];
  const body = content.slice(match[0].length).replace(/^\r?\n/, "");
  const frontmatter = yaml.load(raw) ?? {};
  return { frontmatter, body, raw };
}

function serializeFrontmatter(frontmatter) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    } else if (value === null) {
      lines.push(`${key}: null`);
    } else if (typeof value === "string") {
      lines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

function normalizeTag(tag) {
  return tag.trim().toLowerCase().replace(/_/g, "-");
}

function parseLegacyCategories(legacyContent) {
  const { frontmatter } = parseFrontmatter(legacyContent.replace(/^---\r?\n/, "---\n"));
  const categories = frontmatter.categories;
  if (!categories) return null;

  let items = [];
  if (Array.isArray(categories)) {
    items = categories.map(String);
  } else if (typeof categories === "string") {
    items = categories.split(/\s+/).filter(Boolean);
  }

  if (items.length === 0) return null;
  return [...new Set(items.map(normalizeTag))];
}

function recoverLegacySource(filename) {
  const gitPath = `_posts/${filename}`;
  try {
    return execSync(`git show ${LEGACY_COMMIT}:${JSON.stringify(gitPath).slice(1, -1)}`, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });
  } catch {
    return null;
  }
}

const files = (await fs.readdir(blogDir)).filter((f) => f.endsWith(".md"));

for (const file of files) {
  const filePath = path.join(blogDir, file);
  const content = await fs.readFile(filePath, "utf8");
  const { frontmatter, body } = parseFrontmatter(content);
  const tags = frontmatter.tags;

  if (Array.isArray(tags) && tags.length > 0) {
    summary.skipped_has_tags++;
    continue;
  }

  const id = file.replace(/\.md$/, "");
  const legacyFilename = filenameById.get(id);
  if (!legacyFilename) {
    summary.skipped_no_git_source++;
    continue;
  }

  const legacyContent = recoverLegacySource(legacyFilename);
  if (!legacyContent) {
    summary.skipped_no_git_source++;
    continue;
  }

  const categories = parseLegacyCategories(legacyContent);
  if (!categories) {
    summary.skipped_no_legacy_categories++;
    continue;
  }

  const updatedFrontmatter = { ...frontmatter, tags: categories };
  const updated = `${serializeFrontmatter(updatedFrontmatter)}\n${body}`;
  await fs.writeFile(filePath, updated, "utf8");
  summary.updated++;
}

console.log(JSON.stringify(summary));
process.exit(0);
