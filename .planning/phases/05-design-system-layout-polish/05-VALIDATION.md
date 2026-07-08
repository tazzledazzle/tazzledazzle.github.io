# Phase 5: Design System Validation Matrix

**Requirement coverage:** DESN-01 through DESN-05, decisions D-85–D-107  
**Automated gate:** `npm run verify:phase5` (includes phase 3/4 regressions)

| Requirement | Decision IDs | Automated check | Manual check |
|-------------|--------------|-----------------|--------------|
| **DESN-01** Cohesive typography, spacing, color tokens | D-85–D-89, D-97–D-98 | Built CSS contains `--border`, `--surface`, `.btn-primary`, `.card` | Visual cohesion between site chrome and Expressive Code blocks (GitHub Dark alignment D-85/D-71) |
| **DESN-02** Mobile-usable at 375px, no page-level horizontal scroll | D-101–D-103, D-102 | CSS `position: sticky` on header; `mobile-nav` in HTML; `:focus-visible` in CSS | 375px viewport: no page-level horizontal scroll on `/`, `/work/`, `/career/`, `/about/`, sample blog post; code blocks may scroll internally |
| **DESN-03** Default dark mode | D-85 | Built CSS `color-scheme: dark` | — |
| **DESN-04** Comfortable blog reading width and heading hierarchy | D-90–D-92, D-91, D-94, D-96 | CSS `65ch`; sample post has `post-body` + `layout-prose` | Heading hierarchy readability on a long technical post |
| **DESN-05** Primary nav on every page | D-105–D-107, D-106 | Home HTML links to `/about/`, `/work/`, `/career/`, `/blog/`; text "Work" present | Confirm active nav underline on current section |

## Decision traceability (D-85–D-107)

| ID | Topic | Gate |
|----|-------|------|
| D-85 | GitHub Dark palette | DESN-01/03 automated CSS tokens |
| D-86 | Accent for links/tags only | DESN-01 manual visual |
| D-87 | Tailwind spacing scale | Comment in `global.css`; no custom spacing tokens |
| D-88 | `--radius` ~4px | `.btn`, `.card` use `var(--radius)` |
| D-89 | Inter font stack | `html, body` font-family unchanged |
| D-90 | Heading size scale | DESN-04 CSS h1–h3 rules |
| D-91 | 65ch prose, 1.0625rem body | DESN-04 automated |
| D-92 | Body `--fg`, meta muted | `.post-meta`, `.hero__greeting` muted selectors |
| D-93 | Hiring 72rem | `main.layout-hiring` automated |
| D-94 | Blog 65ch | `main.layout-prose` automated |
| D-95 | Hero full width + tease grid | `project-tease__grid` in global.css |
| D-96 | 2.5rem section gap | `.section-gap`, `.blog-section`, `.project-tease` |
| D-97 | `.btn` / `.btn-primary` | DESN-01 automated + Hero/header markup |
| D-98 | `.card` surface | DESN-01 automated + ProjectCard markup |
| D-99 | Career timeline accent rail | `.career-timeline__content` border-left |
| D-100 | Hero scoped styles removed | `Hero.astro` source has no `<style>` |
| D-101 | Hamburger polish, 44px targets | DESN-02 automated + manual 375px |
| D-102 | Code/table overflow-x | `.post-body pre/table` rules |
| D-103 | Sticky header | DESN-02 automated |
| D-104 | Focus-visible rings | DESN-02 automated |
| D-105 | Active nav underline/bold | `isActiveNavPath` + `.is-active` |
| D-106 | Nav label "Work" at `/work/` | DESN-05 automated "Work" text |
| D-107 | Minimal footer | `site-footer` border + muted copyright |

## Manual smoke checklist (375px)

1. Open `/` — hero and tease grid readable; menu opens full-width panel
2. Open `/work/`, `/career/`, `/about/` — no horizontal page scroll
3. Open sample post (`/2024/11/08/kotlin-cheatsheet/`) — narrow column; code scrolls inside block
4. Tab through header links — visible focus rings
5. Confirm current-page nav shows underline on desktop and mobile

---
*Phase 5 validation matrix — synced with `scripts/verify-phase5-design.mjs`*
