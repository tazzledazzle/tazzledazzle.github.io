# Task 1 Brief: Fix deprecated encoding + unused param

## Context
Foundation utility layer for a blog post editor was just built with TDD. A review agent
flagged two non-blocking issues that must be fixed before the layer is used in production.

## Files to change

### 1. `src/lib/editor/github-api.ts`

**Line 74** — replace:
```ts
const encoded = btoa(unescape(encodeURIComponent(content)));
```
with the TextEncoder approach (no deprecated globals):
```ts
const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(content)));
```

**Line 156** — replace:
```ts
const decoded = decodeURIComponent(escape(atob(clean)));
```
with the TextDecoder approach:
```ts
const decoded = new TextDecoder().decode(Uint8Array.from(atob(clean), c => c.charCodeAt(0)));
```

### 2. `src/lib/editor/preprocessors.ts`

**Line 79** — fix unused `match` parameter:
```ts
// BEFORE
let result = content.replace(/\n?!\[\[.*?\]\]\n?/g, (match) => {
  // Preserve one newline boundary if the match consumed surrounding newlines
```
Change `(match) => {` to `(_match) => {` (prefix with underscore to signal intentional unused param,
OR if the callback body doesn't use `match` at all, change to `() => {`).

Read the actual function body first to confirm which form is correct.

## Verification
After changes, run:
```bash
node --test --experimental-strip-types src/lib/editor/*.test.ts
```
All 82 tests must still pass.

## Commit
Commit with message: `fix(editor): replace deprecated unescape/escape with TextEncoder/TextDecoder`

## Report
Write your full report to `.superpowers/sdd/task-1-report.md`.
Return: status (DONE/BLOCKED), commit SHA, test result summary (pass/fail counts).
