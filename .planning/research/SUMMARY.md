# Project Research Summary

**Project:** Terence Schumacher — Portfolio & Blog modernization (tazzledazzle.github.io)  
**Domain:** Hiring-focused personal portfolio + technical blog (static site)  
**Researched:** 2026-07-01  
**Confidence:** HIGH

## Executive Summary

This is a brownfield modernization of a solo-maintained Jekyll portfolio and technical blog hosted on GitHub Pages. The site serves two audiences with different scan patterns: recruiters who need to answer "is this person worth interviewing?" in 8–60 seconds, and engineering peers who judge depth through curated technical writing. Experts build these sites as static, Markdown-first systems with a four-layer separation (content → presentation → build → deploy), aggressive curation over volume, and CI artifact deploy to GitHub Pages — never committing generated HTML.

Research converges on a clear end state: **migrate from Jekyll to Astro 7 with static output**, styled with Tailwind CSS 4, deployed via `withastro/action@v6` to `tazzledazzle.github.io`. Astro is purpose-built for this use case — zero-JS default, content collections with Zod validation, official GitHub Pages support — while Next.js static export and staying on Jekyll (especially the github-pages gem prison at Jekyll 3.10 / Minima 2.5) are rejected. The critical execution insight is **not** to rewrite the stack before shipping hiring impact, and **not** to do a full Jekyll visual overhaul that gets thrown away during migration. Portable work comes first: extract projects, career, and navigation into structured data; fix broken nav; preserve the `/:year/:month/:day/:title/` permalink scheme. Then scaffold Astro, migrate ~55 posts with a frontmatter script, and build the recruiter-facing experience (hero, project cards, real career content) on the new stack.

Key risks are stack migration paralysis (weeks of framework comparison, zero UX shipped), silent GitHub Pages plugin failures, URL breakage during blog curation, and optimizing for visual polish while failing the 60-second recruiter test. Mitigation: time-boxed stack decision (done — Astro), ship incrementally in deployable layers, audit every post before archiving (traffic + backlinks, not just hiring signal), preserve URLs with redirect maps, and validate with `html-proofer` / pa11y in CI. Generic About/Career copy, dead demo links, and ~28 low-signal posts diluting the archive are the highest project-specific risks today.

---

## Recommended Stack

**Migrate to Astro 7 (`^7.0.5`) with `output: 'static'`, TypeScript 5.9, Node 24.x, Tailwind CSS 4.1 via `@tailwindcss/vite`, deployed through GitHub Actions (`withastro/action@v6` → `actions/deploy-pages@v5`).** No `base` path needed for `username.github.io`. Match current permalink style with `trailingSlash: 'never'`.

**Core technologies:**

| Technology | Purpose | Why |
|------------|---------|-----|
| **Astro 7** | SSG for portfolio, blog, static pages | Content-first, ~0 JS default, official Pages Action, fastest Jekyll Markdown migration path |
| **TypeScript 5.9** | Config, content schemas, components | Zod-validated content collections catch frontmatter drift during migration |
| **Tailwind CSS 4** | Layout, typography, responsive design | Industry standard for portfolio redesigns; CSS-first `@theme`; no runtime CSS-in-JS |
| **Content Collections** | Blog posts, optional projects | Replaces `_posts/` with `getCollection('blog')`; glob loader for `src/content/blog/*.md` |
| **@astrojs/rss + @astrojs/sitemap** | RSS feed, XML sitemap | Direct replacements for `jekyll-feed` and `jekyll-sitemap` |
| **expressive-code / Shiki** | Code highlighting | Replaces Rouge with better theme control |
| **@astrojs/check + html-validate/pa11y-ci** | CI quality gates | Replaces `html-proofer`; addresses explicit a11y requirement |

**Explicit rejections:** Jekyll + github-pages gem (Jekyll 3.10 lock), Next.js `output: 'export'`, full React SPA, headless CMS, comments, skill-bar UI kits, Docker local dev.

**Migration mapping:** `_posts/` → `src/content/blog/`; `date` → `pubDate`, `categories` → `tags`; `_data/*.yml` → `src/data/*`; Minima layouts → Astro components + Tailwind. Remove Ruby toolchain after cutover.

---

## Table Stakes

Features missing from the current site that make it feel incomplete or unprofessional for hiring.

### Hiring / Portfolio (Recruiter-Facing)

- **Clear value proposition above the fold** — role + specialty + impact, not "Welcome to my portfolio"
- **Scannable project cards (3–5 featured)** — title, 1–2 sentence impact, tech tags, GitHub + demo links
- **Working outbound links** — broken demos are instant disqualifiers; audit quarterly
- **Career timeline with real data** — employer names, dates, quantified outcomes (current `career.md` is placeholder-generic)
- **Resume PDF download CTA** — prominent one-click from header or hero
- **Contact + social on every page** — GitHub, LinkedIn, email consistently surfaced
- **Mobile-responsive layout** — ~40% of portfolio views are mobile
- **Fast load (<3s, good Core Web Vitals)** — image compression, font subsetting, lazy loading
- **WCAG 2.1 AA baseline** — semantic HTML, contrast, keyboard nav, focus states
- **SEO basics** — intentional per-page titles, descriptions, OG tags

### Blog (Peer-Facing + Credibility)

- **Readable post layout** — comfortable line length, heading hierarchy, code block styling
- **Post metadata** — date, estimated read time
- **Syntax-highlighted code blocks** — language tags on fenced blocks
- **RSS/Atom feed with discovery** — `<link rel="alternate">` in `<head>`
- **Pagination or year archive** — 52 posts need browseability
- **Tags/categories** — primary discovery mechanism; many posts lack consistent tags
- **Sitemap** — crawlability; curated/archived posts excluded correctly

### Cross-Cutting

- **Consistent navigation** — fix Blog URL YAML typo (`url '/Blog'` → `url: '/blog/'`); lowercase permalinks
- **HTTPS + URL stability** — preserve `/:year/:month/:day/:title/` or redirect
- **No broken internal links** — especially after curation

### Differentiators to Include in MVP (If Cheap)

Curated blog tiers (Featured / Standard / Archived), "Now" section, 2–3 featured posts on homepage, JSON-LD, prev/next navigation, year archive, TOC on long posts.

### Defer to v2+

Deep case studies, full-text search, newsletter, comments, `/uses` page, light mode toggle, interactive embedded demos, `llms.txt`.

### Anti-Features (Never Build)

Skill bars, wall of 30+ technologies, listing the portfolio site as a project, unmodified tutorial clones, every post on the front page, generic "passionate developer" copy, placeholder career content, heavy animations, contact form with backend, CMS admin panel, pop-ups/email gates.

---

## Architecture Overview

Modern portfolio+blog sites use a **four-layer separation**: content (Markdown + YAML/JSON data) → presentation (composable layouts/components) → build (SSG) → deploy (CI → artifact → GitHub Pages). Generated HTML is never committed to git.

**Current architectural debt:** Projects and career are inline Markdown, not data-driven; no `_data/` directory; Minima + HTML5UP + custom SCSS layered debt; post schema inconsistency (mixed layouts, filenames with spaces); inline JS in header partial.

**Target component map (Astro):**

| Component | Responsibility |
|-----------|---------------|
| **SiteShell / BaseLayout** | `<html>`, meta, OG, RSS link, skip-nav |
| **SiteHeader / SiteFooter** | Nav, mobile menu, social links from data |
| **HomeHero** | 60-second hiring pitch + CTAs |
| **ProjectCard** | Title, summary, tech stack, GitHub/demo links from `projects` data |
| **CareerTimeline** | Experience rendered from `career` data |
| **PostCard / PostArticle** | Blog list items and full post layout |
| **BlogIndex** | Paginated list, tag filter, featured section |
| **SEOHead / FeedGenerator** | Meta, JSON-LD, RSS route |

**Key patterns:** Content/data separation (YAML/JSON for hiring content, thin page templates); layout inheritance chain (every page through single shell); artifact-only deploy; URL preservation table before any permalink change; draft-based curation (`draft: true` / `published: false`, never delete without redirect).

**Anti-patterns to avoid:** Big-bang stack rewrite before content restructure; committing `_site/` or `dist/`; inline scripts in layout partials; theme override sprawl; permalink changes without redirects; over-componentizing (5–8 focused components is enough).

```
src/content/blog/     ← migrated _posts/
src/data/             ← projects, career, navigation
src/components/       ← cards, header, footer
src/layouts/          ← BaseLayout, PostLayout
src/pages/            ← routes + feed.xml.ts
public/               ← images, favicon
astro.config.mjs      ← site URL, static output, integrations
```

---

## Key Pitfalls

### Critical (Top 5)

1. **Stack migration paralysis** — Weeks evaluating frameworks while the dated site stays live. *Avoid:* Time-box decision (Astro chosen); ship hiring UX in deployable layers; treat Markdown as portable.

2. **"Works locally, broken in production"** — GitHub Pages safe mode silently drops unsafelisted plugins. *Avoid:* `jekyll build --safe` during interim Jekyll work; consolidate dual CI workflows; use custom Actions build or migrate to Astro CI.

3. **URL/permalink changes without redirect strategy** — 52 posts depend on `/:year/:month/:day/:title/`; GitHub Pages has no server-side 301s. *Avoid:* Preserve permalink scheme; build old→new redirect map before any slug change; hide, don't delete.

4. **Aggressive content purge without SEO audit** — ~28 low-signal posts may have backlinks or long-tail traffic. *Avoid:* Per-URL audit (traffic, backlinks, hiring signal); consolidate 2015/2024 duplicate design docs; default to archive, not delete.

5. **Optimizing for designers, not recruiters** — Beautiful theme but no answer to "what does this person do?" in 60 seconds. *Avoid:* Hero with role + stack + CTA above fold; 3–4 project cards with impact framing; real career data with metrics; test on mobile at 375px.

### Moderate (Watch During Execution)

- **Dead demo links** — CI link check; GitHub-first over fragile free-tier hosts
- **Navigation casing drift** — Normalize lowercase permalinks; fix YAML typo
- **Big-bang redesign PR** — Ship in layers, each mergeable to main
- **Over-engineering stack** — Astro fits; Next.js does not
- **Curation without discovery UX** — Tags, featured section, "start here" alongside hiding noise
- **Split portfolio funnel** — Single canonical Projects page; demote separate `portfolio-projects` redirect

---

## Recommended Phase Order

Research reconciles STACK (Astro end state) with ARCHITECTURE and PITFALLS (data-first, incremental shipping). **Do not invest in a full Jekyll visual overhaul** — extract portable data, then build on Astro.

### Phase 1: Foundation & Data Extraction
**Rationale:** Portable regardless of stack; unblocks everything else.  
**Delivers:** `_data/` or equivalent schemas for navigation, projects, career; fixed nav YAML; URL inventory spreadsheet; blog curation tier spreadsheet (Featured / Standard / Archived).  
**Addresses:** Consistent navigation, project card data model, career data model, curation planning.  
**Avoids:** Big-bang rewrite, permalink breakage (inventory first).  
**Research flag:** Standard patterns — execute directly.

### Phase 2: Astro Scaffold & Content Migration
**Rationale:** Stack decision is made; CI swap is mechanical once content is structured.  
**Delivers:** Astro 7 project with `withastro/action@v6` workflow; ~55 posts migrated via frontmatter script; permalink parity route (`/:year/:month/:day/:title/`); RSS + sitemap; remove Ruby toolchain.  
**Uses:** Astro 7, Content Collections, `@astrojs/rss`, `@astrojs/sitemap`, Tailwind 4.  
**Avoids:** Stack paralysis, safe-mode plugin failures, wrong artifact path (`dist/` not `_site/`).  
**Research flag:** **Needs `/gsd-plan-phase --research-phase 2`** — permalink preservation on GitHub Pages (no Netlify `_redirects`), redirect strategy for archived/renamed slugs.

### Phase 3: Hiring Pages (Core Value)
**Rationale:** Recruiter comprehension is the primary PROJECT.md goal; depends on data + Astro shell.  
**Delivers:** HomeHero with positioning + resume CTA; Projects page with 3–5 featured cards; Career timeline with real employers/dates/metrics; About tightened; contact links on every page.  
**Addresses:** Hero, project cards, career timeline, resume download, contact links.  
**Avoids:** 60-second failure, dead demo links, split portfolio funnel, skill bars.  
**Research flag:** Standard patterns.

### Phase 4: Blog Curation & Discovery
**Rationale:** Signal over noise for peer credibility; must respect URL preservation.  
**Delivers:** Tiered visibility (featured on index, archived excluded from RSS/sitemap); standardized frontmatter; tag pages; year archive; featured writing on homepage; duplicate post consolidation.  
**Addresses:** Curated blog, tags, pagination/archive, RSS, read time, prev/next.  
**Avoids:** SEO-blind purge, duplicate content, broken feed after curation.  
**Research flag:** **Needs research** — per-post GSC/backlink audit methodology if analytics access is limited.

### Phase 5: Design System & Layout Polish
**Rationale:** Visual modernization on final stack, not throwaway Jekyll CSS.  
**Delivers:** Tailwind design tokens; mobile-first responsive layout; dark theme refresh; semantic HTML landmarks; extracted nav JS as minimal island if needed.  
**Addresses:** Professional visual design, mobile-responsive, accessible baseline.  
**Avoids:** Theme fork sprawl, heavy animations.  
**Research flag:** Standard patterns (Tailwind 4 + Astro is well-documented).

### Phase 6: Performance, SEO & Accessibility
**Rationale:** Production polish after content and layout stabilize.  
**Delivers:** Image optimization (WebP, lazy load); JSON-LD (Person, Article); `@astrojs/check` + pa11y/html-validate in CI; Lighthouse 90+ on key pages; link checker in Actions.  
**Addresses:** Core Web Vitals, WCAG AA, SEO basics, structured data.  
**Avoids:** Lighthouse-only optimization without field data; missing sitemap/robots/canonicals.  
**Research flag:** Standard patterns.

### Phase Ordering Rationale

- **Data before design** — project/career YAML schemas prevent rework across stack migration
- **Astro before hiring polish** — avoid double CSS/layout investment on Jekyll
- **Hiring pages before blog curation** — matches recruiter-first priority from FEATURES.md
- **Polish last** — SEO/a11y/perf gates need stable templates

### Research Flags Summary

| Phase | Research Needed? | Reason |
|-------|------------------|--------|
| 1 — Foundation | No | Data extraction patterns are established |
| 2 — Astro Migration | **Yes** | Permalink parity + GitHub Pages redirect limitations |
| 3 — Hiring Pages | No | Well-documented portfolio patterns |
| 4 — Blog Curation | **Maybe** | Depends on GSC/analytics access for audit |
| 5 — Design System | No | Tailwind 4 + Astro is standard |
| 6 — Perf/SEO/A11y | No | Established CI tooling |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | Official Astro GitHub Pages docs, Pages dependency versions, Astro 7 release verified |
| Features | **HIGH** (portfolio), **MEDIUM** (blog discovery) | Multiple hiring-portfolio sources; blog features less standardized |
| Architecture | **HIGH** | Live repo audited; Astro migration guide verified |
| Pitfalls | **HIGH** (hosting/URLs), **MEDIUM** (hiring psychology) | Safe-mode and permalink risks documented; recruiter behavior is industry consensus |

**Overall confidence:** HIGH

### Gaps to Address During Planning

- **GitHub Pages redirect mechanism for Astro** — No server-side 301s; need meta-refresh stubs or URL preservation for every changed slug. Plan in Phase 2 research.
- **Per-post SEO audit data** — Curation spreadsheet needs GSC/backlink columns; confirm analytics access before Phase 4.
- **Jekyll interim vs immediate Astro cutover** — If any Phase 1 work happens on Jekyll, limit to data extraction only (no theme investment).
- **Separate `portfolio-projects` site** — Decide merge vs redirect vs link-only before Phase 3 project cards.

---

## Sources

### Primary (HIGH confidence)
- [GitHub Pages dependency versions](https://pages.github.com/versions/) — Jekyll 3.10 lock, plugin safelist
- [Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) — `withastro/action@v6`
- [Astro: Migrating from Jekyll](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/) — content parity
- [Astro: Content Collections](https://docs.astro.build/en/guides/content-collections/) — Zod schemas, glob loader
- [Next.js: Static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) — why Next is rejected
- [GitHub Pages: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) — artifact deploy pattern
- PROJECT.md + live repo audit — project-specific gaps

### Secondary (MEDIUM confidence)
- [showproof.io portfolio guides](https://showproof.io/guides/what-to-include-in-developer-portfolio/) — hiring must-haves and anti-features
- [Jekyll GitHub Actions CI](https://jekyllrb.com/docs/continuous-integration/github-actions/) — safe mode, custom builds
- Community Jekyll→Astro migration postmortems (2025–2026) — operational migration details
- DEV portfolio review articles — recruiter scan patterns, skill bar anti-pattern

---
*Research completed: 2026-07-01*  
*Ready for roadmap: yes*
