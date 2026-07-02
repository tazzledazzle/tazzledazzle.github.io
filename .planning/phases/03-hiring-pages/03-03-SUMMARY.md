---
phase: 03-hiring-pages
plan: 03
subsystem: ui
tags: [astro, work-page, project-grid]
requires:
  - phase: 03-hiring-pages
    provides: ProjectCard component
provides:
  - /work/ featured project card grid
  - Collapsible archive projects section
affects: [03-05]
tech-stack:
  added: []
  patterns: [2-column responsive grid, details/summary archive collapse]
key-files:
  created: [src/components/ArchiveProjects.astro]
  modified: [src/pages/work.astro, scripts/legacy-redirect-map.mjs, astro.config.mjs]
key-decisions:
  - "Skip mixed-case nav redirects on case-insensitive filesystems to prevent dist route overwrite"
patterns-established:
  - "Archive section defaults collapsed via details/summary"
requirements-completed: [HIRE-03, HIRE-04]
duration: 10min
completed: 2026-07-02
---

# Phase 3 Plan 03: Work Page Summary

**Hiring-grade /work/ page with featured card grid and collapsible archive section**

## Performance

- **Duration:** 10 min
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- All 5 featured projects in responsive 2-col/1-col grid
- Tech pills and GitHub links on every card; no spurious demo links
- "More projects" collapsible section from archive.yml

## Task Commits

1. **Task 1: Featured project card grid** - `bc5d1b67` (feat, combined with Task 2)
2. **Task 2: Archive section** - `bc5d1b67` (feat)
3. **Case-insensitive FS fix** - `61e036a1` (fix)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] macOS case-insensitive dist collision**
- **Found during:** Task 1 verification
- **Issue:** `/About/`, `/Career/`, `/Blog/` redirect HTML overwrote lowercase hiring pages on APFS
- **Fix:** Skip case-variant redirects when filesystem is case-insensitive; Linux CI retains full map
- **Files modified:** `scripts/legacy-redirect-map.mjs`, `astro.config.mjs`
- **Committed in:** `61e036a1`

## Self-Check: PASSED

- FOUND: src/components/ArchiveProjects.astro
- FOUND: bc5d1b67, 61e036a1

---
*Phase: 03-hiring-pages*
*Completed: 2026-07-02*
