# Phase 1: Foundation & Data Extraction - Research

**Researched:** 2026-07-01
**Domain:** Jekyll `_data/` extraction, blog curation inventory, hiring-content YAML schemas, Astro migration mapping
**Confidence:** HIGH

## Summary

Phase 1 is a **data-layer extraction** on the existing Jekyll site — no Astro scaffold, no layout redesign, no live nav wiring. The repo today has **zero `_data/` directory**; projects and career live as inline Markdown (`projects.md`, `career.md`); navigation lives in `_config.yml` with a **YAML syntax error** on the Blog entry (`url '/Blog'` missing colon) and **casing drift** (`/About`, `/Projects` vs actual page permalinks `/about/`, `/projects/`). The header (`_includes/header.html`) reads `site.navigation` from config, not `site.data.*` — per locked decision D-20, Phase 1 creates canonical data files but **defers template consumption** to Phase 2/3.

The blog has **51 Markdown posts** in `_posts/` (plus one stray `ea-forge-service.cpp` that should be excluded from inventory). **13 posts** carry `hide: true` front matter [VERIFIED: repo grep], but layouts (`_layouts/home.html`, `_layouts/posts.html`) **do not filter on `hide`** — those posts still render in blog lists today. Curation tier assignment in `_data/blog-inventory.yml` is therefore the first enforcement mechanism; actual RSS/index exclusion happens in Phases 2 and 4.

Portfolio merge source is the separate [`tazzledazzle/portfolio-projects`](https://github.com/tazzledazzle/portfolio-projects) repo: **36 projects** in its README table plus competency mapping in `PORTFOLIO.md`. Phase 1 absorbs a curated subset into `_data/projects/featured.yml` (3–5 personal/professional repos, no UW coursework per D-01/D-03) and `_data/projects/archive.yml` (remaining professional repos from portfolio-projects). Academic UW-CSS links in `projects.md` are **excluded entirely**.

Ten **2015 ↔ 2024 design-document pairs** exist (e.g., "Setting Up Automated Tests", "Testing Across macOS Versions"). Consolidation should keep **2024 slugs as canonical** and mark 2015 entries `tier: archived` with `canonical_slug` pointing to the 2024 post — URLs preserved, `noindex` applied in Phase 4.

**Primary recommendation:** Create the `_data/` tree with validated YAML schemas, a generated `blog-inventory.yml` covering all 51 posts, an `ASTRO-DATA-MAPPING.md` companion doc for Phase 2, and a `scripts/validate-data.rb` Rake task — all without touching layouts.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Projects / career structured data | **Build-time data layer** (`_data/*.yml`) | Presentation (Phase 3) | Hiring content is stack-portable YAML; templates only render it |
| Navigation & social config | **Build-time data layer** | CDN / Static (deployed HTML) | Single source of truth in `_data/`; layouts consume at build time |
| Blog curation inventory | **Build-time data layer** | Content (`_posts/` frontmatter in Phase 4) | Tier metadata drives RSS/sitemap/index filtering in later phases |
| Blog post bodies | **Content layer** (`_posts/`) | Build (Jekyll → Astro migration) | Phase 1 inventories only; does not move or delete posts |
| Portfolio-projects merge | **Build-time data layer** | External repo (read-only source) | Absorb README table into YAML; stop outbound funnel link |
| Permalink preservation | **CDN / Static** | Build config (Phase 2) | GitHub Pages has no server-side 301s; inventory documents URLs before any slug change |

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Featured Projects (DATA-01)
- **D-01:** Featured project pool is **personal/professional repos only** — no UW coursework in featured tier
- **D-02:** **Merge portfolio-projects site** into main site structured data (absorb content, stop linking out to separate site)
- **D-03:** Academic repos (UW-CSS tree) are **excluded from featured** — not shown in top 3–5 cards
- **D-04:** Demo links are **mixed per project** — maintainer notes which have live demos; mark "code only" when no demo exists
- **D-05:** Canonical projects URL after merge is **`/work/`** (not `/projects/`)

#### Career Data (DATA-02)
- **D-06:** Career data source is **LinkedIn** — user will provide/paste employer details during implementation
- **D-07:** Include **last 3 roles only** in structured career data
- **D-08:** **At least one quantified metric bullet required per role**
- **D-09:** Education is **degree only** (UW Bothell CS) — no coursework list in structured data

#### Data File Format & Location
- **D-10:** Phase 1 creates **both** Jekyll `_data/` YAML (works on current site) **and** documents Astro `src/data/` mapping for Phase 2 migration
- **D-11:** Projects split across **`_data/projects/featured.yml`** and **`_data/projects/archive.yml`**
- **D-12:** Navigation and social links in separate **`_data/navigation.yml`** and **`_data/social.yml`** (not `_config.yml` block)
- **D-13:** Blog curation inventory is **`_data/blog-inventory.yml`** in repo (not planning-only doc)

#### Blog Curation Inventory (DATA-04)
- **D-14:** Tier assignment starts by **auto-archiving all existing `hide: true` posts** (13 today), then manual review for remainder
- **D-15:** Target **10–15 featured posts** after curation
- **D-16:** Archived posts keep **URLs preserved** with **`noindex` meta** — excluded from index and RSS
- **D-17:** **Consolidate duplicate design-doc posts** (2015 vs 2024 pairs) — one canonical URL per topic

#### Navigation & URLs (DATA-03)
- **D-18:** Canonical nav paths are **lowercase**: `/about/`, `/work/`, `/career/`, `/blog/`
- **D-19:** Blog nav destination is **`/blog/`** (fixes `_config.yml` typo `url '/Blog'`)
- **D-20:** Phase 1 deliverable is **data + config only** — live Jekyll header nav fix deferred until templates consume `_data/navigation.yml` (likely Phase 2/3)

### Claude's Discretion
- Exact file field names in YAML schemas (as long as they map cleanly to Astro content collections in Phase 2)
- Which specific personal repos land in featured vs archive (default to macOS Log Analyzer, ImgAnnotator, and repos from merged portfolio-projects content)
- Blog inventory auto-classification rules for non-`hide: true` posts pending user review (apply category heuristics: design docs → archived, recent technical → featured candidate)

### Deferred Ideas (OUT OF SCOPE)
- **Live Jekyll nav fix in header** — deferred to phase when templates consume data (user chose data-only for Phase 1)
- **Academic project secondary listing** — explicitly rejected; coursework stays out of featured and not promoted
- **Secondary project grid below featured cards** — belongs in Phase 3 (Hiring Pages), not Phase 1 data extraction

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DATA-01 | Projects in structured data with title, summary, tech stack, GitHub URL, optional demo URL | `_data/projects/featured.yml` + `archive.yml` schema below; merge from `projects.md` + `portfolio-projects` README table |
| DATA-02 | Career in structured data with employer, role, dates, achievement bullets | `_data/career.yml` schema; placeholder entries until user provides LinkedIn paste (D-06) |
| DATA-03 | Navigation and social links in single config source for all layouts | `_data/navigation.yml` + `_data/social.yml`; maps to `site.data.*` in Jekyll, `file()` loader in Astro Phase 2 |
| DATA-04 | Content inventory with curation tier per blog post | `_data/blog-inventory.yml` generated from `_posts/` scan; 13 `hide:true` → archived; design-doc heuristics + duplicate pairs documented |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **Jekyll Data Files** | built-in (github-pages gem ~228 / Jekyll 3.10) | Load `_data/*.yml` as `site.data.*` | [CITED: jekyllrb.com/docs/datafiles/] Native, zero-dependency, works on current GitHub Pages CI |
| **YAML (Psych)** | Ruby stdlib via Jekyll | Human-editable hiring content | Solo-maintainer friendly; matches Astro `file()` loader target format |
| **Ruby + Bundler** | 3.4.x / 2.6.x | Validation script, optional `jekyll build` | Already in repo; `html-proofer` Rake task exists |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **html-proofer** | ~5.0.0 (in Gemfile) | Link/HTML validation | Post-build smoke test after data changes affect pages (Phase 6 expands) |
| **Rake** | ~13.0.0 (in Gemfile) | Task runner for `validate-data` | Wire data schema checks into `rake test` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `_data/*.yml` | JSON in `_data/` | YAML is more readable for prose fields (summaries, bullets); Jekyll supports both [CITED: jekyllrb.com/docs/datafiles/] |
| Ruby validation script | Node + Zod now | Premature — Zod belongs in Astro Phase 2 `content.config.ts`; Ruby keeps Phase 1 Jekyll-only |
| Manual blog inventory | Spreadsheet only | Violates D-13; YAML in repo enables CI validation and Phase 2 migration |

**Installation:** None required for Phase 1 — uses existing Jekyll/Ruby toolchain. No new gems.

**Version verification:**
```bash
# Jekyll data files — built-in, no package
# html-proofer already pinned in Gemfile: ~> 5.0.0
bundle info html-proofer 2>/dev/null || echo "run bundle install first"
```

## Package Legitimacy Audit

> Phase 1 installs **no new external packages**. Data files are plain YAML parsed by Jekyll's built-in Psych loader.

| Package | Registry | Disposition |
|---------|----------|-------------|
| *(none)* | — | Phase 1 is YAML + Ruby stdlib only |

**Packages removed due to slopcheck [SLOP] verdict:** none (no packages proposed)
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SOURCE CONTENT (today)                          │
│  projects.md ──┐   career.md ──┐   _config.yml (nav, author) ──┐       │
│  portfolio-projects README (GitHub) ──┤                          │       │
│  _posts/* (51 md) ────────────────────┼── INVENTORY SCAN ────────┤       │
└───────────────────────────────────────┼──────────────────────────┼───────┘
                                        ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    PHASE 1 OUTPUT: _data/ (canonical)                     │
│  navigation.yml   social.yml   career.yml                               │
│  projects/featured.yml   projects/archive.yml   blog-inventory.yml      │
│  docs/ASTRO-DATA-MAPPING.md (Phase 2 handoff)                           │
└───────────────────────────────────────┬─────────────────────────────────┘
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
         ┌─────────────────────┐               ┌─────────────────────┐
         │ Jekyll (interim)    │               │ Astro 7 (Phase 2)   │
         │ site.data.*         │               │ file()/glob loaders │
         │ (layouts wired      │               │ + Zod schemas in    │
         │  Phase 2/3)         │               │ content.config.ts   │
         └──────────┬──────────┘               └──────────┬──────────┘
                    ▼                                       ▼
              _site/ HTML                              dist/ HTML
                    └───────────────┬───────────────────────┘
                                    ▼
                          GitHub Pages (static CDN)
```

### Recommended Project Structure

```
_data/
├── navigation.yml          # Primary nav: title, url, order
├── social.yml              # github, linkedin, twitter, email, gravatar_hash
├── career.yml              # roles[], education (degree only)
├── blog-inventory.yml      # posts[] with tier, canonical_slug, permalink
└── projects/
    ├── featured.yml        # 3–5 hiring-facing project cards
    └── archive.yml         # Remaining professional repos from portfolio-projects

docs/
└── ASTRO-DATA-MAPPING.md   # Jekyll → Astro path + loader + Zod schema mapping

scripts/
└── validate-data.rb        # Schema + coverage checks (51 posts, required fields)

lib/tasks/
└── data.rake               # rake data:validate, rake data:inventory (regenerate)
```

### Pattern 1: Jekyll Nested Data Files

**What:** Subfolder YAML maps to dotted `site.data` namespace [CITED: jekyllrb.com/docs/datafiles/#subfolders]
**When to use:** Splitting projects into featured vs archive (D-11)
**Example:**

```yaml
# _data/projects/featured.yml
# Access in Liquid (Phase 3): {% for project in site.data.projects.featured %}
- id: native-macos-log-analyzer
  title: Native macOS Log Analyzer
  summary: Native macOS app for analyzing system logs with filtering and visualization.
  tech_stack: [Swift, AppKit, Core Data]
  github_url: https://github.com/tazzledazzle/native-macos-log-analyzer
  demo_url: null          # null = "code only" per D-04
  demo_status: code_only  # code_only | live | broken
  featured: true
  source: projects.md
```

### Pattern 2: Blog Inventory as Generated Manifest

**What:** Single YAML manifest listing every post with curation metadata — not scattered frontmatter edits in Phase 1
**When to use:** DATA-04; drives Phase 2 migration script and Phase 4 RSS/sitemap filters
**Example:**

```yaml
# _data/blog-inventory.yml
meta:
  generated_at: "2026-07-01"
  total_posts: 51
  tier_counts: { featured: 12, standard: 26, archived: 13 }

posts:
  - id: 2024-11-08-kotlin-cheatsheet
    filename: 2024-11-08-kotlin-cheatsheet.md
    title: Kotlin Cheatsheet
    pub_date: 2024-11-08
    permalink: /2024/11/08/kotlin-cheatsheet/
    tier: featured          # featured | standard | archived
    auto_rule: recent_technical
    hide_frontmatter: false
    canonical_slug: null    # set when this post is superseded
    duplicate_group: null

  - id: 2015-08-08-design-document-setting-up-automated
    filename: "2015-08-08-Design Document for Setting Up Automated.md"
    title: Design Document for Setting Up Automated Tests for macOS Applications
    pub_date: 2015-08-08
    permalink: /2015/08/08/design-document-for-setting-up-automated/
    tier: archived
    auto_rule: design_doc_2015_duplicate
    hide_frontmatter: false
    canonical_slug: 2024-01-30-design-document-for-setting-up-automated
    duplicate_group: macos-automated-testing
```

### Pattern 3: Astro Phase 2 Mapping (Documentation Only in Phase 1)

**What:** Copy `_data/` → `src/data/` and register with Astro Content Layer `file()` loader [CITED: docs.astro.build/en/guides/content-collections/]
**When to use:** Phase 2 scaffold — Phase 1 writes `docs/ASTRO-DATA-MAPPING.md` with exact paths
**Example:**

```typescript
// Phase 2 — src/content.config.ts (not built in Phase 1)
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const navigation = defineCollection({
  loader: file('./src/data/navigation.yml'),
  schema: z.array(z.object({
    title: z.string(),
    url: z.string(),
    order: z.number().optional(),
  })),
});

const featuredProjects = defineCollection({
  loader: file('./src/data/projects/featured.yml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    tech_stack: z.array(z.string()),
    github_url: z.string().url(),
    demo_url: z.string().url().nullable(),
    demo_status: z.enum(['live', 'code_only', 'broken']),
  }).array(),
});
```

### Anti-Patterns to Avoid

- **Editing `_config.yml` navigation as canonical source:** Violates D-12; creates dual-source drift with `_data/navigation.yml`
- **Deleting or renaming `_posts/` files in Phase 1:** Violates D-16 URL preservation; inventory only
- **Promoting UW-CSS repos to featured:** Violates D-01/D-03
- **Wiring `_includes/header.html` in Phase 1:** Violates D-20; scope creep into layout phase
- **Importing all 36 portfolio-projects as featured:** Dilutes hiring signal; 3–5 featured max (HIRE-03)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Blog post enumeration | Manual spreadsheet | `scripts/validate-data.rb` scanning `_posts/` | 51 files, inconsistent frontmatter (empty titles, mixed extensions); automation prevents missed posts |
| YAML schema enforcement | Eyeball review | Rake task with required-field checks | Catches missing `github_url`, empty career bullets before Phase 3 |
| Portfolio-projects merge | Re-typing 36 rows | Parse README table from GitHub raw URL | Single source; README is already maintained |
| Permalink computation | Guessing slugs | Jekyll convention: `/:year/:month/:day/:title/` from filename + `title` slugify | Matches `_config.yml` permalink [VERIFIED: repo `_config.yml` line 68] |
| Astro data loading (Phase 1) | Astro scaffold early | Document `file()` loader mapping only | Phase boundary; stack migration is Phase 2 |

**Key insight:** Phase 1 value is **portable, validated data** — the hard part is inventory completeness and duplicate detection, not file format.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — static site, no database | N/A |
| Live service config | `tazzledazzle.github.io/portfolio-projects` GitHub Pages site live; `projects.md` links outbound | Phase 1: absorb into `_data/projects/*`; Phase 3: remove outbound link, add `/work/` page; optional redirect from `/portfolio-projects/` in Phase 2 |
| OS-registered state | None — verified | N/A |
| Secrets/env vars | `gravatar_hash`, email in `_config.yml` author block | Migrate to `_data/social.yml`; keep values, change consumer in Phase 2/3 |
| Build artifacts | `vendor/bundle/` checked in; local `bundle exec jekyll build` fails (nokogiri gem mismatch) | CI (`actions/jekyll-build-pages@v1`) is authoritative for deploy; run `bundle install` locally before validation tasks |
| `_posts/ea-forge-service.cpp` | Non-Markdown file in `_posts/` | Exclude from `blog-inventory.yml`; flag for removal or relocation (not Phase 1 scope unless planner adds cleanup task) |

**Nothing found in category:** OS-registered state, databases.

## Common Pitfalls

### Pitfall 1: `hide: true` Is Not Enforced Today

**What goes wrong:** Planner assumes 13 posts are already hidden from blog index; they are not — `_layouts/home.html` and `_layouts/posts.html` iterate `site.posts` with no `hide` filter [VERIFIED: repo layout audit].
**Why it happens:** Frontmatter flag added without layout logic.
**How to avoid:** Treat `blog-inventory.yml` tier `archived` as source of truth; document that layout/RSS filtering is Phase 4.
**Warning signs:** Archived posts still appear in `/blog/` list after Phase 1 (expected until Phase 4).

### Pitfall 2: `_config.yml` Blog Nav YAML Syntax Error

**What goes wrong:** Line 28 `url '/Blog'` is invalid YAML (missing `:`) [VERIFIED: `_config.yml`]; may cause unpredictable nav parsing.
**Why it happens:** Manual edit typo.
**How to avoid:** Canonical nav moves to `_data/navigation.yml`; optionally fix `_config.yml` typo as hygiene (does not satisfy DATA-03 alone).
**Warning signs:** Blog nav item missing or malformed in built site.

### Pitfall 3: Permalink / Nav Casing Mismatch

**What goes wrong:** Nav points to `/About`, `/Projects`; pages live at `/about/`, `/projects/` [VERIFIED: page frontmatter]. Jekyll URLs are case-sensitive on some hosts.
**Why it happens:** `_config.yml` used Title Case paths.
**How to avoid:** `_data/navigation.yml` uses lowercase paths per D-18; `/work/` replaces `/projects/` in nav (D-05) — actual `projects.md` permalink change is Phase 3.
**Warning signs:** html-proofer 404s on nav links.

### Pitfall 4: 2015 Design Docs With Empty Frontmatter Titles

**What goes wrong:** 10 posts dated 2015-08-08 have `title:` blank in frontmatter; title lives in body [VERIFIED: sample post read]. Inventory script must read body H1 or filename, not frontmatter alone.
**Why it happens:** Bulk import in 2015.
**How to avoid:** Inventory generator falls back to filename-derived title + first markdown heading.
**Warning signs:** `blog-inventory.yml` entries with empty `title` field.

### Pitfall 5: Duplicate Design Docs Without Consolidation Plan

**What goes wrong:** 10 topic pairs (2015 + 2024) create duplicate content risk [VERIFIED: filename/topic analysis]. Picking wrong canonical URL breaks backlinks.
**Why it happens:** Republished coursework design docs in 2024 with `hide: true`.
**How to avoid:** Canonical = 2024 slug (newer, often has proper frontmatter); 2015 → `tier: archived`, `canonical_slug` set; both URLs preserved until Phase 4 `noindex` on archived [D-16/D-17].
**Warning signs:** Two indexed URLs with near-identical titles in sitemap.

### Pitfall 6: Career Data Blocked on User Input

**What goes wrong:** Phase 1 cannot complete DATA-02 with real employer names until user pastes LinkedIn details [D-06].
**Why it happens:** Placeholder `career.md` has generic copy [VERIFIED: repo read].
**How to avoid:** Ship `_data/career.yml` with schema-valid structure + `status: pending_linkedin` flag; populate during implementation checkpoint with user.
**Warning signs:** Generic bullets like "Architected cloud-native applications" remain.

### Pitfall 7: Portfolio-Projects Over-Merge

**What goes wrong:** All 36 README projects dumped into `featured.yml`.
**Why it happens:** README table is comprehensive, not hiring-curated.
**How to avoid:** Featured = 3–5 (macOS Log Analyzer, ImgAnnotator, + 1–3 from portfolio-projects e.g. `ws-chat-fast`, `online-bookstore`, `otel-demo-stack`); remainder → `archive.yml`.
**Warning signs:** `featured.yml` has more than 5 entries.

## Code Examples

### Navigation YAML (Canonical)

```yaml
# _data/navigation.yml
# Source: D-18, D-19
- title: About
  url: /about/
  order: 1
- title: Work
  url: /work/
  order: 2
- title: Career
  url: /career/
  order: 3
- title: Blog
  url: /blog/
  order: 4
```

### Social YAML (from `_config.yml` author block)

```yaml
# _data/social.yml
name: Terence Schumacher
email: terenceschumacher@gmail.com
github:
  username: tazzledazzle
  url: https://github.com/tazzledazzle
linkedin:
  username: terenceschumacher
  url: https://linkedin.com/in/terenceschumacher
twitter:
  username: terenceschu
  url: https://twitter.com/terenceschu
gravatar_hash: 10056dfd9bd277610a657d2aee28089b
```

### Career YAML (Schema — pending LinkedIn paste)

```yaml
# _data/career.yml
status: pending_linkedin  # remove when populated
education:
  - institution: University of Washington Bothell
    degree: Bachelor of Science in Computer Science & Software Engineering
roles:
  - id: role-1
    employer: ""           # USER INPUT REQUIRED (D-06)
    title: ""
    start_date: ""
    end_date: ""           # or "present"
    bullets:
      - ""                  # min 1 quantified metric per role (D-08)
  # ... 3 roles max (D-07)
```

### Jekyll Liquid Access (Phase 3 — reference only)

```liquid
{% for item in site.data.navigation %}
  <a href="{{ item.url | relative_url }}">{{ item.title }}</a>
{% endfor %}
```
Source: [CITED: jekyllrb.com/docs/datafiles/]

### Inventory Auto-Classification Rules (Discretion)

| Rule | Condition | Default Tier |
|------|-----------|--------------|
| R1 | `hide: true` in frontmatter | `archived` |
| R2 | Filename or title contains "Design Document" | `archived` (unless manually promoted) |
| R3 | 2015 design doc with 2024 `canonical_slug` target | `archived` |
| R4 | Published 2024–2025, technical keywords (kotlin, monorepo, devops, debugging) | `featured` candidate |
| R5 | Layout/meta posts (welcome, status update, greetings) | `archived` |
| R6 | Remaining | `standard` — manual review to reach 10–15 featured total |

**Post-auto-archive math:** 51 posts − 13 `hide:true` = 38 remaining; ~10 unhidden 2015 design docs → archive via R2 → ~28 for standard/featured split → select 10–15 featured [ASSUMED: counts need validation after inventory script runs].

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline Markdown for projects/career | `_data/*.yml` structured hiring content | Phase 1 (this) | Enables Astro migration without content re-entry |
| Nav in `_config.yml` | `_data/navigation.yml` + `_data/social.yml` | Phase 1 | Single source; fixes casing/typo |
| `hide: true` frontmatter | `blog-inventory.yml` tier field | Phase 1 inventory; Phase 4 enforcement | Separates intent from broken layout filtering |
| Separate portfolio-projects site | Merged into main site `/work/` data | Phase 1 data; Phase 3 page | Single hiring funnel [D-02] |
| Jekyll `_data/` | Astro `file()` content collections | Phase 2 | Zod validation at build time |

**Deprecated/outdated:**
- Outbound "Projects Site Here" link in `projects.md` — remove when `/work/` ships (Phase 3)
- `_config.yml` `navigation:` block — superseded by `_data/navigation.yml` (keep until layouts migrate)

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | 2024 design-doc slugs are preferred canonical over 2015 pairs | Pitfall 5 | Wrong canonical if 2015 URLs have more backlinks |
| A2 | Default featured portfolio-projects picks: `ws-chat-fast`, `online-bookstore`, `otel-demo-stack` | Standard Stack | User may prefer different repos |
| A3 | ~10 unhidden 2015 design docs exist beyond the 13 `hide:true` | Inventory math | Featured count target may need adjustment |
| A4 | `/work/` page permalink change deferred to Phase 3 (only nav data updated now) | User Constraints | Nav would 404 until page created |
| A5 | `blog.md` resolves to `/blog/` (no explicit permalink in frontmatter) | Navigation | Verify built URL in Phase 2 |

## Open Questions

1. **Which 3 portfolio-projects repos join macOS Log Analyzer + ImgAnnotator in featured?**
   - What we know: 36 candidates in README; hiring site needs 3–5 total featured.
   - What's unclear: User preference among AI, CI/CD, microservices demos.
   - Recommendation: Default to `ws-chat-fast`, `online-bookstore`, `otel-demo-stack` (stable status, broad stack coverage); flag for user review at implementation checkpoint.

2. **LinkedIn career paste timing**
   - What we know: D-06 requires user input; placeholder schema can ship first.
   - What's unclear: Whether user provides before or during execution.
   - Recommendation: Plan task 1 = schema + placeholders; checkpoint:human-verify before marking DATA-02 complete.

3. **Does `blog.md` need explicit `permalink: /blog/`?**
   - What we know: `blog.md` has only `layout: posts` [VERIFIED: repo].
   - What's unclear: Built URL path on Jekyll 3.10.
   - Recommendation: Add `permalink: /blog/` to `blog.md` in Phase 2 or 3 when nav is wired; document expected URL in `navigation.yml` now.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Ruby | Jekyll data validation script | ✓ | 3.4.4 | — |
| Bundler | Gemfile, html-proofer | ✓ | 2.6.9 | — |
| Jekyll (local) | `bundle exec jekyll build` | ✗ (gem mismatch) | — | Use CI `actions/jekyll-build-pages@v1`; run `bundle install` to fix local |
| Node.js | Not required Phase 1 | ✓ | 25.9.0 | — |
| Python 3 + PyYAML | Optional inventory script | ✓ | 3.13 + installed | Prefer Ruby for consistency |
| GitHub API | portfolio-projects README fetch | ✓ (network) | — | Manual copy from README if offline |
| ctx7 CLI | Docs lookup | ✗ | — | Used WebFetch for official docs |

**Missing dependencies with no fallback:**
- None blocking — Phase 1 is file authoring + Ruby script.

**Missing dependencies with fallback:**
- Local Jekyll build — CI build suffices for deploy verification.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Rake + html-proofer ~5.0 (existing) |
| Config file | `Rakefile` |
| Quick run command | `bundle exec rake data:validate` (Wave 0 — create) |
| Full suite command | `bundle exec rake` (build + html-proofer) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DATA-01 | Every featured project has title, summary, tech_stack, github_url | unit | `bundle exec rake data:validate` | ❌ Wave 0 |
| DATA-01 | featured.yml has 3–5 entries, no UW repos | unit | `bundle exec rake data:validate` | ❌ Wave 0 |
| DATA-02 | career.yml has ≤3 roles, each with ≥1 bullet | unit | `bundle exec rake data:validate` | ❌ Wave 0 |
| DATA-03 | navigation.yml has 4 lowercase paths incl. /blog/ | unit | `bundle exec rake data:validate` | ❌ Wave 0 |
| DATA-04 | blog-inventory.yml covers all 51 markdown posts | unit | `bundle exec rake data:validate` | ❌ Wave 0 |
| DATA-04 | 13 hide:true posts tier=archived | unit | `bundle exec rake data:validate` | ❌ Wave 0 |
| DATA-04 | 10–15 posts tier=featured | manual | User review at checkpoint | — |
| PLAT-adjacent | Jekyll build succeeds with new _data/ | integration | `bundle exec jekyll build` (CI) | ✅ CI workflow |

### Sampling Rate

- **Per task commit:** `bundle exec rake data:validate`
- **Per wave merge:** `bundle exec jekyll build` (CI on push)
- **Phase gate:** Inventory reviewed by user; career LinkedIn checkpoint passed

### Wave 0 Gaps

- [ ] `scripts/validate-data.rb` — schema + coverage validation
- [ ] `lib/tasks/data.rake` — `data:validate`, `data:inventory` tasks
- [ ] `docs/ASTRO-DATA-MAPPING.md` — Phase 2 handoff document
- [ ] `bundle install` — fix local nokogiri if local build needed

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static site, no auth |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | yes | YAML schema validation in `validate-data.rb`; Zod in Phase 2 |
| V6 Cryptography | no | No secrets in data files; email is public contact |

### Known Threat Patterns for YAML Data Layer

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| YAML deserialization attacks | Tampering | Jekyll uses safe YAML load; no `YAML.load` with arbitrary types in custom scripts |
| Secrets committed to `_data/` | Information disclosure | Never put API keys in career/social data; email is intentional public contact |
| Broken external URLs in project data | Spoofing (trust erosion) | Validate URL format in schema; link audit in Phase 6 |

## Project Constraints (from .cursor/rules/)

No `.cursor/rules/` directory exists in this repository. No additional Cursor rule constraints beyond `CLAUDE.md` GSD workflow enforcement.

## Sources

### Primary (HIGH confidence)
- [jekyllrb.com/docs/datafiles/](https://jekyllrb.com/docs/datafiles/) — `_data/` loading, subfolder namespaces, Liquid access
- [docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) — `file()` loader for YAML
- [docs.astro.build/en/reference/content-loader-reference/](https://docs.astro.build/en/reference/content-loader-reference/) — `file()` and `glob()` loader API
- [docs.astro.build/en/guides/migrate-to-astro/from-jekyll/](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/) — permalink differences, Markdown portability
- Live repo audit — `_config.yml`, `_posts/`, `projects.md`, `career.md`, `_includes/header.html`, layouts
- [github.com/tazzledazzle/portfolio-projects README](https://raw.githubusercontent.com/tazzledazzle/portfolio-projects/main/README.md) — 36-project merge source

### Secondary (MEDIUM confidence)
- `.planning/research/ARCHITECTURE.md` — four-layer model, component map
- `.planning/research/PITFALLS.md` — nav casing, URL preservation, curation risks
- `.planning/research/SUMMARY.md` — Astro 7 target stack, phase ordering

### Tertiary (LOW confidence)
- Featured portfolio-project selection defaults (A2) — needs user confirmation

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — Jekyll data files are documented and repo-verified; no new packages
- Architecture: **HIGH** — brownfield audit complete; merge sources identified
- Pitfalls: **HIGH** — `hide` not enforced, nav typo, duplicate pairs verified in repo

**Research date:** 2026-07-01
**Valid until:** 2026-07-31 (stable Jekyll data patterns; inventory counts may shift if posts added)
