import { load as yamlLoad } from "js-yaml";

/**
 * Parses YAML frontmatter from a markdown string.
 * Frontmatter must appear at the very beginning of the file, surrounded by `---` delimiters.
 *
 * Returns:
 *  - `frontmatter`: parsed YAML as a plain object (empty object if none present)
 *  - `body`: remaining markdown content with frontmatter block removed
 */
export function extractFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;
  const match = content.match(FM_RE);
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  const rawYaml = match[1];
  const body = content.slice(match[0].length);
  let frontmatter: Record<string, unknown> = {};
  try {
    const parsed = yamlLoad(rawYaml);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      frontmatter = parsed as Record<string, unknown>;
    }
  } catch {
    // Malformed YAML — return empty frontmatter, keep full body
    return { frontmatter: {}, body: content };
  }
  return { frontmatter, body };
}

/**
 * Removes Bear-specific markdown syntax:
 * - Strips `::highlight::` wrappers (keeps inner text)
 * - Removes trailing hashtag-only lines (Bear inline tags, e.g. `#tag1 #tag2`)
 *   only at the END of the document (not mid-document headings)
 */
export function stripBearSyntax(content: string): string {
  // Remove ::highlight:: wrappers
  let result = content.replace(/::(.+?)::/g, "$1");

  // Remove trailing lines that consist solely of hashtags and spaces
  // (Bear appends tags like "#writing #tech" at the end of notes)
  // Split, work from end, remove contiguous lines that match tag pattern
  const lines = result.split("\n");
  let endIdx = lines.length;
  // Skip trailing empty lines then eat tag-only lines
  while (endIdx > 0) {
    const line = lines[endIdx - 1].trim();
    if (line === "") {
      endIdx--;
      continue;
    }
    // A Bear tag line: only contains #word tokens (no markdown heading prefix with space after #)
    // Heading: "# Heading" — has a space after the hash at start
    // Bear tag: "#tag1 #tag2" — no space after hash (or has space but after the whole word)
    if (/^(#[a-zA-Z0-9_/]+\s*)+$/.test(line)) {
      endIdx--;
    } else {
      break;
    }
  }
  result = lines.slice(0, endIdx).join("\n");

  return result;
}

/**
 * Removes Obsidian-specific wikilink syntax:
 * - `[[page name]]` → `page name`
 * - `[[page|alias]]` → `alias`
 * - `![[embed]]` → removed entirely (including surrounding newline if any)
 */
export function stripObsidianSyntax(content: string): string {
  // Remove embedded notes ![[...]] entirely (including surrounding blank line)
  let result = content.replace(/\n?!\[\[.*?\]\]\n?/g, () => {
    // Preserve one newline boundary if the match consumed surrounding newlines
    return "\n";
  });
  // Clean up potential double newlines introduced by embed removal
  result = result.replace(/\n{3,}/g, "\n\n");

  // Convert [[page|alias]] → alias
  result = result.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");

  // Convert [[page name]] → page name
  result = result.replace(/\[\[([^\]]+)\]\]/g, "$1");

  return result;
}

/**
 * Infers a human-readable title from markdown body or filename.
 * Priority:
 *  1. First H1 line in body (`# Title`)
 *  2. Filename stripped of YYYY-MM-DD- prefix and .md extension, hyphens→spaces
 */
export function inferTitle(body: string, filename: string): string {
  // Try to find first H1
  const h1Match = body.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Fallback: derive from filename
  if (!filename) return "";
  let name = filename;
  // Strip .md extension
  if (name.endsWith(".md")) name = name.slice(0, -3);
  // Strip YYYY-MM-DD- date prefix if present
  name = name.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  // Convert hyphens to spaces
  name = name.replace(/-/g, " ");
  return name;
}
