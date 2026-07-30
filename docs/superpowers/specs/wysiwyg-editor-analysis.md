# WYSIWYG Blog Post Editor — Decision Analysis

**Date:** 2026-07-28
**Context:** Blog post editor page on an Astro static site (GitHub Pages). Auth via GitHub App OAuth. Submit flow calls the GitHub API to create a PR with the new markdown file in `src/content/blog/`.

---

## 1. Library Recommendation

**Use TipTap.**

TipTap is the right call for this stack. It has an official Astro integration guide (updated June 2026), a vanilla JS install path that works in a plain `<script>` tag without pulling in React, and a rich extension ecosystem that covers every feature this editor needs out of the box. At ~50–70 KB gzipped for core + starter kit, it is significantly leaner than BlockNote (~788 KB with the Shiki bug) and more batteries-included than Lexical (which requires assembling slash commands, drag handles, and toolbar from community parts). The 37.8k GitHub stars and active corporate backing (TipTap GmbH) give it long-term maintainability confidence.

Implement it as a vanilla JS Astro island using `client:only` on a dedicated `<EditorIsland>` component, keeping zero JS shipped to the rest of the site.

**Required extensions:**

| Extension | Package | Purpose |
|---|---|---|
| StarterKit | `@tiptap/starter-kit` | Headings, bold, italic, lists, blockquote, code, undo/redo |
| Markdown | `tiptap-markdown` (community) | Import `.md` files; serialize editor content to markdown for the GitHub API payload |
| Slash Commands | `@tiptap/extension-slash-commands` or `@harshtalks/slash-tiptap` | `/` command palette |
| Drag Handle | `@tiptap/extension-drag-handle` | Block-level reorder with `⋮⋮` handle |
| Placeholder | `@tiptap/extension-placeholder` | Per-block empty-state hint text |
| Image | `@tiptap/extension-image` | Paste/drag image insert (base64 or URL) |
| Code Block Lowlight | `@tiptap/extension-code-block-lowlight` | Syntax-highlighted fenced code blocks |
| Link | `@tiptap/extension-link` | Inline links with floating edit bubble |
| Character Count | `@tiptap/extension-character-count` | Optional word count display |

**Known trade-offs:**

- TipTap is document-based (like Word), not natively block-based (like Notion). Drag-and-drop block reordering requires the Drag Handle extension and feels slightly less fluid than BlockNote's built-in block model. Acceptable for a solo-use editor.
- Collaboration, AI, and comments are paid TipTap Cloud features. None are needed here.
- The markdown serialization round-trip (editor state → markdown string → GitHub API) needs testing against all frontmatter-adjacent content (headings, code fences, images). Use `tiptap-markdown` and write a unit test for the serializer before shipping.

---

## 2. Must-Have UX Features (Priority Ordered)

### 1. Slash Command Menu
The single defining feature of a modern block editor. Type `/` anywhere to open a floating command palette at cursor position. Must filter in real time, show icon + label, dismiss on Escape. Minimum block types: H1/H2/H3, Bullet, Numbered list, Blockquote, Code block, Divider, Image.
**Complexity with TipTap:** Medium. Use `@harshtalks/slash-tiptap` — well-documented, no paid plan required.

### 2. Floating Selection Toolbar
Appears above selected text with Bold, Italic, Code, Link, and a "Turn into" type converter. Never a fixed header bar — the toolbar is invisible when not needed.
**Complexity:** Low. TipTap's `BubbleMenu` component handles positioning. Configure content to match the minimum button set.

### 3. Auto-Converting Markdown Syntax
Type `# ` → H1, `- ` → bullet, `` ``` `` → code block. Converts on Space/Enter without a mode switch. This is the primary input path for any user pasting from Bear or Obsidian.
**Complexity:** Very low. TipTap's `InputRules` (built into StarterKit) handles all standard conversions by default.

### 4. File Import (Markdown / Plain Text)
A drag-or-click zone on the page that accepts `.md` and `.txt` files from Bear, Obsidian, or macOS Notes exports. On drop, parse the file, strip any Bear-specific extensions (e.g., `::highlight::`), and load the cleaned markdown into the editor.
**Complexity:** Medium. Use `tiptap-markdown` to set content from a markdown string (`editor.commands.setContent(markdownString)`). The Bear extension stripping requires a small regex preprocessing step before hand-off.

### 5. Metadata Fields Panel
A structured sidebar or top-section form for the five frontmatter fields: `title` (text), `pubDate` (date picker), `description` (textarea), `tags` (tag chip input), `tier` (select: featured / standard / archived). Title should optionally sync with the first H1 in the editor body.
**Complexity:** Low. Pure HTML form with a small state sync. No editor library involvement.

### 6. Empty-State Placeholder Text
Every empty block shows hint text: `"Type '/' for commands"` in paragraphs, greyed heading labels (e.g., `"Heading 1"`). Eliminates blank-canvas intimidation.
**Complexity:** Very low. TipTap `Placeholder` extension, configured per-node.

### 7. Keyboard-First Navigation
`Enter` creates a new block, `Backspace` on empty block deletes it, `Tab`/`Shift+Tab` indents lists, `Shift+Enter` soft-returns, `Cmd+Z`/`Cmd+Shift+Z` undo/redo. Essential for power users and accessibility.
**Complexity:** None — all handled by StarterKit defaults.

### 8. Submit → GitHub PR Flow
A "Publish Draft PR" button that: (1) serializes editor content to markdown, (2) combines with metadata panel values to produce a frontmatter + body string, (3) calls the GitHub API (`PUT /repos/{owner}/{repo}/contents/src/content/blog/{slug}.md`) to create the file on a branch, then (4) calls the PR API to open the draft PR. Show a status toast and link to the opened PR.
**Complexity:** Medium. Client-side GitHub API calls using the OAuth token from the GitHub App session. No server required (static site, browser-only). Token scopes needed: `repo` (read/write content and PRs).

---

## 3. Nice-to-Have Features (Phase 2)

- **Drag-and-drop block reordering** — the TipTap Drag Handle extension works but requires CSS polish to feel native. Defer until core writing flow is stable.
- **Image upload** — pasting a URL is sufficient for MVP. Phase 2: base64 inline embed or GitHub API blob upload.
- **Hover block handle menu** — "Duplicate", "Delete", "Turn into" actions on the drag handle. Phase 2 alongside drag-and-drop.
- **Auto-save to localStorage** — protect against accidental navigation. Simple debounced `editor.getJSON()` → `localStorage.setItem`.
- **Word / reading-time count** — `@tiptap/extension-character-count`. Low effort, pleasant signal.
- **Focus / distraction-free mode** — CSS class toggle that hides the metadata panel. Keyboard shortcut (`Cmd+Shift+F`).
- **Micro-animations** — block insert fade, slash menu scale-in. Pure CSS transitions, 150ms budget.

---

## 4. Features to Skip

- **Column layouts** — Notion-style side-by-side columns. A blog post is linear prose. This adds implementation complexity for zero authoring benefit.
- **Real-time collaboration (Yjs)** — solo maintainer, single author. Not needed.
- **AI autocomplete / TipTap AI** — requires paid TipTap Cloud ($49/mo+) and a server runtime. Out of scope for a static site.
- **Comments / annotations** — out of scope.
- **Tables** — low ROI for a prose blog. Paste markdown tables directly if needed; the StarterKit does not include a table extension by default. Skip the table extension for MVP.
- **Callout blocks** — a nice Notion/Obsidian feature but zero occurrences in existing blog posts. Add later if authoring style shifts.
- **Block references / internal links** — Obsidian-style `[[wikilinks]]`. Not relevant to a public blog.
- **Mobile formatting keyboard** — Bear's iOS formatting keyboard is a gold standard. But this editor is a desktop-only admin tool (GitHub OAuth, PR workflow). Mobile editing is not in scope.
- **Version history** — GitHub PR history is the version history. No in-editor history panel needed.

---

## 5. Editor Page Layout Sketch

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back to site]                     [Save Draft]  [Publish PR ▶] │
├────────────────────────┬────────────────────────────────────┤
│  METADATA PANEL        │  EDITOR BODY                       │
│  (left sidebar, ~280px)│  (fluid, max-width ~720px, centered│
│                        │   within remaining space)           │
│  Title ___________     │                                     │
│  pubDate [date input]  │  ┌ Toolbar ──────────────────────┐ │
│  Description           │  │ B  I  `  Link  H1 H2 H3  ⋯   │ │
│  [textarea]            │  └────────────────────────────────┘ │
│                        │  (fixed inside editor container,    │
│  Tags [chip input]     │   not page-fixed)                   │
│                        │                                     │
│  Tier [select]         │  [Empty editor body]                │
│                        │  "Type '/' for commands..."         │
│  ── Import ──          │                                     │
│  [Drop .md / .txt here]│                                     │
│  or [Browse files]     │                                     │
│                        │                                     │
└────────────────────────┴────────────────────────────────────┘
```

**Layout notes:**
- The toolbar is a fixed bar at the top of the editor content area (not page-fixed). It scrolls away with the page on long documents — acceptable for this use case.
- The floating `BubbleMenu` appears above any text selection and replaces the fixed toolbar for inline formatting actions.
- The metadata panel is always visible on desktop (left sidebar). No accordion or tab — the fields are few enough to show all at once.
- The import drop zone sits at the bottom of the metadata panel. On drop/select, the file contents replace the editor body and attempt to prefill `title` from the first H1 or the filename.
- "Save Draft" commits the current state to localStorage. "Publish PR" opens the GitHub PR creation flow — it should show a confirmation modal summarizing the PR metadata before executing.
- The Submit button is top-right (always visible), not buried at the bottom. Writers who submit before scrolling down should not have to hunt for the action.

---

## 6. Open Questions

1. **GitHub OAuth scope and token storage.** Where does the access token live after GitHub App login? `sessionStorage` (cleared on tab close) vs. `localStorage` (persists). What is the expected token lifetime? This affects whether the user needs to re-auth mid-session.

2. **Branch naming convention for PRs.** Auto-generate from slug + timestamp (e.g., `post/2026-07-28-my-title`)? Or let the user specify? A generated name is lower friction.

3. **Slug generation.** Derive from `title` (kebab-cased) or let the user override? Filename in the repo is `YYYY-MM-DD-slug.md` — confirm the date comes from `pubDate`, not today's date.

4. **Image handling policy.** For MVP, images are URL references only (no upload). Confirm this is acceptable. If blog posts need embedded images, Phase 2 needs a GitHub blob upload step or a CDN strategy.

5. **Bear `.bear2bk` import.** The `.bear2bk` format is a SQLite archive, not a markdown file. If Bear exports need to be imported, the user must first export from Bear as markdown (Bear supports this via File → Export Notes → Markdown). Should the import UI communicate this? Or is direct `.bear2bk` import a requirement?

6. **Existing post editing.** The spec only mentions creating new posts. Will this editor also need to load and edit existing posts (fetching current file content from GitHub API)? Significant additional surface area if yes.

7. **Auth failure handling.** If the OAuth token expires mid-session while the user is writing, what should happen? Ideally: prompt re-auth without losing editor content (restore from localStorage after re-auth).
