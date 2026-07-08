#!/usr/bin/env node
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 4321);
const DIST_DIR = join(fileURLToPath(new URL("..", import.meta.url)), "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

function resolvePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  const relative = normalized.replace(/^\/+/, "");
  const filePath = join(DIST_DIR, relative);

  if (
    !filePath.startsWith(`${DIST_DIR}/`) &&
    !filePath.startsWith(`${DIST_DIR}\\`)
  ) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }
  const htmlFallback = `${filePath.replace(/\/$/, "")}/index.html`;
  if (existsSync(htmlFallback) && statSync(htmlFallback).isFile()) {
    return htmlFallback;
  }

  return null;
}

const server = createServer((req, res) => {
  const urlPath = req.url ?? "/";
  const filePath = resolvePath(urlPath);

  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const ext = extname(filePath);
  const body = readFileSync(filePath);
  res.writeHead(200, {
    "Content-Type": MIME[ext] ?? "application/octet-stream",
    "Cache-Control": "no-store"
  });
  res.end(body);
});

server.listen(PORT, () => {
  console.log(`Serving dist/ at http://localhost:${PORT}`);
});
