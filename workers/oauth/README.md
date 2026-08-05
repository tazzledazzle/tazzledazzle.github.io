# tazzledazzle-oauth — Cloudflare Worker

## What this Worker does

This Worker acts as a secure server-side proxy for the GitHub OAuth token exchange
step. When a user completes the GitHub App OAuth flow, GitHub redirects them back to
`/editor?code=xxx`. The browser cannot exchange that code for an access token
directly because the exchange requires the `client_secret`, which must never be
embedded in client-side JavaScript.

This Worker receives a `POST /exchange` request with `{ code }` in the body, performs
the secure server-side exchange with GitHub, and returns `{ access_token }` to the
browser.

## One-time setup: Create a GitHub App

1. Go to **GitHub Settings → Developer Settings → GitHub Apps → New GitHub App**
2. Set **Callback URL** to `https://tazzledazzle.github.io/editor`
3. Set **Webhook** to inactive (not needed)
4. Under **Permissions**, grant `Contents: Read & write` (to create branches/files/PRs)
5. Click **Create GitHub App**
6. Note the **Client ID** and generate a **Client Secret** — you'll need both below

## Deploy steps

```bash
cd workers/oauth
npm install
wrangler secret put GITHUB_CLIENT_ID    # paste client_id from GitHub App
wrangler secret put GITHUB_CLIENT_SECRET  # paste client_secret from GitHub App
npm run deploy
# Note the Worker URL from deploy output, e.g. https://tazzledazzle-oauth.YOUR_SUBDOMAIN.workers.dev
```

## After deploy: configure the Astro site

Set these env vars so the editor page can call the Worker:

```bash
# .env.local (local dev — never commit)
PUBLIC_GITHUB_APP_CLIENT_ID=Iv1.xxxxxxxxxxxx
PUBLIC_OAUTH_WORKER_URL=https://tazzledazzle-oauth.YOUR_SUBDOMAIN.workers.dev
```

For CI (GitHub Actions), add these as repository secrets and expose them as env vars
in the build step.

## Local development

Run the Worker locally with:

```bash
npm install   # creates/updates package-lock.json — commit the lockfile
npm run dev   # starts at http://localhost:8787
```

Update `PUBLIC_OAUTH_WORKER_URL=http://localhost:8787` in `.env.local` to point the
editor at the local Worker during development.

## CI/CD

GitHub Actions workflow [`.github/workflows/oauth-worker.yml`](../../.github/workflows/oauth-worker.yml)
runs on changes under `workers/oauth/**`:

| Event | Behavior |
|-------|----------|
| Pull request / push | `npm ci` + `wrangler deploy --dry-run` (bundle check) |
| Push to `main` | Deploys via `cloudflare/wrangler-action@v3` when `CLOUDFLARE_API_TOKEN` is set; otherwise skips with a warning |

Worker secrets (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`) stay in Cloudflare via
`wrangler secret put` — they are not GitHub Actions secrets. See
[docs/deploy-runbook.md](../../docs/deploy-runbook.md).
