# Phase 2 Validation Matrix

## Scope

Deterministic pre-merge checks for D-23 and rollback guidance for D-24. The smoke matrix below mirrors `SMOKE10_MATRIX` in `scripts/legacy-redirect-map.mjs` — keep both in sync.

## D-23 Smoke Matrix (fixed 10 URLs)

| # | Category | URL | Expected |
|---|----------|-----|----------|
| 1 | featured | `/2015/02/18/searching-and-sorting-binary-search/` | Post renders in `dist/` |
| 2 | featured-alt-year | `/2024/11/08/kotlin-cheatsheet/` | Post renders in `dist/` |
| 3 | standard | `/2015/04/17/computer-science-rant/` | Post renders in `dist/` |
| 4 | standard-alt-year | `/2025/01/08/cloud-computing-notes/` | Post renders in `dist/` |
| 5 | archived | `/2015/08/08/the-forge/` | Post renders; excluded from RSS/sitemap |
| 6 | archived-alt-year | `/2024/11/20/clickops/` | Post renders; excluded from RSS/sitemap |
| 7 | duplicate-2015 | `/2015/08/08/design-document-for-automating-macos-installers-pkg-and-dmg/` | Meta-refresh redirect to canonical |
| 8 | canonical-2024 | `/2024/12/09/design-document-for-automating-macos-installers/` | Post renders in `dist/` |
| 9 | mixed-case-nav | `/About/` | Astro redirect to `/about/` (checked in `dist/`) |
| 10 | projects-alias | `/projects/` | Astro redirect to `/work/` (checked in `dist/`) |

Inventory IDs: `2015-02-18-binary-search`, `2024-11-08-kotlin-cheatsheet`, `2015-04-17-computer-science-rant`, `2025-01-08-cloud-comp`, `2015-08-08-ea-forge-stuff`, `2024-11-20-clickops`, `2015-08-08-design-document-for-automating-macos-i`, `2024-12-09-design-document-for-automating-macos`.

### macOS local build note

Mixed-case nav aliases (`/About/`, `/Projects/`, etc.) use Astro build-time redirects, not `public/` stubs, because case-insensitive APFS treats `About` and `about` as the same path. `/projects/` also uses Astro redirects for the same reason. CI (Linux) and GitHub Pages deploys are case-sensitive and behave correctly. Gate mixed-case parity on post-build `dist/` checks.

## Required Validation Commands

Run all commands from repo root:

1. `npm run build`
2. `node scripts/verify-phase2-routes.mjs --check smoke10`
3. `node scripts/verify-phase2-routes.mjs --check rss-sitemap`
4. `node scripts/verify-phase2-routes.mjs --check redirects`
5. `node scripts/verify-phase2-routes.mjs --check routes51`
6. `bundle exec rake data:validate`
7. `node scripts/verify-phase2-routes.mjs --check jekyll-retired` (after Jekyll cleanup)

## Pass Criteria

- All 10 URLs in smoke matrix pass parity assertions.
- All 51 inventory permalinks build routable artifacts in `dist/`.
- RSS excludes archived entries (D-32).
- Sitemap excludes archived entries (D-33).
- Nav aliases use Astro redirects in `dist/`; duplicate 2015 URLs use `public/` meta-refresh stubs (D-28, D-29, D-30, D-31).
- Active Jekyll runtime artifacts removed after cutover (D-34–D-36); Ruby validator remains green (D-37).

## Rollback (D-24)

If production breakage is detected after merge:

1. Identify the Astro cutover commit hash in main.
2. Execute `git revert <cutover-commit-hash>`.
3. Push revert commit to main to restore last known-good Jekyll deploy state.

Do not use history-rewriting rollback commands.
