---
spike: "004"
name: card-hover-lift
type: standard
validates: "Given project cards on homepage, when hovered, then they lift with border glow — GPU-composited CSS, 60fps"
verdict: PENDING
related: ["001"]
tags: [css, hover, cards, micro-interactions, gpu]
---

# Spike 004: card-hover-lift

## What This Validates
Given project cards on the homepage, when hovered, then they lift with a border glow pulse — using GPU-composited CSS `transform` and `box-shadow` only, targeting 60fps.

## Research

| Approach | Tool | Pros | Cons | Status |
|----------|------|------|------|--------|
| CSS transform + box-shadow | Pure CSS | GPU-composited, zero JS | Shadow not composited (but cheap) | **Chosen** |
| CSS filter: drop-shadow | Pure CSS | Composited | Can't target border separately | Considered |
| JS mouse-position glow | JS + CSS vars | Fancy spotlight effect | JS overhead, complexity | Rejected |

**Chosen approach:** `transform: translateY(-3px)` + `box-shadow` + `border-color` on `.card.project-card:hover`. `will-change: transform` promotes the card to its own compositor layer. `box-shadow` is not GPU-composited but is cheap at this size. Transition: 200ms ease.

Also applied to `.btn`: `translateY(-1px)` + border/background change on hover.

## How to Run
```
npm run dev
```
Visit `http://localhost:4321` and hover over the project cards. Also hover the CTA buttons.

## What to Expect
- Project cards lift 3px and show a blue border glow when hovered
- Buttons lift 1px and their border brightens
- No layout reflow — only transform and box-shadow animate
- 60fps on any modern device (verify with DevTools Performance panel)

## Investigation Trail
- **v1:** Added `transition` and `:hover` states to `.card.project-card` and `.btn`.
- **will-change:** Added `will-change: transform` on `.card.project-card` to promote to compositor layer proactively.
- **Color:** Used `color-mix(in srgb, var(--accent) 60%, transparent)` for border — matches the site palette without hardcoding.
- **Box-shadow:** Two layers — accent-tinted outer glow + dark inner shadow — gives depth without looking like a light-mode card.

## Results
PENDING — verify by hovering cards in dev server.
