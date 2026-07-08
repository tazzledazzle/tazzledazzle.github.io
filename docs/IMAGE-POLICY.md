# Image Policy (QUAL-06 / D-127)

All **future** content images in this site must use Astro's optimized image pipeline — not raw `<img>` tags in Markdown or HTML.

## Requirements

1. **Use `astro:assets` `Image`** (or an official Astro image integration) for every content image.
2. **Set explicit `width` and `height`** on every image to prevent layout shift (CLS).
3. **Default `loading="lazy"`** unless the image is above the fold (then `loading="eager"` with `fetchpriority="high"`).
4. **Prefer modern formats** — Astro's build pipeline should emit WebP/AVIF where supported.
5. **Meaningful `alt` text** — decorative images use `alt=""` with `role="presentation"`; informative images describe the content.

## Example

```astro
---
import { Image } from "astro:assets";
import diagram from "../assets/platform-diagram.png";
---

<Image
  src={diagram}
  alt="CI pipeline from commit to GitHub Pages deploy"
  width={1200}
  height={630}
  loading="lazy"
/>
```

## Enforcement

- **`scripts/check-dist-alt.mjs`** — fails CI if any built `<img>` lacks a valid `alt` attribute.
- **`npm run check:alt`** — run locally after `npm run build`.

## Current state

The migrated blog has **no inline Markdown images**. This policy is forward-looking for new posts and portfolio assets.

## Related decisions

- D-128: `public/og-default.png` is a static social image (not a content image).
- D-127: Content images added later must follow this policy.
