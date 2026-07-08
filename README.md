# Terence Schumacher — Portfolio & Blog

Personal portfolio and technical blog for Terence Schumacher, a software engineer and technical writer. Built with Astro and deployed to GitHub Pages.

## Quick Start

```bash
git clone https://github.com/tazzledazzle/tazzledazzle.github.io.git
cd tazzledazzle.github.io
npm install
npm run dev        # http://localhost:4321
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build production site to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Run Astro + TypeScript type checking |
| `npm run test:unit` | Run unit tests (Node.js built-in runner) |
| `npm run test:a11y` | Run Playwright accessibility tests |
| `npm run audit:contrast` | Check color contrast ratios |
| `npm run check:alt` | Verify all images have alt text |
| `npm run check:links` | Check for broken links with lychee |
| `npm run check:lighthouse` | Run Lighthouse CI quality audit |

## Content Structure

```
src/
├── content/
│   └── blog/          # Markdown/MDX blog posts
├── pages/             # Routes (.astro, .ts)
├── layouts/           # Page layouts
├── components/        # Astro/UI components
└── lib/               # Shared utilities + unit tests
public/                # Static assets (images, fonts)
```

## Stack

- **[Astro](https://astro.build/)** — static site generator, content collections
- **[Tailwind CSS 4](https://tailwindcss.com/)** — utility-first styling
- **[TypeScript](https://www.typescriptlang.org/)** — type-safe config and schemas
- **[GitHub Pages](https://pages.github.com/)** — hosting via `withastro/action`

## Connect

- **GitHub**: [github.com/tazzledazzle](https://github.com/tazzledazzle)
- **LinkedIn**: [linkedin.com/in/terenceschumacher](https://linkedin.com/in/terenceschumacher)
- **Email**: [terenceschumacher@gmail.com](mailto:terenceschumacher@gmail.com)

## License

Content & code © Terence Schumacher. Feel free to reference with attribution.
