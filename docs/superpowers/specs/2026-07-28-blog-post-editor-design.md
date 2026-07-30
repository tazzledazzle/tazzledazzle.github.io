# Blog Post Editor — Design Spec

**Date:** 2026-07-28
**Status:** Approved
**Author:** Terence Schumacher

---

## Overview

A protected WYSIWYG blog post editor page at `/editor` on tazzledazzle.github.io. Authenticated via GitHub App OAuth. Lets the user write or edit a post in a Notion/Bear-style rich-text editor, fill in frontmatter metadata, and submit — which calls the GitHub REST API to create a markdown file in `src/content/blog/` and open a draft PR. No backend required; runs entirely in the browser against the GitHub API.

---

## Architecture

Three logical layers, all client-side:

```
GitHub App OAuth  →  Editor Page  →  GitHub REST API
(token in           (TipTap island    (create/update file,
 localStorage)       + metadata form)   open/update PR)
```

- **Auth layer:** GitHub App OAuth. Token stored in `localStorage` as `gh_editor_token`.
- **Editor layer:** TipTap vanilla JS Astro island (`client:only`). Metadata sidebar (pure HTML form). File import drop zone. Auto-save to localStorage on every change (debounced 2s).
- **Submit layer:** Browser calls GitHub REST API directly. Creates a branch, writes the markdown file with frontmatter, opens a draft PR.

The editor island ships zero JS to any other page on the site.

---

## Section 1 — Auth Flow

### GitHub App OAuth

```
1. User hits /editor → no token in localStorage
2. Page shows "Connect GitHub" button
3. Click → redirect to GitHub OAuth with GitHub App client_id
4. GitHub redirects back to /editor?code=xxx
5. Page exchanges code for access token → stores in localStorage as gh_editor_token
6. Editor unlocks
```

**Token lifecycle:**
- Required OAuth scope: `repo` (read/write content + PRs on `tazzledazzle/tazzledazzle.github.io`)
- On every API call, catch 401 → save editor state to localStorage → show "Session expired, reconnect" banner with re-auth button → after re-auth, restore editor state automatically
- "Disconnect" button in editor header clears `gh_editor_token` from localStorage

**GitHub App setup (one-time):**
- Create GitHub App in GitHub Settings with callback URL `https://tazzledazzle.github.io/editor`
- Bake `GITHUB_APP_CLIENT_ID` as a build-time env variable in the Astro config

---

## Section 2 — Library

**TipTap** (vanilla JS, `@tiptap/core` + extensions). Official Astro integration guide (updated June 2026). No React dependency. ~50–70 KB gzipped. 37.8k GitHub stars, MIT license.

### Required Extensions

| Extension | Package | Purpose |
|-----------|---------|---------|
| StarterKit | `@tiptap/starter-kit` | Headings, bold, italic, lists, blockquote, code, undo/redo |
| Markdown | `tiptap-markdown` | Import `.md` files; serialize editor → markdown for API payload |
| Slash Commands | `@harshtalks/slash-tiptap` | `/` command palette |
| Drag Handle | `@tiptap/extension-drag-handle` | Block reorder with `⋮⋮` handle (Phase 2) |
| Placeholder | `@tiptap/extension-placeholder` | Per-block empty-state hint text |
| Image | `@tiptap/extension-image` | URL-based image insert |
| Code Block Lowlight | `@tiptap/extension-code-block-lowlight` | Syntax-highlighted fenced code blocks |
| Link | `@tiptap/extension-link` | Inline links with floating edit bubble |
| Character Count | `@tiptap/extension-character-count` | Word count display (Phase 2) |

### Known Trade-offs
- TipTap is document-based, not natively block-based. Drag-and-drop reordering (Phase 2) requires the Drag Handle extension and CSS polish to feel native.
- Collaboration, AI, and comments are paid TipTap Cloud features — none needed here.
- The markdown serialization round-trip (editor state → markdown string → GitHub API) needs a unit test against all frontmatter-adjacent content (headings, code fences, images) before shipping.

---

## Section 3 — Editor Page Layout

Two-panel layout on desktop. The page is `/editor`.

```
┌─────────────────────────────────────────────────────────────────┐
│  ← tazzledazzle.github.io          [Save Draft]  [Publish PR ▶] │
├────────────────────────┬────────────────────────────────────────┤
│  METADATA              │  EDITOR                                │
│  (280px fixed)         │  (fluid, centered, max 720px)          │
│                        │                                        │
│  Title                 │  [Floating BubbleMenu on selection]    │
│  [_______________]     │  B  I  `  Link  H1 H2 H3              │
│  ↑ syncs from H1       │                                        │
│                        │  Type '/' for commands...              │
│  Slug                  │                                        │
│  [_______________]     │                                        │
│  (auto from title)     │                                        │
│                        │                                        │
│  Branch                │                                        │
│  [_______________]     │                                        │
│  (auto from slug)      │                                        │
│                        │                                        │
│  pubDate  [date]       │                                        │
│  Description           │                                        │
│  [textarea]            │                                        │
│  Tags  [chip input]    │                                        │
│  Tier  [select ▼]      │                                        │
│                        │                                        │
│  ── Import ──          │                                        │
│  [Drop .md/.txt here]  │                                        │
│  or [Browse files]     │                                        │
│                        │                                        │
│  Bear users: export    │                                        │
│  as Markdown first     │                                        │
│  (File → Export →      │                                        │
│   Markdown)            │                                        │
└────────────────────────┴────────────────────────────────────────┘
```

**Key behaviors:**
- Title field and first H1 in the editor body stay in sync — editing either updates both
- Slug auto-generates from title (kebab-case), user can override
- Branch name auto-fills as `post/YYYY-MM-DD-{slug}`, user can override
- "Save Draft" = commit to localStorage only, no GitHub call
- "Publish PR" = opens confirmation modal before any API call
- Floating BubbleMenu (Bold, Italic, Code, Link, Turn into H1/H2/H3) appears only on text selection — no fixed toolbar cluttering the canvas

---

## Section 4 — Import Flow

```
1. User drops .md / .txt file onto the drop zone (or clicks Browse)
2. Browser reads file as text via FileReader API
3. Preprocessing:
   - Strip Bear-specific syntax (::highlight::, trailing #tags)
   - Strip Obsidian wikilinks ([[page]]) → plain text
   - Extract YAML frontmatter block → prefill metadata fields
4. Load cleaned markdown into TipTap via tiptap-markdown setContent()
5. If title field is empty → pull from first H1 or filename (strip date prefix)
6. Drop zone collapses; "Clear and re-import" link appears
```

**Supported sources:**

| App | Export path | Format |
|-----|------------|--------|
| Bear | File → Export Notes → Markdown | `.md` |
| Obsidian | Right-click note → Export to markdown | `.md` |
| macOS Notes | Copy-paste into editor body | paste |
| Craft | Export → Markdown | `.md` |

**Bear hint copy (shown persistently in sidebar):**
> Bear users: export as Markdown first — File → Export Notes → Markdown — then drop the `.md` file here.

---

## Section 5 — Submit / PR Flow

### Confirmation Modal

Shown before any GitHub API call. Displays:
- Post title, slug, pubDate, tags, tier
- Target file path: `src/content/blog/YYYY-MM-DD-{slug}.md`
- Branch name (editable one last time)
- PR title (auto: `post: {title}`)
- Mode indicator: "New post" or "Editing existing: {filename}"

### API Sequence (on confirm)

```
1. Serialize editor → frontmatter YAML + markdown body string
2. GET /repos/tazzledazzle/tazzledazzle.github.io/git/ref/heads/main
   → get latest commit SHA
3. POST /repos/.../git/refs
   → create branch post/YYYY-MM-DD-{slug}
4. PUT /repos/.../contents/src/content/blog/YYYY-MM-DD-{slug}.md
   → create (new post) or update (existing post, requires current file SHA)
5. POST /repos/.../pulls
   → open draft PR: title "post: {title}", base: main, head: new branch
6. Show success toast with "View PR on GitHub ↗" link
7. Clear localStorage draft
```

**Error handling:**
- Each step shows inline progress: "Creating branch…", "Uploading file…", "Opening PR…"
- On failure: show which step failed, keep editor content intact, offer retry
- If file already exists on `main` and mode is "New post": warn before overwriting

---

## Section 6 — Existing Post Editing

### Entry Points
- Query param: `/editor?file=src/content/blog/2026-07-28-my-post.md` loads a specific file on page load
- "Load existing post" button in metadata panel opens a search modal

### Load Flow

```
1. User clicks "Load existing post" → modal opens
2. GET /repos/.../git/trees/main?recursive=1
   → fetch file tree, filter to src/content/blog/*.md
3. Show searchable list of posts by filename only (fetching all titles would require 50+ individual API calls — not worth it for a search modal)
4. User selects post → GET /repos/.../contents/src/content/blog/{filename}
5. Decode base64 content → parse frontmatter → prefill metadata panel
6. Load markdown body into TipTap editor
7. Store current file SHA in state (required for PUT update call)
```

### Edit Mode Indicators
- Header shows "Editing: {filename}" instead of "New Post"
- Branch auto-names as `edit/YYYY-MM-DD-{slug}`
- Confirmation modal shows "Editing existing: {filename}"
- PR flow uses the stored file SHA to prevent conflicts

---

## MVP Must-Have Features

Priority ordered:

1. **Slash command menu** — `/` palette with H1–H3, Bullet, Numbered list, Blockquote, Code block, Divider, Image
2. **Floating selection toolbar** — BubbleMenu: Bold, Italic, Code, Link, Turn into H1/H2/H3
3. **Auto-converting markdown syntax** — `# ` → H1, `- ` → bullet, ` ``` ` → code block on Space/Enter
4. **File import drop zone** — `.md` / `.txt` with preprocessing for Bear/Obsidian/Craft
5. **Metadata panel** — title, pubDate, description, tags (chip input), tier (select)
6. **Empty-state placeholder text** — "Type '/' for commands…" per empty block
7. **Submit → GitHub API → PR flow** — with confirmation modal and inline progress
8. **Existing post loading** — search modal + file fetch from GitHub API
9. **Auth expiry recovery** — save to localStorage, prompt re-auth, restore after

---

## Phase 2 (After MVP)

- Drag-and-drop block reordering (TipTap Drag Handle extension + CSS polish)
- Auto-save indicator ("Saved locally" timestamp)
- Word / reading-time count
- Focus / distraction-free mode (hide metadata panel, `Cmd+Shift+F`)
- Image upload via GitHub blob API
- Hover block handle menu (Duplicate, Delete, Turn into)
- Micro-animations (block insert fade, slash menu scale-in, 150ms budget)

---

## Features Explicitly Out of Scope

| Feature | Reason |
|---------|--------|
| Column layouts | Blog posts are linear prose |
| Real-time collaboration | Solo maintainer |
| AI autocomplete | Requires paid TipTap Cloud + server runtime |
| Comments / annotations | Out of scope |
| Tables | Low ROI; paste markdown tables directly |
| Callout blocks | Zero occurrences in existing posts |
| Block references / wikilinks | Not relevant to a public blog |
| Mobile formatting keyboard | Desktop-only admin tool |
| Version history | GitHub PR history serves this purpose |
| `.bear2bk` direct import | SQLite archive format; user exports as `.md` from Bear first |

---

## Frontmatter Schema Reference

```yaml
title: string           # required
pubDate: date           # required (YYYY-MM-DD)
description: string     # optional
tags: string[]          # default []
tier: featured | standard | archived  # optional
```

Generated filename: `src/content/blog/YYYY-MM-DD-{slug}.md`
where date comes from `pubDate`, not today's date.
