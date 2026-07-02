# Phase 2: Astro Scaffold & Content Migration - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold Astro 7 static site, migrate all blog posts and Phase 1 data to Astro content collections, deploy to GitHub Pages via GitHub Actions, and preserve legacy permalink parity with redirects for changed URLs. Phase 2 delivers a working Astro site with basic hiring pages, readable blog, RSS, and sitemap — not full visual polish (Phase 5) or deep blog curation UX (Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Cutover Strategy (PLAT-01)
- **D-21:** **Big-bang cutover** — replace Jekyll GitHub Actions workflow on merge to main; single deploy switches stack
- **D-22:** Ship **all pages + blog** in one cutover (not blog-only deferral)
- **D-23:** Pre-merge verification: **spot-check 10 legacy permalinks** + RSS + sitemap
- **D-24:** Rollback plan: **git revert** to last Jekyll commit if production breaks

### Permalink Parity (PLAT-02)
- **D-25:** Blog posts use **exact Jekyll format** `/:year/:month/:day/:title/` with trailing slash behavior matching inventory
- **D-26:** Slug/permalink resolution uses **`blog-inventory.yml` as source of truth** (not re-derived from filename)
- **D-27:** Static pages use Phase 1 nav paths: **`/about/`**, **`/work/`**, **`/career/`**, **`/blog/`**

### Redirects (PLAT-05)
- **D-28:** Redirect mechanism: **HTML meta-refresh pages in `public/`** (GitHub Pages compatible — no server 301s)
- **D-29:** **`/projects/` → `/work/`** redirect per D-05
- **D-30:** **2015 design-doc duplicate URLs** meta-redirect to 2024 canonical slugs per `blog-inventory.yml` `canonical_slug`
- **D-31:** **Mixed-case legacy nav** (`/About`, `/Projects`, `/Career`, `/Blog`) redirect to lowercase canonical paths

### RSS & Sitemap (PLAT-03, PLAT-04)
- **D-32:** RSS includes **only non-archived** posts (featured + standard tiers)
- **D-33:** XML sitemap **excludes archived** posts; archived posts still build with `noindex` (enforced in Phase 4 layout, stub in Phase 2 if needed)

### Jekyll Retirement
- **D-34:** After Astro deploy passes: **remove** Gemfile, `_config.yml`, Jekyll layouts/themes from active site
- **D-35:** Migrate `_posts/` → `src/content/blog/`, then **remove `_posts/`**
- **D-36:** Copy `_data/` → `src/data/` per `docs/ASTRO-DATA-MAPPING.md`, **remove `_data/`** after verification
- **D-37:** **Keep `rake data:validate`** in repo through Phase 3+ (do not port-only to Zod yet)

### Phase 2 Visual & Page Scope
- **D-38:** **Tailwind 4 minimal shell** — dark background, typography tokens; not full design system (Phase 5)
- **D-39:** **Basic hiring pages now** — simple hero + project list from data (not full Phase 3 polish, but more than placeholders)
- **D-40:** **Readable minimal blog** — post index + post page with syntax highlighting; not Minima parity

### Carried Forward from Phase 1
- D-05 `/work/` canonical projects URL
- D-16 archived posts: URLs preserved, excluded from RSS/sitemap
- D-17 duplicate consolidation via inventory `canonical_slug`
- D-18/D-19 lowercase nav paths

### Claude's Discretion
- Exact Astro version pin within 7.x line
- Shiki vs expressive-code for syntax highlighting
- Frontmatter field mapping (`date` → `pubDate`, `layout` → drop, `categories` → `tags`)
- Which 10 permalinks to spot-check (mix of featured, standard, archived, and duplicate pairs)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value, constraints
- `.planning/REQUIREMENTS.md` — PLAT-01 through PLAT-05
- `.planning/ROADMAP.md` § Phase 2 — Success criteria, research flag
- `.planning/phases/01-foundation-data-extraction/01-CONTEXT.md` — Locked URL and data decisions

### Phase 1 Handoff
- `docs/ASTRO-DATA-MAPPING.md` — Path mapping, `file()` loaders, Zod schemas, migration steps
- `_data/blog-inventory.yml` — Permalink source of truth, tiers, `canonical_slug` for redirects
- `_data/navigation.yml`, `_data/social.yml`, `_data/career.yml`, `_data/projects/*.yml`
- `scripts/validate-data.rb`, `lib/tasks/data.rake` — Keep operational post-migration

### Current Jekyll (migration source)
- `_posts/` — 51 markdown posts to migrate
- `_config.yml` — `permalink: /:year/:month/:day/:title/`, broken nav block (reference only)
- `.github/workflows/jekyll-gh-pages.yml` — Workflow to replace with `withastro/action@v6`

### Research (project-level)
- `.planning/research/STACK.md` — Astro 7 + Tailwind 4 + GitHub Pages recommendation
- `.planning/research/PITFALLS.md` — Permalink breakage, GitHub Pages redirect limits

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 1 `_data/*` YAML — copy verbatim to `src/data/` per ASTRO-DATA-MAPPING
- `blog-inventory.yml` — 51 posts with computed `permalink`, tiers, duplicate groups
- Ruby validator — keep for data integrity until hiring pages stabilize

### Established Patterns
- Jekyll permalink: `/:year/:month/:day/:title/`
- Mixed frontmatter: `layout: page` on some blog posts, `.md` and `.markdown` extensions
- CI: GitHub Actions → `jekyll-build-pages` → `deploy-pages` (swap to Astro action)

### Integration Points
- Replace `.github/workflows/jekyll-gh-pages.yml` with Astro build workflow
- `public/` directory for meta-refresh redirect HTML files
- `src/content/blog/` glob loader for migrated posts
- `src/content.config.ts` for data collections + blog collection

</code_context>

<specifics>
## Specific Ideas

- User wants basic hiring pages in Phase 2 (not wait until Phase 3) but accepts minimal Tailwind shell vs full design system
- Big-bang is acceptable with git revert safety net
- Meta-refresh redirects are acceptable tradeoff for GitHub Pages hosting constraint

</specifics>

<deferred>
## Deferred Ideas

- Full design system and responsive polish — Phase 5
- Blog tag pages, year archive, prev/next — Phase 4
- Deep case study hiring pages — Phase 3 scope expansion intentionally limited to "basic"
- Dual Jekyll/Astro CI — user rejected temporary dual build

</deferred>

---

*Phase: 2-Astro Scaffold & Content Migration*
*Context gathered: 2026-07-02*
