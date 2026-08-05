# Designer Journal — 2026-07-31

## Pre-Sync Work

Started the morning with a full audit of the four spikes. I knew going in that "BUILT" in the manifest doesn't always mean "wired" — I've been burned by that before where CSS lives in global.css but nobody ever adds the class to the component.

**Spike 001 (hero gradient + grain):** This one is clean. The `.hero` class carries the radial gradient mesh background, the `::after` pseudo-element handles the grain at 0.04 opacity. The opacity on the grain is maybe slightly conservative — I'd go to 0.06 in a future pass — but it's tasteful as-is and the recruiter landing isn't the place to get weird. Hero.astro renders `<section class="hero">`, so the CSS is fully in play. Good.

**Spike 002 (scroll-reveal):** This is where I found the gap. The CSS is solid — `@supports (animation-timeline: scroll())` guard, `prefers-reduced-motion` respect, the whole `animation-range: entry 0% entry 30%` setup. That's thoughtful engineering. But the `.reveal` class was only applied in two places: `ProjectTease.astro` (good) and `CareerTimeline.astro` items (good). The blog index sections — the Featured and Recent sections — had no `reveal` class at all. They'd just pop in statically. That's a missed opportunity on a page where recruiters actually spend time scrolling. I added `reveal` to both sections.

I debated whether to add `reveal` to individual `<li>` blog items instead of the wrapping sections. Staggered item reveals would feel fancier. But the CSS is section-level right now and I didn't want to scope-creep into animation delays without testing whether that actually looks better or just jittery. Section-level reveal is the safe, correct call here.

**Spike 003 (ViewTransitions):** `ClientRouter` is in `MainLayout.astro` and `hero__role` has `transition:name="hero-role"`. Already integrated and correct. No work needed.

**Spike 004 (card hover lift):** `.card.project-card` in CSS has the `will-change: transform` and the hover transition. `ProjectCard.astro` renders `<article class="card project-card ...">`. Wired correctly. The lift is 3px, which feels right — noticeable but not cartoonish.

Overall take on rxl: three spikes were fully integrated, one had a real gap (scroll-reveal missing from blog sections). Closing it with confidence now that the blog sections have the class.

---

## Mid-Point Sync

SWE's note on the Zod v4 migration is reassuring — `z.array(z.string()).default([])` is unchanged, so I don't need to worry about the `tags` field type breaking the rendering paths that PostNav depends on. Tag pages are fine.

What hit me from PM's report: 10 featured posts have been invisible to the tag index because they have empty `tags: []`. That's a content problem I can't fix directly, but it reframes why `ufu` matters more than it looked on paper. Those featured posts — the ones that are supposed to make recruiters stop scrolling — rely on clean prev/next navigation when a reader actually finds and clicks one. If PostNav is confusing or inaccessible, we lose that reader at the bottom of the post instead of giving them a natural "read next" path.

That shifted my thinking on the aria-label fix. I had originally read `ufu` as a minor a11y nicety. PM's framing makes it a retention concern for the posts that matter most. A screen reader user hitting a post-nav link that just announces "Teaching Bazel to a skeptical team" has no context for whether they're going forward or backward in the reading sequence. That's not acceptable.

---

## Post-Sync Work

**qth — hero gradient text color fallback:** This one should have been in the original spike. `background-clip: text` with `-webkit-text-fill-color: transparent` is well-supported in 2026, but the defense-in-depth principle still applies: if anything goes wrong, the heading needs to be readable. I added `color: var(--fg)` immediately before the webkit properties. The rule is simple — when `background-clip: text` is unsupported, `color` is the fallback. When it is supported, `-webkit-text-fill-color: transparent` overrides it. One line, zero risk, pure progressive enhancement. Surprised it wasn't there from the start.

The heading text itself — "Senior Platform & Reliability Engineer" — is the most important text on the hiring page. It cannot be invisible under any circumstances. I feel good about this fix.

**ufu — PostNav aria-label:** The visual display is actually fine. The `::before` pseudo-elements handle "← Previous" and "Next →" labeling. What was missing was the aria-label on the anchor tags themselves. Screen readers announce the link by its accessible name, which — without aria-label — would be the link's text content (just the post title). No directional context at all.

I added `aria-label={\`Previous post: ${prev.title}\`}` and `aria-label={\`Next post: ${next.title}\`}`. This gives screen reader users both direction and destination in a single announcement. Pattern is idiomatic — you see it in all the major blog platform implementations.

One observation I'll flag for the synthesis agent: the `post-nav__prev::before` pseudo-element content ("← Previous") is meaningful but not surfaced to screen readers since pseudo-elements with generated content are inconsistently announced. The aria-label approach supersedes that entirely for AT users. The visual label and the accessible name are now independently correct rather than one trying to serve both.

The PM's framing about those 10 featured posts being high-visibility made me double-check the PostNav component handles `null` prev/next gracefully — and it does, rendering `<span />` placeholders. No broken navigation for posts at the start or end of the sequence.

All three issues resolved. The site's visual craft is fully integrated, the hero heading is bulletproof, and the post navigation is accessible.
