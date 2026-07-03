import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";
import * as yaml from "js-yaml";

const parseObject = (text: string): Record<string, unknown> => {
  const value = yaml.load(text);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
};

const navigation = defineCollection({
  loader: file("src/data/navigation.yml", {
    parser: (text) => {
      const parsed = yaml.load(text);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => ({
        ...item,
        id: (item?.url ?? "").toString().replaceAll("/", "-").replace(/^-|-$/g, "") || "nav"
      }));
    }
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    url: z.string(),
    order: z.number().int()
  })
});

const social = defineCollection({
  loader: file("src/data/social.yml", {
    parser: (text) => ({ default: parseObject(text) })
  }),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    github: z.object({ username: z.string(), url: z.string().url() }),
    linkedin: z.object({ username: z.string(), url: z.string().url() }),
    twitter: z.object({ username: z.string(), url: z.string().url() }),
    gravatar_hash: z.string()
  })
});

const career = defineCollection({
  loader: file("src/data/career.yml", {
    parser: (text) => ({ default: parseObject(text) })
  }),
  schema: z.object({
    education: z.array(
      z.object({
        institution: z.string(),
        degree: z.string()
      })
    ),
    roles: z.array(
      z.object({
        employer: z.string(),
        title: z.string(),
        start_date: z.string(),
        end_date: z.string(),
        bullets: z.array(z.string()).min(1)
      })
    )
  })
});

const project = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  tech_stack: z.array(z.string()).min(1),
  github_url: z.string().url(),
  demo_url: z.string().url().nullable(),
  demo_status: z.enum(["live", "code_only", "broken"]),
  featured: z.boolean(),
  source: z.string()
});

const featuredProjects = defineCollection({
  loader: file("src/data/projects/featured.yml"),
  schema: project
});

const archiveProjects = defineCollection({
  loader: file("src/data/projects/archive.yml"),
  schema: project
});

const blogInventory = defineCollection({
  loader: file("src/data/blog-inventory.yml", {
    parser: (text) => ({ default: parseObject(text) })
  }),
  schema: z.object({
    meta: z.object({
      generated_at: z.string(),
      total_posts: z.number().int(),
      tier_counts: z.object({
        featured: z.number().int(),
        standard: z.number().int(),
        archived: z.number().int()
      })
    }),
    posts: z.array(
      z.object({
        id: z.string(),
        filename: z.string(),
        title: z.string(),
        pub_date: z.string(),
        permalink: z.string(),
        tier: z.enum(["featured", "standard", "archived"]),
        auto_rule: z.string(),
        hide_frontmatter: z.boolean(),
        canonical_slug: z.string().nullable(),
        duplicate_group: z.string().nullable()
      })
    )
  })
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,markdown,mdx}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    tier: z.enum(["featured", "standard", "archived"]).optional(),
    permalink: z.string().optional(),
    canonical_slug: z.string().optional().nullable(),
    hide_frontmatter: z.boolean().optional()
  })
});

export const collections = {
  navigation,
  social,
  career,
  featuredProjects,
  archiveProjects,
  blogInventory,
  blog
};
