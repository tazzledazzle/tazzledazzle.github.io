# Phase 4: Blog Curation & Discovery - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver curated blog discovery and reading experience satisfying BLOG-01 through BLOG-07: tiered blog index (featured prominent, archived hidden), post metadata (date + read time), syntax-highlighted code with language labels, tag index pages, year archive page, prev/next navigation, and RSS autodiscovery in page head. Phase 4 upgrades the Phase 2 minimal blog shell — not full typography/design system polish (Phase 5) or Lighthouse/JSON-LD SEO gates (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Blog Index Tiers (BLOG-01)
- **D-61:** `/blog/` index uses a **Featured section at top** (heading + entries), then **standard posts below** in reverse chronological order
- **D-62:** Standard-tier posts appear as a **separate chronological list** below the featured section (not interleaved)
- **D-63:** Index entries show **publication date + estimated read time**
- **D-64:** Index entries show **description from frontmatter** when present (no auto-excerpt from body)

### Post Metadata & Archived Handling (BLOG-02, D-16)
- **D-65:** Post pages display dates in **long format** (e.g., "January 8, 2025")
- **D-66:** Read time calculated at **225 WPM** from rendered body word count
- **D-67:** Archived post pages emit **`noindex`** meta **plus a visible "Archived post" banner** for human readers
- **D-68:** Archived posts remain **fully readable** at legacy URLs — excluded from discovery surfaces only, not content-gated

### Code Blocks (BLOG-03)
- **D-69:** Syntax highlighting via **Expressive Code** integration
- **D-70:** Language labels appear **top-right** of code blocks (when fence specifies language)
- **D-71:** Code theme: **GitHub Dark**
- **D-72:** Legacy ` ```math ` fences **preserved as-is** — no KaTeX/special rendering in Phase 4

### Tag Discovery (BLOG-04)
- **D-73:** Tag pages live at **`/blog/tags/{tag-slug}/`** (e.g., `/blog/tags/python/`)
- **D-74:** Tag indexes include **featured + standard posts only** — archived posts excluded
- **D-75:** Clickable tags appear in **post footer** linking to tag pages
- **D-76:** Posts with empty `tags: []` get **backfilled from legacy Jekyll categories** during implementation (migration pass on frontmatter or runtime merge)

### Year Archive (BLOG-05)
- **D-77:** Single archive page at **`/blog/archive/`** with **year section headings** and post lists underneath
- **D-78:** Archive years derived from **featured + standard posts only**
- **D-79:** Layout uses **year sections with post lists** (not year cards or separate year routes)
- **D-80:** Archive discoverable via **link from `/blog/` index** (Blog sub-nav pattern — no global nav item yet; footer/index link acceptable)

### Post Navigation & RSS (BLOG-06, BLOG-07)
- **D-81:** Prev/next navigation spans **featured + standard posts only** (archived skipped in sequence)
- **D-82:** Prev/next placed at **bottom of article** with **previous/next titles** ("← Previous" / "Next →")
- **D-83:** RSS autodiscovery `<link rel="alternate">` injected via **MainLayout on every page**
- **D-84:** RSS autodiscovery URL: **`/rss.xml`** (existing Phase 2 endpoint)

### Carried Forward from Prior Phases
- D-15: 12 featured posts (within 10–15 target)
- D-16: Archived URLs preserved, excluded from index/RSS/sitemap, noindex on pages
- D-17: 2015 duplicate design docs archived with `canonical_slug` to 2024 entries
- D-32/D-33: RSS and sitemap exclude archived tiers
- D-38: Minimal Tailwind shell — Phase 4 adds blog components without full design tokens (Phase 5)

### Claude's Discretion
- Expressive Code configuration details (copy button, line numbers)
- Tag slug normalization rules (lowercase, hyphenate spaces)
- Category→tag backfill mapping logic for posts missing tags
- Read time rounding (nearest minute vs ceil)
- Featured section internal sort (newest first within featured)
- Whether to add `/tags/` index listing all tags or only per-tag pages
- Archive and tag link styling within minimal shell

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Blog credibility audience, curation strategy
- `.planning/REQUIREMENTS.md` — BLOG-01 through BLOG-07
- `.planning/ROADMAP.md` § Phase 4 — Success criteria, research flag (SEO audit)
- `.planning/phases/01-foundation-data-extraction/01-CONTEXT.md` — D-14 through D-17 curation tiers
- `.planning/phases/02-astro-scaffold-content-migration/02-CONTEXT.md` — D-32, D-33 RSS/sitemap, blog migration
- `.planning/phases/03-hiring-pages/03-CONTEXT.md` — MainLayout chrome, Phase boundary vs Phase 5

### Data & Content
- `src/data/blog-inventory.yml` — Tier source of truth (12 featured / 13 standard / 26 archived)
- `src/content/blog/*` — 51 migrated posts with frontmatter (`tier`, `tags`, `description`, `permalink`)
- `src/content.config.ts` — Blog collection schema
- `docs/ASTRO-DATA-MAPPING.md` — Field mapping from Jekyll

### Current Implementation
- `src/pages/blog/index.astro` — Flat list, archived filtered; needs tiered layout
- `src/pages/[...slug].astro` — Minimal post template; needs metadata, code, nav, noindex
- `src/layouts/MainLayout.astro` — Needs RSS autodiscovery link (BLOG-07)
- `src/pages/rss.xml.ts` — Existing RSS endpoint (non-archived only)
- `astro.config.mjs` — Sitemap filter, MDX integration

### Out of Phase Scope
- Full typography, reading width polish → Phase 5 (DESN-04)
- JSON-LD Article schema, Open Graph → Phase 6 (QUAL-03, QUAL-04)
- Per-post SEO/backlink audit methodology → research note only unless user provides GSC data
- Full-text search, newsletter → v2 (DISC-01, DISC-03)
- Table of contents on long posts → v2 (UX-03)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `MainLayout.astro` + `Header.astro`/`Footer.astro` — inject RSS link in layout head
- `blog-inventory.yml` + post `tier` frontmatter — drive index filtering and featured section
- Phase 2 `[...slug].astro` inventory-driven static paths — extend props for prev/next

### Established Patterns
- Tier filtering: `post.data.tier !== "archived"` already on blog index
- Permalinks from inventory/frontmatter, not derived from filename
- `@ts-nocheck` on blog pages — components may add proper typing
- No blog-specific components yet — Phase 4 introduces PostLayout, TagList, ArchiveList, etc.

### Integration Points
- `MainLayout`: RSS `<link rel="alternate" type="application/rss+xml" href="/rss.xml">`
- Post page: long date, 225 WPM read time, Expressive Code rendering, footer tags, prev/next, archived banner + noindex
- `/blog/index.astro`: featured section + standard list + archive link
- New routes: `/blog/tags/[tag].astro`, `/blog/archive/index.astro`

### Gaps to Address
- **No `description` frontmatter on many posts** — index excerpts sparse until backfilled or omitted
- **Sparse/empty tags** — D-76 requires category backfill pass
- **No Expressive Code installed** — add integration in astro.config
- **Archived noindex not implemented** — D-67 unblocks D-16 compliance on post pages
- **Legacy `_posts` categories** — may need grep of original frontmatter for backfill source

</code_context>

<specifics>
## Specific Ideas

- Featured section gives engineering peers immediate signal posts without wading through 25 standard entries
- Archived banner makes noindex pages honest for humans who arrive via old links
- Tag backfill from Jekyll categories avoids empty tag ecosystem on legacy posts
- Archive as single `/blog/archive/` page keeps scope tight vs per-year routes

</specifics>

<deferred>
## Deferred Ideas

- KaTeX/math rendering for ```math fences → Phase 5 or v2
- Sticky prev/next bar on scroll → Phase 5
- Blog sub-nav in global header → note for Phase 5 (DESN-05); index link sufficient for Phase 4
- Per-post SEO/backlink audit with GSC → research only unless analytics access confirmed
- `/feed.xml` alias → not needed (D-84 locks `/rss.xml`)
- Tag cloud on blog index → user chose footer tags only (D-75)

</deferred>

---

*Phase: 4-Blog Curation & Discovery*
*Context gathered: 2026-07-02*
