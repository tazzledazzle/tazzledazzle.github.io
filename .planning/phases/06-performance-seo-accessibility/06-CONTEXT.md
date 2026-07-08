# Phase 6: Performance, SEO & Accessibility - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver production quality gates satisfying QUAL-01 through QUAL-06: Lighthouse performance ≥90 mobile on key pages, WCAG 2.1 AA baseline with automated CI checks, per-page SEO meta and Open Graph tags, JSON-LD structured data on blog posts and About, CI link checking and accessibility validation before deploy, and image optimization policy for future content. Phase 6 is the final v1 milestone phase — not v2 features (per-post OG images, search, newsletter).

</domain>

<decisions>
## Implementation Decisions

### Lighthouse Performance (QUAL-01)
- **D-108:** CI Lighthouse gate on **6 key pages** — home, about, work, career, blog index, one representative blog post
- **D-109:** **Performance ≥90 mobile** — fail CI if below threshold (hard gate)
- **D-110:** **Self-host Inter latin subset** — preload woff2, `font-display: swap` (drop external font CDN)
- **D-111:** CI gates **Performance + SEO** Lighthouse categories (Accessibility/ Best Practices informational unless axe fails separately)

### SEO Meta & Open Graph (QUAL-03)
- **D-112:** Meta descriptions via **explicit per-page `description` prop** passed to MainLayout — each Astro page owns its copy
- **D-113:** **Single default OG image** at `public/og-default.png` for all pages unless overridden later
- **D-114:** **Full Open Graph + Twitter Card** tags (`summary_large_image` when OG image present)
- **D-115:** **Archived posts** — `noindex` only; **skip OG/meta enrichment** beyond minimal title (consistent with D-67)

### Structured Data (QUAL-04)
- **D-116:** Blog posts (non-archived): **rich Article JSON-LD** — headline, datePublished, author Person, url, description, wordCount, keywords from tags, image (default OG)
- **D-117:** About page: **Person schema** — name, email, sameAs (GitHub, LinkedIn, Twitter) from `social.yml`
- **D-118:** Implement via **optional `jsonLd` prop** on MainLayout/PostLayout injected in `<head>`
- **D-119:** **No JSON-LD on archived posts** — matches noindex/no-OG policy

### CI Quality Gates (QUAL-05)
- **D-120:** Broken link checking with **lychee** CLI against built site / `dist/`
- **D-121:** Accessibility automation with **@axe-core/playwright** scanning key pages after preview/build
- **D-122:** Quality gates run on **every push to main** (extend deploy workflow or parallel quality job on same trigger)
- **D-123:** **Fail hard** on broken links or axe violations — block deploy

### Accessibility (QUAL-02)
- **D-124:** **Run contrast audit and fix** any WCAG 2.1 AA failures in token palette (don't only trust Phase 5 tokens)
- **D-125:** Keyboard nav validated via **axe automation** + existing Phase 5 focus rings (D-104) — no separate skip-link requirement
- **D-126:** CI **fails on images missing `alt`** in built HTML

### Image Optimization (QUAL-06)
- **D-127:** Future images policy: use **Astro `<Image>`** component — modern formats, explicit width/height, lazy loading
- **D-128:** Generate **placeholder `public/og-default.png`** during implementation (name + role branded asset)
- **D-129:** Inter **latin subset, weights 400+600** for minimal self-hosted payload

### Carried Forward from Prior Phases
- D-67 archived banner + noindex
- D-84 RSS autodiscovery at `/rss.xml`
- D-104 focus-visible rings (axe validates)
- D-32/D-33 RSS/sitemap exclude archived
- GitHub Pages static deploy via `withastro/action@v6`

### Claude's Discretion
- Lighthouse CI tooling (`@lhci/cli` vs unlighthouse vs custom script)
- lychee config for excluding archived external URLs or known flaky domains
- Which blog post to use as Lighthouse/axe sample (featured technical post)
- Whether to add `canonical` link tags (user chose OG+Twitter full set; canonical recommended but not locked)
- Exact axe rule configuration (WCAG 2.1 AA tags)
- og-default.png generation method (canvas script vs static SVG→PNG)
- Playwright install in CI vs axe against static dist HTML

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Constraints, out of scope (heavy animation, etc.)
- `.planning/REQUIREMENTS.md` — QUAL-01 through QUAL-06
- `.planning/ROADMAP.md` § Phase 6 — Success criteria
- `.planning/phases/05-design-system-layout-polish/05-CONTEXT.md` — Tokens, focus rings, deferred Lighthouse/a11y CI

### Implementation Baseline
- `src/layouts/MainLayout.astro` — Extend head: OG, Twitter, jsonLd prop
- `src/layouts/PostLayout.astro` — Article schema injection point
- `src/pages/about.astro` — Person schema target
- `src/data/social.yml` — Person sameAs fields
- `src/styles/global.css` — Contrast audit target
- `.github/workflows/deploy-pages.yml` — CI extension point
- `package.json` — Add verify:phase6, quality scripts

### Existing Verification
- `scripts/verify-phase3-hiring.mjs` through `verify-phase5-design.mjs` — Regression suite to keep green

### Out of Phase Scope
- Per-post OG images → v2 (UX-04)
- Full-text search, newsletter → v2
- Light/dark toggle → v2 (UX-02)
- Table of contents → v2 (UX-03)
- GSC/backlink audit methodology → research note only

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- MainLayout `title`, `description`, `robots` props — extend for SEO head partial
- PostLayout archived handling — skip OG/JSON-LD when archived
- Phase verify scripts pattern — model `verify-phase6-quality.mjs`
- `social.yml` — Person schema source

### Established Patterns
- Static output, no server runtime
- CI: checkout → withastro/action → deploy-pages (no quality jobs yet)
- No `@astrojs/image` or playwright in package.json today
- No images in `src/content/blog/` markdown currently
- Inter referenced in CSS but may not be self-hosted yet

### Integration Points
- Head partial or Seo.astro component consumed by MainLayout/PostLayout
- CI workflow: build → lychee → axe → lighthouse → deploy (order TBD)
- `public/og-default.png` + self-hosted fonts in `public/fonts/` or `src/assets/`
- Each page file needs explicit description strings (D-112)

### Gaps to Address
- Missing descriptions on most hiring pages
- No OG/Twitter meta tags
- No JSON-LD anywhere
- No font preload / self-hosting
- No quality CI jobs
- QUAL-06 mostly policy + og image today (zero blog images)

</code_context>

<specifics>
## Specific Ideas

- Hard fail CI aligns with production-ready v1 milestone — no soft warnings on links/a11y
- Rich Article schema supports technical blog credibility for engineering peers
- Self-hosted Inter latin subset balances brand consistency (D-89) with Lighthouse perf gate
- Archived posts stay out of discovery stack end-to-end: noindex, no OG, no JSON-LD

</specifics>

<deferred>
## Deferred Ideas

- Per-post dynamic OG images → v2 (UX-04)
- Lighthouse gate on all 68 pages → too heavy; 6 key pages sufficient
- Skip-link to main content → deferred (axe + focus rings chosen)
- remark plugin for markdown images → user chose Astro Image only for now
- Separate PR-only workflow → user chose main push gates
- Canonical URL tags → planner discretion

</deferred>

---

*Phase: 6-Performance, SEO & Accessibility*
*Context gathered: 2026-07-02*
