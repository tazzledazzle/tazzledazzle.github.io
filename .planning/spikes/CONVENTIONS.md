# Spike Conventions

Patterns and stack choices established across spike sessions. New spikes follow these unless the question requires otherwise.

## Stack
- **Framework:** Astro 7 + TypeScript
- **Styling:** Tailwind 4 + global.css (BEM class names, CSS custom properties)
- **No JS for visual effects** — CSS-only or Astro-native (ViewTransitions)
- **No animation libraries** — native CSS animations, scroll-driven animations, View Transitions API

## Structure
- Spike implementations live in the real site components (not isolated demos), so the user can feel the result via `npm run dev`
- Spike README lives in `.planning/spikes/NNN-name/README.md`
- CSS changes go into `src/styles/global.css` under the relevant section comment

## Patterns
- **GPU compositing:** Animate only `transform`, `opacity`, `translate` — never `top/left/width/height`
- **`will-change: transform`** on cards/elements that get `:hover` lift effects
- **`@supports` guard** for new CSS features without broad baseline (e.g., `animation-timeline: scroll()`)
- **`color-mix(in srgb, var(--accent) N%, transparent)`** for tinted backgrounds/borders — keeps palette consistent
- **Gradient text:** `background-clip: text` + `-webkit-text-fill-color: transparent` — apply sparingly (headings only)

## Tools & Libraries
- `astro:transitions` — Astro's built-in ViewTransitions (zero external deps)
- CSS Scroll-driven Animations (`animation-timeline: view()`) — Baseline 2024, use with `@supports` guard
- SVG `feTurbulence` as `background-image` for grain — zero image requests
