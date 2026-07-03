# Feature Landscape

**Domain:** Personal portfolio + technical blog for software engineer (hiring-focused, peer credibility)
**Project:** Terence Schumacher — tazzledazzle.github.io modernization
**Researched:** 2026-07-01
**Overall confidence:** HIGH (portfolio patterns); MEDIUM (blog discovery features — verified across multiple sources, less standardized than portfolio)

## Audience Split

| Audience | Primary goal on site | Time budget | What convinces them |
|----------|---------------------|-------------|---------------------|
| **Recruiters / hiring managers** | "Is this person worth interviewing?" | 8–60 seconds on first visit | Clear positioning, proof of shipped work, easy contact, professional polish |
| **Engineering peers** | "Does this person think clearly about hard problems?" | 5–15 minutes per post | Technical depth, original writing, code artifacts, discoverable archive |

Both audiences share the same site but scan different sections first. Recruiters hit Home → Projects → Career → maybe one blog post. Peers hit Blog → specific posts → GitHub links → About for context.

---

## Table Stakes

Features users expect. Missing = product feels incomplete or unprofessional.

### Hiring / Portfolio (Recruiter-Facing)

| Feature | Why Expected | Complexity | Notes for This Project |
|---------|--------------|------------|------------------------|
| **Clear value proposition above the fold** | Recruiters skim in seconds; generic "Welcome to my portfolio" wastes the moment | Low | Replace vague headline with role + specialty + impact framing, e.g. "Software Engineer — backend systems, macOS tooling, technical writing" |
| **Scannable project showcase** | Proof of work is the #1 hiring signal; list-of-links pages feel dated | Medium | **Project cards** with title, 1–2 sentence impact summary, tech stack tags, GitHub + live demo links. 3–5 featured, not 20 |
| **Working outbound links** | Broken demo/repo links are an instant disqualifier | Low | Audit quarterly. Current Projects page links to separate portfolio-projects site — consolidate or clearly route |
| **Career / experience timeline** | Recruiters cross-check resume; site should reinforce, not contradict | Low | Existing `career.md` needs real employer names, dates, and quantified outcomes — current version is placeholder-generic |
| **Contact + social in header/footer** | Friction kills outreach; email must be findable without hunting | Low | GitHub, LinkedIn, email already in config — surface consistently on every page |
| **Resume download (PDF)** | Many recruiters still want a PDF for ATS/handoff | Low | Single prominent CTA: "Download Resume." Link to hosted PDF or generate from same source as Career page |
| **Mobile-responsive layout** | ~40% of portfolio views are mobile; broken mobile = rejected | Medium | Minima dark theme is dated; mobile-first redesign is an active requirement |
| **Fast load (<3s, good Core Web Vitals)** | Performance is a credibility signal for engineers | Medium | Static Jekyll is capable; needs image compression, font subsetting, lazy loading pass |
| **Accessible baseline (WCAG 2.1 AA)** | Hiring managers at larger companies notice a11y gaps; also legal risk for some employers | Medium | Semantic HTML, contrast, keyboard nav, alt text, focus states |
| **SEO basics (title, meta, OG tags)** | Links shared on LinkedIn/Slack need good previews; discoverability | Low | `jekyll-seo-tag` exists — verify per-page titles and descriptions are intentional, not defaults |
| **Professional visual design** | Dated theme signals neglect; clean ≠ flashy | Medium | Active requirement. Dark mode is fine; typography, spacing, and hierarchy need modernization |

### Blog (Peer-Facing + Credibility for Recruiters)

| Feature | Why Expected | Complexity | Notes for This Project |
|---------|--------------|------------|------------------------|
| **Readable post layout** | Long-form technical writing needs comfortable line length, heading hierarchy, code blocks | Low–Med | Rouge highlighter exists; improve code block styling, heading anchors, and reading width |
| **Post metadata (date, read time)** | Readers use these to judge freshness and time investment | Low | Date from Jekyll front matter; add estimated read time (word count / 200 wpm) |
| **Syntax-highlighted code blocks** | Technical blog without good code rendering feels amateur | Low | Already via Rouge; ensure language tags on fenced blocks |
| **RSS/Atom feed** | Table stakes for technical audience; feed readers, syndication, AI indexing | Low | `jekyll-feed` exists — expose `<link rel="alternate">` in `<head>` for feed discovery |
| **Pagination or archive** | 52 posts need browseability; infinite scroll alone is poor for archives | Low | Paginate exists (10/page); consider year-based archive index |
| **Tags or categories** | Primary discovery mechanism for topic-focused readers | Medium | Many posts lack consistent front matter tags. Needed for curation tiers |
| **Sitemap** | Search engines and link previews depend on crawlability | Low | Add `jekyll-sitemap` if not present; ensure curated/hidden posts handled correctly |

### Cross-Cutting (Both Audiences)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Consistent navigation** | Users should reach Projects, Blog, Career, About in one click | Low | Fix Blog URL typo in `_config.yml` (`url '/Blog'` missing colon) |
| **HTTPS + custom domain stability** | `tazzledazzle.github.io` is established; don't break URLs | Low | Preserve permalinks (`/:year/:month/:day/:title/`) or add redirects for changed slugs |
| **No broken internal links** | Especially after curation/archive migration | Low | Redirect map for archived posts |

---

## Differentiators

Features that set the site apart. Not universally expected, but valued when done well.

### High-Value Differentiators (Recommended for This Project)

| Feature | Value Proposition | Complexity | Audience | Notes |
|---------|-------------------|------------|----------|-------|
| **Curated blog with quality tiers** | Separates signal from noise; shows editorial judgment | Medium | Both | Featured posts on blog index; archive/hide academic design docs and practice-problem dumps. 13 posts already have `hide: true` — formalize tiers: Featured / Standard / Archived |
| **Project cards with impact framing** | Cards beat bullet lists; impact line beats feature list | Medium | Recruiters | Each card: problem → your role → outcome (even one metric). Links to GitHub + demo. No full case study required for v1 |
| **"Now" / current focus section** | Shows you're active, not a stale portfolio | Low | Recruiters | Brief: what you're building, learning, or open to. 2–3 bullets, update monthly |
| **Featured writing on homepage** | Recruiters who read one post get 10x more context | Low | Both | Surface 2–3 best posts (system design, macOS, recent technical writing) on home or About |
| **Structured data (JSON-LD)** | Better search/social previews; signals technical care | Low | Peers/SEO | Article schema on posts, Person schema on About |
| **Table of contents on long posts** | Improves scanability for deep technical posts | Low–Med | Peers | Auto-generate from h2/h3 headings for posts >800 words |
| **Prev/next post navigation** | Keeps peer readers in the archive | Low | Peers | Adjacent posts by date or series |
| **Open Graph images per post** | LinkedIn/Twitter shares look professional | Medium | Both | Default OG image + optional per-post override |
| **GitHub activity integration** | Live proof of recent engineering work | Low | Recruiters | Pin 3–6 repos on GitHub profile; site links to profile, optionally show pinned repo cards |
| **Speaking / writing index** | Consolidates credibility artifacts | Low | Both | If applicable: talks, publications, notable OSS — single "Writing & Talks" section |

### Aspirational Differentiators (Defer Post-MVP)

| Feature | Value Proposition | Complexity | Why Defer |
|---------|-------------------|------------|-----------|
| Deep project case studies (400–800 words each) | Strongest recruiter signal per showproof.io | High | Explicitly out of scope for v1 per PROJECT.md; cards sufficient initially |
| Full-text search | Useful at 50+ posts | Medium | Client-side filter by tag/title is enough for MVP; search is nice-to-have |
| Newsletter / email capture | Audience building | Medium | Not aligned with hiring-primary goal; adds maintenance |
| Comments (Giscus/Utterances) | Peer engagement | Low–Med | Explicitly out of scope — maintenance cost |
| Interactive demos embedded in posts | High engagement | High | Scope creep; link to live demos from project cards instead |
| Dark/light theme toggle | UX polish | Low–Med | Dark-only is fine for technical brand; add only if trivial with new stack |
| `/uses` or stack page | Personality + context for peers | Low | Nice differentiator post-MVP |
| `llms.txt` / agent-readable catalog | Emerging discovery channel | Low | Interesting for 2026; low priority unless blog becomes primary growth channel |

---

## Anti-Features

Features to explicitly NOT build, or to remove if present.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Skill bars / percentage ratings** | Universally mocked by hiring managers; no objective meaning ("JavaScript 95%") | Group skills by domain (Backend, Systems, Languages) or let projects prove skills |
| **Wall of 30+ technologies** | Reads as resume padding; contradicts "quality over quantity" | Show only tech used in featured projects; max ~12 on a skills summary |
| **Listing the portfolio site itself as a project** | Meta and unimpressive when you have real work | Omit unless it's the only project you have |
| **Unmodified tutorial clones** (Netflix clone, todo app) | Instantly recognizable; signals follow-instructions, not problem-solving | Customize significantly or omit; academic coursework repos belong in secondary/archive tier |
| **Every repo and every blog post on front page** | Dilutes signal; 52 posts include design docs, practice problems, 2015 rants | Curate: 3–5 projects, 10–15 featured posts, archive the rest (still accessible, not promoted) |
| **Generic "passionate developer" copy** | AI-slop tone; wastes recruiter scan time | Specific claims: what you built, what problems you solve, what you're looking for |
| **Placeholder career content** | Current career.md has no employer names — worse than no page | Real experience with dates and metrics, or remove until accurate |
| **Heavy animations / particle effects** | Distract from content; hurt performance and a11y | Subtle transitions only; no autoplay, no scroll-jacking |
| **Contact form with backend** | Adds server, spam, maintenance to a static site | `mailto:` link + LinkedIn + visible email. Optional: Formspree if form is strongly desired |
| **Comments system** | Moderation burden, spam, low ROI for hiring site | Defer per PROJECT.md out-of-scope |
| **CMS / admin panel** | Violates git-based content workflow constraint | Keep Markdown in repo |
| **Auto-playing media** | Accessibility violation; annoys mobile users | User-initiated play only |
| **Blog without curation** | Legacy academic design docs and LeetCode practice posts undermine technical credibility | Tiered visibility: featured, standard, archived |
| **Duplicate project listings** | Projects page links to separate portfolio-projects site AND lists deprecated inline content | Single source of truth: project cards on main site, deprecate redundant page |
| **Stock photos / hero illustrations** | Generic; adds load time; irrelevant for engineering portfolio | Typography and project screenshots only |
| **Pop-ups / email gates on blog posts** | Destroys reading experience and SEO trust | No gates |
| **Infinite scroll without archive page** | Posts from 2015 become unfindable | Year archive + tag pages + pagination |

---

## Feature Dependencies

```
Clear value prop (hero)
  → Projects above fold (recruiter scan path)
  → Project cards (require: GitHub links, 1-line impact, tech tags)
    → Live demo links (require: deployed apps or explicit "code only")

Career page with real data
  → Resume PDF download
  → Skills summary (derived from projects, not independent skill bars)

Blog curation tiers
  → Consistent post front matter (tags, featured flag, hide/archive flag)
    → Tag/category pages
    → Featured posts on blog index
    → RSS feed (must exclude archived/draft posts)
    → Sitemap (same exclusion rules)

Modern layout/theme
  → Mobile responsive
  → Accessibility pass
  → Performance pass (depends on image/font strategy)

SEO (jekyll-seo-tag)
  → OG tags per page
  → JSON-LD (optional enhancement)
  → RSS feed discovery link in <head>
```

**Critical path for hiring goal:**
Hero positioning → Project cards → Real career content → Contact/resume CTA → Mobile + fast + accessible

**Critical path for peer credibility:**
Curated blog → Tags/categories → Readable post UX → RSS → Featured writing surfaced from homepage

---

## MVP Recommendation

Aligned with PROJECT.md active requirements and v1 scope (cards not case studies, curated blog, no comments/CMS).

### Prioritize (Ship in MVP)

1. **Hero + positioning statement** — who, what, hiring CTA above the fold
2. **Project cards (3–5 featured)** — title, impact line, tech tags, GitHub + demo links
3. **Career page with real experience** — employer names, dates, 2–3 quantified bullets per role
4. **Resume download CTA** — one click from header or hero
5. **Curated blog** — featured tier (10–15 posts), archive tier (design docs, practice problems, early rants); RSS/sitemap respect tiers
6. **Tag/category discovery** — minimum viable tags on posts; tag index page
7. **Modern responsive layout** — typography, spacing, dark theme refresh
8. **Navigation fix + consistent footer** — contact links everywhere
9. **Performance + accessibility pass** — Lighthouse 90+ target, WCAG AA basics
10. **RSS feed discovery** — `<link rel="alternate">` in head (feed exists via plugin)

### Include If Cheap (Same Phase)

- Read time on posts
- Prev/next navigation
- "Now" section on About
- 2–3 featured posts on homepage
- JSON-LD Article/Person schema
- Year-based archive index

### Defer (Post-MVP)

| Feature | Reason |
|---------|--------|
| Deep case study pages | Explicitly deferred; cards sufficient for v1 |
| Full-text search | Tag filter + archive adequate at current scale |
| Newsletter / comments | Out of scope; maintenance cost |
| `/uses` page | Low hiring ROI |
| Light mode toggle | Dark brand is established |
| Interactive embedded demos | Complexity; link out instead |
| Testimonials section | Valuable but requires social proof gathering; not blocking interviews |
| Open-source contribution highlights | Link to GitHub; dedicated section later |

### Curation Guidance (Blog)

Based on existing 52 posts, suggested tiers:

| Tier | Criteria | Treatment |
|------|----------|-----------|
| **Featured** | Original technical writing, system design, macOS/systems depth, recent quality posts | Blog index hero, homepage links, RSS |
| **Standard** | Solid posts worth keeping public | Paginated archive, tag pages, RSS |
| **Archived** | Academic design docs, LeetCode practice dumps, 2015 status updates, `hide: true` posts | Accessible via direct URL or `/archive/` but excluded from index, RSS, and sitemap |

This directly addresses PROJECT.md pain point: "legacy academic/design-doc posts dilute signal."

### Curation Guidance (Projects)

| Tier | Criteria | Treatment |
|------|----------|-----------|
| **Featured (card)** | Personal projects with code, clear impact, deployable or strong GitHub README | Project cards on Projects page + optional homepage |
| **Secondary (link)** | Academic coursework repos, older experiments | Collapsed "More Projects" section or link to GitHub org |
| **Omit** | Tutorial clones, empty repos, fork-only repos | Not listed |

---

## Recruiter vs Peer Feature Matrix

| Feature | Recruiters care? | Peers care? | MVP? |
|---------|-----------------|-------------|------|
| Hero value prop | ★★★★★ | ★★☆☆☆ | Yes |
| Project cards | ★★★★★ | ★★★☆☆ | Yes |
| Resume PDF | ★★★★★ | ★☆☆☆☆ | Yes |
| Career timeline | ★★★★☆ | ★★☆☆☆ | Yes |
| Contact links | ★★★★★ | ★★★☆☆ | Yes |
| Mobile + fast | ★★★★☆ | ★★★★☆ | Yes |
| Curated blog | ★★★☆☆ | ★★★★★ | Yes |
| Tags/categories | ★★☆☆☆ | ★★★★☆ | Yes |
| RSS feed | ★☆☆☆☆ | ★★★★☆ | Yes |
| Read time + TOC | ★★☆☆☆ | ★★★★☆ | If cheap |
| Case studies | ★★★★★ | ★★★★☆ | Defer |
| Comments | ★☆☆☆☆ | ★★★☆☆ | No |
| Newsletter | ★☆☆☆☆ | ★★☆☆☆ | No |
| Skill bars | Negative | Negative | Never |
| Animations | ★☆☆☆☆ | ★☆☆☆☆ | Avoid |

---

## Sources

| Source | Confidence | Used For |
|--------|------------|----------|
| [showproof.io — What to Include in a Developer Portfolio (2026)](https://showproof.io/guides/what-to-include-in-developer-portfolio/) | HIGH | Must-haves vs nice-to-haves, case study guidance, blog compounding |
| [showproof.io — Developer Portfolio Mistakes](https://showproof.io/guides/developer-portfolio-mistakes/) | HIGH | Anti-features: skill bars, broken links, stale repos |
| [showproof.io — Developer Portfolio Complete Guide (2026)](https://showproof.io/guides/developer-portfolio/) | HIGH | Skills presentation, quality over quantity |
| [DEV — 40 portfolios reviewed (kethmars)](https://dev.to/kethmars/what-i-learned-after-reviewing-over-40-developer-portfolios-9-tips-for-a-better-portfolio-4me7) | MEDIUM | Projects before about, skill bar anti-pattern, Lighthouse |
| [DEV — Portfolio checklist (eva_clari)](https://dev.to/eva_clari_289d85ecc68da48/things-to-add-to-your-portfolio-website-to-get-hired-58lo) | MEDIUM | Value prop, project structure, blog as credibility |
| [proveyou.to — Do SWEs Need a Portfolio (2025)](https://proveyou.to/blog/do-software-engineers-need-portfolio-2025) | MEDIUM | Hiring manager priorities, clarity over flash |
| [Kieran Roberts — Portfolio do's & don'ts](https://blog.kieranroberts.dev/developer-portfolio-dos-and-donts) | MEDIUM | Tutorial project handling, skill bars, case study guidance |
| [Sagar Sangwan — RSS in 2026](https://blogs.sagarsangwan.dev/blog/why-rss-feeds-still-win-in-2026-a-guide-for-nextjs-developers) | MEDIUM | RSS as table stakes for technical blogs |
| [Delante — RSS for AI Search](https://delante.co/how-to-prepare-your-blog-and-rss-feed-for-ai-search/) | MEDIUM | Feed discovery, structured metadata |
| PROJECT.md + existing site audit (`_config.yml`, `Projects.md`, `career.md`, `_posts/`) | HIGH | Project-specific gaps, curation needs, existing capabilities |
