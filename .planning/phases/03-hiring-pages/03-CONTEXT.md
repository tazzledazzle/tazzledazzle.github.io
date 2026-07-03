# Phase 3: Hiring Pages - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver recruiter-facing hiring pages that satisfy HIRE-01 through HIRE-07: homepage hero with 60-second pitch, resume PDF download, featured project cards on `/work/`, career timeline on `/career/`, expanded about bio, and site chrome (header/footer nav + social links on every page). Phase 3 builds functional hiring UX on the Phase 2 Astro scaffold — not full design system polish (Phase 5), blog curation UX (Phase 4), or SEO/schema work (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Homepage Hero (HIRE-01, HIRE-02)
- **D-41:** Hero headline role label: **Platform-focused Software Engineer** — broader engineering + technical writing angle (not SRE-only framing)
- **D-42:** Specialty line covers **both infrastructure/observability AND platform tooling/DX** in one line under the headline
- **D-43:** Impact framing uses a **value proposition** (e.g., "I build reliable platforms teams ship on") — not a metric hook or current-employer lead
- **D-44:** Below hero CTA on desktop: **tease 2–3 featured projects** as quick proof-of-build before fold ends

### Resume & Contact CTAs (HIRE-02, HIRE-06)
- **D-45:** Resume PDF lives as **static file in `public/`** (e.g., `public/resume.pdf`); maintainer updates manually when resume changes
- **D-46:** Resume download appears in **both header and hero** — persistent one-click access from any page plus prominent homepage CTA
- **D-47:** Resume CTA label: **"Download Resume"** (explicit PDF action)
- **D-48:** Hero CTA row: **Resume + GitHub** primary actions; email/LinkedIn provided via header/footer (not duplicated in hero)

### Project Cards on /work/ (HIRE-03, HIRE-04)
- **D-49:** Featured projects display in a **responsive card grid** (2 columns desktop, 1 column mobile)
- **D-50:** Tech stack renders as **pill/chip tags** from `tech_stack` on each card
- **D-51:** Demo handling: **GitHub as primary action**; show demo link only when `demo_url` exists — omit silently when `demo_status: code_only` (no badge)
- **D-52:** `/work/` shows **featured projects prominent** plus a **collapsed "More projects" section** sourced from `archive.yml`

### Career Timeline on /career/ (HIRE-05)
- **D-53:** Roles render as a **vertical timeline** — date rail on left, role content on right
- **D-54:** Show **all achievement bullets** per role from `career.yml` (no truncation or expand/collapse)
- **D-55:** Education (UW CS degree) appears in a **section below roles**
- **D-56:** Employment dates display as **human-readable month + year** (e.g., "Jan 2025 – Present") parsed from ISO `YYYY-MM` storage

### Site Chrome & About (HIRE-07, DESN-05 partial)
- **D-57:** Primary navigation is **data-driven from `navigation.yml`** via shared layout component
- **D-58:** Social links (GitHub, LinkedIn, email) appear in **both header and footer** on every page
- **D-59:** Mobile navigation uses a **hamburger menu** (<768px); full responsive polish deferred to Phase 5
- **D-60:** `/about/` content: **short bio (2–3 paragraphs) + social links**, adapted from legacy `about.markdown` content — not minimal placeholder

### Carried Forward from Prior Phases
- D-04 mixed demo links; `demo_status: code_only` when no demo
- D-05 `/work/` canonical projects URL
- D-07 last 3 roles only; D-08 quantified metrics in data; D-09 degree-only education
- D-12 `social.yml` separate from nav; D-18 lowercase nav paths
- D-38 Phase 2 minimal Tailwind shell — Phase 3 adds hiring components without full design tokens (Phase 5)
- D-39 Phase 2 delivered basic pages; Phase 3 replaces placeholders with hiring-grade layouts

### Claude's Discretion
- Exact hero copy wording (within D-41–D-43 framing)
- Which 2–3 featured projects tease on homepage hero
- Collapsed archive section default state (collapsed vs expanded on first load)
- Header/footer visual styling within minimal Tailwind shell
- Bio editing/condensing from `about.markdown` while preserving voice
- Hamburger menu implementation (client-side JS vs CSS-only details/summary)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Core value (60-second recruiter comprehension)
- `.planning/REQUIREMENTS.md` — HIRE-01 through HIRE-07
- `.planning/ROADMAP.md` § Phase 3 — Success criteria, UI hint
- `.planning/phases/01-foundation-data-extraction/01-CONTEXT.md` — Data decisions D-01 through D-20
- `.planning/phases/02-astro-scaffold-content-migration/02-CONTEXT.md` — Scaffold scope D-38 through D-40

### Data & Content Sources
- `src/data/navigation.yml` — Nav items for header (D-57)
- `src/data/social.yml` — GitHub, LinkedIn, email, name (D-58)
- `src/data/projects/featured.yml` — 5 featured projects for cards and hero tease
- `src/data/projects/archive.yml` — Archive projects for collapsed section (D-52)
- `src/data/career.yml` — 3 roles, bullets, education (D-53–D-56)
- `about.markdown` — Legacy about bio source for `/about/` adaptation (D-60)
- `docs/ASTRO-DATA-MAPPING.md` — Content collection loaders and schemas

### Current Implementation (Phase 2 baseline)
- `src/layouts/MainLayout.astro` — Bare layout; needs header/footer/nav (D-57–D-59)
- `src/pages/index.astro` — Placeholder hero to replace
- `src/pages/work.astro`, `career.astro`, `about.astro` — Minimal lists to upgrade
- `src/styles/global.css` — Tailwind 4 minimal shell

### Out of Phase Scope (do not implement here)
- Full design system tokens and typography polish → Phase 5 (DESN-01–DESN-04)
- Blog index curation, tags, archives, read time → Phase 4 (BLOG-01–BLOG-07)
- Person/Article JSON-LD, Lighthouse gates → Phase 6 (QUAL-03, QUAL-04)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/data/*` content collections — all hiring page data already migrated and validated
- `MainLayout.astro` — single integration point for header/footer chrome
- `global.css` — Tailwind 4 baseline; extend with component classes only as needed

### Established Patterns
- Pages load data via `getEntry()` / `getCollection()` from `src/content.config.ts`
- No `src/components/` directory yet — Phase 3 introduces shared components (Header, Footer, ProjectCard, CareerTimeline)
- `@ts-nocheck` on work/career pages — planner may add proper typing in components

### Integration Points
- Header: consume `navigation.yml` + `social.yml` + resume link to `public/resume.pdf`
- Homepage: hero + featured project tease + resume/GitHub CTAs
- `/work/`: featured grid + collapsible archive section from two YAML sources
- `/career/`: vertical timeline from `career.yml` roles + education block
- `/about/`: bio content adapted from `about.markdown`

### Gaps to Address
- **No resume PDF in repo yet** — Phase 3 must add `public/resume.pdf` (maintainer provides file or placeholder with clear task)
- **No header/footer/nav** — MainLayout is head+main only; HIRE-07 blocked until chrome added
- **All 5 featured projects are `code_only`** — D-51 means no demo links until data updated

</code_context>

<specifics>
## Specific Ideas

- Hero value prop tone: reliable platforms teams ship on — credibility over metric flex on first impression
- Homepage project tease gives recruiters immediate proof without navigating to `/work/`
- Resume in header satisfies "one click from header or hero" requirement on every page
- Legacy `about.markdown` has structured sections (What I Do, Journey, Connect) — condense to 2–3 paragraphs for hiring focus, drop Jekyll meta footer

</specifics>

<deferred>
## Deferred Ideas

- Full responsive nav polish and design tokens → Phase 5
- Blog featured/archive UX, syntax highlighting labels, tag/archive pages → Phase 4
- Person schema on About, Open Graph, Lighthouse CI gates → Phase 6
- Deep case study pages per project → v2 (CASE-01)
- Contact form backend → out of scope per REQUIREMENTS.md

</deferred>

---

*Phase: 3-Hiring Pages*
*Context gathered: 2026-07-02*
