# Phase 2: Astro Scaffold & Content Migration - Research

**Researched:** 2026-07-02  
**Domain:** Astro 7 static migration on GitHub Pages  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
### Cutover Strategy (PLAT-01)
- **D-21:** **Big-bang cutover** — replace Jekyll GitHub Actions workflow on merge to main; single deploy switches stack
- **D-22:** Ship **all pages + blog** in one cutover (not blog-only deferral)
- **D-23:** Pre-merge verification: **spot-check 10 legacy permalinks** + RSS + sitemap
- **D-24:** Rollback plan: **git revert** to last Jekyll commit if production breaks

### Permalink Parity (PLAT-02)
- **D-25:** Blog posts use **exact Jekyll format** `/:year/:month/:day/:title/` with trailing slash behavior matching inventory
- **D-26:** Slug/permalink resolution uses **`blog-inventory.yml` as source of truth** (not re-derived from filename)
- **D-27:** Static pages use Phase 1 nav paths: **`/about/`**, **`/work/`**, **`/career/`**, **`/blog/`**

### Redirects (PLAT-05)
- **D-28:** Redirect mechanism: **HTML meta-refresh pages in `public/`** (GitHub Pages compatible — no server 301s)
- **D-29:** **`/projects/` → `/work/`** redirect per D-05
- **D-30:** **2015 design-doc duplicate URLs** meta-redirect to 2024 canonical slugs per `blog-inventory.yml` `canonical_slug`
- **D-31:** **Mixed-case legacy nav** (`/About`, `/Projects`, `/Career`, `/Blog`) redirect to lowercase canonical paths

### RSS & Sitemap (PLAT-03, PLAT-04)
- **D-32:** RSS includes **only non-archived** posts (featured + standard tiers)
- **D-33:** XML sitemap **excludes archived** posts; archived posts still build with `noindex` (enforced in Phase 4 layout, stub in Phase 2 if needed)

### Jekyll Retirement
- **D-34:** After Astro deploy passes: **remove** Gemfile, `_config.yml`, Jekyll layouts/themes from active site
- **D-35:** Migrate `_posts/` → `src/content/blog/`, then **remove `_posts/`**
- **D-36:** Copy `_data/` → `src/data/` per `docs/ASTRO-DATA-MAPPING.md`, **remove `_data/`** after verification
- **D-37:** **Keep `rake data:validate`** in repo through Phase 3+ (do not port-only to Zod yet)

### Phase 2 Visual & Page Scope
- **D-38:** **Tailwind 4 minimal shell** — dark background, typography tokens; not full design system (Phase 5)
- **D-39:** **Basic hiring pages now** — simple hero + project list from data (not full Phase 3 polish, but more than placeholders)
- **D-40:** **Readable minimal blog** — post index + post page with syntax highlighting; not Minima parity

### Carried Forward from Phase 1
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
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PLAT-01 | Site builds and deploys to GitHub Pages via GitHub Actions (Astro static output) | Official Astro Pages workflow with `withastro/action@v6` and `actions/deploy-pages@v5` [CITED: https://docs.astro.build/en/guides/deploy/github/] |
| PLAT-02 | All existing blog posts are migrated with preserved permalink structure (`/:year/:month/:day/:title/`) | Inventory-driven route generation from `blog-inventory.yml` permalinks for all 51 posts [VERIFIED: project files] |
| PLAT-03 | RSS feed is generated and excludes archived posts | `@astrojs/rss` endpoint + collection filtering by tier [CITED: https://docs.astro.build/en/guides/rss/] |
| PLAT-04 | XML sitemap is generated and excludes archived posts | `@astrojs/sitemap` with `filter()` exclusions [CITED: https://docs.astro.build/en/guides/integrations-guide/sitemap/] |
| PLAT-05 | Redirects exist for any changed or consolidated URLs from the legacy Jekyll site | Astro static redirects emit HTML meta-refresh files; explicit `public/` redirect pages are GitHub Pages-compatible [CITED: https://docs.astro.build/en/guides/routing/#redirects] [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv#refresh] |
</phase_requirements>

## Project Constraints (from .cursor/rules/)

- `.cursor/rules/` directory is not present, so there are no additional project-level directives from that source. [VERIFIED: project files]

## Summary

Phase 2 planning should prioritize URL integrity and deploy cutover mechanics before visual polish: preserve inventory permalinks, generate deterministic redirects, and ship a single Astro-based GitHub Pages workflow. [VERIFIED: project files]

Astro static routing and redirects support this plan directly. In static builds, configured redirects output HTML files with meta refresh behavior, which aligns with the GitHub Pages constraint and D-28 through D-31. [CITED: https://docs.astro.build/en/guides/routing/#redirects]

The highest-risk work items are migration correctness and exclusion rules: 51 post routes must match `blog-inventory.yml`, and archived content must be omitted from RSS/sitemap while URLs stay accessible. [VERIFIED: project files] [CITED: https://docs.astro.build/en/guides/rss/] [CITED: https://docs.astro.build/en/guides/integrations-guide/sitemap/]

**Primary recommendation:** Implement an inventory-driven route + redirect generation pipeline first, then layer Tailwind minimal shell and basic hiring/blog pages.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| GitHub Pages deploy workflow | API/Backend (CI) | CDN/Static | GitHub Actions builds and publishes static artifacts |
| Permalink parity routing | Frontend Server (SSG build) | CDN/Static | `getStaticPaths()` determines all legacy-compatible routes |
| Meta-refresh redirects | CDN/Static | Frontend Server (generation script) | Redirect files are static HTML served directly by Pages |
| Content migration (`_posts` + `_data`) | Frontend Server (SSG build) | Database/Storage (filesystem) | Build-time loaders consume local Markdown/YAML |
| RSS generation and filtering | Frontend Server (SSG build) | CDN/Static | RSS endpoint produces static XML |
| Sitemap generation and filtering | Frontend Server (SSG build) | CDN/Static | Sitemap integration emits build-time XML |
| Tailwind minimal shell | Browser/Client | Frontend Server (CSS build) | Tailwind compiles to static CSS delivered to clients |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro` | `7.0.5` | SSG framework, routing, collections | Official Astro+GitHub Pages deployment path [CITED: https://docs.astro.build/en/guides/deploy/github/] [VERIFIED: npm registry] |
| `@astrojs/rss` | `4.0.19` | RSS feed generation | Official package with collection integration [CITED: https://docs.astro.build/en/guides/rss/] [VERIFIED: npm registry] |
| `@astrojs/sitemap` | `3.7.3` | Sitemap generation | Official integration with filter controls [CITED: https://docs.astro.build/en/guides/integrations-guide/sitemap/] [VERIFIED: npm registry] |
| `tailwindcss` | `4.3.2` | Minimal dark shell styling | Matches locked Tailwind 4 direction (D-38) [VERIFIED: project files] [VERIFIED: npm registry] |
| `@tailwindcss/vite` | `4.3.2` | Tailwind 4 Vite integration | Required plugin for modern Tailwind/Vite setup [ASSUMED] [VERIFIED: npm registry] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@astrojs/mdx` | `7.0.1` | MDX posts if needed | Include if migrated posts need component markup [ASSUMED] [VERIFIED: npm registry] |
| `@astrojs/check` | `0.9.9` | Astro/type validation | Run as pre-merge migration validation [ASSUMED] [VERIFIED: npm registry] |
| `typescript` | `6.0.3` | Type-safe content config | Keep strict typing in collections/config [ASSUMED] [VERIFIED: npm registry] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inventory permalink mapping | Filename-derived slugs | Violates D-26 and risks URL drift |
| Static redirect files | Runtime/server redirects | Not available on GitHub Pages static hosting |
| Tailwind minimal shell | Full design system now | Contradicts D-38 and Phase 5 scope |

**Installation:**
```bash
npm install astro @astrojs/rss @astrojs/sitemap tailwindcss @tailwindcss/vite @astrojs/mdx
npm install -D @astrojs/check typescript
```

**Version verification:** Completed via `npm view <package> version time.created time.modified`. [VERIFIED: npm registry]

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `astro` | npm | created 2021-03-13 | N/A (not emitted by this slopcheck build) | github.com/withastro/astro | OK | Approved |
| `@astrojs/rss` | npm | created 2022-05-04 | N/A | github.com/withastro/astro | OK | Approved |
| `@astrojs/sitemap` | npm | created 2022-03-18 | N/A | github.com/withastro/astro | OK | Approved |
| `@astrojs/mdx` | npm | created 2022-06-30 | N/A | github.com/withastro/astro | OK | Approved |
| `tailwindcss` | npm | created 2017-10-06 | N/A | github.com/tailwindlabs/tailwindcss | OK | Approved |
| `@tailwindcss/vite` | npm | created 2024-02-02 | N/A | github.com/tailwindlabs/tailwindcss | OK | Approved |
| `@astrojs/check` | npm | created 2023-07-31 | N/A | github.com/withastro/astro | OK | Approved |
| `typescript` | npm | created 2012-10-01 | N/A | github.com/microsoft/TypeScript | OK | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none

Postinstall inspection (`npm view <pkg> scripts.postinstall`) returned no postinstall scripts for all packages above. [VERIFIED: npm registry]

## Architecture Patterns

### System Architecture Diagram
```text
Legacy content (_posts + _data + blog-inventory.yml)
                 |
                 v
Migration step (copy + frontmatter normalize + permalink map)
                 |
   +-------------+-------------------+
   |                                 |
   v                                 v
src/content/blog/*              src/data/*.yml
                 \             /
                  v           v
              src/content.config.ts
            (glob/file loaders + Zod)
                      |
      +---------------+--------------------+
      |                                    |
      v                                    v
blog routes via getStaticPaths      rss.xml + sitemap output
(permalink from inventory)          (filter archived tier)
      |                                    |
      +----------------+-------------------+
                       v
          dist/ + public redirect HTML files
                       |
                       v
          GitHub Actions build + deploy-pages
```

### Recommended Project Structure
```text
src/
├── content/
│   └── blog/                  # 51 migrated posts
├── data/
│   ├── blog-inventory.yml     # permalink + tier truth source
│   ├── navigation.yml
│   ├── social.yml
│   ├── career.yml
│   └── projects/
├── pages/
│   ├── blog/[...slug].astro   # inventory-based route mapping
│   ├── blog/index.astro
│   └── rss.xml.js
├── layouts/
└── styles/
public/
└── redirects/                 # static HTML meta-refresh pages
```

### Pattern 1: Inventory-Driven Permalink Generation
**What:** Build `getStaticPaths()` from `blog-inventory.yml` `permalink` values. [VERIFIED: project files]  
**When to use:** PLAT-02 route generation for every migrated post.  
**Example:**
```typescript
// Source: https://docs.astro.build/en/guides/content-collections/
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: {
      slug: post.data.permalink.replace(/^\/|\/$/g, '').split('/'),
    },
  }));
}
```

### Pattern 2: Tier-Based RSS/Sitemap Exclusion
**What:** Exclude archived entries in both feed and sitemap generation paths. [VERIFIED: project files]  
**When to use:** PLAT-03 and PLAT-04 enforcement.  
**Example:**
```typescript
// Source: https://docs.astro.build/en/guides/rss/
const published = posts.filter((p) => p.data.tier !== 'archived');
```

### Pattern 3: GitHub Pages-Compatible Redirect Stubs
**What:** Emit static HTML redirect documents with meta refresh + canonical link. [CITED: https://docs.astro.build/en/guides/routing/#redirects] [CITED: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv#refresh]  
**When to use:** `/projects/`, mixed-case nav aliases, and 2015 duplicate design-doc URLs.  
**Example:**
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/work/" />
    <link rel="canonical" href="/work/" />
    <title>Redirecting</title>
  </head>
  <body><a href="/work/">Continue</a></body>
</html>
```

### Anti-Patterns to Avoid
- **Slug derivation from filenames:** breaks D-26 and creates parity drift. [VERIFIED: project files]
- **Unsorted collection output:** `getCollection()` ordering is non-deterministic. [CITED: https://docs.astro.build/en/guides/content-collections/]
- **Relying on server 301 config in Pages:** incompatible with static hosting model for this phase. [CITED: https://docs.astro.build/en/guides/routing/#redirects]
- **Including archived entries in discovery artifacts:** violates D-32/D-33 and PLAT-03/PLAT-04. [VERIFIED: project files]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS XML | Manual XML serializer | `@astrojs/rss` | Official helper handles feed shape reliably |
| Sitemap | Custom crawler script | `@astrojs/sitemap` | Official integration with URL filtering |
| Content schema validation | Ad-hoc YAML/frontmatter checks | Astro collections + Zod | Build-time type validation + predictable API |
| Redirect behavior | Client JS redirect snippets | Static redirect files from Astro/public | Works with static host constraints |

**Key insight:** This phase is primarily data-and-URL migration engineering, not UI engineering.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None outside repo files (`_posts`, `_data`, `blog-inventory.yml`). [VERIFIED: project files] | Code edits only; no datastore migration |
| Live service config | GitHub Pages source setting and Actions workflow execution are live GitHub settings. [ASSUMED] | Manual verification post-cutover (Pages source remains Actions) |
| OS-registered state | None found for this repository migration scope. [VERIFIED: project files] | None |
| Secrets/env vars | No required secrets identified for static build path. [ASSUMED] | None unless future integrations add env dependencies |
| Build artifacts | Existing Ruby/Bundler artifacts may remain locally (`vendor/bundle`). [VERIFIED: project files] | Clean workspace during implementation; no data migration |

## Common Pitfalls

### Pitfall 1: Incorrect `site`/`base` configuration
**What goes wrong:** Broken assets/links after deploy. [CITED: https://docs.astro.build/en/guides/deploy/github/]  
**Why it happens:** Using project-page `base` patterns on a `username.github.io` repo.  
**How to avoid:** Set `site: https://tazzledazzle.github.io` and do not set `base`.  
**Warning signs:** Deployed CSS/JS 404s.

### Pitfall 2: Permalink mismatch during migration
**What goes wrong:** Legacy URLs return 404 or wrong post. [VERIFIED: project files]  
**Why it happens:** Re-deriving slug from filename instead of inventory permalink.  
**How to avoid:** Route generation keyed to `blog-inventory.yml` only.  
**Warning signs:** Spot-check set fails on duplicate or archived URLs.

### Pitfall 3: Feed/sitemap leakage of archived content
**What goes wrong:** Archived content appears in search/feed channels. [VERIFIED: project files]  
**Why it happens:** Missing tier filter in RSS/sitemap generation.  
**How to avoid:** Filter by `tier !== 'archived'` in both generation paths.  
**Warning signs:** Archived permalink appears in generated XML.

### Pitfall 4: Redirect loops or wrong canonical target
**What goes wrong:** Redirect chain loops or points to non-canonical destination. [ASSUMED]  
**Why it happens:** Inconsistent source/target mapping for canonical duplicates.  
**How to avoid:** Build redirect map from inventory `canonical_slug` and explicit nav aliases.  
**Warning signs:** Browser reload loops, canonical mismatch in HTML.

## Code Examples

### GitHub Pages Workflow (PLAT-01)
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
      - id: deployment
        uses: actions/deploy-pages@v5
```

### RSS Generation with Archived Exclusion (PLAT-03)
```typescript
// Source: https://docs.astro.build/en/guides/rss/
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => data.tier !== 'archived');
  return rss({
    title: 'Terence Schumacher Blog',
    site: context.site,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: post.data.permalink,
    })),
  });
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Jekyll `actions/jekyll-build-pages` | `withastro/action@v6` + `deploy-pages@v5` | Current Astro GitHub deployment guidance | Simpler Astro-native deploy path |
| Ad-hoc frontmatter parsing | Astro Content Collections with loaders and schema | Astro content architecture maturation | Better migration safety and type guarantees |
| Manual redirect hacks | Astro static redirect output / explicit redirect HTML | `redirects` support and static build behavior | Deterministic redirects on static hosts |

**Deprecated/outdated:**
- Treating filename-derived slug as canonical source for migrated posts is outdated for this phase because inventory is already authoritative. [VERIFIED: project files]

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@tailwindcss/vite` is the correct Tailwind 4 integration path for this scaffold | Standard Stack | Build config churn |
| A2 | No additional secrets are needed for this phase’s static deploy path | Runtime State Inventory | CI deployment interruption if secret appears later |
| A3 | Redirect loop risk should be validated with generated-link tests | Common Pitfalls | Production redirect regressions |

## Open Questions

1. **Exact 10-link smoke test set for D-23**
   - What we know: Must include featured, standard, archived, and duplicate/canonical pairs. [VERIFIED: project files]
   - What's unclear: Final deterministic URL list to lock in PLAN tasks.
   - Recommendation: Select 10 URLs directly from `blog-inventory.yml` before planning.

2. **Phase 2 handling of archived `noindex`**
   - What we know: D-33 allows stub behavior now, full enforcement in Phase 4. [VERIFIED: project files]
   - What's unclear: Whether to add minimal Phase 2 conditional now or defer entirely.
   - Recommendation: Include a lightweight Phase 2 placeholder if low effort.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Astro build pipeline | ✓ | `v25.9.0` | CI uses Node 24 default in `withastro/action` |
| npm | Dependency install/build | ✓ | `11.12.1` | pnpm/yarn if needed |
| Ruby | Keep `rake data:validate` active (D-37) | ✓ | `3.4.4` | none |
| Bundler | Existing rake/data tasks | ✓ | `2.6.9` | none |
| slopcheck | Package legitimacy gate | ✓ | `0.6.1` | Mark packages as assumed if unavailable |

**Missing dependencies with no fallback:** none  
**Missing dependencies with fallback:** none

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | No project-level JS test framework detected yet; validation should use build checks and artifact assertions |
| Config file | none |
| Quick run command | `npx astro check` [ASSUMED] |
| Full suite command | `npx astro check && npm run build` [ASSUMED] |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PLAT-01 | Astro workflow builds/deploys Pages | integration | GitHub Actions run for new workflow | ❌ Wave 0 |
| PLAT-02 | 51 post permalinks map correctly | smoke | script assertion against built route list from inventory | ❌ Wave 0 |
| PLAT-03 | RSS excludes archived | integration | parse generated `rss.xml` and assert absence of archived permalinks | ❌ Wave 0 |
| PLAT-04 | Sitemap excludes archived | integration | parse generated sitemap files and assert absence of archived permalinks | ❌ Wave 0 |
| PLAT-05 | Redirect stubs exist and target canonical URLs | smoke | verify redirect HTML files + `meta refresh`/canonical href pairs | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx astro check` [ASSUMED]
- **Per wave merge:** `npx astro check && npm run build` [ASSUMED]
- **Phase gate:** Full build + D-23 ten-link smoke test green

### Wave 0 Gaps
- [ ] Add migration verification script: inventory route parity (51 posts)
- [ ] Add RSS exclusion assertion for archived tier
- [ ] Add sitemap exclusion assertion for archived tier
- [ ] Add redirect-map assertion (`/projects/`, mixed-case nav, 2015 duplicates)

## Security Domain

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Not in scope for static public site |
| V3 Session Management | no | Not in scope |
| V4 Access Control | no | Public read-only pages only |
| V5 Input Validation | yes | Zod schema validation in content collections [CITED: https://docs.astro.build/en/guides/content-collections/] |
| V6 Cryptography | no | No cryptographic primitives in scope |

### Known Threat Patterns for Astro static migration
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malformed frontmatter/data breaks build | Tampering | Schema validation + CI checks |
| Redirect target poisoning | Spoofing | Generate redirects only from allowlisted inventory/nav mappings |
| Archived content leakage into discovery artifacts | Information Disclosure | Tier-based filtering for RSS and sitemap |
| Supply-chain package risk | Tampering | slopcheck + npm registry checks + postinstall scan |

## Sources

### Primary (HIGH confidence)
- [https://docs.astro.build/en/guides/deploy/github/](https://docs.astro.build/en/guides/deploy/github/) - official GitHub Pages deployment workflow
- [https://docs.astro.build/en/guides/content-collections/](https://docs.astro.build/en/guides/content-collections/) - loaders, schemas, and collection behavior
- [https://docs.astro.build/en/guides/routing/#redirects](https://docs.astro.build/en/guides/routing/#redirects) - configured redirects and static output behavior
- [https://docs.astro.build/en/guides/rss/](https://docs.astro.build/en/guides/rss/) - RSS generation and filtering
- [https://docs.astro.build/en/guides/integrations-guide/sitemap/](https://docs.astro.build/en/guides/integrations-guide/sitemap/) - sitemap generation and `filter()`
- [https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv#refresh](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/http-equiv#refresh) - meta refresh behavior
- Local files: `02-CONTEXT.md`, `docs/ASTRO-DATA-MAPPING.md`, `_data/blog-inventory.yml`, `.planning/research/STACK.md`, `.planning/REQUIREMENTS.md`, `.github/workflows/jekyll-gh-pages.yml`
- npm registry checks (`npm view`) for package version/date metadata and postinstall scripts
- slopcheck run (`slopcheck install --ecosystem npm ...`) for package legitimacy verdicts

### Secondary (MEDIUM confidence)
- none

### Tertiary (LOW confidence)
- none

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - official docs + registry verification + slopcheck output
- Architecture: HIGH - tightly constrained by locked decisions and static hosting model
- Pitfalls: MEDIUM-HIGH - supported by docs and migration constraints, with a few implementation assumptions

**Research date:** 2026-07-02  
**Valid until:** 2026-08-01
