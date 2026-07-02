# Phase 3 Validation Matrix

## Scope

Recruiter-facing hiring pages (HIRE-01 through HIRE-07) with locked decisions D-41 through D-60. Automated gate: `npm run verify:phase3` (created in 03-05). Run alongside Phase 2 checks before merge.

## HIRE Requirement Matrix

| Req | Decision(s) | Automated check | Manual check |
|-----|-------------|-----------------|--------------|
| HIRE-01 | D-41, D-42, D-43 | `dist/index.html` contains role label, specialty keywords (infra/observability + platform tooling/DX), value-prop tone | Desktop ~900px: role + specialty + impact visible without scroll |
| HIRE-02 | D-44, D-46 | `dist/index.html` contains `Download Resume` and `/resume.pdf` | 60-second test: recruiter grasps pitch + sees resume CTA above fold |
| HIRE-03 | D-49, D-50 | `dist/work/index.html` has 5 featured titles, grid layout, GitHub links | Scan /work/: cards show summary, tech pills, GitHub |
| HIRE-04 | D-51 | No demo links when `demo_url` null; GitHub always present | Confirm code_only projects show GitHub only (no badge) |
| HIRE-05 | D-53–D-56 | `dist/career/index.html` has 3 employers, formatted dates, bullets, education | Read timeline: all bullets visible, dates human-readable |
| HIRE-06 | D-45–D-47 | `dist/resume.pdf` exists; header + hero link `/resume.pdf` | Click Download Resume from header and hero — PDF opens |
| HIRE-07 | D-57, D-58 | Social URLs on dist/index, work, career, about; site-footer grep on each | Every page: GitHub, LinkedIn, email reachable from chrome |

## D-51 Note (HIRE-04)

When `demo_status: code_only` and `demo_url` is null, omit demo UI silently — no "code only" badge. This is intentional per D-51 (overrides ROADMAP criterion 4 badge wording).

## Mobile Navigation (D-59)

Automated: build output contains mobile nav control (`details`/`summary` or `aria-label` hamburger marker).

Manual: at 375px width, inline nav hidden; hamburger opens full nav + resume link; keyboard can reach all links.

## Above-the-Fold Recruiter Walkthrough (HIRE-01, HIRE-02)

1. Open `/` at 1440×900 (or similar desktop).
2. Without scrolling, confirm: "Platform-focused Software Engineer" headline, dual-domain specialty line, value proposition, Download Resume + GitHub CTAs, 2–3 project tease cards.
3. Start a 60-second timer on landing — recruiter should understand who Terence is, what he's built, and why he's worth interviewing.

## About Page Social (D-60)

`dist/about/index.html` must include Connect section with GitHub, LinkedIn, and mailto email links (from `social.yml`), in addition to 2–3 paragraph bio.

## Required Validation Commands

Run from repo root after Phase 3 implementation:

1. `npm run build`
2. `npm run verify:phase3`
3. `rake data:validate`
4. Phase 2 gate: `node scripts/verify-phase2-routes.mjs --check smoke10`

## Pass Criteria

- All HIRE-01 through HIRE-07 automated markers pass in `verify-phase3-hiring.mjs`.
- `public/resume.pdf` is non-empty maintainer resume (checkpoint in 03-01).
- Header/footer social parity on every built page.
- Mobile hamburger functional at 375px (manual).
- 60-second recruiter comprehension walkthrough passes (manual).
