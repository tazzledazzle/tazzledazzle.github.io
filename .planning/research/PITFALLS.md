# Domain Pitfalls

**Domain:** Personal portfolio & technical blog modernization (Jekyll → modern static site, hiring optimization)
**Project:** Terence Schumacher — tazzledazzle.github.io
**Researched:** 2026-07-01
**Overall confidence:** HIGH (stack/hosting pitfalls), MEDIUM (hiring psychology claims — industry consensus but not peer-reviewed)

---

## Critical Pitfalls

Mistakes that cause rewrites, traffic loss, broken deploys, or failure against the 60-second recruiter test.

### Pitfall 1: Stack Migration Paralysis (Rebuild Before Ship)

**What goes wrong:** Weeks spent evaluating Astro vs Next.js vs Hugo vs "stay on Jekyll" while the live site remains dated. The modernization never ships; hiring season passes with the same weak first impression.

**Why it happens:** Stack choice feels high-stakes. Blog posts about migrations are compelling; shipping a redesigned About page is not. The project treats "stack evaluation" as a gate instead of a parallel track.

**Consequences:** No hiring impact. Opportunity cost. Risk of a big-bang rewrite that never merges.

**Warning signs:**
- Multiple spike branches or POCs, zero merged UX improvements
- Conversations center on framework benchmarks, not recruiter comprehension
- "We'll launch when the migration is done" becomes the default answer

**Prevention:**
- Decide stack in a time-boxed spike (2–3 days max), not an open-ended research phase
- Ship visual + content improvements on current Jekyll first; migrate stack only when a concrete blocker appears (plugin safelist, build time, DX pain)
- If migrating: treat Markdown as portable; port layouts, not content

**Detection:** More than one sprint without a deployable improvement to About, Projects, or Career.

**Phase mapping:** **Phase 1 — Foundation & Stack Decision**

---

### Pitfall 2: "Works Locally, Broken in Production" (GitHub Pages Safe Mode)

**What goes wrong:** Features work in `bundle exec jekyll serve` but silently disappear on GitHub Pages — missing SEO tags, archive pages 404, custom Liquid tags render as literal text, `_plugins/` never runs.

**Why it happens:** GitHub Pages builds Jekyll in `--safe` mode, which loads only safelisted gems and ignores custom `_plugins/`. Builds succeed with no error email. The `github-pages` gem also pins Jekyll 3.x and a fixed plugin matrix.

**Consequences:** Silent feature loss. False confidence from green CI. Wasted time debugging "why doesn't this work in prod?"

**Warning signs:**
- New plugin added to `Gemfile` but not in [Pages dependency versions](https://pages.github.com/versions/)
- Custom Ruby in `_plugins/`
- Local Jekyll 4.x features used while production is pinned to 3.x
- Never run `bundle exec jekyll build --safe` before push

**Prevention:**
- Always validate with `bundle exec jekyll build --safe` locally
- Check plugin against the official Pages safelist before relying on it
- If you need unsafelisted plugins: use the existing GitHub Actions workflow (`bundle exec jekyll build`) instead of `actions/jekyll-build-pages@v1`, or migrate to a custom Actions build (per [Jekyll CI docs](https://jekyllrb.com/docs/continuous-integration/github-actions/))
- Consolidate the two existing workflows (`jekyll.yml` vs `jekyll-gh-pages.yml`) — dual pipelines invite drift

**Detection:** Diff `_site/` output from local full build vs `--safe` build. Spot-check RSS, sitemap, pagination, and any custom generators.

**Phase mapping:** **Phase 1 — Foundation & Stack Decision**, **Phase 5 — Blog Curation & Migration** (if using `jekyll-redirect-from` or archive plugins)

---

### Pitfall 3: URL / Permalink Changes Without Redirect Strategy

**What goes wrong:** Changing permalink format, renaming posts, archiving content, or fixing filename casing breaks inbound links from Google, Hacker News, bookmarks, and backlinks. Traffic and authority erode.

**Why it happens:** Permalink "cleanup" feels like housekeeping. Static hosts (GitHub Pages) have no server-side `.htaccess`. `jekyll-redirect-from` generates HTML meta-refresh pages, not true HTTP 301s — acceptable for users, weaker for SEO tooling.

**Consequences:** 404s on indexed URLs. Google Search Console crawl errors. Lost referral traffic from years of blog posts.

**Warning signs:**
- Plan to change `_config.yml` `permalink:` without a redirect inventory
- Renaming `_posts/` files with spaces or inconsistent slugs (this site has many: `Design Document for ...`)
- Archiving posts by deletion instead of `published: false` + redirect
- No pre-migration URL spreadsheet

**Prevention:**
- **Preserve existing permalink scheme** (`/:year/:month/:day/:title/`) unless there is a strong reason not to
- Before any URL change: crawl live site (Screaming Frog or `html-proofer`) → build old→new redirect map
- For archived posts: keep URL alive with `published: false` or `redirect_from`; never hard-delete without redirect
- Add `permalink:` in front matter when filename-derived slug would change
- Post-launch: monitor Search Console for 4–6 weeks

**Detection:** `html-proofer` on `_site/`. Manual spot-check of top 20 GSC URLs. Search for external links to `tazzledazzle.github.io` and verify each resolves.

**Phase mapping:** **Phase 5 — Blog Curation & Migration**, **Phase 1 — Foundation & Stack Decision** (if stack change alters URL structure)

---

### Pitfall 4: Aggressive Content Purge Without SEO / Backlink Audit

**What goes wrong:** "Curate the blog" becomes mass deletion of legacy academic design docs, interview prep, and old tutorials. Organic traffic drops. Topical authority on macOS/system design weakens.

**Why it happens:** Low-traffic posts look like noise when optimizing for recruiters. Analytics show zero sessions; team deletes them. But some posts may have backlinks, rank for long-tail queries, or support topical clusters.

**Consequences:** Ranking drops. Broken inbound links from other sites. Loss of credibility signals for engineering peers (secondary audience).

**Warning signs:**
- Curation criteria is only "would a recruiter like this?"
- No GSC / Ahrefs / analytics data in curation spreadsheet
- ~28 of 52 posts match low-signal patterns (design docs, forge/interview prep) with no per-URL decision recorded
- Duplicate content pairs (2015 + 2024 versions of same design doc) handled inconsistently

**Prevention:**
- Audit every post with four columns: **URL, traffic (12mo), backlinks, hiring signal (H/M/L)**
- Categories: **feature** (show prominently), **keep indexed** (accessible but not promoted), **archive** (hidden from nav, URL preserved), **consolidate** (merge duplicates, redirect losers)
- For duplicate design-doc pairs: keep the stronger version, `redirect_from` the other — do not leave both indexed
- Default to **hide, not delete**

**Detection:** Compare pre/post-launch organic sessions in GSC. Watch for sudden 404 spikes. Check that `jekyll-feed` and sitemap still include intended posts.

**Phase mapping:** **Phase 5 — Blog Curation & Migration**

---

### Pitfall 5: Optimizing for Designers, Not Recruiters (60-Second Failure)

**What goes wrong:** Beautiful dark theme, animations, and typography — but a recruiter cannot answer "what does this person do, at what level, in what stack?" within 60 seconds. Core value from PROJECT.md is missed.

**Why it happens:** Portfolio modernization defaults to visual polish. About/Career pages use generic copy ("Building scalable systems", "passionate about technology"). Projects page leads with a link to a separate portfolio site and a long deprecated academic list.

**Consequences:** HR screeners bounce. Technical interviewers never get reached. Site impresses peers but not hiring managers.

**Warning signs:**
- Homepage/About requires scrolling past manifesto before seeing role + stack
- Career page lacks company names, dates, and measurable outcomes
- Projects page has 15+ academic repos before 2–3 featured professional projects
- No clear headline: role + primary stack + domain (e.g., "Backend / Platform Engineer — Kotlin, AWS, macOS tooling")
- Skill lists (languages, frameworks) without linked proof projects

**Prevention:**
- **Above the fold:** name, role, stack, one-line value prop, contact/resume link
- Restructure Career with real employers, dates, 2–3 bullets with metrics per role
- Feature **3–4 strong projects** as cards (title, problem, stack, live link, GitHub) — not 8–12 weak ones
- Write for two audiences: HR (scannable, jargon-free summaries) and engineers (GitHub links, technical posts)
- Remove or demote "deprecated" content — it signals neglect

**Detection:** Ask someone unfamiliar: "What does Terence do?" from 10 seconds on homepage. If they cannot answer, headline fails. Test on mobile (375px) — recruiters browse on phones.

**Phase mapping:** **Phase 3 — Hiring Content Architecture**, **Phase 4 — Project Showcase**

---

### Pitfall 6: Broken or Dead Demo Links

**What goes wrong:** Project cards link to Heroku free-tier apps, idle Glitch/Render instances, or repos with no README. Recruiter clicks "Live Demo" → 404 or billing wall.

**Why it happens:** Demos rot faster than code. External portfolio site (`portfolio-projects`) may drift from main site. Links are added at launch, never re-checked.

**Consequences:** Negative signal about maintenance habits — worse than no demo per multiple hiring-manager guides.

**Warning signs:**
- Live demo URLs on free-tier hosts known to sleep or shut down
- Projects page points to two destinations (separate portfolio site + inline list) with unclear which is canonical
- No monthly link-check habit
- GitHub repos lack README or last commit > 12 months

**Prevention:**
- Prefer GitHub links over fragile demos; live demo only when reliably hosted
- Run `html-proofer` or link checker in CI
- Pin best 6 repos on GitHub profile to match featured projects
- Calendar reminder: monthly "click every link on phone"

**Detection:** CI link check fails. Manual audit before any job search push.

**Phase mapping:** **Phase 4 — Project Showcase**, **Phase 7 — Performance, SEO & Accessibility** (CI checks)

---

## Moderate Pitfalls

### Pitfall 7: Navigation and URL Casing Drift

**What goes wrong:** `_config.yml` navigation points to `/About`, `/Projects`, `/Career`, `/Blog` but actual permalinks are `/about/`, `/projects/`, `/career/`. Blog nav entry has a YAML syntax error (`url '/Blog'` missing colon). Case-sensitive servers and inconsistent canonicals confuse crawlers and users.

**Why it happens:** Jekyll page files use mixed casing (`about.markdown`, `projects.md`). macOS dev is case-insensitive; GitHub Pages is case-sensitive.

**Warning signs:** Known typo in `_config.yml` line 28. NAVIGATION_UPDATE.md describes custom header but config still has broken Blog entry.

**Prevention:** Normalize all permalinks to lowercase. Fix YAML. Use `relative_url` filter in templates. One canonical path per page.

**Detection:** Click every nav item in production. Run `html-proofer` with `check_external_links`.

**Phase mapping:** **Phase 2 — Visual Design & UX**, **Phase 3 — Hiring Content Architecture**

---

### Pitfall 8: Big-Bang Redesign Instead of Incremental Delivery

**What goes wrong:** Single massive PR changes theme, all pages, all posts, and CI at once. Hard to review, hard to roll back, long period on a branch with no production updates.

**Why it happens:** Desire for a "clean break" from Minima. Perfectionism.

**Prevention:** Ship in layers: (1) fix nav + About headline, (2) project cards, (3) blog curation, (4) theme/visual refresh, (5) stack migration if needed. Each layer deployable to main.

**Detection:** Branch age > 2 weeks with no merge. PR touches 50+ files across unrelated concerns.

**Phase mapping:** **All phases** — process discipline

---

### Pitfall 9: Over-Engineering the Stack (Next.js for a Markdown Blog)

**What goes wrong:** Choosing Next.js or a heavy SPA for a content site that needs zero client-side JS. Build times balloon, hydration delays LCP, maintenance burden grows (version churn, dependency updates).

**Why it happens:** "Modern" defaults to React. Portfolio tutorials use Next.js.

**Prevention:** For this project: Jekyll (incremental refresh), Astro, or Eleventy fit better than Next.js. Astro if migrating — Markdown ports cleanly, zero JS by default. Stay on Jekyll if visual refresh + curation solves 80% of pain.

**Detection:** Lighthouse shows large JS bundle on pages with no interactivity. `npm run build` > 60s for < 100 pages.

**Phase mapping:** **Phase 1 — Foundation & Stack Decision**

---

### Pitfall 10: Blog Curation Without Discovery UX

**What goes wrong:** Low-value posts are hidden, but high-value posts are also hard to find — no tags, no featured section, no "start here" page. Blog still feels like a chronological dump.

**Why it happens:** Curation focuses on removal, not promotion. Pagination-only navigation.

**Prevention:** Add tags/categories, a "Featured writing" collection, and 3–5 anchor posts linked from About. Keep RSS (`jekyll-feed`) updated. Consider a `/blog/start-here/` page for hiring-relevant technical depth.

**Detection:** Recruiter cannot find best technical writing within 2 clicks from homepage.

**Phase mapping:** **Phase 6 — Blog Discovery & Reading UX**

---

### Pitfall 11: Lighthouse Score Chasing Without Real-World Validation

**What goes wrong:** Team optimizes lab Lighthouse to 100 while mobile CrUX field data still fails LCP. Or: perfect performance but missing `robots.txt`, sitemap, canonical tags, heading hierarchy.

**Why it happens:** Lighthouse is visible and gamified. CrUX and manual a11y testing are harder.

**Prevention:** Fix fundamentals first: semantic HTML, heading order (no h1→h3 skips), alt text, contrast, sitemap, structured data. Validate with PageSpeed Insights field data, not lab-only. Manual keyboard + screen reader pass.

**Detection:** Lighthouse 95+ but PSI "Core Web Vitals: Failed" on mobile. Automated a11y passes but Tab order is illogical.

**Phase mapping:** **Phase 7 — Performance, SEO & Accessibility**

---

### Pitfall 12: Duplicate Content From Legacy Republishing

**What goes wrong:** This site has parallel posts — 2015 "Design Document for ..." files and 2024 `Design-Document-for-...` versions covering the same topics. Search engines see near-duplicate content; blog index looks repetitive.

**Why it happens:** Content was bulk-imported or republished without consolidation plan.

**Prevention:** Pick one canonical version per topic. Unpublish or redirect duplicates. Add `canonical` URL in front matter if needed.

**Detection:** Blog index shows multiple posts with nearly identical titles. GSC "Duplicate without user-selected canonical" warnings.

**Phase mapping:** **Phase 5 — Blog Curation & Migration**

---

### Pitfall 13: Split Portfolio Funnel (Two Sites, One Story)

**What goes wrong:** `projects.md` sends visitors to `tazzledazzle.github.io/portfolio-projects` while also listing a "deprecated" inline project list. Recruiters do not know which to trust.

**Why it happens:** Historical separation of blog and portfolio repos.

**Prevention:** Single canonical Projects experience on main site (cards v1). Link to separate site only if it adds unique value; otherwise redirect or merge. Remove "deprecated" labeling from primary path.

**Detection:** Analytics show bounce between two domains. User testing shows confusion about where projects live.

**Phase mapping:** **Phase 4 — Project Showcase**

---

## Minor Pitfalls

### Pitfall 14: Theme Fork Maintenance Burden

**What goes wrong:** Heavy Minima overrides in `_includes/`, `_layouts/`, `_sass/` become unmaintainable. Upstream theme updates cannot be merged.

**Prevention:** Prefer CSS custom properties and layout overrides over deep forks. If migrating, do not recreate Minima's complexity — start fresh with a minimal layout.

**Phase mapping:** **Phase 2 — Visual Design & UX**

---

### Pitfall 15: Filename and Front-Matter Inconsistency

**What goes wrong:** Posts mix `.md`, `.markdown`, spaces in filenames, missing titles/descriptions. Build works but slugs are ugly; `jekyll-seo-tag` generates weak metadata.

**Prevention:** Normalize new posts to `YYYY-MM-DD-slug.md`. Add `description:` to front matter for SEO. Do not rename published posts without redirects.

**Phase mapping:** **Phase 5 — Blog Curation & Migration**

---

### Pitfall 16: Exposed Email and Scraping

**What goes wrong:** Plain `mailto:` on every page → spam lists. Or: contact form that never works, blocking recruiter outreach.

**Prevention:** Visible email is fine for hiring (recruiters need low friction) — accept some spam. Avoid broken contact forms. Consider obfuscation only if spam becomes unmanageable.

**Phase mapping:** **Phase 3 — Hiring Content Architecture**

---

### Pitfall 17: Skill Bars and Unverifiable Claims

**What goes wrong:** Self-rated "JavaScript 95%" or vague "optimized performance" without numbers. Hiring managers ignore or distrust these.

**Prevention:** Replace skill bars with stack tags tied to specific projects. Use metrics only when defensible ("deployment time −60%" on Career page).

**Phase mapping:** **Phase 3 — Hiring Content Architecture**

---

### Pitfall 18: Ignoring RSS and External Subscribers

**What goes wrong:** Curation changes break feed expectations; full-content vs summary feed not considered.

**Prevention:** Keep `jekyll-feed` working through curation. Document which posts are excluded from feed vs site (if any).

**Phase mapping:** **Phase 6 — Blog Discovery & Reading UX**

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|----------------|------------|
| **1 — Foundation & Stack Decision** | GitHub Pages CI | Safe-mode silent plugin failure | `jekyll build --safe`; consolidate workflows; time-box stack decision |
| **1 — Foundation & Stack Decision** | Stack migration | Paralysis / big-bang rewrite | Ship on Jekyll first; migrate only for concrete blockers |
| **2 — Visual Design & UX** | Navigation | Casing mismatch, YAML typo | Lowercase permalinks; fix Blog nav entry |
| **2 — Visual Design & UX** | Theme | Deep Minima fork | Minimal overrides; mobile-first testing at 375px |
| **3 — Hiring Content Architecture** | About / Career | Generic manifesto copy | Role + stack headline; real employers, dates, metrics |
| **3 — Hiring Content Architecture** | Skills | Lists without proof | Tie each skill to a featured project |
| **4 — Project Showcase** | Demos | Dead links | CI link check; GitHub-first; monthly manual audit |
| **4 — Project Showcase** | Structure | Two portfolio sites | Single canonical Projects page; demote deprecated list |
| **5 — Blog Curation & Migration** | Archiving | Delete without redirect | Hide + preserve URL; redirect map before any slug change |
| **5 — Blog Curation & Migration** | SEO | Traffic-blind purge | Per-URL audit with GSC + backlinks |
| **5 — Blog Curation & Migration** | Duplicates | 2015/2024 design doc pairs | Consolidate to one canonical post per topic |
| **6 — Blog Discovery & Reading UX** | Findability | Chronological dump only | Tags, featured posts, "start here" |
| **6 — Blog Discovery & Reading UX** | RSS | Broken feed after curation | Verify `jekyll-feed` output post-curation |
| **7 — Performance, SEO & Accessibility** | Metrics | Lighthouse-only optimization | CrUX field data; manual keyboard/a11y pass |
| **7 — Performance, SEO & Accessibility** | SEO infra | Missing sitemap/robots/canonicals | Technical SEO checklist before sign-off |
| **7 — Performance, SEO & Accessibility** | CI | No automated checks | `html-proofer` in Actions; Lighthouse CI on PRs |

---

## Project-Specific Risk Summary

| Risk | Evidence in Current Site | Severity |
|------|--------------------------|----------|
| Nav Blog link broken (YAML) | `_config.yml` line 28: `url '/Blog'` | High |
| Nav casing mismatch | Config `/About` vs permalink `/about/` | Medium |
| Hiring signal diluted | ~28/52 posts are design docs, interview prep, forge notes | High |
| Duplicate design-doc posts | 2015 + 2024 versions of same topics | Medium |
| Generic Career/About copy | Placeholder responsibilities, no company names | High |
| Split project presence | `portfolio-projects` + deprecated inline list | Medium |
| Dual CI workflows | `jekyll.yml` and `jekyll-gh-pages.yml` | Medium |
| Safe-mode assumptions | `jekyll-remote-theme`, many plugins in config | Medium |

---

## Sources

| Source | Confidence | Used For |
|--------|------------|----------|
| [Jekyll Plugins Installation](https://github.com/jekyll/jekyll/blob/master/docs/_docs/plugins/installation.md) via Context7 | HIGH | Safe mode, GitHub Pages plugin restrictions |
| [Jekyll GitHub Actions CI](https://jekyllrb.com/docs/continuous-integration/github-actions/) | HIGH | Custom build vs Pages preinstalled action |
| [DrinkBird — GitHub Pages safelist](https://blog.drinkbird.com/courses/jekyll-engineering-blog-github-pages/05-github-pages-and-custom-domain/01-how-github-pages-builds-jekyll/) | HIGH | Silent plugin failure mode |
| [jekyll-redirect-from README](https://github.com/jekyll/jekyll-redirect-from/) | HIGH | Meta-refresh vs 301 limitations |
| [Jesse Squires — permalink redirects](https://www.jessesquires.com/blog/2020/04/15/updating-permalinks-and-adding-redirects-for-jekyll-sites/) | MEDIUM | Permalink change strategy |
| [Advanced Web Ranking — SEO migration](https://www.advancedwebranking.com/blog/seo-migration-best-practices) | MEDIUM | Content audit before removal |
| [Pagepro — CMS migration SEO](https://pagepro.co/blog/wordpress-cms-migration-seo/) | MEDIUM | Redirect map as primary SEO artifact |
| [Showproof — developer portfolio mistakes](https://showproof.io/guides/developer-portfolio-mistakes/) | MEDIUM | Dead demos, mobile, skill bars |
| [Solid Web — hiring manager perspective](https://solid-web.com/developer-portfolio-gets-interviews/) | MEDIUM | HR vs engineer audiences |
| [DEV — portfolio checklist](https://dev.to/_d7eb1c1703182e3ce1782/developer-portfolio-checklist-20-things-hiring-managers-look-for-388p) | MEDIUM | 60-second scan, project curation |
| [Mathewsachin — Jekyll to Astro](https://mathewsachin.github.io/blog/2026/05/02/jekyll-to-astro-migration.html) | MEDIUM | Migration mechanics, stay-on-Jekyll case |
| [Monotonomo — Core Web Vitals portfolios](https://www.monotonomo.com/journal/core-web-vitals-portfolio-sites-2026/) | MEDIUM | Field data vs Lighthouse |
| PROJECT.md + live repo inspection | HIGH | Project-specific risks |
