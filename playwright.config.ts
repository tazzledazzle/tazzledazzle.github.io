import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/a11y",
  timeout: 60_000,
  workers: 1,
  use: {
    baseURL: "http://localhost:4321"
  },
  webServer: {
    command: "node scripts/serve-dist.mjs",
    port: 4321,
    reuseExistingServer: true,
    timeout: 120_000
  }
});
