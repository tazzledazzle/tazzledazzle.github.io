const SCHEMA_CONTEXT = "https://schema.org";

export interface ArticleSchemaInput {
  title: string;
  description?: string;
  pubDate: string;
  authorName: string;
  url: string;
  wordCount?: number;
  tags?: string[];
  image?: string;
}

export interface PersonSchemaInput {
  name: string;
  email?: string;
  sameAs?: string[];
}

export function countWords(body: string): number {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function buildArticleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Article",
    headline: input.title,
    datePublished: input.pubDate,
    author: {
      "@type": "Person",
      name: input.authorName
    },
    url: input.url
  };

  if (input.description) {
    schema.description = input.description;
  }
  if (typeof input.wordCount === "number") {
    schema.wordCount = input.wordCount;
  }
  if (input.tags && input.tags.length > 0) {
    schema.keywords = input.tags.join(", ");
  }
  if (input.image) {
    schema.image = input.image;
  }

  return schema;
}

export function buildPersonSchema(input: PersonSchemaInput): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Person",
    name: input.name
  };

  if (input.email) {
    schema.email = input.email;
  }
  if (input.sameAs && input.sameAs.length > 0) {
    schema.sameAs = input.sameAs;
  }

  return schema;
}
