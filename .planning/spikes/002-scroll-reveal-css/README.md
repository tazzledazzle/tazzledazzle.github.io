---
spike: "002"
name: scroll-reveal-css
type: standard
validates: "Given sections below the fold, when the user scrolls, then each section fades+slides in using CSS-only animation-timeline: view() — no JS, no layout jank"
verdict: PENDING
related: ["001"]
tags: [css, scroll, animation, baseline-2024]
---

# Spike 002: scroll-reveal-css

## What This Validates
Given sections below the fold, when the user scrolls, then each section fades+slides in using CSS-only `animation-timeline: view()` — no IntersectionObserver, no JS, no layout jank.

## Research

| Approach | Tool | Pros | Cons | Status |
|----------|------|------|------|--------|
| CSS Scroll-driven Animations | `animation-timeline: view()` | Zero JS, native, composited | Baseline 2024 (Chrome 115+, FF 110+, Safari 18+) | **Chosen** |
| IntersectionObserver | JS | Wide support | JS-dependent | Rejected |
| AOS / GSAP ScrollTrigger | JS library | Fancy | Bundle weight, JS required | Rejected |

**Chosen approach:** `@keyframes reveal-up` (opacity 0→1, translate 0 1.5rem→0) with `animation-timeline: view()` and `animation-range: entry 0% entry 30%`. Wrapped in `@supports (animation-timeline: scroll())` so browsers without support show elements statically (no FOIC).

Applied `.reveal` class to:
- `.project-tease` section (homepage featured work)
- `.career-timeline__item` list items (each role reveals individually as you scroll)

## How to Run
```
npm run dev
```
Visit `http://localhost:4321` — scroll down past the hero to see project cards reveal. Visit `/career/` and scroll to see each career role animate in.

## What to Expect
- Project tease section fades up as it enters the viewport
- Each career timeline item slides up individually as you scroll through them
- No JS in DevTools network panel for this behavior
- Older browsers (Safari < 18) show elements static — no blank content

## Investigation Trail
- **v1:** Added `@keyframes reveal-up` with `animation-timeline: view()` + `@supports` guard.
- **Range:** `entry 0% entry 30%` means the animation plays during the first 30% of the element's entry into the viewport — feels natural, not slow.
- **translate vs transform:** Used `translate` property (not `transform: translateY`) — same GPU compositing, cleaner syntax.
- **Career items:** Applied to individual `<li>` items rather than the whole list — each role reveals as you scroll past it, which reads better with a long timeline.

## Results
PENDING — verify by running dev server and scrolling.
