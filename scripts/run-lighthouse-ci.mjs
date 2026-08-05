#!/usr/bin/env node
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = 4321;
const READY_URL = `http://localhost:${PORT}/`;
const MAX_WAIT_MS = 60_000;
const POLL_MS = 250;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: process.platform === "win32",
      ...options
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited ${code}`));
    });
  });
}

async function waitForServer(url, { timeoutMs = MAX_WAIT_MS, intervalMs = POLL_MS } = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.ok || (res.status >= 300 && res.status < 500)) {
        return;
      }
      lastError = new Error(`Unexpected status ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    await delay(intervalMs);
  }

  throw new Error(
    `Server at ${url} not ready within ${timeoutMs}ms` +
      (lastError ? `: ${lastError.message ?? lastError}` : "")
  );
}

const server = spawn("node", ["scripts/serve-dist.mjs"], {
  stdio: "inherit",
  env: { ...process.env, PORT: String(PORT) }
});

try {
  await waitForServer(READY_URL);
  await run("npx", ["lhci", "autorun"]);
} finally {
  server.kill("SIGTERM");
}
