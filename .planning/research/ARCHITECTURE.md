# Architecture Patterns

**Domain:** Personal portfolio + technical blog (static site)
**Project:** Terence Schumacher — tazzledazzle.github.io
**Researched:** 2026-07-01
**Overall confidence:** HIGH (current site audited; patterns verified against official Astro, Jekyll, and GitHub Pages docs)

## Recommended Architecture

Modern portfolio+blog static sites converge on a **four-layer separation**: content, presentation, build, and deploy. Content is Markdown + structured data; presentation is composable layouts/components; build is a static site generator (SSG); deploy is CI → artifact → GitHub Pages.

For this brownfield Jekyll site, the recommended path is **incremental modernization inside Jekyll first**, then an **optional stack migration to Astro** once content is data-driven and URLs are stable. That order minimizes risk: you ship hiring-impact UX before rewriting the build toolchain.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CONTENT LAYER                            │
│  Markdown posts │ YAML/JSON data │ frontmatter metadata         │
│  (_posts/ or src/content/blog/)                                 │
│  projects, career, navigation (_data/ or src/data/)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                     PRESENTATION LAYER                          │
│  Layouts (shell) → Page templates → Components (cards, nav)     │
│  Design tokens + global CSS                                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                        BUILD LAYER                              │
│  SSG (Jekyll today / Astro later) → static HTML in _site/ dist/ │
│  Plugins: RSS, SEO, syntax highlight, redirects                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                       DEPLOY LAYER                              │
│  GitHub Actions: build job → upload-pages-artifact → deploy     │
│  Source repo = Markdown only; no generated files in git         │
└─────────────────────────────────────────────────────────────────┘
```

### Target Component Map (Post-Modernization)

Regardless of SSG, the site should decompose into these bounded components:

| Component | Responsibility | Current State | Target State |
|-----------|---------------|---------------|--------------|
| **SiteShell** | `<html>`, meta, OG, RSS link, skip-nav | `_layouts/base.html` + `_includes/head.html` | Single base layout; no inline scripts in header |
| **SiteHeader** | Logo, primary nav, mobile menu | `_includes/header.html` (inline JS) | Component with extracted JS module or minimal vanilla |
| **SiteFooter** | Copyright, social links | `_includes/footer.html` | Component; social from data file |
| **HomeHero** | 60-second hiring pitch | `index.markdown` prose | Structured hero + CTA blocks from data |
| **ProjectCard** | Title, summary, tech stack, GitHub/demo links | Inline markdown in `projects.md` | Rendered from `_data/projects.yml` or `projects` collection |
| **PostCard** | Title, date, excerpt, tags | Liquid loop in `_layouts/home.html` | Reusable include/component |
| **PostArticle** | Full post layout, reading typography | `_layouts/post.html` | Dedicated post layout; fix hardcoded CSS path |
| **BlogIndex** | Paginated/filterable post list | `_layouts/posts.html` + `blog.md` | Tag filter + curated "featured" section |
| **CareerTimeline** | Experience, education, skills | Inline markdown in `career.md` | `_data/career.yml` rendered by include |
| **SEOHead** | Title, description, canonical, structured data | `jekyll-seo-tag` plugin | Keep plugin (Jekyll) or `@astrojs/sitemap` + manual meta (Astro) |
| **FeedGenerator** | RSS/Atom | `jekyll-feed` plugin | Keep (Jekyll) or `feed.xml.ts` route (Astro) |

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Content collections | Own Markdown bodies + frontmatter schemas | Build layer via glob loader / Jekyll collections |
| Data files | Structured, non-page content (nav, projects, career) | Presentation via `site.data.*` or `getCollection()` |
| Layouts | Page shells, slot for body content | Includes/components, global CSS |
| Pages/routes | URL → template mapping | Content queries, layouts |
| Static assets | Images, fonts, favicon | Copied verbatim to output (`assets/`, `public/`) |
| CI workflow | Build + deploy only | Reads repo; writes artifact; never commits `_site/` |

### Data Flow

**Build-time (static generation):**

1. SSG reads `_config.yml` / `astro.config` + data files → global `site` context
2. Content files (posts, pages) parsed; frontmatter validated
3. Each page assigned a layout chain (e.g., `post` → `base`)
4. Liquid/Astro renders components with content + data
5. Sass/CSS compiled; assets copied
6. Output: `_site/` (Jekyll) or `dist/` (Astro) — pure static HTML/CSS/JS

**Runtime (browser):**

- Zero server logic. Optional minimal client JS for mobile nav, search, or theme toggle.
- All blog/project/career content is pre-rendered HTML.

**Deploy flow (already correct on this repo):**

```
push to main → checkout → jekyll-build-pages → _site/
            → upload-pages-artifact → deploy-pages → tazzledazzle.github.io
```

Source: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [upload-pages-artifact](https://github.com/actions/upload-pages-artifact). Confidence: HIGH.

---

## Current Site Architecture (Brownfield Baseline)

Audited from the live repo structure:

| Path | Role |
|------|------|
| `_posts/` (52 files) | Blog content; mixed `.md`/`.markdown`; some use `layout: page` not `post` |
| `about.markdown`, `career.md`, `projects.md`, `blog.md`, `index.markdown` | Top-level pages with frontmatter |
| `_layouts/` | `base`, `home`, `page`, `post`, `posts` — custom overrides atop Minima |
| `_includes/` | `head`, `header`, `footer`, social icons |
| `_sass/` | Theme overrides (`custom.scss`, layout, syntax) |
| `assets/` | CSS entry (`main.scss`), legacy jQuery/skel JS, Font Awesome |
| `_config.yml` | Site config, navigation, Minima skin, plugins, permalink pattern |
| `.github/workflows/jekyll-gh-pages.yml` | Artifact-based Pages deploy (modern pattern) |

**Key architectural debt:**

- **Content-in-markup**: Projects and career are long inline Markdown pages, not data-driven — blocks card-based redesign and reuse.
- **No `_data/` directory**: Navigation lives in `_config.yml`; no separation of structured hiring content.
- **Theme coupling**: Minima + custom overrides + legacy HTML5UP assets create layered CSS/JS debt.
- **URL fragility**: Permalink `/:year/:month/:day/:title/` must be preserved or redirected during any migration.
- **Post schema inconsistency**: Mixed layouts, extensions, and filenames with spaces (e.g., `Design Document for...`).

---

## Modern Structure Patterns

### Pattern A — Jekyll In-Place Modernization (Recommended First)

Stay on GitHub Pages + Jekyll; restructure content before considering a stack change. Lowest risk for a solo maintainer with 52 posts and working CI.

```
tazzledazzle.github.io/
├── _data/
│   ├── navigation.yml      # Primary nav (fix Blog URL typo)
│   ├── site.yml            # Author, social, SEO defaults
│   ├── projects.yml        # Project cards (title, url, repo, stack, featured)
│   └── career.yml          # Jobs, education, skills
├── _posts/                 # Keep; add draft: true for archived posts
├── _drafts/                # Posts removed from build but preserved in git
├── _includes/
│   ├── project-card.html
│   ├── post-card.html
│   ├── career-timeline.html
│   ├── header.html
│   └── footer.html
├── _layouts/
│   ├── base.html
│   ├── home.html
│   ├── page.html
│   ├── post.html
│   └── blog.html           # Renamed from posts.html for clarity
├── _sass/
│   ├── _tokens.scss        # Colors, spacing, typography scale
│   ├── _components.scss    # Cards, nav, buttons
│   └── main.scss
├── assets/
│   ├── css/main.scss
│   └── js/nav.js           # Extract from header inline script
├── about.md, career.md, projects.md, blog.md, index.md
├── _config.yml
└── .github/workflows/jekyll-gh-pages.yml
```

**Why this first:** PROJECT.md lists stack as "open to recommendations." Restructuring content into `_data/` is valuable whether you stay on Jekyll or migrate — it is not throwaway work.

### Pattern B — Astro Migration (Recommended If Stack Changes)

Astro is the best-documented Jekyll migration target for content-heavy static sites. Official migration guide confirms Markdown + frontmatter carry over; Liquid → `.astro` components. Confidence: HIGH — [Astro Jekyll migration guide](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/).

```
src/
├── content/
│   ├── blog/               # Migrated from _posts/
│   └── pages/              # Optional: long-form About content
├── data/
│   ├── projects.json       # Or .ts for type safety
│   ├── career.json
│   └── navigation.ts
├── components/
│   ├── SiteHeader.astro
│   ├── ProjectCard.astro
│   ├── PostCard.astro
│   └── CareerTimeline.astro
├── layouts/
│   ├── BaseLayout.astro
│   ├── PostLayout.astro
│   └── PageLayout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── career.astro
│   ├── projects.astro
│   ├── blog/
│   │   ├── index.astro     # Post list + tag filter
│   │   └── [...slug].astro # Or [year]/[month]/[day]/[slug] for URL parity
│   └── feed.xml.ts         # RSS
├── styles/
│   └── global.css          # Design tokens
├── content.config.ts       # Zod schemas for blog + projects
public/
├── images/
└── favicon.svg
astro.config.mjs            # site: 'https://tazzledazzle.github.io', output: 'static'
```

**Content collections** (Astro 5.x): Define schemas in `src/content.config.ts` with `defineCollection` + Zod. Blog posts get `draft`, `tags`, `pubDate`; projects get `title`, `repoUrl`, `demoUrl`, `tech`, `featured`. Query via `getCollection('blog')`. Confidence: HIGH — [Astro content collections](https://docs.astro.build/en/guides/content-collections/).

**Deploy change:** Replace `actions/jekyll-build-pages` with `npm ci && npm run build`; upload `dist/` instead of `_site/`. Workflow shape stays identical (build → artifact → deploy).

### Pattern C — Eleventy (Alternative Migration)

Closer mental model to Jekyll (folder-based, no framework runtime). Good if you want to avoid JSX-like `.astro` syntax. Less ecosystem momentum for portfolio+blog than Astro in 2026. Confidence: MEDIUM — viable but not the default recommendation for this project.

---

## Brownfield Build Order

Recommended phase sequence for this repo. Each phase produces a deployable site.

### Phase 1 — Foundation & Data Extraction
**Goal:** Stable shell + structured hiring content without visual overhaul.

1. Fix `_config.yml` navigation (Blog URL typo: `url '/Blog'` → `url: '/blog/'`)
2. Create `_data/navigation.yml`, `_data/projects.yml`, `_data/career.yml`
3. Extract project entries from `projects.md` → `_data/projects.yml`
4. Extract career timeline from `career.md` → `_data/career.yml`
5. Add `_includes/project-card.html`, `career-timeline.html`; slim down page files to loops
6. Normalize page permalinks to lowercase (`/about/`, `/projects/`, `/career/`, `/blog/`)

**Validation:** `bundle exec jekyll build` succeeds; all nav links resolve; project/career content unchanged semantically.

### Phase 2 — Layout Shell & Design Tokens
**Goal:** Mobile-first base layout decoupled from Minima internals.

1. Audit Minima overrides — decide: fork skin vs. replace `_sass` entirely
2. Introduce `_sass/_tokens.scss` (spacing, type scale, colors)
3. Refactor `base.html` → semantic HTML (`<main>`, landmarks, skip link)
4. Extract header inline JS → `assets/js/nav.js`
5. Remove dead legacy assets (jquery/skel if unused)

**Validation:** Lighthouse a11y baseline; no layout regressions on all 5 page types.

### Phase 3 — Hiring Pages (Core Value)
**Goal:** 60-second recruiter comprehension.

1. Redesign `index` with hero: name, role, 2-line pitch, CTA to Projects + Career
2. Projects page: card grid from `_data/projects.yml` with GitHub + demo links
3. Career page: scannable timeline from `_data/career.yml`
4. About page: tighten copy; link to Projects/Career/Blog

**Validation:** Stakeholder review — can a recruiter grok value in <60s from homepage?

### Phase 4 — Blog Curation & Discovery
**Goal:** Signal over noise; preserve URLs.

1. Audit 52 posts — tag `draft: true` or move to `_drafts/` for archive candidates
2. Standardize post frontmatter (`layout: post`, `description`, `tags`)
3. Blog index: pagination, tag badges, "featured" section for best posts
4. Verify `jekyll-feed` and `jekyll-seo-tag` still output correctly
5. Add redirects for any renamed slugs via `jekyll-redirect-from` (already in github-pages gem set)

**Validation:** RSS valid; no 404s on existing permalinks; curated index shows ~15–25 keeper posts.

### Phase 5 — Performance, SEO, Accessibility
**Goal:** Production polish.

1. Image optimization (WebP, dimensions, lazy load)
2. Structured data (Person, BlogPosting JSON-LD)
3. `html-proofer` in CI (already in Gemfile)
4. axe/Lighthouse pass on key templates

### Phase 6 — Optional Stack Migration (Astro)
**Only after Phases 1–5.** Content is already data-driven; migration is mechanical.

1. Scaffold Astro with `output: 'static'`
2. Migration script: `_posts/` → `src/content/blog/`; map frontmatter keys
3. Port `_data/*.yml` → `src/data/*.json`
4. Rebuild layouts as `.astro` components
5. Implement URL parity (`/:year/:month/:day/:title/`) via dynamic route or `public/_redirects`
6. Swap CI build step; keep artifact deploy pattern
7. Run link checker against old `_site` URL map

**Build order rationale:** Data extraction before design prevents rework. Hiring pages before blog curation matches PROJECT.md core value (recruiters first). Stack migration last avoids rewriting 52 posts twice.

---

## Patterns to Follow

### Pattern 1: Content/Data Separation
**What:** Structured hiring content (projects, jobs, nav) lives in YAML/JSON; page files are thin templates that iterate data.
**When:** Any time content appears in more than one place or needs card rendering.
**Example (Jekyll):**
```yaml
# _data/projects.yml
- title: Native macOS Log Analyzer
  slug: native-macos-log-analyzer
  repo: https://github.com/tazzledazzle/native-macos-log-analyzer
  demo: null
  tech: [Swift, AppKit, Core Data]
  featured: true
  summary: Real-time log monitoring with custom filters and export.
```
```liquid
{% for project in site.data.projects %}
  {% if project.featured %}
    {% include project-card.html project=project %}
  {% endif %}
{% endfor %}
```

### Pattern 2: Layout Inheritance Chain
**What:** Every page flows through a single shell layout for consistent nav, footer, meta.
**When:** Always. Current site already does `post → base`, `home → base`.
**Chain:** `content → page layout → base layout`

### Pattern 3: Artifact-Only Deploy
**What:** Generated HTML never committed; CI builds and uploads artifact.
**When:** All GitHub Pages deploys (already implemented in this repo).
**Do not regress** to `gh-pages` branch pushes.

### Pattern 4: URL Preservation Table
**What:** Maintain a CSV/map of old URL → new URL before any permalink change.
**When:** Blog migration, filename normalization, stack change.
**Current permalink:** `/:year/:month/:day/:title/` — 52 posts depend on this.

### Pattern 5: Draft-Based Curation (Not Deletion)
**What:** Archive low-signal posts with `published: false` or `draft: true`; keep files in git.
**When:** Blog curation per PROJECT.md — avoids data loss, enables reversal.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Big-Bang Stack Rewrite Before Content Restructure
**What:** Migrating Jekyll → Astro while projects/career are still inline Markdown.
**Why bad:** Rewriting layouts AND extracting content simultaneously doubles failure surface.
**Instead:** Phase 1 data extraction on Jekyll; migrate stack only when schemas are stable.

### Anti-Pattern 2: Committing Build Output
**What:** Checking in `_site/` or `dist/` to `main`.
**Why bad:** Merge conflicts, stale deploys, repo bloat.
**Instead:** Keep artifact deploy (current workflow is correct).

### Anti-Pattern 3: Inline Scripts in Layout Partials
**What:** 60+ lines of JS in `_includes/header.html` (current state).
**Why bad:** No caching, hard to test, blocks CSP hardening.
**Instead:** Extract to `assets/js/nav.js`; defer load.

### Anti-Pattern 4: Theme Override Sprawl
**What:** Stacking Minima overrides + legacy HTML5UP CSS + Font Awesome + custom SCSS.
**Why bad:** Specificity wars, large CSS bundle, unpredictable mobile breakage.
**Instead:** Pick one design system; delete unused CSS/JS per phase.

### Anti-Pattern 5: Permalink Changes Without Redirects
**What:** Switching to `/blog/:slug` without mapping old dated URLs.
**Why bad:** Broken inbound links, lost SEO on 10 years of posts.
**Instead:** Keep dated URLs or add `jekyll-redirect-from` / Astro `redirects` config.

### Anti-Pattern 6: Over-Componentizing in Jekyll
**What:** Creating 30 Liquid includes for a 5-page site.
**Why bad:** Solo maintainer overhead; Jekyll lacks real component isolation.
**Instead:** 5–8 focused includes (card, timeline, header, footer, seo). Move to Astro components only if migrating.

---

## Scalability Considerations

| Concern | At current scale (~52 posts, 5 pages) | At 200 posts | At high traffic |
|---------|--------------------------------------|--------------|-----------------|
| Build time | <30s Jekyll | Consider pagination + tag indexes | N/A (static) |
| Content model | `_data/` YAML sufficient | Add `tags` collection, series frontmatter | — |
| Search | Browser find + tag filter | Pagefind or Algolia static index | CDN cache |
| Images | Manual in `images/` | `assets/` pipeline or Astro Image | CDN (Cloudflare optional) |
| Deploy | Single workflow | Same | GitHub Pages + optional Cloudflare |
| Maintainer burden | 1 person | Content collections + schema validation | Automated link checking in CI |

This site will not hit scale problems. Optimize for **maintainer time** and **hiring clarity**, not distributed systems.

---

## Stack Decision Matrix (Architecture Impact)

| Path | Migration Effort | DX | URL Parity | GitHub Pages Fit | Recommendation |
|------|-----------------|-----|------------|------------------|----------------|
| Jekyll in-place | Low | Familiar (current) | Native | Native | **Phase 1–5 default** |
| Astro | Medium | Best (TS, content collections) | Requires route config | Excellent (static `dist/`) | **If stack changes** |
| Eleventy | Medium | Good (simpler than Astro) | Configurable | Excellent | Fallback option |
| Next.js | High | Overkill for static blog | Needs adapter | Possible but heavy | **Avoid** |

---

## Migration Mapping Reference (Jekyll → Astro)

For Phase 6 planning — not immediate work:

| Jekyll | Astro |
|--------|-------|
| `_posts/*.md` | `src/content/blog/*.md` |
| `_layouts/*.html` | `src/layouts/*.astro` |
| `_includes/*.html` | `src/components/*.astro` |
| `_data/*.yml` | `src/data/*` or content collection |
| `_config.yml` | `astro.config.mjs` + `src/content.config.ts` |
| `permalink: /:year/:month/:day/:title/` | `src/pages/blog/[...slug].astro` + slug mapping |
| `jekyll-feed` | `src/pages/feed.xml.ts` |
| `jekyll-seo-tag` | `@astrojs/sitemap` + manual meta in BaseLayout |
| `site.posts` Liquid | `getCollection('blog')` |
| `bundle exec jekyll serve` | `npm run dev` |
| `_site/` | `dist/` |

Source: [Astro Jekyll migration](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/), community migration writeups (Zein Sleiman, Pat Hermens — MEDIUM confidence for operational details).

---

## Phase-Specific Architecture Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Data extraction | Inconsistent project schema | Define YAML schema upfront; one card template |
| Blog curation | Accidental 404s | `draft:` flag, not delete; link checker |
| Design overhaul | Minima upgrade breaks overrides | Pin theme version; visual regression on 3 templates |
| Stack migration | Permalink breakage | URL map + redirects before cutover |
| CI swap | Wrong artifact path | `path: dist` in upload-pages-artifact |
| Post filenames | Spaces/special chars in slugs | Migration script normalizes; redirect old URLs |

---

## Sources

| Source | Confidence | Used For |
|--------|------------|----------|
| [Astro: Migrating from Jekyll](https://docs.astro.build/en/guides/migrate-to-astro/from-jekyll/) | HIGH | Migration mapping, content parity |
| [Astro: Content Collections](https://docs.astro.build/en/guides/content-collections/) | HIGH | Target content architecture |
| [GitHub Pages: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) | HIGH | Deploy layer pattern |
| [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) | HIGH | Artifact requirements |
| [IT-Journey: Jekyll theme architecture](https://it-journey.dev/quickstart/theme-architecture/) | MEDIUM | Layout inheritance, `_data/` patterns |
| [McGarrah: Merging Jekyll sites](https://mcgarrah.org/merging-two-jekyll-websites-architectural-analysis/) | MEDIUM | Collection vs subdirectory strategies |
| Repo audit: `tazzledazzle.github.io` file structure | HIGH | Current-state baseline |
| Community Jekyll→Astro postmortems (2025–2026) | MEDIUM | Build order, migration scripts |
