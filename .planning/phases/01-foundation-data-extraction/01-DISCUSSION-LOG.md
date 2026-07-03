# Phase 1: Foundation & Data Extraction - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-01
**Phase:** 1-Foundation & Data Extraction
**Areas discussed:** Featured projects, Career data, Data format, Blog curation, Navigation & URLs

---

## Featured Projects

| Option | Description | Selected |
|--------|-------------|----------|
| Personal/professional only | macOS Log Analyzer, ImgAnnotator, etc. | ✓ |
| Personal + standout academic | Personal + 1–2 academic repos | |
| Broader mix | User specifies repos | |

| Option | Description | Selected |
|--------|-------------|----------|
| Merge portfolio-projects | Absorb into main site data | ✓ |
| Link out | Keep separate site, one card links there | |
| Deprecate | Stop linking entirely | |

| Option | Description | Selected |
|--------|-------------|----------|
| Exclude academic from featured | Archive tier only | ✓ |
| Secondary list below featured | Not in top 3–5 | |
| Include one academic in featured | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Mixed demo links | Note per project which have demos | ✓ |
| GitHub-only | Mark "code only" when no demo | |
| Demos required | Only feature projects with live demos | |

**User's choice:** Personal/professional only; merge portfolio-projects; exclude academic; mixed demo links per project.

---

## Career Data

| Option | Description | Selected |
|--------|-------------|----------|
| LinkedIn source | User will paste/share details | ✓ |
| User provides directly | | |
| Match resume PDF | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Last 3 roles | Recommended for recruiters | ✓ |
| Full history | | |
| Current + education only | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Metrics required | At least one quantified bullet per role | ✓ |
| When available | | |
| Skip metrics | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Degree only | No coursework list | ✓ |
| Include UW in career data | | |
| Separate education section | | |

**User's choice:** LinkedIn source; last 3 roles; metrics required; degree only for education.

---

## Data Format

| Option | Description | Selected |
|--------|-------------|----------|
| Both Jekyll + Astro mapping | `_data/` now, document Astro path for Phase 2 | ✓ |
| Jekyll `_data/` only | | |
| Astro `src/data/` early | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Split project files | `featured.yml` + `archive.yml` | ✓ |
| Flat list with featured flag | | |
| JSON | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Separate nav + social data files | `_data/navigation.yml` + `_data/social.yml` | ✓ |
| Extend `_config.yml` | | |
| Single `_data/site.yml` | | |

| Option | Description | Selected |
|--------|-------------|----------|
| YAML inventory in repo | `_data/blog-inventory.yml` | ✓ |
| CSV spreadsheet | | |
| Markdown in `.planning/` | | |

**User's choice:** Both locations; split project files; separate nav/social data; YAML blog inventory.

---

## Blog Curation

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-archive `hide: true` + manual rest | 13 posts today | ✓ |
| Manual tier for every post | | |
| Rule-based by category | | |

| Option | Description | Selected |
|--------|-------------|----------|
| 10–15 featured posts | Research recommendation | ✓ |
| 5–10 featured | | |
| Decide per-post during review | | |

| Option | Description | Selected |
|--------|-------------|----------|
| URLs preserved + noindex | Excluded from index/RSS | ✓ |
| URLs preserved only | | |
| Redirect to archive page | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Consolidate duplicate design docs | One canonical URL per topic | ✓ |
| Keep both URLs | | |
| Audit first, decide per pair | | |

**User's choice:** Auto-hide + manual review; 10–15 featured; noindex on archived; consolidate duplicates.

---

## Navigation & URLs

| Option | Description | Selected |
|--------|-------------|----------|
| Lowercase everywhere | `/about/`, `/work/`, `/career/`, `/blog/` | ✓ |
| Match current file permalinks | | |
| Lowercase + redirects from mixed-case | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Fix to `/blog/` | Matches blog.md permalink | ✓ |
| Different path | | |

| Option | Description | Selected |
|--------|-------------|----------|
| `/work/` after merge | Hiring-focused URL | ✓ |
| `/projects/` | | |
| Keep both with redirect | | |

| Option | Description | Selected |
|--------|-------------|----------|
| Data + config only in Phase 1 | Nav fix when templates consume data | ✓ |
| Fix Jekyll header immediately | | |
| Both now and data extract | | |

**User's choice:** Lowercase URLs; `/blog/`; `/work/` for projects; data-only deliverable in Phase 1.

---

## Claude's Discretion

- YAML schema field naming
- Default featured repo selection from existing projects.md + merged portfolio-projects
- Heuristic auto-classification for non-hidden posts pending review

## Deferred Ideas

- Live Jekyll nav fix in Phase 1 (user chose data-only)
- Academic secondary project listing (rejected)
- Secondary project grid UI (Phase 3)
