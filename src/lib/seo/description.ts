const DESCRIPTION_MAX_LENGTH = 155;

/**
 * Returns explicit frontmatter description when present; otherwise the first
 * non-heading paragraph trimmed to 155 characters with an ellipsis.
 */
export function deriveDescription(body: string, explicit?: string): string {
  const trimmedExplicit = explicit?.trim();
  if (trimmedExplicit) {
    return trimmedExplicit;
  }

  const withoutCode = body.replace(/```[\s\S]*?```/g, "");
  const withoutHeadings = withoutCode.replace(/^#+\s.*$/gm, "");
  const paragraphs = withoutHeadings
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    )
    .filter((paragraph) => paragraph.length > 0);

  const firstParagraph = paragraphs[0] ?? "";
  if (!firstParagraph.trim()) {
    return "";
  }

  if (firstParagraph.length <= DESCRIPTION_MAX_LENGTH) {
    return firstParagraph;
  }

  return `${firstParagraph.slice(0, DESCRIPTION_MAX_LENGTH - 1).trimEnd()}…`;
}
