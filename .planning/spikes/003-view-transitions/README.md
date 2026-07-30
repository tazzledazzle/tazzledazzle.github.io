---
spike: "003"
name: view-transitions
type: standard
validates: "Given a user clicks a nav link, when the page changes, then it feels like a native app with smooth morph/fade via Astro ViewTransitions"
verdict: PENDING
related: ["001"]
tags: [astro, navigation, transitions, view-transitions-api]
---

# Spike 003: view-transitions

## What This Validates
Given a user clicks a nav link, when the page changes, then it feels like a native app with smooth morph/fade using Astro's built-in `<ViewTransitions />` component — with named transitions on persistent elements.

## Research

| Approach | Tool | Pros | Cons | Status |
|----------|------|------|------|--------|
| Astro ViewTransitions | Built-in `astro:transitions` | Zero config, works with MPA, fallback included | Requires same element on both pages for morph | **Chosen** |
| CSS `@view-transition` raw | Pure CSS | No framework dep | Complex to wire up manually | Rejected |
| Framer Motion page transitions | React + Framer | Very smooth | Requires React island, adds JS weight | Rejected |

**Chosen approach:** `<ClientRouter />` (Astro 5+ renamed `ViewTransitions` → `ClientRouter`) in `<head>` of MainLayout. Named transitions:
- `transition:name="site-brand"` on header logo (persists across all pages, morphs)
- `transition:name="hero-role"` on the h1 in Hero (morphs when navigating to/from homepage)

Astro's default transition is a crossfade. Named elements get the View Transitions API morph effect.

## How to Run
```
npm run dev
```
Click between pages in the nav — Home, Blog, Work, Career. Watch for the fade transition. Navigate to and from the homepage to see the hero heading morph.

## What to Expect
- Smooth crossfade between all pages (no hard refresh flash)
- Header brand name smoothly persists/morphs across navigation
- Hero h1 morphs when navigating away from the homepage

## Investigation Trail
- **v1:** Added `<ViewTransitions />` import and placement in `<head>`. Named `site-brand` on header anchor, `hero-role` on Hero h1.
- **Fallback:** Astro's ViewTransitions includes a JS fallback for browsers without the View Transitions API — navigation still works, just without the animation.
- **Gotcha to watch:** `transition:name` values must be unique per page. Two elements with the same name on one page will cause issues.

## Results
PENDING — verify by navigating between pages in dev server.
