# Task 2 Brief: Wire editor.astro to mount all editor components

## Context
`src/pages/editor.astro` has the full HTML shell (3 auth states, header with
Save Draft / Publish PR buttons, metadata sidebar slot, editor canvas slot).
The inline `<script>` handles auth state switching but has a placeholder comment
where the editor island should mount. Task 2 replaces that placeholder with real
wiring that connects all four layers: MetadataPanel, EditorIsland, SubmitFlow,
and the GitHub API utilities.

No new files needed — this task is entirely edits to the `<script>` block inside
`src/pages/editor.astro`.

## What to implement

Replace the `// TODO: import(...)` block in the `init()` function's authenticated
branch with working code that:

### 1. Mount MetadataPanel
```ts
const { MetadataPanel } = await import("/src/components/editor/MetadataPanel.ts");
const panelRoot = document.getElementById("metadata-panel-root")!;
const metadataPanel = new MetadataPanel(panelRoot, {
  mode: "new",
  onImport: handleImport,
});
```

### 2. Mount EditorIsland
```ts
const { EditorIsland } = await import("/src/components/editor/EditorIsland.ts");
const editorRoot = document.getElementById("editor-root")!;
const editorIsland = new EditorIsland(editorRoot, metadataPanel);
```

### 3. Mount SubmitFlow
```ts
const { SubmitFlow } = await import("/src/components/editor/SubmitFlow.ts");
const submitFlow = new SubmitFlow();
```

### 4. Implement handleImport (file import → preprocessors → editor)
```ts
async function handleImport(content: string, filename: string) {
  const { extractFrontmatter, stripBearSyntax, stripObsidianSyntax, inferTitle }
    = await import("/src/lib/editor/preprocessors.ts");

  // Clean Bear/Obsidian-specific syntax
  let cleaned = stripBearSyntax(content);
  cleaned = stripObsidianSyntax(cleaned);

  // Extract and apply frontmatter if present
  const { frontmatter, body } = extractFrontmatter(cleaned);
  const fm = frontmatter as Record<string, unknown>;

  metadataPanel.setValues({
    title: (fm.title as string) || inferTitle(body, filename),
    pubDate: (fm.pubDate as string) || (fm.date as string) || "",
    description: fm.description as string | undefined,
    tags: Array.isArray(fm.tags) ? fm.tags as string[] : undefined,
    tier: fm.tier as "featured" | "standard" | "archived" | undefined,
  });

  editorIsland.setMarkdown(body);
}
```

### 5. Save Draft button → localStorage
```ts
document.getElementById("btn-save-draft")?.addEventListener("click", () => {
  const draft = {
    metadata: metadataPanel.getValues(),
    markdown: editorIsland.getMarkdown(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("editor_draft", JSON.stringify(draft));
  // Brief visual feedback: button text flips to "Saved ✓" for 1.5s
  const btn = document.getElementById("btn-save-draft") as HTMLButtonElement;
  const original = btn.textContent;
  btn.textContent = "Saved ✓";
  setTimeout(() => { btn.textContent = original; }, 1500);
});
```

On authenticated init, also restore any saved draft from localStorage:
```ts
const savedDraft = localStorage.getItem("editor_draft");
if (savedDraft) {
  try {
    const draft = JSON.parse(savedDraft) as { metadata: Record<string, unknown>; markdown: string };
    metadataPanel.setValues(draft.metadata as Parameters<typeof metadataPanel.setValues>[0]);
    editorIsland.setMarkdown(draft.markdown);
  } catch {
    // malformed draft — ignore
  }
}
```

### 6. Publish PR button → SubmitFlow → GitHub API sequence
```ts
document.getElementById("btn-publish-pr")?.addEventListener("click", () => {
  const values = metadataPanel.getValues();
  const mode = currentMode; // "new" | "edit" — tracked in outer scope
  submitFlow.showConfirmModal(values, mode);
  submitFlow.onConfirm(async () => {
    const { getMainSHA, createBranch, createOrUpdateFile, createPR }
      = await import("/src/lib/editor/github-api.ts");
    const { serializePost } = await import("/src/lib/editor/serializer.ts");
    const { generateFilename } = await import("/src/lib/editor/slug.ts");

    const token = getToken(); // already defined in auth section
    const repo = "tazzledazzle/tazzledazzle.github.io";
    const meta = metadataPanel.getValues();
    const filename = generateFilename(meta.pubDate, meta.slug);
    const filePath = `src/content/blog/${filename}`;
    const markdownBody = editorIsland.getMarkdown();
    const fileContent = serializePost(meta, markdownBody);

    // Read the final branch name from the modal input (user may have edited it)
    const branchEl = document.getElementById("submit-branch-input") as HTMLInputElement | null;
    const branchName = branchEl?.value || meta.branchName;
    const prTitle = `post: ${meta.title}`;

    try {
      submitFlow.showProgress("Getting main branch SHA…");
      const sha = await getMainSHA(token!, repo);

      submitFlow.showProgress("Creating branch…");
      await createBranch(token!, repo, branchName, sha);

      submitFlow.showProgress("Uploading file…");
      // currentFileSHA is set when loading an existing post (undefined for new)
      await createOrUpdateFile(token!, repo, filePath, fileContent, prTitle, currentFileSHA);

      submitFlow.showProgress("Opening pull request…");
      const prUrl = await createPR(token!, repo, prTitle, branchName, "main");

      // Clear draft from localStorage on success
      localStorage.removeItem("editor_draft");
      submitFlow.showSuccess(prUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // Determine which step failed from the last showProgress call
      submitFlow.showError("GitHub API", message);
      // Check for auth expiry
      if (message.includes("401")) {
        (window as Window & { handleAuthExpiry?: () => void }).handleAuthExpiry?.();
      }
    }
  });
});
```

### 7. Load existing post modal
Add a "Load existing post" button to the page. Wire it to open a modal that:
- Calls `fetchFileTree(token, repo)` to get the list of blog `.md` filenames
- Shows a searchable `<input>` + scrollable `<ul>` of filenames
- On click: calls `fetchFileContent(token, repo, path)`, parses frontmatter,
  calls `metadataPanel.setValues(...)` and `editorIsland.setMarkdown(body)`,
  sets `currentFileSHA` and `currentMode = "edit"`, updates header mode label

Add the button to the metadata panel footer, below the import drop zone:
```html
<button id="btn-load-existing" ...>Load existing post</button>
```
Implement the modal inline in the script (similar to SubmitFlow's approach —
create a div, append to body, remove on cancel).

### 8. Handle ?file= URL param on page load
After mounting the island, check for `?file=src/content/blog/some-post.md`:
```ts
const fileParam = new URL(window.location.href).searchParams.get("file");
if (fileParam) {
  // auto-load that file as if user clicked "Load existing post" and selected it
  await loadExistingPost(fileParam); // extract this as a named function
}
```

### 9. Auth expiry → save editor state
Update the `handleAuthExpiry` global to save the current draft before showing the banner:
```ts
(window as Window & { handleAuthExpiry?: () => void }).handleAuthExpiry = () => {
  // Save current state before auth expires
  const draft = {
    metadata: metadataPanel.getValues(),
    markdown: editorIsland.getMarkdown(),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem("editor_draft", JSON.stringify(draft));
  document.getElementById("state-session-expired")?.classList.remove("hidden");
};
```
This replaces the existing stub `handleAuthExpiry` (which just shows the banner).
Note: `metadataPanel` and `editorIsland` are only in scope after auth + mount, so
this must be registered inside the `if (token)` block after mounting.

### 10. Disconnect button → clear draft too
Update the disconnect handler to also clear `editor_draft` from localStorage.

## Important implementation notes

- `currentMode: "new" | "edit"` and `currentFileSHA: string | undefined` are
  mutable variables declared in the `init()` function outer scope, updated when
  an existing post is loaded.
- The mode label in the header (`#editor-mode-label`) should read "New Post" or
  "Editing: {filename}" depending on mode.
- All dynamic imports (`import("/src/...")`) are top-level ESM paths — Astro's
  build will bundle them correctly for `output: "static"`.
- The `<script>` tag in editor.astro already has TypeScript support (inline
  Astro scripts are type-checked). Do not add `is:inline` or change the script tag.
- Do NOT add `is:inline` — the current script tag without it lets Astro bundle
  and process the TypeScript. Keep it as-is.

## Verification
The site must build without errors:
```bash
npm run build 2>&1 | tail -20
```
(There are no unit tests for browser-only wiring. Build success is the gate.)

## Commit
```
feat(editor): wire editor page — mount island, import flow, save draft, publish PR, load existing post
```

## Report
Write your full report to `.superpowers/sdd/task-2-report.md`.
Return: status (DONE/BLOCKED), commit SHA, build result summary.
