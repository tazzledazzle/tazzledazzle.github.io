# Observability — Option B Design Spec

**Date:** 2026-07-31  
**Status:** Approved  
**Author:** Brainstorming session (Terence + Claude)

---

## Goal

Add real-user observability to tazzledazzle.github.io: traffic analytics, Core Web Vitals from actual visitors, most-visited pages, and uptime monitoring — at zero cost, without a custom domain.

---

## Chosen Approach: Option B — Umami + web-vitals.js + UptimeRobot

### Why B over A and C
- **vs. A (Plausible Cloud):** Free vs. $9/mo. Umami is feature-comparable for this use case.
- **vs. C (Cloudflare):** No custom domain required (~$9/yr). No DNS change. No Cloudflare intermediary.
- **Tradeoff accepted:** Railway free tier idles Umami — dashboard wake-up is slow after inactivity, but visitor tracking is async and unaffected. A cron-job.org ping keeps it warm.

---

## Architecture

```
Visitor browser
  │
  ├─→ tazzledazzle.github.io (GitHub Pages, static)
  │     ├─ Umami script.js (async, deferred)     → Railway: Umami app → Postgres
  │     └─ WebVitals.astro island (client:load)  → Railway: Umami /api/send (custom events)
  │
UptimeRobot
  └─→ HTTP check every 5 min → tazzledazzle.github.io → alert on non-200
```

---

## Components

### 1. Umami on Railway
- Deploy via Railway Umami template (one-click)
- Services: Umami Next.js app + PostgreSQL (Railway-managed)
- Env vars: `UMAMI_APP_SECRET` (random string), `DATABASE_URL` (auto-injected)
- Post-deploy: change default password, add site, copy `data-website-id` UUID
- Keep-warm: cron-job.org free ping every 10 min to prevent cold starts

### 2. Tracking Script (MainLayout.astro)
Added to `<head>` in `src/layouts/MainLayout.astro`:
```astro
<script
  defer
  src="https://[railway-url]/script.js"
  data-website-id="[uuid]"
></script>
```
Captures: page views, unique visitors, referrers, country, device, browser, OS.

### 3. WebVitals Island (src/components/WebVitals.astro)
- `client:load` Astro island
- Imports `web-vitals` npm package
- Sends LCP, CLS, INP, TTFB, FCP to `window.umami.track()`
- Payload: `{ value: number, rating: 'good'|'needs-improvement'|'poor', path: string }`
- CLS value multiplied by 1000 (Umami stores integers; CLS is typically 0.0x)
- Mounted in `MainLayout.astro` after Umami script

### 4. UptimeRobot Monitor
- Type: HTTP(s)
- URL: `https://tazzledazzle.github.io`
- Interval: 5 minutes
- Alert: email to terenceschumacher@gmail.com
- Public status page: optional, linkable from site footer

---

## Data Available Post-Implementation

| Signal                              | Source        | Location in Umami             |
|-------------------------------------|---------------|-------------------------------|
| Page views                          | Umami script  | Overview → Pageviews          |
| Unique visitors                     | Umami script  | Overview → Unique visitors    |
| Most visited pages                  | Umami script  | Pages tab (sorted)            |
| Referrer sources                    | Umami script  | Referrers tab                 |
| LCP, CLS, INP, TTFB, FCP values     | web-vitals.js | Custom Events tab             |
| Good/needs-improvement/poor ratings | web-vitals.js | Custom Events → properties    |
| Uptime / downtime incidents         | UptimeRobot   | UptimeRobot dashboard + email |

---

## SRE Perspective (SLOs adapted for static site)

| SLI          | Target                             | Measurement                     |
|--------------|------------------------------------|---------------------------------|
| Availability | 99.9% (~43 min/mo allowed down)    | UptimeRobot uptime %            |
| LCP          | ≥ 75% of sessions "good" (< 2.5s)  | Umami custom events: LCP rating |
| CLS          | ≥ 95% of sessions "good" (< 0.1)   | Umami custom events: CLS rating |
| INP          | ≥ 75% of sessions "good" (< 200ms) | Umami custom events: INP rating |

These are observational targets, not gated alerts. Review monthly.

---

## Files Changed

| File                             | Change                                               |
|----------------------------------|------------------------------------------------------|
| `src/layouts/MainLayout.astro`   | Add Umami `<script>` tag to `<head>`                 |
| `src/components/WebVitals.astro` | New client island for web-vitals reporting           |
| `package.json`                   | Add `web-vitals` dependency                          |
| `.env.example`                   | Add `PUBLIC_UMAMI_WEBSITE_ID` and `PUBLIC_UMAMI_URL` |
| `src/layouts/MainLayout.astro`   | Mount `<WebVitals />` component                      |

---

## Environment Variables

```bash
# .env (not committed) — values set after Railway deploy
PUBLIC_UMAMI_URL=https://[railway-url].up.railway.app
PUBLIC_UMAMI_WEBSITE_ID=[uuid-from-umami-dashboard]
```

Astro `PUBLIC_` prefix makes these available in client-side code.

---

## Out of Scope

- Server-side request logs (not possible on GitHub Pages)
- Prometheus/Grafana (no server runtime)
- Alerts on Core Web Vitals degradation (manual review for now)
- Cloudflare cache TTL control (would require Option C + custom domain)

---

## Success Criteria

- Umami dashboard shows real pageview data within 24h of deploy
- Custom Events tab shows LCP/CLS/INP/TTFB/FCP entries with rating breakdown
- UptimeRobot sends a test alert email successfully
- `npm run build` passes with `web-vitals` installed
- No Umami script errors in browser console
