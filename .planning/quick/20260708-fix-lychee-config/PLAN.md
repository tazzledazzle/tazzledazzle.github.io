---
slug: fix-lychee-config
status: in-progress
---

# Fix lychee.toml Config Error

## Problem
lychee v0.23.0 rejects `base` (unknown field). Correct field is `base_url`.
`include_path` is also not a valid lychee config field — paths are passed as CLI args.

## Changes
1. lychee.toml: rename `base` → `base_url`, remove `include_path`
2. src/lib/lychee-config.test.ts: 3 tests that catch this failure locally
3. package.json: add `test:config` script to run the new tests

## Tests
- Test 1: `base` key must not appear in lychee.toml
- Test 2: `include_path` key must not appear (invalid lychee field)
- Test 3: All top-level keys must be from lychee's known valid field set
