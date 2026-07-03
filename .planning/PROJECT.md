# Terence Schumacher — Portfolio & Blog

## What This Is

A personal portfolio and technical blog for Terence Schumacher, a software engineer and technical writer. The site showcases projects, career history, and long-form writing to help recruiters and engineering peers quickly understand skills, impact, and technical depth. This is a modernization of the existing Jekyll/GitHub Pages site at tazzledazzle.github.io — not a greenfield build.

## Core Value

A recruiter or hiring manager can land on the site and within 60 seconds understand who Terence is, what he's built, and why he's worth interviewing.

## Requirements

### Validated

- ✓ Static site deployed to GitHub Pages — existing
- ✓ Blog with 50+ posts in `_posts/` — existing
- ✓ Static pages: About, Projects, Career, Blog — existing
- ✓ Jekyll + Minima theme (dark skin) — existing
- ✓ Social links (GitHub, Twitter, LinkedIn) — existing
- ✓ SEO tags and RSS feed via Jekyll plugins — existing
- ✓ CI/CD via GitHub Actions (jekyll-build-pages) — existing
- ✓ Local dev workflow (Bundler, serve.sh) — existing

### Active

- [ ] Modern visual design and UX (layout, typography, mobile-first)
- [ ] Restructured content for hiring impact (About, Projects, Career)
- [ ] Project showcase as cards with GitHub and live demo links
- [ ] Curated blog — migrate keepers, archive or hide low-value legacy posts
- [ ] Improved blog reading experience (discovery, tags/categories, RSS)
- [ ] Performance, SEO, and accessibility pass
- [ ] Stack evaluation and migration path (open to recommendations beyond Jekyll)

### Out of Scope

- User authentication or CMS admin panel — content stays in git/Markdown
- Comments system — defer to keep maintenance low
- E-commerce or paid content — not relevant to hiring goal
- Real-time features — static site is the right model
- Deep case-study pages for every project — v1 uses project cards; case studies deferred

## Context

**Existing site:** Jekyll 3.x on GitHub Pages with Minima theme (dark), ~50 blog posts spanning 2015–2025, mix of algorithms, macOS/system design notes, interview prep, and recent technical writing. Projects page links to a separate portfolio-projects site and lists GitHub repos with tech stacks. Career page has professional experience and education (UW Bothell CS).

**Audience:** Recruiters and hiring managers (primary for core value) plus engineering peers (blog credibility).

**Pain points driving modernization:** Dated visual design, content structure not optimized for hiring, blog needs curation (legacy academic/design-doc posts dilute signal), performance and accessibility not audited, navigation has minor config issues (e.g. Blog URL typo in `_config.yml`).

**Prior work:** User maintains content in Markdown, deploys via push to main. Comfortable with git-based workflow.

## Constraints

- **Hosting**: GitHub Pages at tazzledazzle.github.io — must remain deployable there (or document migration if stack changes)
- **Content**: Existing posts and pages must be preserved or intentionally curated — no data loss
- **Maintenance**: Favor low-overhead stack; solo maintainer
- **Timeline**: Ship polished MVP iteratively — no hard deadline but favor incremental delivery
- **Brand**: Professional, technical credibility — not flashy for its own sake

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Modernize existing site vs. rebuild from scratch | Existing content, domain, and CI are valuable | — Pending |
| Project showcase as cards (not deep case studies) | Faster to ship; links to GitHub/demos sufficient for v1 hiring goal | — Pending |
| Blog: migrate + curate/archive | Keep signal posts, reduce noise from legacy academic content | — Pending |
| Stack: open to recommendations | Jekyll works but may not be optimal for modern DX/performance | — Pending |
| Core audience: recruiters + peers | Hiring is primary goal; blog supports credibility | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-01 after initialization*
