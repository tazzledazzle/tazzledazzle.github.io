# Phase 5: Design System & Layout Polish - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a cohesive dark-theme design system and responsive layout polish satisfying DESN-01 through DESN-05: consistent typography/spacing/color tokens, mobile-usable navigation at 375px without page-level horizontal scroll, default dark mode, comfortable blog reading width with heading hierarchy, and working primary nav on every page. Phase 5 unifies visual treatment across hiring and blog pages — not Lighthouse CI gates, JSON-LD, or full WCAG audit automation (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Design Tokens (DESN-01, DESN-03)
- **D-85:** Color palette **GitHub Dark-inspired** — align site surfaces with Expressive Code theme (D-71) for visual cohesion
- **D-86:** Accent color used for **links, tags, and subtle highlights** — restrained but not monochrome
- **D-87:** Spacing rhythm via **Tailwind default scale** (4/8/12/16/24px utilities)
- **D-88:** Border radius **subtle ~4px** on cards and buttons (current ~0.5rem pattern)

### Typography (DESN-01, DESN-04)
- **D-89:** Keep **Inter** as primary sans-serif (UI + body)
- **D-90:** Heading hierarchy via **size scale emphasis** — larger h1/h2 jumps, lighter weights
- **D-91:** Blog prose: **~65ch narrow column**, body ~1.0625rem, clear h2/h3 spacing
- **D-92:** Body text at **full `--fg`** — meta/captions muted only (depart from all-paragraphs-muted pattern)

### Layout Widths (DESN-04)
- **D-93:** Hiring pages (home, `/work/`, `/career/`, `/about/`) use **wide layout max 72rem** (match header)
- **D-94:** Blog post content uses **narrower ~65ch** centered column
- **D-95:** Homepage: **hero full content width** within container, **project tease in grid below**
- **D-96:** **Consistent 2.5rem** vertical spacing between major sections site-wide

### Component Polish (DESN-01)
- **D-97:** Shared **`.btn` / `.btn-primary`** classes — hero CTAs, header resume, card actions unified
- **D-98:** Unified **`.card` surface token** — project cards, and shared border/bg pattern where applicable
- **D-99:** Career timeline: **polish rail** — accent line, date labels, responsive stack on mobile
- **D-100:** **Migrate Hero scoped styles** to global design tokens (remove isolated `<style>` block dependency)

### Mobile Responsive (DESN-02)
- **D-101:** Polish existing **hamburger** — full-width panel, larger tap targets (no slide drawer or bottom nav)
- **D-102:** **Horizontal scroll only on code blocks and tables** via `overflow-x: auto` wrappers — not strict shrink-everything
- **D-103:** **Sticky header** on scroll — nav + resume always accessible
- **D-104:** **Visible focus rings** on all interactive elements (foundation for Phase 6 QUAL-02)

### Site Chrome (DESN-05)
- **D-105:** Active nav item shows **underline and/or bold** matching current URL
- **D-106:** Keep nav label **"Work"** at `/work/` — per D-05; DESN-05 satisfied functionally (not renamed to "Projects")
- **D-107:** **Minimal footer** — copyright + social links, subtle top border (polish spacing only)

### Carried Forward from Prior Phases
- D-05 `/work/` canonical URL and nav label
- D-38/D-59 minimal shell + hamburger mobile nav (polish, not replace)
- D-57 navigation.yml-driven nav
- D-69/D-71 Expressive Code + GitHub Dark — palette alignment in D-85
- D-71 code theme must remain compatible after token refresh

### Claude's Discretion
- Exact GitHub Dark token hex values mapped to CSS custom properties
- Whether to add `@tailwindcss/typography` vs hand-rolled `.prose` styles (user chose hand-rolled 65ch prose, not plugin)
- Card elevation vs flat border-only surfaces within D-98
- Sticky header implementation (CSS `position: sticky` vs JS)
- 375px validation approach in plan verify step
- Code block width relative to 65ch prose (default: contained unless breakout needed)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project & Requirements
- `.planning/PROJECT.md` — Professional technical brand, no heavy animation
- `.planning/REQUIREMENTS.md` — DESN-01 through DESN-05
- `.planning/ROADMAP.md` § Phase 5 — Success criteria, UI hint
- `.planning/phases/03-hiring-pages/03-CONTEXT.md` — Hiring page structure, chrome decisions
- `.planning/phases/04-blog-curation-discovery/04-CONTEXT.md` — Blog layouts, Expressive Code

### Styling & Components (current baseline)
- `src/styles/global.css` — Existing tokens, chrome, blog, card styles
- `src/components/Hero.astro` — Scoped styles to migrate (D-100)
- `src/components/Header.astro`, `MobileNav.astro`, `Footer.astro`
- `src/components/ProjectCard.astro`, `CareerTimeline.astro`, `ProjectTease.astro`
- `src/layouts/MainLayout.astro`, `PostLayout.astro`
- `astro.config.mjs` — Expressive Code theme config

### Out of Phase Scope
- Lighthouse ≥90 mobile → Phase 6 (QUAL-01)
- WCAG CI automation, JSON-LD, Open Graph → Phase 6 (QUAL-02–QUAL-05)
- Light/dark theme toggle → v2 (UX-02)
- Heavy animations / particle effects → out of scope per REQUIREMENTS.md
- Table of contents on long posts → v2 (UX-03)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- CSS custom properties in `global.css`: `--bg`, `--fg`, `--muted`, `--accent` — extend to full token set
- Component classes: `.project-card`, `.site-header`, `.post-nav`, `.blog-section` — refactor toward `.card`, `.btn`
- Tailwind 4 via `@import "tailwindcss"` — use utilities for spacing scale (D-87)
- Hero has isolated scoped styles — primary migration target (D-100)

### Established Patterns
- `main` max-width 72ch globally — must split hiring (72rem) vs blog prose (65ch) per D-93/D-94
- Header/footer max-width 72rem already — aligns with hiring layout
- Mobile nav: `<details>` hamburger at `<768px` — polish in place, don't replace pattern
- Expressive Code GitHub Dark — site palette should harmonize, not clash

### Integration Points
- `global.css` — central token + component class definitions
- All page templates inherit via `MainLayout` / `PostLayout`
- Sticky header affects all pages — test mobile menu z-index stacking
- Prose styles apply inside `.post-body` in PostLayout

### Gaps to Address
- Inconsistent text color (global `p { color: muted }` conflicts with D-92)
- Hero styles not in design system
- No `.btn` / `.card` shared primitives
- No nav active state
- No focus ring styles
- Main width 72ch may be too narrow for 72rem hiring grid intent

</code_context>

<specifics>
## Specific Ideas

- GitHub Dark cohesion between site chrome and code blocks reduces "two themes" feel
- Size-scale headings give recruiter pages more hierarchy without flashy design
- Sticky header supports 60-second recruiter comprehension — resume always one click away
- 65ch blog column improves long-form technical reading without Phase 6 SEO work

</specifics>

<deferred>
## Deferred Ideas

- Slide-in mobile drawer, bottom tab nav — rejected in discussion
- Footer sitemap with tag/archive links — minimal footer chosen (D-107)
- Rename nav to "Projects" — conflicts with locked D-05
- `@tailwindcss/typography` plugin — user chose hand-rolled prose
- Full WCAG focus audit in CI → Phase 6
- Light mode toggle → v2

</deferred>

---

*Phase: 5-Design System & Layout Polish*
*Context gathered: 2026-07-02*
