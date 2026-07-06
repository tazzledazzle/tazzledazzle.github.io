#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const DIST_DIR = "dist";
let violations = 0;

function walkHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walkHtmlFiles(fullPath, files);
    } else if (extname(entry) === ".html") {
      files.push(fullPath);
    }
  }
  return files;
}

function checkImgTags(html, filePath) {
  const imgPattern = /<img\b[^>]*>/gi;
  const matches = html.match(imgPattern) ?? [];

  for (const tag of matches) {
    const altMatch = tag.match(/\balt\s*=\s*(['"])(.*?)\1/i);
    const roleMatch = tag.match(/\brole\s*=\s*(['"])presentation\1/i);

    if (!altMatch) {
      console.error(`${filePath}: <img> missing alt attribute — ${tag}`);
      violations += 1;
      continue;
    }

    const altValue = altMatch[2].trim();
    if (altValue.length === 0 && !roleMatch) {
      console.error(
        `${filePath}: <img> has empty alt without role="presentation" — ${tag}`
      );
      violations += 1;
    }
  }
}

const htmlFiles = walkHtmlFiles(DIST_DIR);
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  checkImgTags(html, file);
}

if (violations > 0) {
  console.error(`check-dist-alt failed: ${violations} violation(s)`);
  process.exit(1);
}

console.log(`check-dist-alt passed (${htmlFiles.length} HTML files scanned)`);
