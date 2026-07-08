import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(import.meta.url), "../../..");
const configPath = resolve(root, "lychee.toml");
const configText = readFileSync(configPath, "utf-8");

// Top-level keys lychee v0.23.0 accepts (from error output in CI).
const VALID_LYCHEE_KEYS = new Set([
  "files_from", "verbose", "no_progress", "host_stats", "extensions",
  "default_extension", "cache", "max_cache_age", "cache_exclude_status",
  "dump", "dump_inputs", "archive", "suggest", "max_redirects", "max_retries",
  "min_tls", "max_concurrency", "host_concurrency", "host_request_interval",
  "threads", "user_agent", "insecure", "scheme", "offline", "include",
  "exclude", "exclude_file", "exclude_path", "exclude_all_private",
  "exclude_private", "exclude_link_local", "exclude_loopback", "include_mail",
  "remap", "fallback_extensions", "index_files", "header", "accept",
  "include_fragments", "timeout", "retry_wait_time", "method", "base_url",
  "root_dir", "basic_auth", "github_token", "skip_missing", "no_ignore",
  "hidden", "include_verbatim", "glob_ignore_case", "output", "mode",
  "format", "generate", "require_https", "cookie_jar", "include_wikilinks",
  "preprocess", "hosts",
]);

function extractTopLevelKeys(toml: string): string[] {
  return toml
    .split("\n")
    .filter((line) => /^[a-z_][\w_]*\s*=/.test(line.trim()))
    .map((line) => line.trim().split(/\s*=/)[0]);
}

test("lychee.toml must not use the removed `base` field (renamed to `base_url`)", () => {
  const keys = extractTopLevelKeys(configText);
  assert.ok(
    !keys.includes("base"),
    'lychee.toml contains `base` — lychee v0.23+ requires `base_url` instead. ' +
    'This caused exit code 3 in CI. Rename the field.'
  );
});

test("lychee.toml must not use `include_path` (not a valid lychee config field)", () => {
  const keys = extractTopLevelKeys(configText);
  assert.ok(
    !keys.includes("include_path"),
    'lychee.toml contains `include_path` which is not a recognised field. ' +
    'Pass file paths as CLI arguments instead (e.g. `lychee dist`).'
  );
});

test("all top-level keys in lychee.toml must be valid lychee v0.23 fields", () => {
  const keys = extractTopLevelKeys(configText);
  const unknown = keys.filter((k) => !VALID_LYCHEE_KEYS.has(k));
  assert.deepEqual(
    unknown,
    [],
    `lychee.toml contains unknown fields: ${unknown.join(", ")}. ` +
    "These cause lychee to exit with code 3, failing CI before any links are checked."
  );
});
