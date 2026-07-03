# Phase 3: Hiring Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 3-Hiring Pages
**Areas discussed:** Hero & 60-second pitch, Resume PDF & CTAs, Project cards, Career timeline, Site chrome

---

## Hero & 60-second pitch

| Option | Description | Selected |
|--------|-------------|----------|
| SRE / Platform Engineer | Emphasize reliability, CI/CD, observability | |
| Platform-focused Software Engineer | Broader engineering + technical writing | ✓ |
| Custom headline | User specifies exact copy | |

| Option | Description | Selected |
|--------|-------------|----------|
| Infrastructure & observability | CI/CD, release engineering, distributed systems | |
| Platform tooling & DX | Build systems, automation, internal tools | |
| Both | One-line specialty covering infra + platform DX | ✓ |

| Option | Description | Selected |
|--------|-------------|----------|
| Quantified hook | Lead with metric from career data | |
| Value proposition | "I build reliable platforms teams ship on" | ✓ |
| Current role context | Lead with Invisible Technologies title | |

| Option | Description | Selected |
|--------|-------------|----------|
| Tease 2–3 featured projects | Quick proof below hero | ✓ |
| Career highlight strip | Latest employer + one metric | |
| CTA only | No preview content before fold | |

**User's choice:** Platform-focused Software Engineer headline; both infra + platform specialty; value-prop impact framing; featured project tease below hero.

---

## Resume PDF & CTAs

| Option | Description | Selected |
|--------|-------------|----------|
| Static PDF in public/ | Manual updates when resume changes | ✓ |
| Static PDF in src/assets/ | Built with versioned filename | |
| External hosted link | Google Drive / LinkedIn export | |

| Option | Description | Selected |
|--------|-------------|----------|
| Header and hero | Persistent + prominent CTA | ✓ |
| Hero only | Footer secondary link | |
| Header only | Hero focuses on work/career | |

| Option | Description | Selected |
|--------|-------------|----------|
| Download Resume | Explicit PDF action | ✓ |
| View Resume | Opens in new tab | |
| Resume (PDF) | Compact header label | |

| Option | Description | Selected |
|--------|-------------|----------|
| Resume + Email + LinkedIn | Three hero CTAs | |
| Resume primary | Email/LinkedIn in chrome only | |
| Resume + GitHub | Code-first hiring signal | ✓ |

**User's choice:** public/resume.pdf; header + hero placement; "Download Resume" label; hero CTAs are Resume + GitHub only.

---

## Project cards

| Option | Description | Selected |
|--------|-------------|----------|
| Responsive card grid | 2 col desktop, 1 col mobile | ✓ |
| Stacked full-width cards | One project per row | |
| Compact list | Denser scan | |

| Option | Description | Selected |
|--------|-------------|----------|
| Pill/chip tags | tech_stack as badges | ✓ |
| Comma inline | Lighter weight | |
| Top 3 only | Truncate with +N more | |

| Option | Description | Selected |
|--------|-------------|----------|
| Code only badge | Visible label when no demo | |
| GitHub primary | Demo link only when demo_url exists | ✓ |
| Muted "No live demo" | Explicit subdued state | |

| Option | Description | Selected |
|--------|-------------|----------|
| Featured only | archive hidden | |
| Collapsed "More projects" | archive.yml below featured | ✓ |
| Separate archive page stub | Link only, no UI | |

**User's choice:** Card grid, pill tags, GitHub-primary demo handling, collapsed archive section.

---

## Career timeline

| Option | Description | Selected |
|--------|-------------|----------|
| Vertical timeline | Date rail + role cards | ✓ |
| Stacked sections | Employer blocks, no rail | |
| Reverse-chronological list | Minimal styling | |

| Option | Description | Selected |
|--------|-------------|----------|
| All bullets | 3–4 per role from career.yml | ✓ |
| Top 3 bullets | Trim for scannability | |
| Expandable | 2 + show more | |

| Option | Description | Selected |
|--------|-------------|----------|
| Below roles | Education separate block | ✓ |
| Sidebar | Desktop aside | |
| Page bottom | Roles dominate | |

| Option | Description | Selected |
|--------|-------------|----------|
| Month + year | Jan 2025 – Present | ✓ |
| Year only | 2025 – Present | |
| As stored in YAML | 2025-01 – Present | |

**User's choice:** Vertical timeline, all bullets, education below roles, month+year dates.

---

## Site chrome

| Option | Description | Selected |
|--------|-------------|----------|
| navigation.yml driven | Data-driven nav | ✓ |
| Hardcoded links | Simpler 4-item nav | |

| Option | Description | Selected |
|--------|-------------|----------|
| Header + footer | Social on both | ✓ |
| Footer only | Clean header | |
| Header only | Icons next to resume | |

| Option | Description | Selected |
|--------|-------------|----------|
| Hamburger menu | Collapsible <768px | ✓ |
| Inline wrap | Links wrap, no hamburger | |
| Minimal hamburger | Name + menu only | |

| Option | Description | Selected |
|--------|-------------|----------|
| Bio + social | 2–3 paragraphs from legacy about | ✓ |
| Minimal bio | Name, role, email only | |
| Bio + career link | About intro, career detail | |

**User's choice:** Data-driven nav, social in header and footer, hamburger mobile nav, expanded about bio from legacy content.

---

## Claude's Discretion

- Hero copy wording within agreed framing
- Which 2–3 projects tease on homepage
- Archive section default collapsed/expanded state
- Header/footer styling within minimal shell
- Bio condensing from about.markdown
- Hamburger implementation approach

## Deferred Ideas

- Full design system → Phase 5
- Blog curation UX → Phase 4
- SEO/schema → Phase 6
- Deep case studies → v2
