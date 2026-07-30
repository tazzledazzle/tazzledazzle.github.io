---
spike: "001"
name: hero-gradient-depth
type: standard
validates: "Given a visitor lands on the homepage, when the hero renders, then they feel immediate visual craft via gradient mesh bg + gradient text h1 + grain — zero JS, zero layout shift"
verdict: PENDING
related: []
tags: [css, hero, gradient, grain]
---

# Spike 001: hero-gradient-depth

## What This Validates
Given a visitor lands on the homepage, when the hero renders, then they feel immediate visual craft via gradient mesh background + gradient text h1 + grain overlay — using zero JS and producing zero layout shift.

## Research

| Approach | Tool | Pros | Cons | Status |
|----------|------|------|------|--------|
| Radial gradient mesh | Pure CSS `radial-gradient` | Zero cost, composited, instant | Limited to color blobs | **Chosen** |
| Canvas particle field | JS + `<canvas>` | Very dynamic | JS-dependent, battery drain | Rejected |
| SVG background image | Inline SVG | Flexible shapes | Larger DOM | Rejected |
| CSS `@property` animated gradient | Houdini | Smooth animated blobs | Limited browser support | Future |

**Chosen approach:** Two radial gradient blobs (`--accent` blue at top-left, purple at bottom-right) composited over `--bg`. Grain via inline SVG `feTurbulence` as a `background-image` on `::after` pseudo-element — zero image requests, zero JS. Gradient text uses `background-clip: text` + `-webkit-text-fill-color: transparent`.

## How to Run
```
npm run dev
```
Visit `http://localhost:4321` — the hero section is immediately visible.

## What to Expect
- Hero has a subtle dark blue/purple gradient mesh glow in the corners
- The h1 role title has a gradient fade from white → blue-tinted
- A faint grain/noise texture adds depth to the hero surface
- No layout shift, no JS, instant render

## Investigation Trail
- **v1:** Applied gradient mesh + grain. Padding added to give the hero a contained surface area — without padding the background is invisible as there's no physical box to paint.
- **Gradient text:** `background-clip: text` requires `-webkit-text-fill-color: transparent` for broad support. Applied to `.hero__role` only — applying to all headings would be too much.
- **Grain intensity:** Set opacity to 0.04 — enough to read as texture without looking dirty.

## Results
PENDING — verify by running dev server.
