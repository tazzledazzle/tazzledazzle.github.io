# Deploy & rollback runbook

Operations guide for deploying `tazzledazzle.github.io` (Astro static site on GitHub Pages) and the OAuth Cloudflare Worker.

## Happy path (site)

1. Merge or push to `main` (or run **Actions → Deploy Astro to GitHub Pages → Run workflow**).
2. Workflow [`.github/workflows/deploy-pages.yml`](../.github/workflows/deploy-pages.yml) runs:
   - Install → quality gates → `npm run build` → upload Pages artifact → deploy.
3. GitHub Pages serves the new `dist/` at [https://tazzledazzle.github.io](https://tazzledazzle.github.io).

PR validation (no deploy) runs via [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) on every pull request. The required job name for branch protection is **`quality`**.

## Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `.github/workflows/ci.yml` | `pull_request` | Quality gates only (no deploy). Required check name: **`quality`**. Uploads **`site-preview`** artifact (`dist/`). |
| `.github/workflows/deploy-pages.yml` | `push` to `main`, `workflow_dispatch` | Build + quality gates, then deploy to GitHub Pages. |
| `.github/workflows/oauth-worker.yml` | PR/push touching `workers/oauth/**` | Worker `npm ci` + `wrangler deploy --dry-run`; deploy to Cloudflare on `main` when token present. |
| `.github/workflows/codeql.yml` | PR/`main` push + weekly schedule | Advisory CodeQL for `javascript-typescript` (`src` + `workers/oauth`). |

Node is pinned with `package.json` `engines` (`>=24 <25`) and `.nvmrc` (`24`). Site workflows use `actions/setup-node` with `node-version-file: '.nvmrc'`.

Dependabot (`.github/dependabot.yml`) opens weekly PRs for npm at `/`, npm at `/workers/oauth`, and `github-actions`.

Security: both site workflows run `npm audit --audit-level=high` immediately after `npm ci`.

## Actual deploy stack (not `withastro/action`)

This repo does **not** use `withastro/action`. Deploy is hand-rolled so quality gates can run against `dist/` before upload:

| Step | Action / command | Role |
|------|------------------|------|
| Node | `actions/setup-node` | Node from `.nvmrc`, npm cache |
| Gates | `npm audit`, unit/config tests, `astro check`, contrast/alt/lychee, a11y, Lighthouse | Fail the build before Pages sees a bad artifact |
| Pages config | `actions/configure-pages@v5` | Wire Pages build settings |
| Artifact | `actions/upload-pages-artifact@v3` (`path: dist`) | Pages-compatible upload |
| Deploy | `actions/deploy-pages@v5` | Publish to the `github-pages` environment |

**Why not `withastro/action`:** that composite action owns install/build/upload in one step and does not cleanly expose a post-build hook for lychee, Playwright a11y, Lighthouse, and similar gates against `dist/`. Explicit steps keep gates first-class.

## Concurrency: `cancel-in-progress: false`

```yaml
concurrency:
  group: pages
  cancel-in-progress: false
```

For the `pages` group, in-progress deploys are **not** cancelled when a newer run starts.

**Why:** GitHub Pages deployments should finish (or fail) cleanly. Cancelling mid-deploy can leave the environment in a confusing state or race two uploads. Newer pushes queue behind the current run instead of aborting it. (PR CI uses a separate `ci-*` group with `cancel-in-progress: true`, which is fine for non-deploy checks.)

## Rollback

If a bad deploy reaches production:

### Option A — Revert and push (preferred for lasting fix)

```bash
git revert <bad-commit-sha>   # or revert the merge commit
git push origin main
```

This triggers a fresh Deploy Astro to GitHub Pages run with the reverted tree.

### Option B — Re-run a prior successful workflow

1. Open **Actions → Deploy Astro to GitHub Pages**.
2. Find the last **successful** run on `main` before the bad deploy.
3. Use **Re-run all jobs** (or re-run failed jobs if only deploy failed after a good build).

Re-running rebuilds from that run’s commit SHA, so the site returns to that known-good revision without a new git commit. Follow up with Option A so `main` matches what is live.

## Required secrets & env

### Repository secrets (build-time `PUBLIC_*`)

Astro inlines `PUBLIC_*` at **build** time. Set these as **GitHub Actions repository secrets** (Settings → Secrets and variables → Actions) so `npm run build` embeds them in the static output.

| Secret name | Purpose | Required for production? |
|-------------|---------|--------------------------|
| `PUBLIC_GITHUB_APP_CLIENT_ID` | GitHub App client ID for OAuth login UI | Yes, if OAuth login is enabled |
| `PUBLIC_OAUTH_WORKER_URL` | Cloudflare Worker URL that completes OAuth | Yes, if OAuth login is enabled |
| `PUBLIC_UMAMI_URL` | Umami analytics base URL | Optional (analytics omitted when empty) |
| `PUBLIC_UMAMI_WEBSITE_ID` | Umami website ID | Optional (analytics omitted when empty) |

Both `ci.yml` and `deploy-pages.yml` pass these into the **Build site** step via `env:`. Missing secrets resolve to empty strings (safe for PRs from forks and local-style CI without secrets).

Local development: copy [`.env.example`](../.env.example) to `.env` / `.env.local` instead of using Actions secrets.

### Repository secrets (OAuth Worker CI/CD)

| Secret name | Purpose | Required? |
|-------------|---------|-----------|
| `CLOUDFLARE_API_TOKEN` | Deploy `workers/oauth` via `cloudflare/wrangler-action@v3` on push to `main` | Required for automatic Worker deploys. If unset, the deploy job skips with a warning. |

### Cloudflare Worker secrets (Wrangler — not GitHub Actions)

Runtime credentials for the token exchange live in Cloudflare, not GitHub:

```bash
cd workers/oauth
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

Never commit these or expose them as `PUBLIC_*` build env. See [workers/oauth/README.md](../workers/oauth/README.md).

## OAuth Worker deploy overview

1. **One-time:** Create a GitHub App (callback `https://tazzledazzle.github.io/editor`), note Client ID / Secret. Put secrets via Wrangler as above.
2. **Manual / first deploy:** `cd workers/oauth && npm ci && npm run deploy` — note the `*.workers.dev` URL.
3. **CI/CD:** On pushes to `main` that touch `workers/oauth/**`, [oauth-worker.yml](../.github/workflows/oauth-worker.yml) dry-runs on PRs and deploys on `main` when `CLOUDFLARE_API_TOKEN` is set. If the token is missing, deploy is skipped with a warning (non-blocking for the site).
4. **Site config:** Set `PUBLIC_GITHUB_APP_CLIENT_ID` and `PUBLIC_OAUTH_WORKER_URL` to match the App and Worker URL.

## Branch protection checklist (`main`)

Configure under **Settings → Branches → Branch protection rule** for `main`:

- [ ] **Require a pull request before merging** (no direct pushes to `main` except break-glass)
- [ ] **Require status checks to pass before merging**
  - [ ] Require the check named **`quality`** (job id/name from [`.github/workflows/ci.yml`](../.github/workflows/ci.yml))
- [ ] **Require conversation resolution before merging** (recommended)
- [ ] **Dismiss stale pull request approvals when new commits are pushed**
- [ ] Do **not** require linear history unless the team already uses rebase-only merges

Optional: enable [CodeQL](../.github/workflows/codeql.yml) alerts; treat as advisory until the team promotes it to a required check.

## PR site preview artifact

On pull requests, the `quality` job uploads the built `dist/` as a downloadable Actions artifact named **`site-preview`**.

1. Open the PR → **Checks** / **Actions** → CI run → **quality** job.
2. Download **`site-preview`** from the run’s Artifacts section.
3. Unzip and open locally (e.g. `npx serve` on the extracted folder) for a static preview.

This is not a hosted preview URL; it is a downloadable build for reviewers. (Lighthouse reports may also upload as `lighthouse-reports` when present.)

## Manual deploy

Use **Actions → Deploy Astro to GitHub Pages → Run workflow** (`workflow_dispatch`) after secrets are set.

## Quick reference

| Concern | Where |
|---------|--------|
| Production deploy | `.github/workflows/deploy-pages.yml` |
| PR quality + preview artifact | `.github/workflows/ci.yml` (`quality`) |
| OAuth Worker | `.github/workflows/oauth-worker.yml`, `workers/oauth/` |
| Code scanning | `.github/workflows/codeql.yml`, `.github/codeql/codeql-config.yml` |
| Env templates | `.env.example`, `workers/oauth/.env.example` |
