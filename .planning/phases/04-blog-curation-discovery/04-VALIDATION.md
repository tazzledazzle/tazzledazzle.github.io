# Phase 4 Validation Matrix

Blog curation and discovery requirements (BLOG-01 through BLOG-07). Automated checks run via `npm run verify:phase4`.

| Req | Requirement | Decisions | Automated check | Manual check |
|-----|-------------|-----------|-----------------|--------------|
| BLOG-01 | Tiered blog index: featured prominent, archived hidden | D-61, D-62, D-63, D-64, D-16 | `dist/blog/index.html` contains "Featured", "Kotlin Cheatsheet", "min read"; excludes "Welcome to Jekyll" | Visual: featured section above standard list |
| BLOG-02 | Post metadata: long date + read time | D-65, D-66 | Featured post HTML has long month name + "min read" | — |
| BLOG-03 | Syntax-highlighted code with language labels | D-69, D-70, D-71, D-72 | Post HTML has `ec-`/`expressive-code`; `dist/_astro/ec*.css` exists | Visual: language label top-right (D-70); GitHub Dark theme (D-71); `cloud-comp` ```math fence plain text, no KaTeX (D-72) |
| BLOG-04 | Tag index pages; footer tags on posts | D-73, D-74, D-75, D-76 | Tag index under `dist/blog/tags/`; tagged post has `post-tags` with `/blog/tags/` links | — |
| BLOG-05 | Year archive page | D-77, D-78, D-79, D-80 | `dist/blog/archive/index.html` has year h2; blog index links `/blog/archive/` | — |
| BLOG-06 | Prev/next navigation with titles | D-81, D-82 | Post HTML has `post-nav` with Previous/Next | — |
| BLOG-07 | RSS autodiscovery in head | D-83, D-84 | Homepage, blog index, sample post have `rel="alternate"` + `href="/rss.xml"` | — |

## Archived posts (D-67, D-68)

| Check | Automated | Manual |
|-------|-----------|--------|
| `noindex` meta on archived tier | verify script: archived post dist HTML | — |
| Visible "Archived post" banner | verify script | — |
| Full body readable | — | Open archived permalink; confirm content not truncated |

## Inherited Phase 2 checks (D-16, D-32, D-33)

Archived posts excluded from RSS and sitemap — covered by `scripts/verify-phase2-routes.mjs` (rss-sitemap assertions). Not duplicated in verify:phase4.

## D-76 tag backfill scope

Category-to-tags backfill runs via `scripts/backfill-blog-tags.mjs` against git-recovered `_posts/` sources. Most 2024+ posts had no Jekyll `categories` field; ~10 posts retain migrated tags from Phase 2. Discoverable posts without tags omit footer tags; tag routes still generate for tagged posts. Accepted per D-76 scope.

## Manual-only criteria

- **D-70:** Language label appears top-right on fenced code blocks with language identifier
- **D-71:** Code blocks use GitHub Dark theme (matches site dark baseline)
- **D-72:** `2025-01-08-cloud-comp.md` ```math fence renders as plain unhighlighted text
