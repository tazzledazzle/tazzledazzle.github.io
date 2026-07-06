#!/usr/bin/env node
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const PORT = 4321;

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

const server = spawn("node", ["scripts/serve-dist.mjs"], {
  stdio: "inherit",
  env: { ...process.env, PORT: String(PORT) }
});

try {
  await delay(1500);
  await run("npx", ["lhci", "autorun"]);
} finally {
  server.kill("SIGTERM");
}
