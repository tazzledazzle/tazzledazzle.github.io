# Roadmap: Terence Schumacher — Portfolio & Blog

## Overview

Modernize the brownfield Jekyll portfolio and technical blog into an Astro static site optimized for recruiter comprehension in 60 seconds. Work proceeds in six deployable layers: extract portable hiring data first, migrate stack and content, ship recruiter-facing pages, curate and improve blog discovery, apply cohesive visual design, then gate production quality with performance, SEO, and accessibility.

## Phases

**Phase Numbering:**
- Integer phases (1–6): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions via `/gsd-phase --insert`

- [x] **Phase 1: Foundation & Data Extraction** - Structured hiring data, fixed navigation, and blog curation inventory (completed 2026-07-02)
- [x] **Phase 2: Astro Scaffold & Content Migration** - Astro 7 build, post migration, RSS, sitemap, and URL preservation (completed 2026-07-02)
- [x] **Phase 3: Hiring Pages** - Homepage hero, project cards, career timeline, resume CTA, and contact links (completed 2026-07-02)
- [x] **Phase 4: Blog Curation & Discovery** - Tiered blog visibility, tags, archives, and reading experience (completed 2026-07-02)
- [ ] **Phase 5: Design System & Layout Polish** - Cohesive dark theme, responsive layout, and readable post typography
- [ ] **Phase 6: Performance, SEO & Accessibility** - Lighthouse 90+, WCAG AA, structured data, and CI quality gates

## Phase Details

### Phase 1: Foundation & Data Extraction
**Goal**: Portable hiring content and navigation exist in structured data before any stack migration
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04
**Success Criteria** (what must be TRUE):
  1. Maintainer can read canonical nav paths from `_data/navigation.yml` (lowercase `/about/`, `/work/`, `/career/`, `/blog/`) — live header wiring deferred to Phase 2/3 per D-20
  2. Maintainer can render project cards from structured data with title, summary, tech stack, GitHub URL, and optional demo URL for each featured project
  3. Maintainer can render a career timeline from structured data with employer, role, dates, and quantified achievement bullets
  4. Every legacy blog post has a documented curation tier (featured / standard / archived) before migration begins
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Validation scaffold (scripts/validate-data.rb + Rake tasks)
- [x] 01-02-PLAN.md — Navigation, social, and curated projects YAML (DATA-01, DATA-03)
- [x] 01-03-PLAN.md — Career data with LinkedIn input checkpoint (DATA-02)
- [x] 01-04-PLAN.md — Blog inventory, Astro mapping doc, and full validation gate (DATA-04)

### Phase 2: Astro Scaffold & Content Migration
**Goal**: Site builds on Astro 7 and deploys to GitHub Pages with migrated blog content and preserved permalinks
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PLAT-01, PLAT-02, PLAT-03, PLAT-04, PLAT-05
**Success Criteria** (what must be TRUE):
  1. Visitor can load the live site at tazzledazzle.github.io after a push to main triggers GitHub Actions deploy
  2. Visitor can open any migrated blog post at its legacy permalink (`/:year/:month/:day/:title/`)
  3. Visitor can subscribe via RSS feed that includes only non-archived posts
  4. Search engines can crawl an XML sitemap that excludes archived posts
  5. Visitor following a changed or consolidated legacy URL is redirected to the correct new location
**Plans**: 5 plans
**Research flag**: Permalink parity and GitHub Pages redirect strategy (`/gsd-plan-phase --research-phase 2`)

Plans:
- [x] 02-01-PLAN.md — Astro scaffold and single-path CI cutover baseline
- [x] 02-02-PLAN.md — Data migration to `src/data` and validator continuity
- [x] 02-03-PLAN.md — Blog/content migration with canonical hiring/blog pages
- [x] 02-04-PLAN.md — RSS/sitemap archive filters and legacy redirect generation
- [x] 02-05-PLAN.md — D-23 validation matrix, smoke enforcement, and Jekyll retirement

### Phase 3: Hiring Pages
**Goal**: A recruiter can understand who Terence is, what he's built, and why he's worth interviewing within 60 seconds
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: HIRE-01, HIRE-02, HIRE-03, HIRE-04, HIRE-05, HIRE-06, HIRE-07
**Success Criteria** (what must be TRUE):
  1. Recruiter landing on the homepage sees role, specialty, and impact framing above the fold without scrolling on desktop
  2. Recruiter can download a resume PDF in one click from the header or hero CTA
  3. Recruiter browsing the Projects page sees 3–5 featured project cards with impact summary, tech tags, and GitHub links
  4. Recruiter clicking a project demo link reaches a live demo or sees a clear "code only" state when no demo exists
  5. Recruiter reading the Career page sees real employer names, dates, and quantified achievement bullets
  6. Recruiter can reach GitHub, LinkedIn, and email from the site header or footer on every page
**Plans**: 5 plans
**UI hint**: yes

Plans:
- [x] 03-01-PLAN.md — Site chrome, resume PDF, shared ProjectCard (HIRE-06, HIRE-07)
- [x] 03-02-PLAN.md — Homepage hero and featured project tease (HIRE-01, HIRE-02)
- [x] 03-03-PLAN.md — Work page card grid and archive section (HIRE-03, HIRE-04)
- [x] 03-04-PLAN.md — Career timeline and About bio (HIRE-05)
- [x] 03-05-PLAN.md — Phase 3 verification gate and validation matrix (HIRE-01–07)

### Phase 4: Blog Curation & Discovery
**Goal**: Engineering peers can discover and read curated technical writing without legacy noise diluting signal
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07
**Success Criteria** (what must be TRUE):
  1. Reader browsing the blog index sees featured posts prominently and does not see archived posts in the list
  2. Reader viewing a post sees publication date and estimated read time
  3. Reader viewing posts with code sees syntax-highlighted blocks with language labels
  4. Reader can browse all posts for a given tag from a tag index page
  5. Reader can browse posts grouped by year from an archive page
  6. Reader can navigate to the previous and next post by publication date from any blog post
  7. Reader (or feed aggregator) can discover the RSS feed via `<link rel="alternate">` in the page head on all pages
**Plans**: 6 plans

Plans:
- [x] 04-01-PLAN.md — Blog utilities, tag backfill, and prev/next helpers
- [x] 04-02-PLAN.md — Expressive Code (GitHub Dark) and RSS autodiscovery
- [x] 04-03-PLAN.md — PostLayout with metadata, tags, prev/next, archived handling
- [x] 04-04-PLAN.md — Tiered featured + standard blog index
- [x] 04-05-PLAN.md — Tag index routes and year archive page
- [x] 04-06-PLAN.md — Phase 4 verification gate (BLOG-01–07)

**Research flag**: Per-post SEO/backlink audit methodology if analytics access is limited
**UI hint**: yes

### Phase 5: Design System & Layout Polish
**Goal**: Site presents a cohesive, professional dark-theme experience across all pages and screen sizes
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: DESN-01, DESN-02, DESN-03, DESN-04, DESN-05
**Success Criteria** (what must be TRUE):
  1. Visitor sees consistent typography, spacing, and color treatment across homepage, hiring pages, and blog
  2. Visitor on a mobile device (375px width) can use navigation and read all page content without horizontal scrolling
  3. Visitor sees a dark theme as the default visual mode on first load
  4. Reader reading a blog post sees comfortable line length and clear heading hierarchy
  5. Visitor can reach About, Projects, Career, and Blog via primary navigation with working links on every page
**Plans**: 5 plans
**UI hint**: yes

Plans:
- [ ] 05-01-PLAN.md — GitHub Dark tokens, .btn/.card primitives, focus rings (DESN-01, DESN-03)
- [ ] 05-02-PLAN.md — Hiring vs prose layouts, typography, hand-rolled blog prose (DESN-01, DESN-04)
- [ ] 05-03-PLAN.md — Hero/card component migration to design system (DESN-01)
- [ ] 05-04-PLAN.md — Sticky header, active nav, mobile polish, footer (DESN-02, DESN-05)
- [ ] 05-05-PLAN.md — Phase 5 verification gate and validation matrix (DESN-01–05)

### Phase 6: Performance, SEO & Accessibility
**Goal**: Site meets production quality bars for speed, discoverability, and inclusive access
**Mode:** mvp
**Depends on**: Phase 5
**Requirements**: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06
**Success Criteria** (what must be TRUE):
  1. All key pages score ≥ 90 on Lighthouse performance for mobile
  2. Keyboard-only visitor can navigate all pages with visible focus states and sufficient color contrast (WCAG 2.1 AA)
  3. Each page has a unique, intentional title, meta description, and Open Graph tags when shared
  4. Blog posts expose JSON-LD Article schema and the About page exposes Person schema to search engines
  5. Broken links and accessibility regressions are caught automatically in CI before deploy
  6. Images load in modern formats with lazy loading and do not cause layout shift from oversized dimensions
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Data Extraction | 4/4 | Complete   | 2026-07-02 |
| 2. Astro Scaffold & Content Migration | 5/5 | Complete   | 2026-07-02 |
| 3. Hiring Pages | 5/5 | Complete   | 2026-07-02 |
| 4. Blog Curation & Discovery | 6/6 | Complete   | 2026-07-02 |
| 5. Design System & Layout Polish | 0/5 | Not started | - |
| 6. Performance, SEO & Accessibility | 0/TBD | Not started | - |

---
*Roadmap created: 2026-07-01*
