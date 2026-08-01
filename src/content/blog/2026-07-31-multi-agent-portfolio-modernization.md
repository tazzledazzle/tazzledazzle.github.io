---
title: "Three Perspectives on Modernizing a Technical Blog: A Multi-Agent Sprint"
pubDate: 2026-07-31
description: "A Designer, a Principal SWE, and a Product Manager walk into a codebase. This is what they found, what they fixed, and where they disagreed."
tags: [astro, portfolio, engineering-process, ux, ci-cd]
draft: false
---

There is a particular kind of technical debt that only accumulates on side projects: the kind where everything *mostly* works. The CI passes. The build succeeds. The site loads. And yet, the hero heading is one broken CSS property away from being invisible. Ten featured posts have sat in a tag vacuum for months, invisible to anyone browsing by topic. A pubDate in the RSS feed has been quietly wrong since the post was written. Nobody's job was to notice.

This site — a portfolio and technical blog modernized from Jekyll to Astro over several phases — had reached that point. Not broken. Not embarrassing. But not polished either, and polish is the point. A hiring site that mostly works is not meeting its brief. A recruiter who lands on a featured post and hits a dead end hasn't been impressed; they've been subtly let down.

The backlog going into this sprint held nine specific issues: visual integration gaps that had slipped through phase verification, type-safety problems hiding behind missing CI gates, content discoverability failures that had been filed and forgotten, and a Phase 5 UAT that was still open because nobody had run the tests. All of it was known. None of it was catastrophic. All of it needed to get done.

The interesting part wasn't the individual fixes. Any one of these could have been knocked out in an afternoon by a single developer. The interesting part was the decision to run them in parallel with three specialized agents — a Designer, a Principal Software Engineer, and a Product Manager — working from their own domain lenses simultaneously, syncing at the midpoint, then finishing independently. The bet was that domain isolation would produce better decisions: that a Designer thinking purely about visual craft would catch things a generalist wouldn't, that a SWE focused entirely on type safety and CI hygiene wouldn't cut corners to close UAT faster, that a PM reading the actual content of ten blog posts would make better tagging decisions than a system that had never read them.

Whether that bet paid off is what this post documents.

---

## The Setup: Three Agents, Nine Issues, One Codebase

The orchestration pattern used here is what you might call Option C: parallel execution with a mandatory mid-point sync. Each agent starts independently on their assigned issues. At a defined midpoint, all three pause and exchange status — not to merge changes, but to surface surprises that might affect the other agents' decisions. Then they continue to completion.

This pattern matters because the alternative extremes both fail for different reasons. Fully serial execution — one person grinding through the list in order — is slow and context-switches constantly between visual thinking, systems thinking, and user-empathy thinking. Fully parallel execution with no sync risks agents making decisions that contradict each other, or worse, agents finishing their work without knowing that their counterpart's findings changed the stakes.

The mid-point sync is where the real value lives.

The issue assignments going in:

**Designer (rxl, qth, ufu):** Three issues: verify the four visual spikes were actually wired into the site (not just written), add a color fallback to the hero gradient text, and fix PostNav aria-labels for screen reader clarity.

**Principal SWE (bbm, f3s, 4to, 4zk):** Four issues: migrate the content schema from Zod v3 to Zod v4 API, add `astro check` to CI as a type-check gate, close a stale quick plan for a lychee config fix that had already been applied, and correct a pubDate mismatch in a blog post.

**PM (29s, b51):** Two issues: tag ten featured posts that had been sitting with empty tag arrays for months, and run Phase 5 UAT on five pending tests.

Nine issues. Three agents. One codebase that was about to get substantially better across dimensions none of the agents had full visibility into alone.

---

## The Designer's Perspective

The Designer started where designers should start: with a systematic audit rather than an assumption. "BUILT in the manifest doesn't always mean 'wired,'" her journal notes at the top. "I've been burned by that before where CSS lives in global.css but nobody ever adds the class to the component."

That skepticism was warranted. Three of the four spikes checked out cleanly. The hero gradient was integrated — `.hero` carries the radial gradient mesh, the `::after` pseudo-element handles the grain texture at 0.04 opacity. ViewTransitions were correctly placed, with `ClientRouter` in `MainLayout.astro` and `hero__role` carrying a `transition:name` attribute. The card hover lift was wired: `.card.project-card` in CSS had `will-change: transform` and the right hover transition, and `ProjectCard.astro` rendered the matching class.

> "Spike 001 (hero gradient + grain): This one is clean... The opacity on the grain is maybe slightly conservative — I'd go to 0.06 in a future pass — but it's tasteful as-is and the recruiter landing isn't the place to get weird."

And then: Spike 002, scroll-reveal.

The CSS itself was well-engineered. `@supports (animation-timeline: scroll())` guard, `prefers-reduced-motion` respect, careful `animation-range: entry 0% entry 30%` configuration. The engineering of the animation was thoughtful. What wasn't thoughtful was the application — the `.reveal` class had only been added to `ProjectTease.astro` and `CareerTimeline.astro`. The blog index sections — the Featured posts section and the Recent posts section — had no `reveal` class at all. Visitors scrolling through them would see static content pop in, identical to a site with no scroll animations at all.

> "That's a missed opportunity on a page where recruiters actually spend time scrolling."

The fix was to add `class="reveal"` to both `<section>` elements in `src/pages/blog/index.astro`. But the Designer's journal documents something more interesting than the fix itself: the decision she explicitly didn't make.

> "I debated whether to add `reveal` to individual `<li>` blog items instead of the wrapping sections. Staggered item reveals would feel fancier. But the CSS is section-level right now and I didn't want to scope-creep into animation delays without testing whether that actually looks better or just jittery. Section-level reveal is the safe, correct call here."

This is the kind of constraint that matters in solo-maintainer projects: the instinct to make something fancier is almost always available, and it's almost always the wrong call when the alternative is shipping the correct version of what was designed. Staggered item reveals might look better. They also might feel jittery on mid-range devices, might need new CSS variables, might interact poorly with the `prefers-reduced-motion` guard in non-obvious ways. Section-level reveal, added to the right elements, is verifiable and clean. That's the decision.

The color fallback issue (qth) was technically simpler but philosophically important. The hero heading — "Senior Platform & Reliability Engineer" — uses `background-clip: text` with `-webkit-text-fill-color: transparent` to render gradient text. This works in every modern browser. The problem is what happens in any context where it doesn't: the heading text becomes invisible, rendered transparent against whatever background the browser shows. The heading that's supposed to tell a recruiter exactly who Terence is and what he does becomes a blank space.

> "One line, zero risk, pure progressive enhancement. Surprised it wasn't there from the start."

The fix: `color: var(--fg)` immediately before the webkit properties. When `background-clip: text` is supported, `-webkit-text-fill-color: transparent` overrides the color. When it isn't, the heading renders in the foreground color. The property cascade does exactly what progressive enhancement is supposed to do: the base experience is correct, the enhanced experience is additive.

The PostNav aria-label fix (ufu) started as a minor accessibility nicety and was reframed at the mid-point sync. The visual display was already adequate: `::before` pseudo-elements on `.post-nav__prev` and `.post-nav__next` handled "← Previous" and "Next →" labeling visually. What was missing was the `aria-label` on the anchor tags themselves.

Without it, screen readers would announce the link by its accessible name — the post title. "Teaching Bazel to a skeptical team." No directional context. A screen reader user hitting PostNav at the bottom of a post has no idea whether they're navigating forward or backward in the sequence.

The fix was `aria-label={\`Previous post: ${prev.title}\`}` and `aria-label={\`Next post: ${next.title}\`}`. The Designer's journal makes a point worth underscoring about how this interacts with the pseudo-element content:

> "The `post-nav__prev::before` pseudo-element content ('← Previous') is meaningful but not surfaced to screen readers since pseudo-elements with generated content are inconsistently announced. The aria-label approach supersedes that entirely for AT users. The visual label and the accessible name are now independently correct rather than one trying to serve both."

Two independently correct labeling systems is a better architecture than one labeling system trying to serve both visual and assistive technology contexts. That principle scales beyond PostNav.

The grain overlay observation from the Designer came at the mid-point sync rather than as a fix: the SVG filter running on every page as part of the grain texture is potentially expensive on CPU timing, and would show up on a Lighthouse trace for a mid-range device. She flagged it and deferred it deliberately.

> "Not blocking but it's the kind of thing that will show up on a Lighthouse CPU timing trace for a mid-range device. Worth a bead for future investigation. It's a classic 'looks cheap in code, costs cycles in paint' trap."

That self-awareness about what to fix now versus what to file for later is characteristic of the sprint as a whole: the goal was closing nine specific issues cleanly, not discovering new ones and chasing them.

---

## The Principal SWE's Perspective

The Principal SWE started with a question that engineers who've been around long enough learn to ask before assuming a problem is real: is this actually a problem, or just a ticketed concern that hasn't materialized?

For the Zod migration (bbm), the answer was unambiguous. Running `npm list zod` revealed Astro 7 ships `zod@4.4.3`, but the re-export from `astro:content` is marked deprecated. Running `astro check` immediately returned 85-plus deprecation hints, all pointing to `z` usage in `content.config.ts`, plus 10 actual errors in `editor.astro` that had nothing to do with Zod.

The Zod migration itself had two distinct parts. First, the import path: `import { z } from 'astro:content'` was the Astro 6 pattern; `import { z } from 'astro/zod'` is the Astro 7 canonical path, re-exporting from `zod/v4`. Second, five call sites using `z.string().email()` and `z.string().url()` — chained validators that Zod v4 replaces with standalone `z.email()` and `z.url()`.

> "The fix was straightforward once I traced the import chain. Changed the import, changed the 5 chained `.email()`/`.url()` calls to v4 standalone form. Satisfied that this is the right migration — Zod v4 standalone validators are actually cleaner at the schema level."

What the SWE did NOT expect was what came with it. The 10 errors in `editor.astro` were all `ts(2307): Cannot find module '/src/lib/editor/...'`. Browser-path dynamic imports — Vite resolves `/src/` as the project root at build time, but TypeScript's module resolver saw absolute URL paths with no mapping in `tsconfig.json`. The `tsconfig` had `baseUrl: "."` but no `paths` entry to teach TypeScript that `/src/*` maps to `./src/*`.

> "The editor feature has been silently broken from a type-checking perspective, probably since it was first written."

The SWE fixed it — `"/src/*": ["./src/*"]` added to tsconfig `paths` — and the journal documents exactly why she didn't consider leaving it:

> "Leaving 10 errors in the check output while claiming the Zod migration 'fixed the warnings' would be dishonest. Added `"/src/*": ["./src/*"]` to tsconfig `paths`. `astro check` now reports 0 errors, 0 warnings."

This is a professional standard worth naming: a CI gate with pre-existing errors is a gate that gets bypassed in 48 hours when someone is tired. If the type checker reports errors before the new gate lands, the new gate will be treated as noisy from day one. The tsconfig fix wasn't technically in scope for the Zod ticket. It was the price of claiming the Zod ticket was done.

The CI gate addition (f3s) was architecturally simple: one step added to `.github/workflows/deploy-pages.yml` between `npm ci` and `npm run build`, using `npx astro check`. The placement is intentional — you want type checking before the build consumes type-incorrect code. The journal's commentary on why this should have existed from the beginning is worth quoting:

> "This should've existed from day one — type errors are the kind of thing that accumulate invisibly when there's no gate, and 10 was already too many before I fixed them."

The sequencing decision that made the CI gate work — fix to zero errors first, then add the gate — reflects a mature understanding of how gates function in practice. A gate that starts with failures is treated as a suggestion. A gate that starts at zero is treated as a standard.

The stale plan closure (4to) surfaced something about planning artifacts that applies well beyond this sprint. The lychee config fix — a URL checker configuration that had been updated to use `base_url` instead of `base`, removing an invalid `include_path` field — had already been applied to `lychee.toml`. The quick plan for it remained open as `in-progress`. Someone had fixed the underlying issue without updating the plan.

> "Plans that don't reflect reality are worse than no plans — they create false urgency and erode trust in the planning artifacts."

The fix was updating a status field and a date. The principle is more broadly applicable: stale in-progress items in any tracking system create two costs. The first cost is cognitive: anyone reading the backlog assumes those items need work. The second cost is trust: when the system is known to have stale entries, people stop trusting the accurate entries too.

The pubDate mismatch (4zk) was quiet and consequential. `practice-makes-perfect.md` had `pubDate: "2024-12-16"` in its frontmatter, but the filename — `2025-01-02-practice-makes-perfect.md` — and the permalink — `/2025/01/02/` — both said January 2025. The SWE's fix was to change the pubDate to `2025-01-02`, and her reasoning is precise:

> "The canonical source of truth for a post's date is the filename and permalink, not a manually-typed frontmatter string. The filename says 2025-01-02. The permalink says 2025-01-02. The pubDate saying 2024-12-16 was a transcription error that would display wrong dates in the blog listing and RSS feed."

Feed readers that processed the post when it was published would have seen a December 2024 date and filed it accordingly. Readers sorting or filtering by date would find it in the wrong position. The pubDate is surfaced in the blog listing, in the RSS feed, and in any SEO metadata. Getting it wrong is a quiet, persistent inaccuracy that touches every surface where the post appears.

After all four issues, `astro check` returned 0 errors, 0 warnings. The build had a clean type-check gate for the first time.

---

## The PM's Perspective

The PM picked up issue 29s — ten featured posts with empty tag arrays — and the frustration came before the work.

> "These are the *featured* posts. The ones we presumably want recruiters to find. And they have had zero tags for months. That means anyone landing on the kotlin cheatsheet has no tag cloud to click, no 'related topics' trail. The post is a dead end. You read it, and then what? You navigate away, that's what."

This framing — "the post is a dead end" — captures what content discoverability failure actually costs. It's not that the post is hard to find. It's that finding the post doesn't lead anywhere. A recruiter who reads the Kotlin cheatsheet and wants more Kotlin content has no path forward. A reader who lands on the OpenTelemetry post and wants more observability content has nowhere to go. Each featured post is an island.

The tagging work required actually reading the posts, and the PM's journal documents her content decisions with enough specificity to show the thinking. The `aditl` post was particularly interesting:

> "Interesting post. The intro is about fixing the website, then it pivots to C++ code examples (Locomotion strategy patterns). It's genuinely a 'day in the life' as an engineer — fixing infrastructure, writing code. I dropped `'astro'` from the suggestion since the post doesn't mention Astro at all; it's about build pipelines and C++ design patterns."

That's the kind of call that requires reading — a tagger working from titles and suggested keywords would have included `astro` in the tags because the post category is "portfolio updates" and the site runs on Astro. But the post's actual content is about something else entirely. Tags that don't match content create discoverable-but-wrong paths: a reader clicking an Astro tag expecting Astro content and landing on a C++ design patterns post has been misled, not served.

Similar judgment calls appeared throughout:

On the diagrams post: "Dropped 'diagrams' since the title says 'web application architectures and components' and the content is architecture concepts, not diagramming tools."

On the debugging post: "I used `['debugging', 'software-engineering', 'troubleshooting']` — these are accurate to the content and more useful as discovery vectors than the suggested tags."

Ten posts. Twenty to forty minutes of reading. Result: `debugging`, `software-engineering`, `troubleshooting`, `career`, `interviewing`, `behavioral`, `observability`, `temporal`, `cloud-native`, `library-evaluation`, and more — all new tag index routes generated at build. The site went from 82 generated pages to 111.

The PM's Phase 5 UAT work (b51) illustrates a different kind of problem-solving: how to run user acceptance tests without a browser. The five pending tests covered post readability, sticky header behavior, mobile navigation, keyboard focus visibility, and the phase verification gate.

For tests 2 through 5, the PM used code-review-based verdicts — reading the CSS and component implementations directly, verifying that what the code said should happen matched what the tests required. This is not the same as testing in a browser, and the PM's journal is explicit about that:

> "Verdict: PASS (conditional on browser rendering matching the code-level intent, which the code strongly supports)."

The qualification matters. Code-review verification of CSS is high-confidence for properties like `position: sticky` and `min-height: 44px`, where the browser behavior is well-specified and predictable. It's lower-confidence for anything involving interaction, layout cascade interactions, or rendering subtleties. The PM documented her methodology clearly enough that anyone who needs to dispute a verdict knows exactly what kind of evidence it was based on.

Test 6 — the verification gate — was where things got interesting. The PM ran `npm run verify:phase5` and it failed immediately on `DESN-04 65ch prose width: pattern /65ch/ not matched`. The `.post-body` selector had no `max-width` rule at all. Blog post prose was rendering at 54rem — roughly 864 pixels at default font size — which is comfortable for code blocks but exhausting for reading paragraphs.

> "This change also unblocked the verify:phase5 DESN-04 check which was explicitly testing for `65ch`... A featured post page like the kotlin cheatsheet was rendering prose at 54rem width — about 864px — which is too wide for comfortable reading. The 65ch constraint brings it to approximately 520-650px for the prose body while letting code blocks and tables still expand. This is a real readability improvement, not just a CI checkbox."

The `max-width: 65ch` rule on `.post-body` is a standard typographic constraint — 65 characters per line is the canonical optimum for sustained reading comprehension. The existing CSS already exempted `pre`, `table`, and `.expressive-code` blocks from the constraint, so technical content would still breathe at full width. The prose fix was a genuine quality gap, not a box-checking exercise.

The PM closed both issues. The gate passed.

---

## Where They Collided: Cross-Cutting Themes

The mid-point sync is where three parallel streams of work became a single coherent sprint.

The Designer flagged the grain overlay performance concern. The SWE's response in her own journal — logged after hearing it at sync — was direct:

> "Not blocking but it's the kind of thing that will show up on a Lighthouse CPU timing trace for a mid-range device. Worth a bead for future investigation. It's a classic 'looks cheap in code, costs cycles in paint' trap. I won't touch it now."

Both agents reached the same conclusion independently: defer it, file it, don't let it become scope creep. The grain overlay is a future performance investigation, not a blocker for today's polish sprint. Agreement without collision.

The PM's tag work landed differently at the sync than it had appeared when the issue was filed. From the Designer's journal:

> "What hit me from PM's report: 10 featured posts have been invisible to the tag index because they have empty `tags: []`. That's a content problem I can't fix directly, but it reframes why `ufu` matters more than it looked on paper."

The PostNav aria-label fix had been on the list as a minor a11y nicety. Once the PM surfaced that ten high-visibility posts were about to get their first real discoverability — tag pages, discovery paths, a reason for readers to navigate between posts — the PostNav fix became a retention concern. A reader who discovers the OpenTelemetry post through the new `observability` tag page and wants to explore more posts in the sequence needs PostNav to work correctly. The Designer double-checked that PostNav handled null prev/next gracefully for posts at the start and end of the sequence. It did.

The SWE's CI gate work intersected with the PM's UAT timeline in a way that required explicit coordination. From the PM's journal:

> "I want that gate running before we close out b51, because 'passes verify:phase5' is not the same as 'no type regressions.' The SWE's CI work and my UAT work should land at roughly the same time."

And from the SWE's journal:

> "PM explicitly wants the CI gate (f3s) deployed before phase 5 UAT closes. That confirms my sequencing decision: fix to green first, add the gate second. I'm not going to add a gate that immediately blocks CI — that's just creating noise for myself and defeating the purpose of a gate."

This is a real coordination problem: if the PM closes UAT before the CI gate exists, the declaration of "done" is weaker. If the SWE adds the gate before fixing the pre-existing errors, the gate fails immediately and causes noise. The correct ordering was clear only once both agents had heard each other's context. Fix errors → add gate → close UAT. That's the sequence the sync produced.

The SWE's tsconfig discovery was invisible to everyone except the SWE — and that's precisely why it mattered. The Designer's visual work didn't depend on TypeScript module resolution. The PM's content work didn't touch the editor feature. But a CI gate with 10 pre-existing type errors is a gate that gets muted and eventually bypassed. Fixing the tsconfig paths wasn't just about the editor feature; it was about the gate being trustworthy from day one.

> "A CI gate with 10 pre-existing errors is a gate that gets bypassed in 48 hours when somebody is tired."

That observation from the SWE's journal is the kind of institutional knowledge that gets lost when projects have no one whose job is to care about systemic quality. A designer closes the visual issues. A PM closes the content issues. Nobody closes the "our CI gate will be ignored" issue unless a SWE is explicitly assigned to think about CI hygiene.

The three agents also pushed each other's stakes upward in ways that are worth naming. The Designer's accessibility work — the PostNav aria-labels — mattered more once the PM's tagging work made those featured posts discoverable. Ten posts that had been invisible to tag browsing becoming first-class citizens of the tag index meant more readers would be navigating between them. The PostNav fix went from "minor a11y nicety" to "essential for the reading experience on our highest-visibility content."

The PM's prose width fix (`max-width: 65ch`) mattered more in context of the Designer's scroll-reveal work. A reader who arrives at a featured post via a tag page, reads through well-constrained prose with proper scroll-reveal animations on the way down, and then hits PostNav with clear directional labels — that's a coherent reading experience. Each individual fix is small. The combination is what makes the site feel considered rather than assembled.

---

## Conclusion: What the Site Looks Like Now

Nine issues closed. 111 pages generated, up from 82. A CI gate that runs `astro check` before every build and reports 0 errors. Featured posts with real tags and working scroll-reveal on the sections where recruiters scroll.

What changed, specifically:

The blog index now reveals its sections on scroll. The Featured Posts section and Recent Posts section were rendering statically before this sprint; they now animate in with the same thoughtful scroll-reveal that ProjectTease and CareerTimeline had. On a page where the goal is to hold a recruiter's attention while they scan post titles, that animation serves a purpose.

The hero heading is bulletproof. "Senior Platform & Reliability Engineer" will be legible under any rendering conditions because the color fallback now exists. One line of CSS, zero risk, the most important text on the page protected against browser edge cases.

PostNav is accessible. Screen reader users navigating between posts now hear "Previous post: Teaching Bazel to a skeptical team" rather than just "Teaching Bazel to a skeptical team" — direction and destination in a single announcement.

Ten featured posts are discoverable by topic for the first time. The Kotlin cheatsheet is tagged. The OpenTelemetry post is tagged. The cloud-native patterns post is tagged. Readers who arrive through a tag page can navigate to related content. The site's content investment is now surfaced to its discovery investment.

The type-check gate exists. Future Zod migrations, future content schema changes, future editor features — they all pass through `astro check` before they reach the build. The tsconfig paths fix means the gate starts at zero and will stay near zero as long as people are paying attention.

The pubDate in the RSS feed is correct. This one is invisible to most visitors and essential to feed readers. It's the kind of fix that's easy to skip and wrong to skip.

What remains: the grain overlay SVG filter performance question is filed as a bead and deferred to a future Lighthouse audit pass. The code-review-based UAT verdicts for tests 2 through 5 are high-confidence but not browser-verified; a future phase should run them in a real browser. The editor feature — now type-checking cleanly — has its own issue history and its own roadmap.

The multi-agent model worked here for a specific reason: the issues genuinely belonged to different domains. Visual integration, type safety, and content quality don't cross-contaminate much at the implementation level. What they do cross-contaminate is at the level of stakes and sequencing — which is exactly what the mid-point sync was designed to surface.

At scale, this model would need more structured output formats. The Designer's grain overlay observation was a note in a journal; at scale, it needs to become a filed issue with enough context for whoever runs the Lighthouse audit to know what to look for. The SWE's tsconfig discovery could have been filed as a separate issue rather than absorbed into the Zod ticket; the fact that it was absorbed makes the audit trail slightly harder to read. The PM's UAT methodology footnote about code-review versus browser verification should probably be a documented protocol rather than a qualification in a test verdict.

But for a nine-issue sprint on a solo-maintainer portfolio site, three agents with clear domain assignments, a mid-point sync, and journals that documented their thinking produced something better than what a single generalist running down a checklist would have. The Designer noticed the grain opacity was conservative. The SWE noticed the tsconfig was silently broken. The PM noticed that "aditl" shouldn't be tagged `astro` because she read the post. None of those observations were on the issue tickets. They all made the site better.

The site is a hiring asset. A hiring asset must be polished, discoverable, and technically correct. It is now measurably more all three.

---

*Issues closed in this sprint: rxl, qth, ufu (Designer) · bbm, f3s, 4to, 4zk (Principal SWE) · 29s, b51 (PM). Build output: 111 pages. Type check: 0 errors.*
