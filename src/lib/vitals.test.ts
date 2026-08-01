import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { buildVitalsPayload } from "./vitals.ts";
import type { Metric } from "web-vitals";

function makeMetric(overrides: Partial<Metric>): Metric {
  return {
    name: "LCP",
    value: 1200,
    rating: "good",
    delta: 1200,
    id: "v4-abc123",
    entries: [],
    navigationType: "navigate",
    ...overrides,
  } as Metric;
}

describe("buildVitalsPayload", () => {
  test("uses metric name as event name", () => {
    const payload = buildVitalsPayload(makeMetric({ name: "LCP" }), "/blog/");
    assert.equal(payload.name, "LCP");
  });

  test("includes value in data", () => {
    const payload = buildVitalsPayload(makeMetric({ name: "LCP", value: 2400 }), "/");
    assert.equal(payload.data.value, 2400);
  });

  test("includes rating in data", () => {
    const payload = buildVitalsPayload(
      makeMetric({ name: "LCP", value: 2400, rating: "needs-improvement" }),
      "/"
    );
    assert.equal(payload.data.rating, "needs-improvement");
  });

  test("includes path in data", () => {
    const payload = buildVitalsPayload(makeMetric({ name: "FCP" }), "/about/");
    assert.equal(payload.data.path, "/about/");
  });

  test("multiplies CLS value by 1000 (Umami stores integers)", () => {
    const payload = buildVitalsPayload(
      makeMetric({ name: "CLS", value: 0.05, rating: "good" }),
      "/"
    );
    assert.equal(payload.data.value, 50);
  });

  test("rounds CLS*1000 to integer", () => {
    const payload = buildVitalsPayload(
      makeMetric({ name: "CLS", value: 0.123456 }),
      "/"
    );
    assert.equal(payload.data.value, 123);
  });

  test("does not multiply non-CLS metrics", () => {
    const payload = buildVitalsPayload(makeMetric({ name: "INP", value: 180 }), "/");
    assert.equal(payload.data.value, 180);
  });

  test("TTFB with good rating → correct payload shape", () => {
    const payload = buildVitalsPayload(
      makeMetric({ name: "TTFB", value: 600, rating: "good" }),
      "/projects/"
    );
    assert.deepEqual(payload, {
      name: "TTFB",
      data: { value: 600, rating: "good", path: "/projects/" },
    });
  });

  test("INP with poor rating → correct payload shape", () => {
    const payload = buildVitalsPayload(
      makeMetric({ name: "INP", value: 450, rating: "poor" }),
      "/"
    );
    assert.deepEqual(payload, {
      name: "INP",
      data: { value: 450, rating: "poor", path: "/" },
    });
  });
});
