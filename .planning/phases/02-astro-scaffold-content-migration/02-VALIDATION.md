# Phase 2 Validation Matrix

## Scope

This validation matrix resolves the prior Phase 2 blocker by defining deterministic pre-merge checks for D-23 and rollback guidance for D-24.

## D-23 Smoke Matrix (fixed 10 URLs)

These 10 legacy URLs are the required parity set for pre-merge validation:

1. Featured post URL from `blog-inventory.yml`
2. Featured post URL from a different publication year
3. Standard post URL from `blog-inventory.yml`
4. Standard post URL from a different publication year
5. Archived post URL (must resolve but remain excluded from RSS/sitemap)
6. Archived post URL from a different publication year
7. Duplicate 2015 legacy URL (must redirect to canonical 2024 slug)
8. Canonical 2024 destination URL for duplicate pair
9. Legacy mixed-case nav URL `/About` (must redirect to `/about/`)
10. Legacy projects URL `/projects/` (must redirect to `/work/`)

Implementation note: executor must replace each category above with explicit permalink values sourced from `src/data/blog-inventory.yml` and keep this list stable once committed.

## Required Validation Commands

Run all commands from repo root:

1. `npm run build`
2. `node scripts/verify-phase2-routes.mjs --check smoke10`
3. `node scripts/verify-phase2-routes.mjs --check rss-sitemap`
4. `node scripts/verify-phase2-routes.mjs --check redirects`
5. `bundle exec rake data:validate`

## Pass Criteria

- All 10 URLs in smoke matrix pass parity assertions.
- RSS excludes archived entries (D-32).
- Sitemap excludes archived entries (D-33).
- Redirects exist for `/projects/`, mixed-case nav aliases, and duplicate URL consolidations (D-28, D-29, D-30, D-31).
- Data validator remains green after migration cleanup (D-37).

## Rollback (D-24)

If production breakage is detected after merge:

1. Identify the Astro cutover commit hash in main.
2. Execute `git revert <cutover-commit-hash>`.
3. Push revert commit to main to restore last known-good Jekyll deploy state.

Do not use history-rewriting rollback commands.
