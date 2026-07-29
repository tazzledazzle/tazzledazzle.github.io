/** GitHub REST API base URL */
const GITHUB_API = "https://api.github.com";

/** Fetcher type — matches the global `fetch` signature for the relevant subset we use. */
export type Fetcher = (url: string, init: RequestInit) => Promise<Response>;

function headers(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function checkOk(res: Response, context: string): Promise<void> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`GitHub API error (${context}): ${res.status} ${text}`);
  }
}

/**
 * GET /repos/{repo}/git/ref/heads/main
 * Returns the current commit SHA of the main branch.
 */
export async function getMainSHA(
  token: string,
  repo: string,
  fetcher: Fetcher = fetch
): Promise<string> {
  const res = await fetcher(`${GITHUB_API}/repos/${repo}/git/ref/heads/main`, {
    method: "GET",
    headers: headers(token),
  });
  await checkOk(res, "getMainSHA");
  const data = (await res.json()) as { object: { sha: string } };
  return data.object.sha;
}

/**
 * POST /repos/{repo}/git/refs
 * Creates a new branch from the given SHA.
 */
export async function createBranch(
  token: string,
  repo: string,
  branchName: string,
  sha: string,
  fetcher: Fetcher = fetch
): Promise<void> {
  const res = await fetcher(`${GITHUB_API}/repos/${repo}/git/refs`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha }),
  });
  await checkOk(res, "createBranch");
}

/**
 * PUT /repos/{repo}/contents/{path}
 * Creates or updates a file. Content is base64-encoded.
 * Pass `fileSHA` when updating an existing file.
 */
export async function createOrUpdateFile(
  token: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  fileSHA?: string,
  fetcher: Fetcher = fetch
): Promise<void> {
  const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(content)));
  const body: Record<string, unknown> = { message, content: encoded };
  if (fileSHA !== undefined) body.sha = fileSHA;

  const res = await fetcher(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(body),
  });
  await checkOk(res, "createOrUpdateFile");
}

/**
 * POST /repos/{repo}/pulls
 * Opens a draft PR and returns its html_url.
 */
export async function createPR(
  token: string,
  repo: string,
  title: string,
  head: string,
  base: string,
  fetcher: Fetcher = fetch
): Promise<string> {
  const res = await fetcher(`${GITHUB_API}/repos/${repo}/pulls`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ title, head, base, draft: true }),
  });
  await checkOk(res, "createPR");
  const data = (await res.json()) as { html_url: string };
  return data.html_url;
}

/**
 * GET /repos/{repo}/git/trees/main?recursive=1
 * Returns file paths filtered to src/content/blog/*.md
 */
export async function fetchFileTree(
  token: string,
  repo: string,
  fetcher: Fetcher = fetch
): Promise<string[]> {
  const res = await fetcher(
    `${GITHUB_API}/repos/${repo}/git/trees/main?recursive=1`,
    {
      method: "GET",
      headers: headers(token),
    }
  );
  await checkOk(res, "fetchFileTree");
  const data = (await res.json()) as {
    tree: Array<{ path: string; type: string }>;
  };
  return data.tree
    .filter(
      (item) =>
        item.type === "blob" &&
        item.path.startsWith("src/content/blog/") &&
        item.path.endsWith(".md")
    )
    .map((item) => item.path);
}

/**
 * GET /repos/{repo}/contents/{path}
 * Returns the decoded (UTF-8) file content and the file's current SHA.
 */
export async function fetchFileContent(
  token: string,
  repo: string,
  path: string,
  fetcher: Fetcher = fetch
): Promise<{ content: string; sha: string }> {
  const res = await fetcher(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
    method: "GET",
    headers: headers(token),
  });
  await checkOk(res, "fetchFileContent");
  const data = (await res.json()) as { content: string; sha: string };
  // GitHub returns content with newlines embedded; strip them before decoding
  const clean = data.content.replace(/\n/g, "");
  const decoded = new TextDecoder().decode(Uint8Array.from(atob(clean), c => c.charCodeAt(0)));
  return { content: decoded, sha: data.sha };
}
