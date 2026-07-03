---
phase: 04-blog-curation-discovery
plan: 01
subsystem: blog
tags: [astro, content-collections, unit-tests]
requires:
  - phase: 02-astro-scaffold-content-migration
    provides: migrated blog posts with tier frontmatter
provides:
  - Shared blog utility modules (dates, readTime, tags, posts)
  - Category-to-tags backfill script
affects: [04-03, 04-04, 04-05]
tech-stack:
  added: []
  patterns: [tier-filtered post queries, UTC long-date formatting, 225 WPM ceiling read time]
key-files:
  created: [src/lib/blog/dates.ts, src/lib/blog/readTime.ts, src/lib/blog/tags.ts, src/lib/blog/posts.ts, scripts/backfill-blog-tags.mjs]
  modified: [package.json]
key-decisions:
  - "Read time uses Math.ceil at 225 WPM with Math.max(1, ...) floor"
  - "formatLongDate uses UTC timezone for consistent date-only frontmatter"
  - "Tag backfill persists to frontmatter only; no runtime merge"
requirements-completed: [BLOG-04]
duration: 8min
completed: 2026-07-02
---

# Phase 4 Plan 01: Blog Utilities Summary

**Shared blog helpers with tier filtering, 225 WPM read time, tag slugs, and git-based category backfill.**

## Performance

- **Duration:** 8 min
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments

- `src/lib/blog/*` utilities with 18 passing unit tests
- `getDiscoverablePosts`, `getPrevNextPosts` encode featured+standard-only rules
- Idempotent `backfill-blog-tags.mjs` (0 updates — legacy sources lacked categories for empty-tag posts)

## Task Commits

1. **Task 1: Blog date, read-time, and tag slug utilities** - `99bf8c47` (test)
2. **Task 2: Discoverable post queries and prev/next sequencing** - `b2906d90` (feat)
3. **Task 3: Backfill empty tags from legacy Jekyll categories** - `0d59ed43` (feat)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] UTC timezone for formatLongDate**
- **Found during:** Task 1 tests
- **Issue:** ISO date strings parsed as UTC midnight displayed previous day in local TZ
- **Fix:** Added `timeZone: "UTC"` to `toLocaleDateString`
- **Commit:** `99bf8c47`

**2. [Rule 1 - Bug] HTML inner text counted in readTime**
- **Found during:** Task 1 tests
- **Issue:** Stripping tags left inner HTML text in word count
- **Fix:** Remove block elements including inner content before counting
- **Commit:** `99bf8c47`

## Self-Check: PASSED
