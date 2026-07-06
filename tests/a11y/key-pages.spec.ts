import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const KEY_PAGES = [
  "/",
  "/about/",
  "/work/",
  "/career/",
  "/blog/",
  "/2024/11/08/kotlin-cheatsheet/"
];

for (const pagePath of KEY_PAGES) {
  test(`axe WCAG scan: ${pagePath}`, async ({ page }) => {
    await page.goto(pagePath);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(
      results.violations,
      `axe violations on ${pagePath}:\n${JSON.stringify(results.violations, null, 2)}`
    ).toEqual([]);
  });
}
