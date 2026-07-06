import assert from "node:assert/strict";
import test from "node:test";
import {
  buildArticleSchema,
  buildPersonSchema,
  countWords
} from "./jsonLd.ts";

test("buildArticleSchema returns Article with required fields", () => {
  const schema = buildArticleSchema({
    title: "Kotlin Cheatsheet",
    description: "Quick Kotlin reference for engineers.",
    pubDate: "2024-11-08T00:00:00.000Z",
    authorName: "Terence Schumacher",
    url: "https://tazzledazzle.github.io/2024/11/08/kotlin-cheatsheet/",
    wordCount: 1200,
    tags: ["kotlin", "reference"],
    image: "https://tazzledazzle.github.io/og-default.png"
  });

  assert.equal(schema["@type"], "Article");
  assert.equal(schema.headline, "Kotlin Cheatsheet");
  assert.equal(schema.description, "Quick Kotlin reference for engineers.");
  assert.equal(schema.datePublished, "2024-11-08T00:00:00.000Z");
  assert.deepEqual(schema.author, { "@type": "Person", name: "Terence Schumacher" });
  assert.equal(schema.wordCount, 1200);
  assert.equal(schema.keywords, "kotlin, reference");
  assert.equal(schema.image, "https://tazzledazzle.github.io/og-default.png");
});

test("buildArticleSchema omits undefined optional fields", () => {
  const schema = buildArticleSchema({
    title: "Minimal Post",
    pubDate: "2024-01-01T00:00:00.000Z",
    authorName: "Terence Schumacher",
    url: "https://tazzledazzle.github.io/minimal/"
  });

  assert.equal(schema.headline, "Minimal Post");
  assert.equal("description" in schema, false);
  assert.equal("wordCount" in schema, false);
  assert.equal("keywords" in schema, false);
  assert.equal("image" in schema, false);
});

test("buildPersonSchema returns Person with sameAs", () => {
  const schema = buildPersonSchema({
    name: "Terence Schumacher",
    email: "terenceschumacher@gmail.com",
    sameAs: [
      "https://github.com/tazzledazzle",
      "https://linkedin.com/in/terenceschumacher"
    ]
  });

  assert.equal(schema["@type"], "Person");
  assert.equal(schema.name, "Terence Schumacher");
  assert.equal(schema.email, "terenceschumacher@gmail.com");
  assert.deepEqual(schema.sameAs, [
    "https://github.com/tazzledazzle",
    "https://linkedin.com/in/terenceschumacher"
  ]);
});

test("countWords strips code blocks and counts prose words", () => {
  const body = "Hello world\n```js\nconst x = 1\n```\nmore words here";
  assert.equal(countWords(body), 5);
});
