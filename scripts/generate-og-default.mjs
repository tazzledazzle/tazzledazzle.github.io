#!/usr/bin/env node
import sharp from "sharp";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "..", "public", "og-default.png");

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0d1117"/>
  <rect x="48" y="48" width="1104" height="534" rx="16" fill="#161b22" stroke="#30363d" stroke-width="2"/>
  <text x="96" y="280" fill="#e6edf3" font-family="Inter, system-ui, sans-serif" font-size="64" font-weight="600">Terence Schumacher</text>
  <text x="96" y="360" fill="#8b949e" font-family="Inter, system-ui, sans-serif" font-size="36" font-weight="400">Software Engineer · Platform &amp; Reliability</text>
  <text x="96" y="520" fill="#58a6ff" font-family="Inter, system-ui, sans-serif" font-size="28" font-weight="400">tazzledazzle.github.io</text>
</svg>
`;

const png = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outputPath, png);
console.log(`Wrote ${outputPath}`);
