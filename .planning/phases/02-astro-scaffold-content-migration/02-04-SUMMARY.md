---
phase: 02-astro-scaffold-content-migration
plan: 04
subsystem: routing
tags: [rss, sitemap, redirects, astro-config]
requires:
  - phase: 02-astro-scaffold-content-migration
    provides: Blog posts, inventory tiers, canonical pages
provides:
  - RSS feed excluding archived tier (D-32)
  - Sitemap filter excluding archived permalinks (D-33)
  - Shared legacy-redirect-map.mjs for Astro nav aliases and duplicate public stubs
  - verify-phase2-routes.mjs checks rss-sitemap, redirects, routes51, smoke10
affects: [validation, jekyll-retirement]
tech-stack:
  added: [@astrojs/rss, js-yaml in verify scripts]
  patterns: [Astro build-time redirects for mixed-case nav, public meta-refresh for duplicate 2015 URLs]
key-files:
  created: [src/pages/rss.xml.ts, scripts/legacy-redirect-map.mjs, scripts/generate-legacy-redirects.mjs, scripts/verify-phase2-routes.mjs]
  modified: [astro.config.mjs, src/pages/[...slug].astro]
key-decisions:
  - "Option 2: mixed-case nav aliases via astro.config redirects, not public/ stubs (D-31)."
  - "/projects/ also uses Astro redirects due to macOS case-insensitive FS collision with /Projects/."
  - "public/ retains only duplicate canonical_slug meta-refresh stubs (D-28, D-30)."
patterns-established:
  - "Redirect parity gated on post-build dist/ checks for nav aliases."
  - "SMOKE10_MATRIX in legacy-redirect-map.mjs drives category-driven validation."
requirements-completed: [PLAT-03, PLAT-04, PLAT-05]
duration: 45min
completed: 2026-07-02
---

# Phase 2 Plan 04: Feeds & Redirects Summary

**RSS/sitemap archived-tier filtering plus Astro build-time nav redirects with inventory-driven duplicate stubs.**

## Performance
- **Duration:** 45 min
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- RSS and sitemap exclude archived posts while archived URLs remain buildable.
- Nav alias redirects (`/About/`, `/Projects/`, etc.) emit from Astro config into `dist/`.
- Ten duplicate 2015 design-doc URLs redirect via deterministic `public/` meta-refresh stubs.
- Automated verify script covers rss-sitemap, redirects, routes51, and smoke10 matrix.

## Task Commits
1. **Task 1: RSS and sitemap with archived exclusion** - `2858f28e` (feat)
2. **Task 2: Legacy redirect set (Option 2 Astro aliases)** - `36092112` (feat)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] public/ mixed-case stubs blocked canonical page builds on macOS**
- **Issue:** `public/About/index.html` collided with `about.astro` on case-insensitive APFS
- **Fix:** Removed public nav stubs; use `ASTRO_NAV_REDIRECTS` in astro.config.mjs; verify via dist/

**2. [Rule 3 - Blocking] /projects/ public stub collided with /Projects/ Astro redirect**
- **Fix:** Moved `/projects/` into Astro redirects alongside `/Projects/`

**3. [Rule 1 - Bug] Blog routes served under /blog/ prefix instead of inventory permalinks**
- **Fix:** Relocated `[...slug].astro` to `src/pages/` root (see 02-03 deviation)

## macOS Local Build Note
Case-insensitive filesystem treats `About` and `about` as one path. CI (Linux) and GitHub Pages are case-sensitive. Mixed-case redirect parity is validated against `dist/` after build, not `public/` nav stubs.

## Self-Check: PASSED
- Summary file exists
- Commits 2858f28e, 36092112 found in git log

---
*Phase: 02-astro-scaffold-content-migration*
*Completed: 2026-07-02*
