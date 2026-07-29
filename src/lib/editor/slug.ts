/**
 * Converts a post title to a URL-safe kebab-case slug.
 * - Lowercases everything
 * - Replaces spaces and consecutive non-alphanumeric chars with a single hyphen
 * - Strips leading/trailing hyphens
 * - Returns empty string for empty or punctuation-only inputs
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanum runs with hyphen
    .replace(/^-+|-+$/g, "");    // strip leading/trailing hyphens
}

/**
 * Generates the markdown filename for a blog post.
 * Format: YYYY-MM-DD-slug.md  (date comes from pubDate, not today)
 */
export function generateFilename(pubDate: string, slug: string): string {
  return `${pubDate}-${slug}.md`;
}

/**
 * Generates a Git branch name for the post.
 * - "new"  → post/YYYY-MM-DD-slug
 * - "edit" → edit/YYYY-MM-DD-slug
 */
export function generateBranchName(
  mode: "new" | "edit",
  pubDate: string,
  slug: string
): string {
  const prefix = mode === "edit" ? "edit" : "post";
  return `${prefix}/${pubDate}-${slug}`;
}
