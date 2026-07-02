# Astro Data Mapping (Phase 2 Handoff)

Phase 1 delivers hiring content as Jekyll `_data/*.yml` files. Phase 2 copies them into Astro `src/data/` and registers each file with the Content Layer `file()` loader plus Zod schemas. **Do not scaffold Astro in Phase 1** — this document is the migration contract.

## Path Mapping

| Jekyll source | Astro destination | Jekyll access | Notes |
|---------------|-------------------|---------------|-------|
| `_data/navigation.yml` | `src/data/navigation.yml` | `site.data.navigation` | 4 nav items; lowercase URLs per D-18 |
| `_data/social.yml` | `src/data/social.yml` | `site.data.social` | Replaces `_config.yml` author block |
| `_data/career.yml` | `src/data/career.yml` | `site.data.career` | ≤3 roles, quantified bullets |
| `_data/projects/featured.yml` | `src/data/projects/featured.yml` | `site.data.projects.featured` | 3–5 hiring-facing cards |
| `_data/projects/archive.yml` | `src/data/projects/archive.yml` | `site.data.projects.archive` | Remaining professional repos |
| `_data/blog-inventory.yml` | `src/data/blog-inventory.yml` | `site.data.blog-inventory` | 51-post curation manifest |

Nested `projects/` structure is preserved under `src/data/projects/`.

## Phase 2 Migration Steps

1. Scaffold Astro 7 with `output: 'static'` and GitHub Pages deploy (`withastro/action@v6`).
2. Copy data files verbatim:
   ```bash
   mkdir -p src/data/projects
   cp _data/navigation.yml src/data/navigation.yml
   cp _data/social.yml src/data/social.yml
   cp _data/career.yml src/data/career.yml
   cp _data/blog-inventory.yml src/data/blog-inventory.yml
   cp _data/projects/featured.yml src/data/projects/featured.yml
   cp _data/projects/archive.yml src/data/projects/archive.yml
   ```
3. Register collections in `src/content.config.ts` (see loader examples below).
4. Migrate `_posts/` to `src/content/blog/` via content collection glob loader (separate from this data layer).
5. Wire layouts to import collections instead of `site.data.*`.
6. Keep `rake data:inventory` / `rake data:validate` in repo until Jekyll is retired, or port validation to Astro `astro check` + Zod.

## Liquid → Astro Access Patterns

| Jekyll (Liquid) | Astro equivalent |
|-----------------|------------------|
| `{% for item in site.data.navigation %}` | `import { getCollection } from 'astro:content'` then `getCollection('navigation')` |
| `{{ site.data.social.github.url }}` | `(await getEntry('social', 'default')).data.github.url` or direct `file()` import |
| `{% for p in site.data.projects.featured %}` | `getCollection('featuredProjects')` |
| `site.data.career.roles` | `getCollection('career')` → `.roles` field |
| `site.data.blog-inventory.posts` | Filter `getCollection('blogInventory')` by `tier` |

Prefer `getCollection()` in `.astro` frontmatter for type-safe access after Zod validation at build time.

## `file()` Loader Registration Examples

```typescript
// src/content.config.ts — Phase 2 scaffold (not built in Phase 1)
import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

const navigation = defineCollection({
  loader: file('src/data/navigation.yml'),
  schema: z.array(z.object({
    title: z.string(),
    url: z.string(),
    order: z.number(),
  })),
});

const social = defineCollection({
  loader: file('src/data/social.yml'),
  schema: z.object({
    name: z.string(),
    email: z.string().email(),
    github: z.object({ username: z.string(), url: z.string().url() }),
    linkedin: z.object({ username: z.string(), url: z.string().url() }),
    twitter: z.object({ username: z.string(), url: z.string().url() }),
    gravatar_hash: z.string(),
  }),
});

const career = defineCollection({
  loader: file('src/data/career.yml'),
  schema: z.object({
    education: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
    })),
    roles: z.array(z.object({
      employer: z.string(),
      title: z.string(),
      start_date: z.string(),
      end_date: z.string(),
      bullets: z.array(z.string()).min(1),
    })).max(3),
  }),
});

const projectEntry = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string(),
  tech_stack: z.array(z.string()).min(1),
  github_url: z.string().url(),
  demo_url: z.string().url().nullable(),
  demo_status: z.enum(['live', 'code_only', 'broken']),
  featured: z.boolean(),
  source: z.string(),
});

const featuredProjects = defineCollection({
  loader: file('src/data/projects/featured.yml'),
  schema: projectEntry.array(),
});

const archiveProjects = defineCollection({
  loader: file('src/data/projects/archive.yml'),
  schema: projectEntry.array(),
});

const blogInventory = defineCollection({
  loader: file('src/data/blog-inventory.yml'),
  schema: z.object({
    meta: z.object({
      generated_at: z.string(),
      total_posts: z.number().int(),
      tier_counts: z.object({
        featured: z.number().int(),
        standard: z.number().int(),
        archived: z.number().int(),
      }),
    }),
    posts: z.array(z.object({
      id: z.string(),
      filename: z.string(),
      title: z.string(),
      pub_date: z.string(),
      permalink: z.string(),
      tier: z.enum(['featured', 'standard', 'archived']),
      auto_rule: z.string(),
      hide_frontmatter: z.boolean(),
      canonical_slug: z.string().nullable(),
      duplicate_group: z.string().nullable(),
    })),
  }),
});

export const collections = {
  navigation,
  social,
  career,
  featuredProjects,
  archiveProjects,
  blogInventory,
};
```

## Blog Inventory Tier Usage (Phase 4)

`blog-inventory.yml` drives RSS, sitemap, and index filtering per D-16:

| Tier | RSS feed | Sitemap | Blog index | SEO |
|------|----------|---------|------------|-----|
| `featured` | Include | Include | Promote on homepage / blog highlights | Index |
| `standard` | Include | Include | Normal listing | Index |
| `archived` | **Exclude** | **Exclude** or deprioritize | **Exclude** from lists | `noindex` meta; URLs preserved |

Additional rules:

- All `hide_frontmatter: true` posts are `tier: archived` (13 posts today).
- `canonical_slug` on 2015 duplicate design docs points to the 2024 canonical post (D-17). Phase 4 should emit `<link rel="canonical">` on archived duplicates.
- Regenerate inventory after adding posts: `bundle exec rake data:inventory`.

## Navigation / Permalink Note

`_data/navigation.yml` uses `/work/` for the projects nav item (D-05). The live Jekyll page `projects.md` still resolves to `/projects/` until Phase 3 creates the `/work/` hiring page and updates permalinks. Phase 2 Astro should either:

- Create a `/work/` route immediately, or
- Temporarily alias `/work/` → projects content until Phase 3 ships.

Do **not** change `_posts/` filenames or delete posts during data migration (D-16).

## Validation Reference

Phase 1 validation: `bundle exec rake data:validate`

Checks all six data files including 51-post blog inventory coverage, 10–15 featured count, and hide-post archival. Phase 2 should replicate equivalent Zod + integration tests in `astro check` CI.

## Source File Field Reference

Actual field names from Phase 1 `_data/` artifacts (do not diverge):

**navigation.yml:** `title`, `url`, `order`

**social.yml:** `name`, `email`, `github.{username,url}`, `linkedin.{username,url}`, `twitter.{username,url}`, `gravatar_hash`

**career.yml:** `education[].{institution,degree}`, `roles[].{employer,title,start_date,end_date,bullets[]}`

**projects/*.yml:** `id`, `title`, `summary`, `tech_stack[]`, `github_url`, `demo_url`, `demo_status`, `featured`, `source`

**blog-inventory.yml:** `meta.{generated_at,total_posts,tier_counts}`, `posts[].{id,filename,title,pub_date,permalink,tier,auto_rule,hide_frontmatter,canonical_slug,duplicate_group}`
