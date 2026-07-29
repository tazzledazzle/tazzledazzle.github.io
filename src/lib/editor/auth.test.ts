import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  storeToken,
  getToken,
  clearToken,
  parseOAuthCode,
  createStorage,
} from "./auth.ts";

// --- in-memory localStorage mock ---
function makeFakeStorage(): Storage {
  const store: Record<string, string> = {};
  return {
    getItem(key: string): string | null {
      return Object.prototype.hasOwnProperty.call(store, key)
        ? store[key]
        : null;
    },
    setItem(key: string, value: string): void {
      store[key] = value;
    },
    removeItem(key: string): void {
      delete store[key];
    },
    clear(): void {
      for (const k in store) delete store[k];
    },
    get length(): number {
      return Object.keys(store).length;
    },
    key(index: number): string | null {
      return Object.keys(store)[index] ?? null;
    },
  };
}

describe("storeToken", () => {
  test("writes token to localStorage under gh_editor_token key", () => {
    const storage = makeFakeStorage();
    const { storeToken: store } = createStorage(storage);
    store("abc123");
    assert.equal(storage.getItem("gh_editor_token"), "abc123");
  });

  test("overwrites an existing token", () => {
    const storage = makeFakeStorage();
    const { storeToken: store } = createStorage(storage);
    store("first");
    store("second");
    assert.equal(storage.getItem("gh_editor_token"), "second");
  });
});

describe("getToken", () => {
  test("returns null when no token stored", () => {
    const storage = makeFakeStorage();
    const { getToken: get } = createStorage(storage);
    assert.equal(get(), null);
  });

  test("returns stored token", () => {
    const storage = makeFakeStorage();
    const { storeToken: store, getToken: get } = createStorage(storage);
    store("mytoken");
    assert.equal(get(), "mytoken");
  });
});

describe("clearToken", () => {
  test("removes token from storage", () => {
    const storage = makeFakeStorage();
    const { storeToken: store, clearToken: clear, getToken: get } = createStorage(storage);
    store("token-to-remove");
    clear();
    assert.equal(get(), null);
  });

  test("does not throw when no token present", () => {
    const storage = makeFakeStorage();
    const { clearToken: clear } = createStorage(storage);
    assert.doesNotThrow(() => clear());
  });
});

describe("parseOAuthCode", () => {
  test("extracts code from query string", () => {
    assert.equal(parseOAuthCode("?code=abc123"), "abc123");
  });

  test("extracts code when there are other params", () => {
    assert.equal(parseOAuthCode("?state=xyz&code=mycode&foo=bar"), "mycode");
  });

  test("returns null when code param absent", () => {
    assert.equal(parseOAuthCode("?state=xyz&foo=bar"), null);
  });

  test("returns null for empty string", () => {
    assert.equal(parseOAuthCode(""), null);
  });

  test("returns null for query string with no params", () => {
    assert.equal(parseOAuthCode("?"), null);
  });

  test("handles code with special characters (URL encoded)", () => {
    assert.equal(parseOAuthCode("?code=abc%2B123"), "abc+123");
  });
});
