/** Key used to store the GitHub OAuth token in localStorage */
const TOKEN_KEY = "gh_editor_token";

/**
 * Factory that returns token-management functions bound to a given Storage
 * implementation. This makes the module testable without a real browser.
 */
export function createStorage(storage: Storage) {
  return {
    storeToken(token: string): void {
      storage.setItem(TOKEN_KEY, token);
    },
    getToken(): string | null {
      return storage.getItem(TOKEN_KEY);
    },
    clearToken(): void {
      storage.removeItem(TOKEN_KEY);
    },
  };
}

// --- Browser-facing singletons (use globalThis.localStorage in the browser) ---

/** Writes token to localStorage under key `gh_editor_token`. */
export function storeToken(token: string): void {
  globalThis.localStorage?.setItem(TOKEN_KEY, token);
}

/** Reads the stored token; returns null if absent. */
export function getToken(): string | null {
  return globalThis.localStorage?.getItem(TOKEN_KEY) ?? null;
}

/** Removes the token from localStorage. */
export function clearToken(): void {
  globalThis.localStorage?.removeItem(TOKEN_KEY);
}

/**
 * Extracts the `code` query parameter from a URL search string.
 * Returns null if the parameter is absent.
 *
 * @param urlSearch - The query string portion of a URL, e.g. "?code=abc&state=xyz"
 */
export function parseOAuthCode(urlSearch: string): string | null {
  if (!urlSearch) return null;
  const params = new URLSearchParams(urlSearch.startsWith("?") ? urlSearch.slice(1) : urlSearch);
  return params.get("code");
}
