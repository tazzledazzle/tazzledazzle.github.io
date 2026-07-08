# Phase 6 Validation Matrix

**Phase:** 06-performance-seo-accessibility  
**Requirements:** QUAL-01 through QUAL-06  
**Decisions:** D-108 through D-129

| Req | Requirement | Decisions | Automated check | Manual check |
|-----|-------------|-----------|-----------------|--------------|
| QUAL-01 | Key pages score ≥ 90 Lighthouse performance (mobile) | D-108, D-109, D-110, D-111, D-129 | `check:lighthouse` in CI (`lighthouserc.cjs` asserts perf ≥ 0.9 on 6 URLs) | Confirm Lighthouse mobile scores in CI logs on merge to `main` |
| QUAL-02 | Keyboard nav + WCAG 2.1 AA contrast | D-124, D-125 | `npm run audit:contrast`; `npm run test:a11y` (axe wcag2aa) | Spot-check keyboard focus rings on home and blog post |
| QUAL-03 | Unique title, meta description, OG tags per page | D-112, D-113, D-114, D-128 | `verify:phase6` dist meta/OG assertions on home + kotlin-cheatsheet | Optional: share home URL preview to confirm OG image renders |
| QUAL-04 | Article JSON-LD on posts; Person on About | D-116, D-117, D-118, D-119 | `verify:phase6` Article/Person JSON-LD + archived exclusion | — |
| QUAL-05 | CI catches broken links and a11y regressions | D-120, D-121, D-122, D-123, D-126 | `.github/workflows/deploy-pages.yml` runs lychee, axe, alt check on `main` push | Review failed workflow on first merge |
| QUAL-06 | Images: modern formats, lazy load, dimensions, alt | D-127, D-128 | `check:alt`; `docs/IMAGE-POLICY.md`; `og-default.png` exists | Apply IMAGE-POLICY when adding future content images |

## Decision traceability

### SEO & meta (D-108–D-114, D-128)

- **D-108–D-111:** Lighthouse perf+SEO hard gates; a11y/best-practices informational only (axe is hard a11y gate).
- **D-112–D-114:** Per-page descriptions; full OG/Twitter tags via `Seo.astro`.
- **D-115:** Archived posts: `noindex`, no OG/Twitter, no JSON-LD.
- **D-128:** `public/og-default.png` generated via `scripts/generate-og-default.mjs`.

### Structured data (D-116–D-119)

- **D-116:** `buildArticleSchema` on non-archived posts.
- **D-117:** `buildPersonSchema` on About with `sameAs`.
- **D-118–D-119:** `jsonLd` prop shell in `MainLayout`; archived posts excluded.

### CI gates (D-120–D-126)

- **D-120:** `lychee.toml` scans `dist/**/*.html` with archived path exclusions.
- **D-121–D-123:** axe on 6 key pages; workflow fails before deploy on any gate failure.
- **D-122:** Explicit `npm ci && npm run build` replaces `withastro/action` for gate access to `dist/`.
- **D-125:** Keyboard validation via axe (no skip-link added).
- **D-126:** `scripts/check-dist-alt.mjs` enforces `alt` on all `<img>` in dist.

### Fonts & images (D-127–D-129)

- **D-127:** Forward-looking `docs/IMAGE-POLICY.md` for `astro:assets` Image usage.
- **D-129:** Self-hosted Inter 400/600 with preload.

### Contrast (D-124)

- **D-124:** `scripts/audit-contrast.mjs` — all token pairs ≥ 4.5:1.

## Local verification commands

```bash
npm run verify:phase6    # Full Phase 6 gate (build + contrast + axe + smoke)
npm run check:lighthouse # Lighthouse CI (slow; enforced in CI)
npm run check:links      # Requires lychee CLI locally; CI uses lychee-action
```

## Sample paths

- Lighthouse/axe sample post: `/2024/11/08/kotlin-cheatsheet/`
- Archived policy check: `/2015/12/03/welcome-to-jekyll/`

## Notes

- **D-111:** Only Performance and SEO categories are Lighthouse assertion failures; Accessibility and Best Practices are informational.
- **D-122:** Quality gates run on every push to `main` before `deploy-pages`.
- **D-127:** Blog has zero markdown images today; policy applies to new content.
