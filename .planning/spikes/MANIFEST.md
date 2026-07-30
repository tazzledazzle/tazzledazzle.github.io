# Spike Manifest

## Idea
UI improvements to give the portfolio site a performant "wow factor" — visual depth, motion, and interactivity that signal craft without hurting performance. All techniques are CSS-first, zero-JS where possible, and GPU-composited to maintain 60fps.

## Requirements

- No JS for visual effects unless Astro-native (e.g., ViewTransitions)
- All animations must be GPU-composited (transform/opacity only, no layout-triggering properties)
- Zero layout shift on load
- Must work on the existing dark GitHub-palette (#0d1117 bg, #58a6ff accent)
- No third-party animation libraries

## Spikes

| # | Name | Type | Validates | Verdict | Tags |
|---|------|------|-----------|---------|------|
| 001 | hero-gradient-depth | standard | Given a visitor lands on the homepage, when the hero renders, then they feel immediate visual craft via gradient mesh bg + gradient text h1 + grain — zero JS, zero layout shift | BUILT | css, hero, gradient, grain |
| 002 | scroll-reveal-css | standard | Given sections below the fold, when the user scrolls, then each section fades+slides in using CSS-only `animation-timeline: view()` — no JS, no layout jank | BUILT | css, scroll, animation |
| 003 | view-transitions | standard | Given a user clicks a nav link, when the page changes, then it feels like a native app with smooth morph/fade via Astro `<ViewTransitions />` | BUILT | astro, navigation, transitions |
| 004 | card-hover-lift | standard | Given project cards on homepage, when hovered, then they lift with border glow — GPU-composited CSS, 60fps | BUILT | css, hover, cards |
