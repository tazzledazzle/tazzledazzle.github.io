---
phase: 01-foundation-data-extraction
plan: 02
subsystem: data
tags: [jekyll, yaml, navigation, projects, portfolio-projects]

# Dependency graph
requires:
  - phase: 01-01
    provides: "scripts/validate-data.rb and rake data:validate gate"
provides:
  - "Canonical _data/navigation.yml with /work/ and /blog/ paths"
  - "Canonical _data/social.yml migrated from _config.yml author block"
  - "_data/projects/featured.yml with 5 hiring-facing professional repos"
  - "_data/projects/archive.yml with 33 remaining portfolio-projects repos"
affects: ["01-03", "01-04", "Phase 2 nav wiring", "Phase 3 projects.md merge"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hiring project schema: id, title, summary, tech_stack, github_url, demo_url, demo_status, featured, source"
    - "portfolio-projects monorepo URLs via tree/main/{path} pattern"

key-files:
  created:
    - _data/navigation.yml
    - _data/social.yml
    - _data/projects/featured.yml
    - _data/projects/archive.yml
  modified: []

key-decisions:
  - "Featured tier: 5 repos (2 from projects.md + 3 from portfolio-projects per research defaults)"
  - "Archive excludes ForgeX (planned status) and all UW-CSS academic repos"
  - "All demo_url null with demo_status code_only until live demos confirmed (D-04)"

patterns-established:
  - "Navigation single source in _data/navigation.yml; _config.yml block left for Phase 2/3 wiring"
  - "Project github_url points to standalone repos or portfolio-projects subtree paths"

requirements-completed: [DATA-01, DATA-03]

# Metrics
duration: 8min
completed: 2026-07-02
---

# Phase 01 Plan 02: Navigation, Social & Projects Data Summary

**Canonical hiring YAML for nav (/work/), social links, 5 featured projects, and 33-archive portfolio-projects merge — all passing data:validate**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-02T06:08:00Z
- **Completed:** 2026-07-02T06:15:59Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Created `_data/navigation.yml` with 4 lowercase canonical paths including `/work/` (D-05) and `/blog/` (D-19).
- Migrated author/social contact data to `_data/social.yml` with gravatar_hash per D-12.
- Built `_data/projects/featured.yml` with 5 professional repos (no UW-CSS).
- Populated `_data/projects/archive.yml` with 33 remaining portfolio-projects repos; zero id overlap with featured.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create navigation.yml and social.yml from _config.yml** - `81b51cdc` (feat)
2. **Task 2: Build featured.yml from projects.md and portfolio-projects** - `8115578c` (feat)
3. **Task 3: Build archive.yml from remaining portfolio-projects repos** - `477c9592` (feat)

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified

- `_data/navigation.yml` - 4-item primary nav (About, Work, Career, Blog)
- `_data/social.yml` - name, email, github/linkedin/twitter with URLs, gravatar_hash
- `_data/projects/featured.yml` - 5 hiring-facing project cards
- `_data/projects/archive.yml` - 33 professional archive repos from portfolio-projects

## Decisions Made

- Featured picks: native-macos-log-analyzer, imgannotator (projects.md) + ws-chat-fast, online-bookstore, otel-demo-stack (portfolio-projects).
- Skipped ForgeX (planned, not implemented) from archive per stable/WIP filter in plan.
- All projects marked `demo_status: code_only` with `demo_url: null` — no confirmed live demos at extraction time.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prevented vendor/bundle from landing in task 2 commit**
- **Found during:** Task 2 commit
- **Issue:** Initial commit accidentally included 200+ untracked vendor/bundle files alongside featured.yml
- **Fix:** Soft-reset, unstaged vendor, recommitted only `_data/projects/featured.yml`
- **Files modified:** git history only
- **Verification:** `git show --stat HEAD` shows 1 file changed
- **Committed in:** `8115578c`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope change; prevented polluting repo with vendor artifacts.

## Issues Encountered

None beyond the accidental vendor staging (resolved before continuing).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- DATA-01 and DATA-03 satisfied for navigation, social, and project tiers.
- `bundle exec rake data:validate` passes navigation, social, and projects checks (career/inventory SKIP until Plans 03/04).
- Phase 2/3 can wire `_includes/header.html` to `site.data.navigation` and retire `_config.yml` nav block.
- `projects.md` outbound link removal deferred to Phase 3 per plan.

## Self-Check: PASSED

- FOUND: _data/navigation.yml
- FOUND: _data/social.yml
- FOUND: _data/projects/featured.yml
- FOUND: _data/projects/archive.yml
- FOUND: 81b51cdc
- FOUND: 8115578c
- FOUND: 477c9592

---
*Phase: 01-foundation-data-extraction*
*Completed: 2026-07-02*
