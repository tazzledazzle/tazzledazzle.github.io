#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssPath = join(__dirname, "..", "src", "styles", "global.css");
const css = readFileSync(cssPath, "utf8");

const rootMatch = css.match(/:root\s*\{([^}]+)\}/);
if (!rootMatch) {
  console.error("Could not find :root block in global.css");
  process.exit(1);
}

const tokens = {};
for (const match of rootMatch[1].matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{3,8})/g)) {
  tokens[match[1]] = match[2];
}

const required = ["fg", "bg", "muted", "accent", "surface", "border"];
for (const name of required) {
  if (!tokens[name]) {
    console.error(`Missing token --${name} in :root`);
    process.exit(1);
  }
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized.slice(0, 6);
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16)
  ];
}

function relativeLuminance([r, g, b]) {
  const channel = (value) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(foregroundHex, backgroundHex) {
  const l1 = relativeLuminance(hexToRgb(foregroundHex));
  const l2 = relativeLuminance(hexToRgb(backgroundHex));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const pairs = [
  ["fg", "bg", "body text"],
  ["muted", "bg", "secondary text"],
  ["fg", "surface", "card text"],
  ["accent", "bg", "link text on background"],
  ["accent", "surface", "link text on cards"]
];

const minimum = 4.5;
let failed = false;

console.log("WCAG 2.1 AA contrast audit (4.5:1 minimum)\n");

for (const [foreground, background, label] of pairs) {
  const ratio = contrastRatio(tokens[foreground], tokens[background]);
  const pass = ratio >= minimum;
  const status = pass ? "PASS" : "FAIL";
  console.log(
    `${status} ${label}: --${foreground} on --${background} = ${ratio.toFixed(2)}:1`
  );
  if (!pass) {
    failed = true;
  }
}

if (failed) {
  console.error("\nContrast audit failed.");
  process.exit(1);
}

console.log("\nAll token pairs pass WCAG 2.1 AA.");
