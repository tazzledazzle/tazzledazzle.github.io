# Phase 2: Astro Scaffold & Content Migration - Discussion Log

**Date:** 2026-07-02
**Areas discussed:** Cutover, Permalinks, Redirects, Jekyll retirement, Visual scope

---

## Cutover
- Big-bang replace Jekyll CI on merge ✓
- All pages + blog in one cutover ✓
- Spot-check 10 legacy permalinks + RSS + sitemap ✓
- Git revert rollback ✓

## Permalinks
- Exact Jekyll `/:year/:month/:day/:title/` ✓
- blog-inventory.yml as permalink source of truth ✓
- Static pages: /about/, /work/, /career/, /blog/ ✓

## Redirects
- Meta-refresh HTML in public/ ✓
- /projects/ → /work/ ✓
- 2015 design-docs → 2024 canonical ✓
- Mixed-case nav → lowercase ✓

## Jekyll Retirement
- Remove Gemfile, _config.yml, layouts after Astro passes ✓
- Migrate _posts/, delete source ✓
- Copy _data/ to src/data/, remove _data/ after verify ✓
- Keep rake data:validate ✓

## Visual Scope
- Tailwind 4 minimal dark shell ✓
- Basic hiring pages (hero + project list) ✓
- Readable minimal blog with syntax highlighting ✓
