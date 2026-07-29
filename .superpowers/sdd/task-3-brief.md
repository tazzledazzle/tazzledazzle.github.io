# Task 3 Brief: Cloudflare Worker for GitHub OAuth token exchange

## Context
The editor page at `/editor` handles GitHub App OAuth but has a documented gap:
GitHub's OAuth flow requires a server-side component to exchange a `?code` param
for an access token. The `client_secret` MUST NOT be embedded in browser JS.

This task creates a Cloudflare Worker that acts as the secure token exchange
endpoint, plus wires the editor page to call it.

## Files to create

### `workers/oauth/src/index.ts`
The Worker entry point. Handles one route:

```
POST /exchange
Body: { code: string }
Response: { access_token: string } or { error: string }
```

Implementation:
```ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "https://tazzledazzle.github.io",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let code: string;
    try {
      const body = await request.json() as { code?: string };
      if (!body.code) throw new Error("missing code");
      code = body.code;
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Exchange code for token with GitHub
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenRes.json() as { access_token?: string; error?: string };

    if (!tokenData.access_token) {
      return new Response(
        JSON.stringify({ error: tokenData.error ?? "Token exchange failed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ access_token: tokenData.access_token }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
} satisfies ExportedHandler<Env>;

interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}
```

### `workers/oauth/wrangler.toml`
```toml
name = "tazzledazzle-oauth"
main = "src/index.ts"
compatibility_date = "2024-09-23"
compatibility_flags = ["nodejs_compat"]

[vars]
# GITHUB_CLIENT_ID is set here or via `wrangler secret put GITHUB_CLIENT_ID`
# GITHUB_CLIENT_SECRET must be set via `wrangler secret put GITHUB_CLIENT_SECRET`
# Never put the secret in this file.
```

### `workers/oauth/package.json`
```json
{
  "name": "tazzledazzle-oauth-worker",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "devDependencies": {
    "wrangler": "^3.0.0",
    "@cloudflare/workers-types": "^4.0.0"
  }
}
```

### `workers/oauth/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ES2022",
    "moduleResolution": "bundler",
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

### `workers/oauth/README.md`
Document:
1. What this Worker does (OAuth token exchange for GitHub App)
2. One-time setup: create GitHub App in GitHub Settings, set callback URL to `https://tazzledazzle.github.io/editor`
3. Deploy steps:
   ```bash
   cd workers/oauth
   npm install
   wrangler secret put GITHUB_CLIENT_ID    # paste client_id from GitHub App
   wrangler secret put GITHUB_CLIENT_SECRET  # paste client_secret from GitHub App
   npm run deploy
   # Note the Worker URL from deploy output, e.g. https://tazzledazzle-oauth.YOUR_SUBDOMAIN.workers.dev
   ```
4. After deploy: set `PUBLIC_GITHUB_APP_CLIENT_ID` and `PUBLIC_OAUTH_WORKER_URL` env vars in the Astro build (`.env` locally, GitHub Actions secret for CI)
5. Local development: `npm run dev` in `workers/oauth/` runs the Worker at `http://localhost:8787`

## Wire the editor page

Update `src/pages/editor.astro` — in the `else if (code)` branch (the "Authenticating" state), replace the TODO comment block with the real token exchange call:

```ts
} else if (code) {
  showState("state-authenticating");
  try {
    const workerUrl = import.meta.env.PUBLIC_OAUTH_WORKER_URL ?? "";
    if (!workerUrl) {
      throw new Error("OAuth worker not configured. Set PUBLIC_OAUTH_WORKER_URL.");
    }
    const res = await fetch(`${workerUrl}/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json() as { access_token?: string; error?: string };
    if (!data.access_token) {
      throw new Error(data.error ?? "Token exchange failed");
    }
    localStorage.setItem(TOKEN_KEY, data.access_token);
    // Clean code from URL and reload into authenticated state
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.location.replace(url.toString());
  } catch (err) {
    // Show error in the authenticating state instead of hanging
    const msgEl = document.querySelector("#state-authenticating p.text-zinc-600");
    if (msgEl) {
      msgEl.textContent = `Authentication failed: ${err instanceof Error ? err.message : String(err)}`;
      (msgEl as HTMLElement).classList.replace("text-zinc-600", "text-red-400");
    }
  }
}
```

Also add `PUBLIC_OAUTH_WORKER_URL` to the Astro env type declarations if a
`src/env.d.ts` or similar exists. If not, leave a `// @ts-ignore` comment above
`import.meta.env.PUBLIC_OAUTH_WORKER_URL` with a note to add it.

## Add env var to `.env.example`
Create `workers/oauth/.env.example` (not `.env` — never commit secrets):
```
# Copy to .env.local for local dev — never commit the real values
PUBLIC_GITHUB_APP_CLIENT_ID=your_github_app_client_id
PUBLIC_OAUTH_WORKER_URL=https://tazzledazzle-oauth.YOUR_SUBDOMAIN.workers.dev
```

And create `.env.example` at the repo root (if it doesn't exist):
```
PUBLIC_GITHUB_APP_CLIENT_ID=Iv1.xxxxxxxxxxxx
PUBLIC_OAUTH_WORKER_URL=https://tazzledazzle-oauth.YOUR_SUBDOMAIN.workers.dev
```

## Verification

The Worker code cannot be run locally without wrangler installed (don't install it as part of this task — it's the user's one-time setup). Instead, verify:

1. TypeScript structure is valid — `workers/oauth/src/index.ts` exports a default object with `fetch` method matching `ExportedHandler<Env>`
2. The Astro site still builds cleanly: `npm run build 2>&1 | tail -10`
3. The `else if (code)` branch in `editor.astro` no longer shows a static "pending" message but instead makes a real fetch call

## Commit
```
feat(editor): add Cloudflare Worker for OAuth token exchange + wire editor authenticating state
```

## Report
Write your full report to `.superpowers/sdd/task-3-report.md`.
Return: DONE or BLOCKED, commit SHA, build result.
