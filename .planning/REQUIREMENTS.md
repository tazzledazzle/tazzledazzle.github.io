# Requirements: Terence Schumacher — Portfolio & Blog

**Defined:** 2026-07-01
**Core Value:** A recruiter or hiring manager can land on the site and within 60 seconds understand who Terence is, what he's built, and why he's worth interviewing.

## v1 Requirements

### Foundation & Data

- [x] **DATA-01**: Projects are defined in structured data (YAML/JSON) with title, summary, tech stack, GitHub URL, and optional demo URL
- [x] **DATA-02**: Career experience is defined in structured data with employer, role, dates, and achievement bullets
- [x] **DATA-03**: Site navigation and social links are defined in a single config source used by all layouts
- [x] **DATA-04**: A content inventory exists documenting all blog posts with curation tier (featured / standard / archived)

### Platform & Migration

- [ ] **PLAT-01**: Site builds and deploys to GitHub Pages via GitHub Actions (Astro static output)
- [ ] **PLAT-02**: All existing blog posts are migrated with preserved permalink structure (`/:year/:month/:day/:title/`)
- [ ] **PLAT-03**: RSS feed is generated and excludes archived posts
- [ ] **PLAT-04**: XML sitemap is generated and excludes archived posts
- [ ] **PLAT-05**: Redirects exist for any changed or consolidated URLs from the legacy Jekyll site

### Hiring / Portfolio

- [ ] **HIRE-01**: Homepage hero displays role, specialty, and impact framing above the fold
- [ ] **HIRE-02**: Homepage includes a prominent contact/resume CTA visible without scrolling on desktop
- [ ] **HIRE-03**: Projects page displays 3–5 featured project cards with impact summary, tech tags, and GitHub links
- [ ] **HIRE-04**: Project cards link to live demos when available; broken links are removed or marked "code only"
- [ ] **HIRE-05**: Career page displays real employer names, dates, and quantified achievement bullets
- [ ] **HIRE-06**: User can download resume PDF in one click from header or hero
- [ ] **HIRE-07**: GitHub, LinkedIn, and email are visible in site header or footer on every page

### Blog

- [ ] **BLOG-01**: Blog index shows featured posts prominently; archived posts are excluded from index
- [ ] **BLOG-02**: Each post displays publication date and estimated read time
- [ ] **BLOG-03**: Code blocks render with syntax highlighting and language tags
- [ ] **BLOG-04**: User can browse posts by tag via a tag index page
- [ ] **BLOG-05**: User can browse posts by year via an archive page
- [ ] **BLOG-06**: Blog posts support prev/next navigation by date
- [ ] **BLOG-07**: RSS feed link is discoverable in page `<head>` on all pages

### Design & UX

- [ ] **DESN-01**: Site uses a cohesive design system with consistent typography, spacing, and color tokens
- [ ] **DESN-02**: All pages are mobile-responsive with usable navigation on small screens
- [ ] **DESN-03**: Site uses a dark theme as the default visual mode
- [ ] **DESN-04**: Post layout uses comfortable reading width with clear heading hierarchy
- [ ] **DESN-05**: Navigation includes About, Projects, Career, and Blog with working links

### Performance, SEO & Accessibility

- [ ] **QUAL-01**: All pages pass Lighthouse performance score ≥ 90 on mobile
- [ ] **QUAL-02**: All pages meet WCAG 2.1 AA baseline (contrast, keyboard nav, focus states, alt text)
- [ ] **QUAL-03**: Each page has intentional title, meta description, and Open Graph tags
- [ ] **QUAL-04**: Blog posts include JSON-LD Article schema; About page includes Person schema
- [ ] **QUAL-05**: CI runs link checking and accessibility validation on every deploy
- [ ] **QUAL-06**: Images use modern formats, lazy loading, and appropriate dimensions

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Depth

- **CASE-01**: Deep project case study pages (problem → approach → outcome)
- **CASE-02**: Testimonials or recommendations section
- **CASE-03**: Open-source contribution highlights section

### Discovery & Engagement

- **DISC-01**: Full-text search across blog posts
- **DISC-02**: `/uses` page documenting tools and setup
- **DISC-03**: Newsletter or email capture
- **DISC-04**: `llms.txt` agent-readable content catalog

### UX Polish

- **UX-02**: Light/dark theme toggle
- **UX-03**: Table of contents auto-generated on long posts (>800 words)
- **UX-04**: Per-post Open Graph images

## Out of Scope

| Feature | Reason |
|---------|--------|
| User authentication / CMS admin panel | Content stays in git/Markdown per maintainer workflow |
| Comments system (Giscus, Utterances) | Moderation burden; low ROI for hiring site |
| Contact form with backend | Static site; mailto + LinkedIn sufficient |
| Skill bars / percentage ratings | Universally mocked by hiring managers |
| Heavy animations / particle effects | Hurts performance and accessibility |
| Next.js or full React SPA | Over-engineered for static portfolio; Astro recommended |
| Listing portfolio site itself as a project | Meta; real projects prove skills |
| Every repo and every post on homepage | Dilutes signal; curation is the strategy |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| DATA-03 | Phase 1 | Complete |
| DATA-04 | Phase 1 | Complete |
| PLAT-01 | Phase 2 | Pending |
| PLAT-02 | Phase 2 | Pending |
| PLAT-03 | Phase 2 | Pending |
| PLAT-04 | Phase 2 | Pending |
| PLAT-05 | Phase 2 | Pending |
| HIRE-01 | Phase 3 | Pending |
| HIRE-02 | Phase 3 | Pending |
| HIRE-03 | Phase 3 | Pending |
| HIRE-04 | Phase 3 | Pending |
| HIRE-05 | Phase 3 | Pending |
| HIRE-06 | Phase 3 | Pending |
| HIRE-07 | Phase 3 | Pending |
| BLOG-01 | Phase 4 | Pending |
| BLOG-02 | Phase 4 | Pending |
| BLOG-03 | Phase 4 | Pending |
| BLOG-04 | Phase 4 | Pending |
| BLOG-05 | Phase 4 | Pending |
| BLOG-06 | Phase 4 | Pending |
| BLOG-07 | Phase 4 | Pending |
| DESN-01 | Phase 5 | Pending |
| DESN-02 | Phase 5 | Pending |
| DESN-03 | Phase 5 | Pending |
| DESN-04 | Phase 5 | Pending |
| DESN-05 | Phase 5 | Pending |
| QUAL-01 | Phase 6 | Pending |
| QUAL-02 | Phase 6 | Pending |
| QUAL-03 | Phase 6 | Pending |
| QUAL-04 | Phase 6 | Pending |
| QUAL-05 | Phase 6 | Pending |
| QUAL-06 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 34 total
- Mapped to phases: 34
- Unmapped: 0 ✓

### Phase Coverage Summary

| Phase | Requirements | Count |
|-------|--------------|-------|
| 1 — Foundation & Data Extraction | DATA-01, DATA-02, DATA-03, DATA-04 | 4 |
| 2 — Astro Scaffold & Content Migration | PLAT-01, PLAT-02, PLAT-03, PLAT-04, PLAT-05 | 5 |
| 3 — Hiring Pages | HIRE-01, HIRE-02, HIRE-03, HIRE-04, HIRE-05, HIRE-06, HIRE-07 | 7 |
| 4 — Blog Curation & Discovery | BLOG-01, BLOG-02, BLOG-03, BLOG-04, BLOG-05, BLOG-06, BLOG-07 | 7 |
| 5 — Design System & Layout Polish | DESN-01, DESN-02, DESN-03, DESN-04, DESN-05 | 5 |
| 6 — Performance, SEO & Accessibility | QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05, QUAL-06 | 6 |

---
*Requirements defined: 2026-07-01*
*Last updated: 2026-07-01 after roadmap creation*
