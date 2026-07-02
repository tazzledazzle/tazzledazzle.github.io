export function tagToSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function resolvePostTags(
  frontmatterTags: string[],
  backfillTags?: string[]
): string[] {
  if (frontmatterTags.length > 0) {
    return frontmatterTags;
  }
  return backfillTags ?? [];
}
