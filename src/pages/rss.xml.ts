import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: { site?: URL }) {
  const posts = await getCollection("blog");
  const items = posts
    .filter((post) => post.data.tier !== "archived")
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime())
    .map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      link: post.data.permalink ?? `/blog/${post.id}/`
    }));

  return rss({
    title: "Terence Schumacher Blog",
    description: "Engineering notes, project writeups, and technical essays.",
    site: context.site ?? new URL("https://tazzledazzle.github.io"),
    items
  });
}
