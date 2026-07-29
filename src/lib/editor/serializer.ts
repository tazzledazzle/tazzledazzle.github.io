/**
 * Metadata for a blog post — matches Astro content collection schema.
 */
export interface PostMetadata {
  title: string;
  pubDate: string; // YYYY-MM-DD
  description?: string;
  tags?: string[];
  tier?: "featured" | "standard" | "archived";
}

/**
 * Serializes post metadata and markdown body into a complete `.md` file string.
 *
 * Output format:
 * ```
 * ---
 * title: My Post
 * pubDate: 2026-07-28
 * description: Optional description  # omitted if absent
 * tags:                               # omitted if absent or empty
 *   - tag1
 *   - tag2
 * tier: featured                      # omitted if absent
 * ---
 *
 * # My Post
 *
 * Body content...
 * ```
 */
export function serializePost(metadata: PostMetadata, markdownBody: string): string {
  const lines: string[] = ["---"];

  // Required fields
  lines.push(`title: ${escapeYamlString(metadata.title)}`);
  lines.push(`pubDate: ${metadata.pubDate}`);

  // Optional: description
  if (metadata.description !== undefined && metadata.description !== "") {
    lines.push(`description: ${escapeYamlString(metadata.description)}`);
  }

  // Optional: tags (omit if absent or empty)
  if (metadata.tags !== undefined && metadata.tags.length > 0) {
    lines.push("tags:");
    for (const tag of metadata.tags) {
      lines.push(`  - ${tag}`);
    }
  }

  // Optional: tier
  if (metadata.tier !== undefined) {
    lines.push(`tier: ${metadata.tier}`);
  }

  lines.push("---");
  lines.push(""); // blank line separator between frontmatter and body
  lines.push(markdownBody);

  return lines.join("\n");
}

/**
 * Minimal YAML string escaping for scalar values.
 * Wraps the string in double quotes if it contains special characters.
 */
function escapeYamlString(value: string): string {
  // If the string contains chars that need quoting in YAML, double-quote it
  if (/[:#\[\]{},&*!|>'"%@`\n\r]/.test(value) || value.startsWith(" ") || value.endsWith(" ")) {
    const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return value;
}
