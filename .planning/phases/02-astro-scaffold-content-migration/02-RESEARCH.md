# Phase 2: Astro Scaffold & Content Migration - Research

**Researched:** 2026-07-02  
**Domain:** Astro 7 static-site migration on GitHub Pages with permalink-preserving blog migration  
**Confidence:** HIGH

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-21:** **Big-bang cutover** — replace Jekyll GitHub Actions workflow on merge to main; single deploy switches stack
- **D-22:** Ship **all pages + blog** in one cutover (not blog-only deferral)
- **D-23:** Pre-merge verification: **spot-check 10 legacy permalinks** + RSS + sitemap
- **D-24:** Rollback plan: **git revert** to last Jekyll commit if production breaks
- **D-25:** Blog posts use **exact Jekyll format** `/:year/:month/:day/:title/` with trailing slash behavior matching inventory
- **D-26:** Slug/permalink resolution uses **`blog-inventory.yml` as source of truth** (not re-derived from filename)
- **D-27:** Static pages use Phase 1 nav paths: **`/about/`**, **`/work/`**, **`/career/`**, **`/blog/`**
- **D-28:** Redirect mechanism: **HTML meta-refresh pages in `public/`** (GitHub Pages compatible — no server 301s)
- **D-29:** **`/projects/` → `/work/`** redirect per D-05
- **D-30:** **2015 design-doc duplicate URLs** meta-redirect to 2024 canonical slugs per `blog-inventory.yml` `canonical_slug`
- **D-31:** **Mixed-case legacy nav** (`/About`, `/Projects`, `/Career`, `/Blog`) redirect to lowercase canonical paths
- **D-32:** RSS includes **only non-archived** posts (featured + standard tiers)
- **D-33:** XML sitemap **excludes archived** posts; archived posts still build with `noindex` (enforced in Phase 4 layout, stub in Phase 2 if needed)
- **D-34:** After Astro deploy passes: **remove** Gemfile, `_config.yml`, Jekyll layouts/themes from active site
- **D-35:** Migrate `_posts/` → `src/content/blog/`, then **remove `_posts/`**
- **D-36:** Copy `_data/` → `src/data/` per `docs/ASTRO-DATA-MAPPING.md`, **remove `_data/`** after verification
- **D-37:** **Keep `rake data:validate`** in repo through Phase 3+ (do not port-only to Zod yet)
- **D-38:** **Tailwind 4 minimal shell** — dark background, typography tokens; not full design system (Phase 5)
- **D-39:** **Basic hiring pages now** — simple hero + project list from data (not full Phase 3 polish, but more than placeholders)
- **D-40:** **Readable minimal blog** — post index + post page with syntax highlighting; not Minima parity
- D-05 `/work/` canonical projects URL
- D-16 archived posts: URLs preserved, excluded from RSS/sitemap
- D-17 duplicate consolidation via inventory `canonical_slug`
- D-18/D-19 lowercase nav paths

### Claude's Discretion
- Exact Astro version pin within 7.x line
- Shiki vs expressive-code for syntax highlighting
- Frontmatter field mapping (`date` → `pubDate`, `layout` → drop, `categories` → `tags`)
- Which 10 permalinks to spot-check (mix of featured, standard, archived, and duplicate pairs)

### Deferred Ideas (OUT OF SCOPE)
- Full design system and responsive polish — Phase 5
- Blog tag pages, year archive, prev/next — Phase 4
- Deep case study hiring pages — Phase 3 scope expansion intentionally limited to "basic"
- Dual Jekyll/Astro CI — user rejected temporary dual build

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PLAT-01 | Site builds and deploys to GitHub Pages via GitHub Actions (Astro static output) | Official `withastro/action@v6` workflow + `actions/deploy-pages@v5` configuration and `site`/`base` guidance |
| PLAT-02 | All existing blog posts are migrated with preserved permalink structure | `blog-inventory.yml` permalink-driven route generation pattern and migration workflow for 51 posts |
| PLAT-03 | RSS feed is generated and excludes archived posts | `@astrojs/rss` with filtered collection items by tier (`featured`/`standard`) |
| PLAT-04 | XML sitemap is generated and excludes archived posts | `@astrojs/sitemap` integration with `filter()` to exclude archived permalinks |
| PLAT-05 | Redirects exist for changed/consolidated legacy URLs | Static HTML redirect pages in `public/` with meta refresh + canonical + fallback link |

## Project Constraints (from .cursor/rules/)

- No `.cursor/rules/` directory found in this repository, so no additional project-specific directives were discovered there.

## Summary

Phase 2 should be planned as a **single cutover migration** that swaps Jekyll Pages workflows to Astro’s official GitHub Pages action, migrates content/data in one pass, and preserves legacy URLs using inventory-driven routing plus static redirect pages. This aligns directly with locked decisions D-21 through D-40 and PLAT-01..05. [VERIFIED: project files]

Astro’s current docs support this deployment model natively (`withastro/action@v6`, `actions/deploy-pages@v5`, static output) and explicitly note `base` is unnecessary for `username.github.io` repos. That fits `tazzledazzle.github.io` exactly and reduces routing risk during cutover. [CITED: https://docs.astro.build/en/guides/deploy/github/] [VERIFIED: npm registry]

The key planning risk is not framework setup, but **URL integrity and migration correctness**: preserving 51 inventory permalinks, excluding archived items from RSS/sitemap, and implementing GitHub Pages-compatible redirect stubs for changed/canonicalized URLs. GitHub Pages does not offer custom server redirect config (`.htaccess`/`.conf`), so static HTML redirects are the correct hosting-compatible mechanism for this phase. [CITED: https://docs.github.com/en/enterprise/2.14/user/articles/redirects-on-github-pages] [VERIFIED: project files]

**Primary recommendation:** Plan Phase 2 around an inventory-driven route/redirect build pipeline first, then layer minimal Tailwind shell and hiring pages on top.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| GitHub Pages deployment pipeline | CDN/Static | API/Backend (GitHub Actions runtime) | Build/deploy is CI-driven static artifact publication |
| Blog permalink parity | Frontend Server (SSG build layer) | CDN/Static | URL paths are generated at build-time from content metadata |
| Legacy URL redirects | CDN/Static | Frontend Server (generation script) | Redirects are static HTML files served directly by Pages |
| Blog content migration + schema validation | Frontend Server (SSG build layer) | Database/Storage (filesystem content store) | Astro collections validate and compile local Markdown/YAML |
| RSS generation | Frontend Server (SSG build layer) | CDN/Static | Feed XML is generated by Astro endpoint at build |
| Sitemap generation | Frontend Server (SSG build layer) | CDN/Static | Integration builds XML from prerendered routes |
| Minimal Tailwind shell | Browser/Client | Frontend Server (static CSS generation) | Styling ships as static CSS with no runtime framework requirement |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `7.0.5` | Static site framework + content collections | Official deploy path for GitHub Pages; first-class Markdown/content workflow [CITED: https://docs.astro.build/en/guides/deploy/github/] [VERIFIED: npm registry] |
| `@astrojs/rss` | `4.0.19` | RSS feed generation endpoint helper | Official Astro RSS package with collection-based item mapping [CITED: https://docs.astro.build/en/guides/rss/] [VERIFIED: npm registry] |
| `@astrojs/sitemap` | `3.7.3` | Sitemap index/page XML generation | Official integration with URL filtering controls [CITED: https://docs.astro.build/en/guides/integrations-guide/sitemap/] [VERIFIED: npm registry] |
| `tailwindcss` | `4.3.2` | Minimal shell styling | Tailwind 4 is Astro’s preferred path via Vite plugin [CITED: https://docs.astro.build/en/guides/styling/#tailwind] [VERIFIED: npm registry] |
| `@tailwindcss/vite` | `4.3.2` | Tailwind 4 Vite integration | Explicitly recommended for Tailwind 4 in Astro docs [CITED: https://docs.astro.build/en/guides/styling/#tailwind] [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/mdx` | `7.0.1` | MDX support for posts needing component embeds | Install now for compatibility; use only when Markdown is insufficient [VERIFIED: npm registry] [ASSUMED] |
| `@astrojs/check` | `0.9.9` | Astro/TS validation in CI | Use in pre-merge gate with permalink checks [VERIFIED: npm registry] [ASSUMED] |
| `typescript` | `6.0.3` | Typed content/config safety | Use strict mode for collection schema and route tooling [VERIFIED: npm registry] [ASSUMED] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static HTML redirect files | `jekyll-redirect-from` | Jekyll-specific and incompatible with Astro cutover target |
| Tailwind 4 via Vite plugin | Legacy `@astrojs/tailwind` | Deprecated for Tailwind 4 use cases [CITED: https://docs.astro.build/en/guides/integrations-guide/tailwind/] |
| Inventory-driven permalink mapping | Filename-derived slugs | Violates D-26 and risks permalink drift from canonical source |

**Installation:**
```bash
npm install astro @astrojs/rss @astrojs/sitemap tailwindcss @tailwindcss/vite @astrojs/mdx
npm install -D @astrojs/check typescript
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| astro | npm | since 2021-03-13 | 3,549,234/week | github.com/withastro/astro | OK | Approved |
| @astrojs/mdx | npm | since 2022-06-30 | 1,143,297/week | github.com/withastro/astro | OK | Approved |
| @astrojs/sitemap | npm | since 2022-03-18 | 1,621,478/week | github.com/withastro/astro | OK | Approved |
| @astrojs/rss | npm | since 2022-05-04 | 467,522/week | github.com/withastro/astro | OK | Approved |
| tailwindcss | npm | since 2017-10-06 | 118,246,761/week | github.com/tailwindlabs/tailwindcss | OK | Approved |
| @tailwindcss/vite | npm | since 2024-02-02 | 36,941,459/week | github.com/tailwindlabs/tailwindcss | OK | Approved |
| @astrojs/check | npm | since 2023-07-31 | 1,478,765/week | github.com/withastro/astro | OK | Approved |
| typescript | npm | since 2012-10-01 | 217,486,890/week | github.com/microsoft/TypeScript | OK | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none

Postinstall risk scan (`npm view <pkg> scripts.postinstall`) returned empty for all recommended packages. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram

```text
_posts/*.md|.markdown + _data/*.yml
            |
            v
  Migration scripts (copy + frontmatter normalize + inventory map)
            |
            v
src/content/blog/*.md      src/data/*.yml
            |                   |
            +--------+----------+
                     v
       src/content.config.ts (glob/file loaders + Zod)
                     |
         +-----------+------------------+
         |                              |
         v                              v
 Dynamic blog routes            RSS + Sitemap generation
 ([...slug] + getStaticPaths)   (filtered by tier)
         |                              |
         +----------+-------------------+
                    v
          dist/ static artifact + public/redirect pages
                    |
                    v
             GitHub Actions -> Pages deploy
```

### Recommended Project Structure

```text
src/
├── content/
│   └── blog/                 # migrated 51 posts
├── data/
│   ├── blog-inventory.yml    # permalink + tier source of truth
│   ├── navigation.yml
│   ├── social.yml
│   ├── career.yml
│   └── projects/
├── pages/
│   ├── blog/
│   │   ├── index.astro
│   │   └── [...slug].astro   # inventory-driven routing
│   ├── rss.xml.js
│   └── ...
├── layouts/
└── styles/
public/
└── redirects/...             # meta-refresh redirect stubs
```

### Pattern 1: Inventory-Driven Route Generation
**What:** Generate `getStaticPaths()` from `blog-inventory.yml` permalink records, not filename parsing. [VERIFIED: project files]  
**When to use:** Any route where legacy URL parity is required (PLAT-02).  
**Example:**
```typescript
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => {
    const segs = post.data.permalink.replace(/^\/|\/$/g, '').split('/');
    return { params: { slug: segs } };
  });
}
```

### Pattern 2: Tier-Based Feed/Index Filtering
**What:** Filter feed/sitemap/index by `tier !== 'archived'`. [VERIFIED: project files]  
**When to use:** PLAT-03/PLAT-04 and D-16/D-32/D-33 enforcement.  
**Example:**
```typescript
// Source: https://docs.astro.build/en/guides/rss/
const eligible = posts.filter((p) => p.data.tier === 'featured' || p.data.tier === 'standard');
```

### Pattern 3: Static Redirect Stubs
**What:** Generate HTML files in `public/` with meta refresh, canonical, and fallback anchor.  
**When to use:** Any legacy URL that must redirect on GitHub Pages (PLAT-05).  
**Example:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/work/" />
    <link rel="canonical" href="/work/" />
    <title>Redirecting...</title>
  </head>
  <body>
    <p>Moved to <a href="/work/">/work/</a>.</p>
  </body>
</html>
```

### Anti-Patterns to Avoid
- **Filename-as-slug truth:** breaks D-26 and risks mismatch with explicit inventory permalinks.
- **Redirect-only in client JS:** less robust than HTML-level meta refresh for static hosts.
- **Including archived posts in feeds/sitemap:** violates PLAT-03/04 and D-32/33.
- **Using `@astrojs/tailwind` for Tailwind 4:** deprecated path per Astro docs.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS XML generation | Manual XML string builder | `@astrojs/rss` | Handles feed shape and endpoint ergonomics safely |
| Sitemap generation | Custom crawler script | `@astrojs/sitemap` | Includes static + `getStaticPaths()` routes with filters |
| Content typing/validation | Ad-hoc frontmatter parser | Astro collections + Zod schema | Build-time validation and typed query APIs |
| Tailwind integration wiring | Manual Vite plumbing from scratch | `astro add tailwind` / `@tailwindcss/vite` | Official path, lower config drift |

**Key insight:** Phase 2 success depends on deterministic URL/data behavior, and official Astro integrations eliminate high-risk boilerplate.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None in external DB/datastore; content state is repo files (`_posts`, `_data`, inventory manifest). | Code edit only (filesystem migration). |
| Live service config | GitHub Pages settings + Actions workflow source are live config outside code. | Manual check: Pages source remains GitHub Actions after workflow swap. |
| OS-registered state | None identified for this phase (no systemd/launchd/pm2/task scheduler coupling). | None. |
| Secrets/env vars | No required runtime secrets for static Astro build surfaced in scope. | None; document if future feed/content integrations need env vars. |
| Build artifacts | Existing Jekyll `_site` style output and Ruby bundle artifacts may remain locally. | Clean/build verification in CI; no data migration needed. |

## Common Pitfalls

### Pitfall 1: Wrong `base` configuration for user site
**What goes wrong:** Asset and links break if `base` is set when repo is `username.github.io`.  
**Why it happens:** Copying project-site examples blindly.  
**How to avoid:** Set `site` and skip `base` for `tazzledazzle.github.io`.  
**Warning signs:** CSS/JS 404s only on deployed Pages URL.

### Pitfall 2: Trailing slash mismatch between routes and RSS
**What goes wrong:** Feed links differ from site canonical links.  
**Why it happens:** `@astrojs/rss` trailing slash defaults differ unless configured.  
**How to avoid:** Align `trailingSlash` in RSS helper to site behavior. [CITED: https://docs.astro.build/en/guides/rss/]  
**Warning signs:** Duplicate URL variants in crawlers/feed readers.

### Pitfall 3: Non-deterministic content ordering
**What goes wrong:** Blog index/feed order shifts unexpectedly across builds.  
**Why it happens:** `getCollection()` order is non-deterministic/platform-dependent.  
**How to avoid:** Always sort by `pubDate` or inventory order. [CITED: https://docs.astro.build/en/guides/content-collections/]  
**Warning signs:** Different ordering between local and CI builds.

### Pitfall 4: Redirect gaps for case/legacy paths
**What goes wrong:** 404s for mixed-case nav and old project routes.  
**Why it happens:** Static hosts do not auto-normalize all legacy paths.  
**How to avoid:** Explicit redirect page generation for each required alias in inventory + nav.  
**Warning signs:** Spot-check failures on `/About`, `/Projects`, duplicate 2015 design-doc URLs.

## Code Examples

### PLAT-01 GitHub Pages Workflow
```yaml
# Source: https://docs.astro.build/en/guides/deploy/github/
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: withastro/action@v6
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v5
```

### PLAT-03 RSS Filtering by Tier
```typescript
// Source: https://docs.astro.build/en/guides/rss/
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => data.tier !== 'archived');
  return rss({
    title: 'Terence Schumacher Blog',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: post.data.permalink,
    })),
  });
}
```

### PLAT-04 Sitemap Exclusion Filter
```typescript
// Source: https://docs.astro.build/en/guides/integrations-guide/sitemap/
import sitemap from '@astrojs/sitemap';

sitemap({
  filter: (page) => !page.includes('/archived-path-fragment/'),
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Jekyll deploy actions (`jekyll-build-pages`) | `withastro/action@v6` | Astro docs current guidance | Lower setup friction for Astro static deploys |
| Tailwind via `@astrojs/tailwind` integration | Tailwind 4 via `@tailwindcss/vite` | Astro Tailwind docs deprecation notice | Simpler, supported Tailwind 4 path |
| Implicit permalink from frontmatter/filename | Explicit content collections + inventory contract | Phase 1 migration decisions | Better parity control and traceability |

**Deprecated/outdated:**
- `@astrojs/tailwind` for Tailwind 4 setups is marked deprecated in docs.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@astrojs/mdx` is needed in Phase 2 baseline rather than added later | Standard Stack (Supporting) | Slight dependency bloat, low delivery risk |
| A2 | `@astrojs/check` should be part of immediate CI gate in this phase | Standard Stack (Supporting) | If deferred, quality checks move to later phase |
| A3 | TypeScript 6.0.3 is acceptable for Astro 7 toolchain in this repo | Standard Stack (Supporting) | Potential tooling compatibility adjustment |

## Open Questions

1. **Exact 10 permalink smoke-test set (D-23)**
   - What we know: Must include featured, standard, archived, and duplicate redirect pairs.
   - What's unclear: Final exact URL list for plan task acceptance.
   - Recommendation: Lock a deterministic list from `blog-inventory.yml` before PLAN task breakdown.

2. **Archived `noindex` implementation timing**
   - What we know: D-33 allows stub in Phase 2, full enforcement in Phase 4.
   - What's unclear: Whether to include minimal `noindex` now on archived post layout.
   - Recommendation: Add lightweight `noindex` conditional in Phase 2 if trivial; otherwise explicit Phase 4 follow-up task.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build/tooling | ✓ | v25.9.0 | Use Node 24 in CI via action default |
| npm | Package install/build scripts | ✓ | 11.12.1 | pnpm/yarn if needed |
| Ruby | Existing `rake data:validate` retention | ✓ | 3.4.4 | none (required until retired) |
| Python + slopcheck | Package legitimacy gate | ✓ | Python 3.13.6 / slopcheck 0.6.1 | mark all packages assumed if unavailable |
| GitHub CLI (`gh`) | Release/version verification | ✓ | available | Use docs only if unavailable |

**Missing dependencies with no fallback:** none  
**Missing dependencies with fallback:** none

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | No first-party JS test framework detected yet (Wave 0 gap) |
| Config file | none |
| Quick run command | `npm run astro check` [ASSUMED] |
| Full suite command | `npm run build` + permalink smoke checks [ASSUMED] |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLAT-01 | Astro deploy workflow builds and publishes | integration | GitHub Actions workflow run | ❌ Wave 0 |
| PLAT-02 | 51 posts resolve to inventory permalink paths | smoke | script curl/URL checks against built `dist` | ❌ Wave 0 |
| PLAT-03 | RSS excludes archived | integration | parse `dist/rss.xml` for excluded URLs | ❌ Wave 0 |
| PLAT-04 | Sitemap excludes archived | integration | parse `dist/sitemap-0.xml` or index chain | ❌ Wave 0 |
| PLAT-05 | Redirect pages exist and point correctly | smoke | grep generated redirect HTML for target URLs | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run astro check` (or `astro check` command)
- **Per wave merge:** `npm run build` and generated artifact assertions
- **Phase gate:** Full build + 10 permalink smoke-checks green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `package.json` scripts for `check`/`build` not yet present in Astro scaffold
- [ ] Redirect assertion script (meta-refresh + canonical correctness)
- [ ] Inventory parity checker (51 entries mapped to generated routes)
- [ ] RSS/sitemap exclusion assertion script for archived tier

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Static site, no auth in scope |
| V3 Session Management | no | Static site, no sessions in scope |
| V4 Access Control | no | Public read-only content site |
| V5 Input Validation | yes | Zod schemas in Astro content collections |
| V6 Cryptography | no | No custom crypto in phase scope |

### Known Threat Patterns for Astro static migration

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed frontmatter/data causes broken builds | Tampering | Strict collection schemas + CI checks |
| Open redirect from incorrect redirect generation | Spoofing | Allowlist redirect targets from inventory/canonical paths |
| Sensitive draft/archived leakage via feeds/sitemaps | Information Disclosure | Tier-based filtering for RSS/sitemap generation |
| Dependency supply chain risk | Tampering | Slopcheck + registry verification + postinstall checks |

## Sources

### Primary (HIGH confidence)
- [https://docs.astro.build/en/guides/deploy/github/](https://docs.astro.build/en/guides/deploy/github/) - official Astro GitHub Pages workflow, `site`/`base`, action usage
- [https://docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) - `defineCollection`, `glob/file`, sorting caveat, route generation
- [https://docs.astro.build/en/guides/rss/](https://docs.astro.build/en/guides/rss/) - RSS helper usage, feed item generation, trailing slash control
- [https://docs.astro.build/en/guides/integrations-guide/sitemap/](https://docs.astro.build/en/guides/integrations-guide/sitemap/) - sitemap integration and `filter()` capability
- [https://docs.astro.build/en/guides/styling/#tailwind](https://docs.astro.build/en/guides/styling/#tailwind) - Tailwind 4 via Vite plugin and legacy/deprecated path
- [https://github.com/withastro/action](https://github.com/withastro/action) + `gh release list -R withastro/action` - current action major/minor release state
- Local project artifacts: `02-CONTEXT.md`, `ASTRO-DATA-MAPPING.md`, `_data/blog-inventory.yml`, `.planning/REQUIREMENTS.md`, existing Jekyll workflows

### Secondary (MEDIUM confidence)
- [https://docs.github.com/en/enterprise/2.14/user/articles/redirects-on-github-pages](https://docs.github.com/en/enterprise/2.14/user/articles/redirects-on-github-pages) - historical GitHub guidance confirming lack of custom server redirect config and static redirect/plugin strategy

### Tertiary (LOW confidence)
- none

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - official Astro docs + npm registry + slopcheck verification
- Architecture: HIGH - directly constrained by locked decisions and static-hosting model
- Pitfalls: MEDIUM-HIGH - grounded in docs plus migration-specific failure modes

**Research date:** 2026-07-02  
**Valid until:** 2026-08-01
