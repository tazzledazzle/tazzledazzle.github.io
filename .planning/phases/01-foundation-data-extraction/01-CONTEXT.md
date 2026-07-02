# Phase 1: Foundation & Data Extraction - Context

**Gathered:** 2026-07-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Extract portable hiring content into structured data files, fix navigation configuration, and produce a complete blog curation inventory — all before any Astro migration or visual redesign. Phase 1 delivers data artifacts and config that Phase 2+ can consume; it does not ship new page layouts or stack changes.

</domain>

<decisions>
## Implementation Decisions

### Featured Projects (DATA-01)
- **D-01:** Featured project pool is **personal/professional repos only** — no UW coursework in featured tier
- **D-02:** **Merge portfolio-projects site** into main site structured data (absorb content, stop linking out to separate site)
- **D-03:** Academic repos (UW-CSS tree) are **excluded from featured** — not shown in top 3–5 cards
- **D-04:** Demo links are **mixed per project** — maintainer notes which have live demos; mark "code only" when no demo exists
- **D-05:** Canonical projects URL after merge is **`/work/`** (not `/projects/`)

### Career Data (DATA-02)
- **D-06:** Career data source is **LinkedIn** — user will provide/paste employer details during implementation
- **D-07:** Include **last 3 roles only** in structured career data
- **D-08:** **At least one quantified metric bullet required per role**
- **D-09:** Education is **degree only** (UW Bothell CS) — no coursework list in structured data

### Data File Format & Location
- **D-10:** Phase 1 creates **both** Jekyll `_data/` YAML (works on current site) **and** documents Astro `src/data/` mapping for Phase 2 migration
- **D-11:** Projects split across **`_data/projects/featured.yml`** and **`_data/projects/archive.yml`**
- **D-12:** Navigation and social links in separate **`_data/navigation.yml`** and **`_data/social.yml`** (not `_config.yml` block)
- **D-13:** Blog curation inventory is **`_data/blog-inventory.yml`** in repo (not planning-only doc)

### Blog Curation Inventory (DATA-04)
- **D-14:** Tier assignment starts by **auto-archiving all existing `hide: true` posts** (13 today), then manual review for remainder
- **D-15:** Target **10–15 featured posts** after curation
- **D-16:** Archived posts keep **URLs preserved** with **`noindex` meta** — excluded from index and RSS
- **D-17:** **Consolidate duplicate design-doc posts** (2015 vs 2024 pairs) — one canonical URL per topic

### Navigation & URLs (DATA-03)
- **D-18:** Canonical nav paths are **lowercase**: `/about/`, `/work/`, `/career/`, `/blog/`
- **D-19:** Blog nav destination is **`/blog/`** (fixes `_config.yml` typo `url '/Blog'`)
- **D-20:** Phase 1 deliverable is **data + config only** — live Jekyll header nav fix deferred until templates consume `_data/navigation.yml` (likely Phase 2/3)

### Claude's Discretion
- Exact file field names in YAML schemas (as long as they map cleanly to Astro content collections in Phase 2)
- Which specific personal repos land in featured vs archive (default to macOS Log Analyzer, ImgAnnotator, and repos from merged portfolio-projects content)
- Blog inventory auto-classification rules for non-`hide: true` posts pending user review (apply category heuristics: design docs → archived, recent technical → featured candidate)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints, validated vs active requirements
- `.planning/REQUIREMENTS.md` — DATA-01 through DATA-04 definitions
- `.planning/ROADMAP.md` § Phase 1 — Success criteria and scope boundary

### Research
- `.planning/research/SUMMARY.md` — Stack recommendation (Astro 7), phase ordering, pitfall summary
- `.planning/research/FEATURES.md` — Table stakes, anti-features, curation guidance, MVP priorities
- `.planning/research/ARCHITECTURE.md` — Four-layer model, `_data/` extraction pattern, component mapping
- `.planning/research/PITFALLS.md` — Nav breakage, curation without URL audit, placeholder career content

### Existing Site (source content to extract)
- `_config.yml` — Current nav block with Blog YAML typo; author/social config
- `projects.md` — Personal projects list + portfolio-projects link (merge source)
- `career.md` — Placeholder career content (replace with LinkedIn-sourced data)
- `_includes/header.html` — Nav consumer (`site.navigation` loop)
- `_posts/` — 52 posts; 13 with `hide: true` front matter

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `_includes/header.html` — Desktop + mobile nav loops over `site.navigation`; will consume `_data/navigation.yml` once wired
- `_config.yml` `author` block — GitHub, Twitter, LinkedIn, email already defined; migrate to `_data/social.yml`
- `projects.md` — Contains 2 personal projects with tech stacks and GitHub URLs ready for extraction
- `_posts/*` with `hide: true` — 13 posts already flagged for archival tier

### Established Patterns
- Jekyll front matter on pages (`layout`, `title`, `permalink`) — permalinks use lowercase (`/projects/`, `/career/`)
- Nav config in `_config.yml` uses mixed-case URLs (`/About`, `/Projects`) — mismatch with actual page permalinks
- No `_data/` directory exists today — greenfield within Jekyll for structured data

### Integration Points
- `_config.yml` navigation → `_data/navigation.yml` (Phase 1 creates; Phase 2/3 wires to layouts)
- `projects.md` inline markdown → `_data/projects/featured.yml` + archive file
- `career.md` placeholder → `_data/career.yml` (LinkedIn-sourced, last 3 roles)
- Post front matter + filenames → `_data/blog-inventory.yml` tier assignments

</code_context>

<specifics>
## Specific Ideas

- User will provide LinkedIn career details during implementation (not available at discuss time)
- Per-project demo availability decided individually (mixed — not all GitHub-only, not all demo-required)
- `/work/` preferred over `/projects/` for hiring-focused language after portfolio-projects merge

</specifics>

<deferred>
## Deferred Ideas

- **Live Jekyll nav fix in header** — deferred to phase when templates consume data (user chose data-only for Phase 1)
- **Academic project secondary listing** — explicitly rejected; coursework stays out of featured and not promoted
- **Secondary project grid below featured cards** — belongs in Phase 3 (Hiring Pages), not Phase 1 data extraction

</deferred>

---

*Phase: 1-Foundation & Data Extraction*
*Context gathered: 2026-07-01*
