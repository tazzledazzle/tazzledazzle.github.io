<!-- GSD:project-start source:PROJECT.md -->
## Project

**Terence Schumacher — Portfolio & Blog**

A personal portfolio and technical blog for Terence Schumacher, a software engineer and technical writer. The site showcases projects, career history, and long-form writing to help recruiters and engineering peers quickly understand skills, impact, and technical depth. This is a modernization of the existing Jekyll/GitHub Pages site at tazzledazzle.github.io — not a greenfield build.

**Core Value:** A recruiter or hiring manager can land on the site and within 60 seconds understand who Terence is, what he's built, and why he's worth interviewing.

### Constraints

- **Hosting**: GitHub Pages at tazzledazzle.github.io — must remain deployable there (or document migration if stack changes)
- **Content**: Existing posts and pages must be preserved or intentionally curated — no data loss
- **Maintenance**: Favor low-overhead stack; solo maintainer
- **Timeline**: Ship polished MVP iteratively — no hard deadline but favor incremental delivery
- **Brand**: Professional, technical credibility — not flashy for its own sake
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Recommendation
## Framework Comparison: Jekyll vs Astro vs Next.js Static Export
| Criterion | Jekyll (stay/upgrade) | **Astro 7 (recommended)** | Next.js 16 `output: 'export'` |
|-----------|----------------------|----------------------------|-------------------------------|
| **Fit for portfolio+blog** | Good (legacy default) | **Excellent (purpose-built)** | Adequate but mismatched |
| **GitHub Pages deploy** | Native (`jekyll-build-pages`) | **Official `withastro/action@v6`** | Manual Actions + `out/` upload |
| **Content model** | `_posts/` + Liquid | **Content collections + MD/MDX** | MDX via contentlayer-like setup or manual |
| **JS shipped to browser** | ~0 (static HTML) | **~0 default (islands opt-in)** | React runtime on most routes |
| **Modern styling** | Sass + Minima (dated) | **Tailwind CSS 4 + components** | Tailwind works but React-centric |
| **Build speed (~50 posts)** | Fast | **Very fast (Rust compiler in v7)** | Slower; heavier toolchain |
| **Solo maintainer overhead** | Ruby + Bundler + gem pins | **Node only (already familiar)** | Node + React ecosystem weight |
| **RSS / SEO / sitemap** | `jekyll-feed`, `jekyll-seo-tag` | **`@astrojs/rss`, `@astrojs/sitemap`** | Manual or third-party |
| **Migration from current site** | None | **Moderate** (frontmatter mapping) | **High** (routing + React layouts) |
| **Future flexibility** | Low (Ruby declining for greenfield) | **High** (add React/Svelte islands if needed)** | High but irrelevant without server |
### Verdict
| Option | Verdict |
|--------|---------|
| **Astro 7** | **Choose.** Best alignment with hiring-site goals, GitHub Pages constraint, Markdown workflow, and 2025–2026 community momentum for developer portfolios. |
| **Jekyll 3.10 / github-pages gem** | **Reject for modernization.** Caps you at GitHub's pinned dependency set (Jekyll 3.10.0, Minima 2.5.1, Ruby 3.3.4). Design and DX ceiling is the actual pain point. |
| **Jekyll 4.4 via Actions** | **Reject unless migration blocked.** Possible with `ruby/setup-ruby` + `bundle exec jekyll build`, but you still inherit Liquid themes, Ruby toolchain, and a shrinking theme ecosystem for the same outcome Astro gives faster. |
| **Next.js static export** | **Reject.** Static export disables server features (Route Handlers, cookies, ISR, default image optimizer, middleware). You get a heavy React SPA/MPA hybrid hosted on a platform optimized for static HTML — the worst of both worlds for a recruiter landing page. |
## Recommended Stack
### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Astro** | **7.0.x** (`^7.0.5`) | SSG for portfolio, blog, static pages | Content-first, zero-JS default, official GitHub Pages Action, fastest path from Jekyll Markdown workflow |
| **TypeScript** | **5.9.x** | Config, content schemas, components | Type-safe content collections; catches frontmatter drift during migration |
| **Node.js** | **24.x** (LTS) | Build/runtime for CI + local dev | Default in `withastro/action@v6`; matches current Astro toolchain (Vite 8 / Rolldown) |
### Styling & UI
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Tailwind CSS** | **4.1.x** | Layout, typography, responsive design | CSS-first `@theme` config; industry standard for modern portfolio redesigns; pairs with Astro without shipping runtime CSS-in-JS |
| **@tailwindcss/vite** | **4.1.x** | Tailwind integration | Official Vite plugin; simpler than PostCSS pipeline for Astro 7 |
| **@fontsource-variable/inter** (or similar) | latest | Self-hosted webfont | No Google Fonts CDN dependency; better privacy/performance control |
### Content & Blog
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Astro Content Collections** | built-in | Blog posts, optional projects data | Replaces Jekyll `_posts/` with Zod-validated frontmatter; `getCollection('blog')` replaces `site.posts` |
| **glob loader** | built-in (Astro 7) | Load `src/content/blog/*.md` | Drop-in pattern for migrating `_posts/YYYY-MM-DD-slug.md` files |
| **MDX** (`@astrojs/mdx`) | **4.x** | Posts needing embedded components | Optional; keep most posts as `.md` |
| **expressive-code** or **Shiki** | latest | Code highlighting | Replaces Rouge; better theme control for technical posts |
### SEO, Discovery & Feeds
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **@astrojs/sitemap** | **3.7.x** | XML sitemap | Direct replacement for `jekyll-sitemap` |
| **@astrojs/rss** | **4.0.x** | RSS feed | Direct replacement for `jekyll-feed` |
| **astro-seo** or hand-rolled `<head>` | latest | Meta, OG, Twitter cards | Replaces `jekyll-seo-tag`; full control over recruiter-facing previews |
### Quality & CI
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **withastro/action** | **v6** | Build + artifact upload | Official, minimal GitHub Pages workflow |
| **actions/deploy-pages** | **v5** | Deploy to GitHub Pages | Same pattern as current Jekyll workflow |
| **@astrojs/check** | **0.9.x** | Astro + TS validation in CI | Catches broken links in content/components at build time |
| **html-validate** or **pa11y-ci** | latest | Accessibility CI gate | Addresses explicit a11y requirement; Jekyll had `html-proofer`, this is the Astro-era equivalent |
### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **GitHub Pages** | — | Hosting at `tazzledazzle.github.io` | Constraint satisfied; deploy source = GitHub Actions (not legacy Jekyll builder) |
| **npm** | **11.x** | Package management | Simplest solo-maintainer default; lockfile committed |
## Prescriptive `astro.config` Baseline
### Permalink preservation
## Installation
# Scaffold (recommended for brownfield — new directory, migrate content in)
# Core
# Integrations
# Styling
# Dev quality
### GitHub Actions (replace `jekyll-build-pages`)
## Jekyll Migration Mapping
| Jekyll (current) | Astro (target) |
|------------------|----------------|
| `_posts/2015-11-09-slug.markdown` | `src/content/blog/2015-11-09-slug.md` |
| `layout`, `title`, `date`, `categories` | Zod schema: `title`, `pubDate`, `tags`, `draft`, `description` |
| `jekyll-feed` | `src/pages/rss.xml.ts` via `@astrojs/rss` |
| `jekyll-seo-tag` | Layout `<head>` or `astro-seo` |
| `jekyll-sitemap` | `@astrojs/sitemap` |
| `jekyll-gist` | GitHub gist embed script or remove (most gists age poorly) |
| `jekyll-github-metadata` | Not needed (no runtime GitHub API at build time unless desired) |
| `minima` theme | Custom Astro layouts + Tailwind |
| `paginate: 10` | `getCollection` + slice in `/blog/[page].astro` |
| `_config.yml` navigation | `src/config/nav.ts` |
| Static pages (`About.md`, etc.) | `src/pages/about.astro` or content collection `pages` |
## Alternatives Considered
| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro 7 | **Jekyll 4.4 + Actions** | Ruby toolchain, Liquid/Minima ceiling, no meaningful DX win over Astro for a JS engineer |
| Framework | Astro 7 | **Next.js 16 static export** | React weight, static-export feature gaps, optimized for Vercel not GitHub Pages |
| Framework | Astro 7 | **Eleventy 3** | Valid SSG; smaller ecosystem for portfolio themes/components than Astro in 2025–2026 |
| Framework | Astro 7 | **Hugo** | Go templates + different content conventions; steeper migration from Jekyll Liquid |
| Framework | Astro 7 | **Gatsby 5** | Declining adoption; GraphQL data layer overkill; slow builds |
| Styling | Tailwind 4 | **CSS Modules / vanilla CSS** | Fine for small sites, but Tailwind is faster for mobile-first redesign sprint |
| Styling | Tailwind 4 | **styled-components / Emotion** | Ships runtime CSS-in-JS; hurts performance goal |
| Hosting | GitHub Pages | **Vercel / Netlify** | Unnecessary migration; GitHub Pages meets constraints at $0 |
| Content | Git Markdown | **Headless CMS (Sanity, Contentful)** | Out of scope; adds admin surface and cost |
| Content | Git Markdown | **Decap CMS / TinaCMS** | CMS admin panel explicitly out of scope |
| Interactivity | Astro islands | **Full React SPA (Vite)** | Wrong model for SEO-critical hiring landing page |
| Search | Pagefind (static) | **Algolia DocSearch** | Overkill until post count grows significantly; Pagefind is zero-ops |
| Analytics | **Plausible / Fathom** (optional) | Google Analytics | Lighter, privacy-friendlier; defer until after MVP |
## What NOT to Use
| Do Not Use | Reason |
|------------|--------|
| **Jekyll + `github-pages` gem (~228)** | Locks to Jekyll **3.10.0**, Minima **2.5.1**, whitelisted plugins — the stack you're trying to escape |
| **GitHub Pages legacy Jekyll builder** (no Actions) | Same dependency prison; no custom themes/plugins |
| **Next.js `output: 'export'`** | Heavy toolchain, React runtime, disabled server features — no payoff on GitHub Pages |
| **Create React App / Vite SPA without SSG** | Poor SEO defaults; bad for recruiter 60-second comprehension goal |
| **WordPress, Ghost Pro, Squarespace** | Violates git/Markdown workflow and zero-maintenance constraint |
| **Gatsby** | Legacy GraphQL complexity; community moving away |
| **Remix / SvelteKit / Nuxt** | Excellent frameworks, but none offer a compelling advantage over Astro for a static Markdown blog on GitHub Pages |
| **Ruby-based Jekyll 4 theme ecosystem** | Marginal themes; still Ruby dual-toolchain if day job is TypeScript |
| **Heavy UI kits (MUI, Chakra)** | React-centric, bundle-heavy; wrong fit for Astro static pages |
| **client-side theme frameworks sitewide** | Use CSS variables + minimal island for toggle only |
| **GraphQL content layer** | Unnecessary for ~50 Markdown files |
| **Comments (Disqus, giscus)** | Explicitly out of scope |
| **MongoDB, Supabase, Firebase** | No database needed for static portfolio |
| **Docker-based local dev** | Solo maintainer; `npm run dev` is sufficient |
## Version Pinning Summary
## Confidence Assessment
| Area | Level | Notes |
|------|-------|-------|
| GitHub Pages + Astro deploy | **HIGH** | [Official Astro GitHub deploy guide](https://docs.astro.build/en/guides/deploy/github/), `withastro/action@v6` |
| GitHub Pages Jekyll limits | **HIGH** | [pages.github.com/versions.json](https://pages.github.com/versions.json) — Jekyll 3.10.0, github-pages 232 |
| Next.js static export limits | **HIGH** | [Next.js static exports docs](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) — server features unsupported |
| Astro 7 as current stable | **HIGH** | npm `7.0.5`, [Astro 7.0 release blog](https://astro.build/blog/astro-7/) (2026-06-23) |
| Tailwind 4 + Astro pairing | **MEDIUM-HIGH** | Widespread 2025–2026 portfolio pattern; verified via ecosystem, not a single official "portfolio stack" doc |
| Jekyll→Astro migration effort | **MEDIUM** | ~55 posts, mixed frontmatter, permalink preservation needs phase-specific planning |
## Sources
- [GitHub Pages dependency versions](https://pages.github.com/versions/) — Jekyll 3.10.0, Ruby 3.3.4, Minima 2.5.1 (verified 2025-08-13)
- [GitHub Docs: About GitHub Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) — GitHub Actions now recommended over legacy builder
- [Jekyll: GitHub Actions CI](https://jekyllrb.com/docs/continuous-integration/github-actions/) — Jekyll 4.x path if staying on Ruby
- [Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/) — `withastro/action@v6`, `site` config
- [Astro 7.0 release](https://astro.build/blog/astro-7/) — Rust compiler, Vite 8, build performance
- [Astro: Content collections](https://docs.astro.build/en/guides/content-collections/) — `getCollection`, Zod schemas, glob loader
- [Next.js: Static exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) — `output: 'export'`, unsupported server features
- npm registry — `astro@7.0.5`, `next@16.2.10` (queried 2026-07-01)
- Project context: `.planning/PROJECT.md`, `Gemfile`, `_config.yml`, `.github/workflows/jekyll-gh-pages.yml`
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
