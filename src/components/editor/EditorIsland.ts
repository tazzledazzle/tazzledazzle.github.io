/**
 * EditorIsland — TipTap-based rich text editor island.
 *
 * Vanilla JS class. No React. Ships zero JS to any other page on the site.
 * Instantiated by editor.astro's inline <script> after authentication.
 *
 * Features:
 *   - BubbleMenu: floating Bold/Italic/Code/Link/H1/H2/H3 toolbar on text selection
 *   - Slash command palette: /h1 /bullet /code etc. triggered by typing "/"
 *   - Markdown serialization via tiptap-markdown
 *   - Placeholder text per block
 *   - Title sync to MetadataPanel on H1 changes
 */

import {Editor} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import {Placeholder} from "@tiptap/extension-placeholder";
import {Image} from "@tiptap/extension-image";
import {Link} from "@tiptap/extension-link";
import {CodeBlockLowlight} from "@tiptap/extension-code-block-lowlight";
import {Markdown} from "tiptap-markdown";
import type {MetadataPanel} from "./MetadataPanel.ts";

// ── Slash command definitions ──────────────────────────────────────────────

interface SlashCmd {
  label: string;
  shortcut: string;
  keywords: string[];
  action: (editor: Editor, range: { from: number; to: number }) => void;
}

const SLASH_COMMANDS: SlashCmd[] = [
  {
    label: "Heading 1",
    shortcut: "H1",
    keywords: ["h1", "heading", "title", "large"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).setHeading({level: 1}).run(),
  },
  {
    label: "Heading 2",
    shortcut: "H2",
    keywords: ["h2", "heading", "subtitle"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).setHeading({level: 2}).run(),
  },
  {
    label: "Heading 3",
    shortcut: "H3",
    keywords: ["h3", "heading", "subheading"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).setHeading({level: 3}).run(),
  },
  {
    label: "Bullet List",
    shortcut: "• •",
    keywords: ["bullet", "list", "unordered", "ul"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).toggleBulletList().run(),
  },
  {
    label: "Numbered List",
    shortcut: "1. 2.",
    keywords: ["numbered", "ordered", "list", "ol", "number"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).toggleOrderedList().run(),
  },
  {
    label: "Blockquote",
    shortcut: "\"",
    keywords: ["quote", "blockquote", "callout"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).toggleBlockquote().run(),
  },
  {
    label: "Code Block",
    shortcut: "</>",
    keywords: ["code", "codeblock", "pre", "snippet", "fence"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).toggleCodeBlock().run(),
  },
  {
    label: "Divider",
    shortcut: "——",
    keywords: ["divider", "rule", "separator", "hr", "horizontal"],
    action: (e, r) =>
        e.chain().focus().deleteRange(r).setHorizontalRule().run(),
  },
  {
    label: "Image (URL)",
    shortcut: "🖼",
    keywords: ["image", "img", "photo", "picture", "url"],
    action: (e, r) => {
      const src = window.prompt("Image URL:");
      if (src) {
        e.chain().focus().deleteRange(r).setImage({src}).run();
      }
    },
  },
];

// ── EditorIsland ──────────────────────────────────────────────────────────

export class EditorIsland {
  private editor: Editor;
  private metadataPanel: MetadataPanel;
  private loadingEl: HTMLElement | null;

  // BubbleMenu
  private bubbleMenuEl: HTMLElement;

  // Slash palette state
  private slashPaletteEl: HTMLElement | null = null;
  private slashRange: { from: number; to: number } | null = null;
  private slashSelectedIndex = 0;
  private slashFilteredCmds: SlashCmd[] = [];

  constructor(container: HTMLElement, metadataPanel: MetadataPanel) {
    this.metadataPanel = metadataPanel;
    this.loadingEl = container.querySelector("#editor-loading");

    // Create editor DOM target
    const editorEl = document.createElement("div");
    editorEl.className = "tiptap-editor";
    container.appendChild(editorEl);

    // Create and append BubbleMenu DOM (hidden initially)
    this.bubbleMenuEl = this.buildBubbleMenuEl();
    document.body.appendChild(this.bubbleMenuEl);

    this.editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === "heading") return "Heading…";
            return "Type '/' for commands…";
          },
          includeChildren: true,
        }),
        Image.configure({
          allowBase64: false,
          inline: false,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {class: "text-indigo-400 underline"},
        }),
        CodeBlockLowlight.configure({}),
        Markdown.configure({
          html: false,
          tightLists: true,
          bulletListMarker: "-",
          linkify: false,
          breaks: false,
          transformPastedText: true,
          transformCopiedText: false,
        }),
      ],
      editorProps: {
        attributes: {class: "tiptap-canvas"},
        handleKeyDown: (_view, event) => {
          if (this.slashPaletteEl) return this.handleSlashKeydown(event);
          return false;
        },
      },
      onUpdate: ({ editor }) => {
        this.syncTitleToPanel(editor);
        this.checkSlashCommand(editor);
      },
      onSelectionUpdate: () => {
        this.updateBubbleMenu();
      },
      onBlur: () => {
        // Delay hide so clicks on bubble buttons still register
        setTimeout(() => this.hideBubbleMenu(), 150);
        setTimeout(() => this.hideSlashPalette(), 200);
      },
    });

    if (this.loadingEl) {
      this.loadingEl.remove();
      this.loadingEl = null;
    }

    // Close slash palette on Escape globally
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.slashPaletteEl) {
        this.hideSlashPalette();
        this.editor.commands.focus();
      }
    });
  }

  // ── Public API ─────────────────────────────────────────────────────────

  getTitle(): string {
    let title = "";
    this.editor.state.doc.descendants((node) => {
      if (title) return false;
      if (
          node.type.name === "heading" &&
          (node.attrs as { level: number }).level === 1
      ) {
        title = node.textContent;
        return false;
      }
    });
    return title;
  }

  getMarkdown(): string {
    const storage = this.editor.storage as { markdown?: { getMarkdown: () => string } };
    return storage.markdown?.getMarkdown() ?? "";
  }

  setMarkdown(md: string): void {
    this.editor.commands.setContent(md);
  }

  destroy(): void {
    this.bubbleMenuEl.remove();
    this.slashPaletteEl?.remove();
    this.editor.destroy();
  }

  // ── BubbleMenu ─────────────────────────────────────────────────────────

  private buildBubbleMenuEl(): HTMLElement {
    const el = document.createElement("div");
    el.id = "editor-bubble-menu";
    el.setAttribute("aria-label", "Text formatting toolbar");
    el.style.cssText = `
      display: none;
      position: fixed;
      z-index: 100;
      background: #18181b;
      border: 1px solid #3f3f46;
      border-radius: 8px;
      padding: 4px;
      gap: 2px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      transform: translateX(-50%);
      pointer-events: auto;
    `;
    el.style.display = "none";

    const buttons: Array<{
      label: string;
      title: string;
      action: () => void;
      isActive?: () => boolean;
    }> = [
      {
        label: "B",
        title: "Bold",
        action: () => this.editor.chain().focus().toggleBold().run(),
        isActive: () => this.editor.isActive("bold"),
      },
      {
        label: "<i>I</i>",
        title: "Italic",
        action: () => this.editor.chain().focus().toggleItalic().run(),
        isActive: () => this.editor.isActive("italic"),
      },
      {
        label: "`",
        title: "Inline code",
        action: () => this.editor.chain().focus().toggleCode().run(),
        isActive: () => this.editor.isActive("code"),
      },
      {
        label: "🔗",
        title: "Link",
        action: () => {
          const prev = this.editor.getAttributes("link").href as string | undefined;
          const url = window.prompt("URL:", prev ?? "https://");
          if (url === null) return;
          if (!url) {
            this.editor.chain().focus().unsetLink().run();
          } else {
            this.editor.chain().focus().setLink({href: url}).run();
          }
        },
        isActive: () => this.editor.isActive("link"),
      },
      {
        label: "H1",
        title: "Heading 1",
        action: () =>
            this.editor.chain().focus().toggleHeading({level: 1}).run(),
        isActive: () => this.editor.isActive("heading", {level: 1}),
      },
      {
        label: "H2",
        title: "Heading 2",
        action: () =>
            this.editor.chain().focus().toggleHeading({level: 2}).run(),
        isActive: () => this.editor.isActive("heading", {level: 2}),
      },
      {
        label: "H3",
        title: "Heading 3",
        action: () =>
            this.editor.chain().focus().toggleHeading({level: 3}).run(),
        isActive: () => this.editor.isActive("heading", {level: 3}),
      },
    ];

    for (const btn of buttons) {
      const button = document.createElement("button");
      button.innerHTML = btn.label;
      button.title = btn.title;
      button.type = "button";
      button.style.cssText = `
        min-width: 28px;
        height: 28px;
        padding: 0 6px;
        border-radius: 4px;
        border: none;
        background: transparent;
        color: #d4d4d8;
        cursor: pointer;
        font-size: 12px;
        font-weight: 600;
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.1s;
      `;
      button.addEventListener("mouseenter", () => {
        button.style.background = "#27272a";
      });
      button.addEventListener("mouseleave", () => {
        button.style.background = btn.isActive?.()
            ? "#3730a3"
            : "transparent";
      });
      button.addEventListener("mousedown", (e) => {
        e.preventDefault(); // don't steal focus
        btn.action();
        // Refresh active states after action
        requestAnimationFrame(() => this.refreshBubbleActiveStates());
      });
      button.dataset.bubbleBtn = btn.title;
      el.appendChild(button);
    }

    el.style.display = "flex";
    el.style.display = "none"; // start hidden
    return el;
  }

  private updateBubbleMenu(): void {
    const {state} = this.editor;
    const {selection} = state;

    if (selection.empty) {
      this.hideBubbleMenu();
      return;
    }

    const {from, to} = selection;
    const startCoords = this.editor.view.coordsAtPos(from);
    const endCoords = this.editor.view.coordsAtPos(to);

    // Position centered above the selection
    const midX = (startCoords.left + endCoords.right) / 2;
    const topY = Math.min(startCoords.top, endCoords.top);

    this.bubbleMenuEl.style.display = "flex";
    this.bubbleMenuEl.style.left = `${midX}px`;
    this.bubbleMenuEl.style.top = `${topY - 48}px`;

    this.refreshBubbleActiveStates();
  }

  private hideBubbleMenu(): void {
    this.bubbleMenuEl.style.display = "none";
  }

  private refreshBubbleActiveStates(): void {
    const activeColor = "#3730a3";
    const inactiveColor = "transparent";
    const stateLookup: Record<string, boolean> = {
      Bold: this.editor.isActive("bold"),
      Italic: this.editor.isActive("italic"),
      "Inline code": this.editor.isActive("code"),
      Link: this.editor.isActive("link"),
      "Heading 1": this.editor.isActive("heading", {level: 1}),
      "Heading 2": this.editor.isActive("heading", {level: 2}),
      "Heading 3": this.editor.isActive("heading", {level: 3}),
    };
    this.bubbleMenuEl
        .querySelectorAll<HTMLButtonElement>("button[data-bubble-btn]")
        .forEach((btn) => {
          const title = btn.dataset.bubbleBtn ?? "";
          btn.style.background = stateLookup[title] ? activeColor : inactiveColor;
          btn.style.color = stateLookup[title] ? "#fff" : "#d4d4d8";
        });
  }

  // ── Slash command palette ──────────────────────────────────────────────

  private checkSlashCommand(editor: Editor): void {
    const {state} = editor;
    const {selection} = state;
    const {$from} = selection;

    if (!selection.empty) {
      this.hideSlashPalette();
      return;
    }

    const blockStart = $from.start();
    const text = state.doc.textBetween(blockStart, $from.pos, "\n");
    const match = text.match(/\/([\w ]*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      const from = $from.pos - match[0].length;
      const to = $from.pos;
      this.slashRange = {from, to};
      const filtered = SLASH_COMMANDS.filter(
          (cmd) =>
              !query ||
              cmd.label.toLowerCase().includes(query) ||
              cmd.keywords.some((k) => k.includes(query))
      );
      this.slashFilteredCmds = filtered;
      this.slashSelectedIndex = 0;
      this.showSlashPalette(editor);
    } else {
      this.hideSlashPalette();
    }
  }

  private showSlashPalette(editor: Editor): void {
    const cmds = this.slashFilteredCmds;

    if (cmds.length === 0) {
      this.hideSlashPalette();
      return;
    }

    if (!this.slashPaletteEl) {
      const el = document.createElement("div");
      el.id = "editor-slash-palette";
      el.style.cssText = `
        position: fixed;
        z-index: 200;
        background: #18181b;
        border: 1px solid #3f3f46;
        border-radius: 10px;
        padding: 4px;
        min-width: 200px;
        max-height: 300px;
        overflow-y: auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
      `;
      document.body.appendChild(el);
      this.slashPaletteEl = el;
    }

    // Position below cursor
    const {from} = this.slashRange!;
    const coords = editor.view.coordsAtPos(from);
    this.slashPaletteEl.style.left = `${coords.left}px`;
    this.slashPaletteEl.style.top = `${coords.bottom + 4}px`;

    // Render items
    this.slashPaletteEl.innerHTML = "";
    cmds.forEach((cmd, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.dataset.slashIndex = String(index);
      item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        padding: 7px 10px;
        border: none;
        border-radius: 6px;
        background: ${index === this.slashSelectedIndex ? "#27272a" : "transparent"};
        color: #e4e4e7;
        cursor: pointer;
        font-family: inherit;
        font-size: 13px;
        text-align: left;
        transition: background 0.1s;
      `;

      const shortcut = document.createElement("span");
      shortcut.textContent = cmd.shortcut;
      shortcut.style.cssText =
          "min-width: 32px; font-size: 11px; font-weight: 700; color: #71717a; font-variant-numeric: tabular-nums;";

      const label = document.createElement("span");
      label.textContent = cmd.label;

      item.appendChild(shortcut);
      item.appendChild(label);

      item.addEventListener("mousedown", (e) => {
        e.preventDefault();
        this.executeSlashCmd(cmd, editor);
      });
      item.addEventListener("mouseenter", () => {
        this.slashSelectedIndex = index;
        this.renderSlashItems();
      });

      this.slashPaletteEl!.appendChild(item);
    });
  }

  private renderSlashItems(): void {
    if (!this.slashPaletteEl) return;
    this.slashPaletteEl
        .querySelectorAll<HTMLButtonElement>("button[data-slash-index]")
        .forEach((btn) => {
          const i = Number(btn.dataset.slashIndex);
          btn.style.background =
              i === this.slashSelectedIndex ? "#27272a" : "transparent";
        });
  }

  private handleSlashKeydown(event: KeyboardEvent): boolean {
    const cmds = this.slashFilteredCmds;
    if (!cmds.length) return false;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      this.slashSelectedIndex = (this.slashSelectedIndex + 1) % cmds.length;
      this.renderSlashItems();
      this.scrollSlashItemIntoView();
      return true;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      this.slashSelectedIndex =
          (this.slashSelectedIndex - 1 + cmds.length) % cmds.length;
      this.renderSlashItems();
      this.scrollSlashItemIntoView();
      return true;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const cmd = cmds[this.slashSelectedIndex];
      if (cmd) this.executeSlashCmd(cmd, this.editor);
      return true;
    }
    if (event.key === "Escape") {
      this.hideSlashPalette();
      return true;
    }
    return false;
  }

  private scrollSlashItemIntoView(): void {
    const el = this.slashPaletteEl?.querySelector<HTMLElement>(
        `button[data-slash-index="${this.slashSelectedIndex}"]`
    );
    el?.scrollIntoView({block: "nearest"});
  }

  private executeSlashCmd(cmd: SlashCmd, editor: Editor): void {
    const range = this.slashRange;
    this.hideSlashPalette();
    if (range) cmd.action(editor, range);
  }

  private hideSlashPalette(): void {
    this.slashPaletteEl?.remove();
    this.slashPaletteEl = null;
    this.slashRange = null;
    this.slashFilteredCmds = [];
    this.slashSelectedIndex = 0;
  }

  // ── Title sync ─────────────────────────────────────────────────────────

  private syncTitleToPanel(editor: Editor): void {
    let h1: string | null = null;
    editor.state.doc.descendants((node) => {
      if (h1 !== null) return false;
      if (
          node.type.name === "heading" &&
          (node.attrs as { level: number }).level === 1
      ) {
        h1 = node.textContent;
        return false;
      }
    });
    if (h1 !== null) {
      this.metadataPanel.setValues({ title: h1 });
    }
  }
}
