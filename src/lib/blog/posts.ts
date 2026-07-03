import { resolvePostTags } from "./tags.ts";

export interface BlogPostEntry {
  id: string;
  data: {
    title: string;
    pubDate: Date;
    description?: string;
    tags: string[];
    tier?: "featured" | "standard" | "archived";
    permalink?: string;
  };
}

export interface PostNavEntry {
  title: string;
  permalink: string;
}

export function getDiscoverablePosts(posts: BlogPostEntry[]): BlogPostEntry[] {
  return posts
    .filter((post) => post.data.tier !== "archived")
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function getFeaturedPosts(posts: BlogPostEntry[]): BlogPostEntry[] {
  return posts
    .filter((post) => post.data.tier === "featured")
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function getStandardPosts(posts: BlogPostEntry[]): BlogPostEntry[] {
  return posts
    .filter((post) => post.data.tier === "standard")
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function getPrevNextPosts(
  posts: BlogPostEntry[],
  currentPermalink: string
): { prev: BlogPostEntry | null; next: BlogPostEntry | null } {
  const discoverable = getDiscoverablePosts(posts).sort(
    (a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime()
  );
  const index = discoverable.findIndex(
    (post) => post.data.permalink === currentPermalink
  );
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? discoverable[index - 1] : null,
    next: index < discoverable.length - 1 ? discoverable[index + 1] : null
  };
}

export function getAllTags(posts: BlogPostEntry[]): string[] {
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of resolvePostTags(post.data.tags)) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort((a, b) => a.localeCompare(b));
}

export function toPostNavEntry(post: BlogPostEntry): PostNavEntry {
  return {
    title: post.data.title,
    permalink: post.data.permalink ?? `/${post.id}/`
  };
}
