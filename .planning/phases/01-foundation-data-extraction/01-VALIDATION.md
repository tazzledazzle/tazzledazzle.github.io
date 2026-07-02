---
phase: 01
slug: foundation-data-extraction
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-01
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Ruby stdlib + Rake (no test gem required) |
| **Config file** | `lib/tasks/data.rake`, `scripts/validate-data.rb` |
| **Quick run command** | `bundle exec rake data:validate` |
| **Full suite command** | `bundle exec rake data:validate && bundle exec jekyll build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `bundle exec rake data:validate`
- **After every plan wave:** Run `bundle exec jekyll build` (CI on push)
- **Before `/gsd-verify-work`:** Full suite must be green; blog inventory featured count reviewed

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 01-01-01 | 01 | 1 | DATA-01–04 infra | unit | `ruby -c scripts/validate-data.rb` | ⬜ pending |
| 01-01-02 | 01 | 1 | DATA-01–04 infra | unit | `bundle exec rake -T data` | ⬜ pending |
| 01-02-01 | 02 | 2 | DATA-03 | unit | `bundle exec rake data:validate` (navigation, social PASS) | ⬜ pending |
| 01-02-02 | 02 | 2 | DATA-01 | unit | `bundle exec ruby -e "..."` featured count 3–5 | ⬜ pending |
| 01-02-03 | 02 | 2 | DATA-01 | unit | `bundle exec rake data:validate` projects | ⬜ pending |
| 01-03-01 | 03 | 2 | DATA-02 | unit | `bundle exec rake data:validate` career | ⬜ pending |
| 01-03-02 | 03 | 2 | DATA-02 | manual | LinkedIn paste checkpoint | ⬜ pending |
| 01-04-01 | 04 | 3 | DATA-04 | unit | `bundle exec rake data:inventory && data:validate` | ⬜ pending |
| 01-04-02 | 04 | 3 | D-10 | unit | `test -f docs/ASTRO-DATA-MAPPING.md` | ⬜ pending |
| 01-04-03 | 04 | 3 | DATA-04 | integration | `bundle exec rake data:validate` full gate | ⬜ pending |

---

## Wave 0 Requirements

- [x] `scripts/validate-data.rb` — schema + coverage validation (Plan 01-01)
- [x] `lib/tasks/data.rake` — `data:validate`, `data:inventory` tasks (Plan 01-01)
- [ ] `docs/ASTRO-DATA-MAPPING.md` — Plan 01-04
- [ ] `_data/*.yml` — Plans 01-02, 01-03, 01-04

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| LinkedIn career paste | DATA-02 | User-provided employer data (D-06) | Plan 01-03 checkpoint: paste last 3 roles with metrics |
| Featured post curation review | DATA-04 | 10–15 featured target needs editorial judgment | Review `_data/blog-inventory.yml` tier_counts after auto-rules |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or manual checkpoint documented
- [x] Sampling continuity: validate after each data file wave
- [x] Wave 0 covers validator scaffold
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-01
