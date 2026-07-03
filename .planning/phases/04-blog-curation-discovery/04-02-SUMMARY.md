---
phase: 04-blog-curation-discovery
plan: 02
subsystem: blog
tags: [astro-expressive-code, rss]
requires:
  - phase: 02-astro-scaffold-content-migration
    provides: MainLayout, rss.xml endpoint
provides:
  - Expressive Code syntax highlighting with GitHub Dark theme
  - Sitewide RSS autodiscovery link
affects: [04-03, 04-06]
tech-stack:
  added: [astro-expressive-code]
  patterns: [EC integration before mdx(), CSS data-language label overlay]
key-files:
  created: []
  modified: [astro.config.mjs, package.json, src/layouts/MainLayout.astro, src/styles/global.css]
key-decisions:
  - "User approved astro-expressive-code install (checkpoint bypassed per orchestrator)"
  - "Language labels via data-language CSS pseudo-element top-right (no third-party badge plugin)"
  - "Copy button disabled; math fences fall back to plain txt (D-72)"
requirements-completed: [BLOG-03, BLOG-07]
duration: 5min
completed: 2026-07-02
---

# Phase 4 Plan 02: Expressive Code & RSS Summary

**Expressive Code with GitHub Dark theme and sitewide `/rss.xml` autodiscovery in MainLayout.**

## Performance

- **Duration:** 5 min
- **Tasks:** 3 (checkpoint auto-approved by user)
- **Files modified:** 4

## Accomplishments

- `astro-expressive-code` installed and ordered before `mdx()` in integrations
- GitHub Dark theme; EC CSS emitted at `dist/_astro/ec*.css`
- RSS `<link rel="alternate">` on all MainLayout pages

## Task Commits

1. **Task 1: Package legitimacy checkpoint** - user approved (skipped commit)
2. **Task 2: Install and configure Expressive Code** - `c3b373a9` (feat)
3. **Task 3: RSS autodiscovery in MainLayout** - `8ce84baa` (feat)

## Deviations from Plan

**Language label placement:** EC has no `showLanguageLabel` option; used `data-language::before` CSS in global.css for top-right labels (D-70).

## Self-Check: PASSED
