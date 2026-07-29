/**
 * EditorIsland — TipTap-based rich text editor island.
 *
 * Vanilla JS class. No React. Ships zero JS to any other page on the site.
 * Instantiated by editor.astro's inline <script> after authentication.
 */

import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Markdown } from "tiptap-markdown";
import type { MetadataPanel } from "./MetadataPanel.ts";

export class EditorIsland {
  private editor: Editor;
  private container: HTMLElement;
  private metadataPanel: MetadataPanel;
  private loadingEl: HTMLElement | null;

  constructor(container: HTMLElement, metadataPanel: MetadataPanel) {
    this.container = container;
    this.metadataPanel = metadataPanel;
    this.loadingEl = container.querySelector("#editor-loading");

    // Create editor DOM target
    const editorEl = document.createElement("div");
    editorEl.className = "tiptap-editor prose prose-invert max-w-none focus:outline-none";
    container.appendChild(editorEl);

    this.editor = new Editor({
      element: editorEl,
      extensions: [
        StarterKit.configure({
          // Code block handled by CodeBlockLowlight separately
          codeBlock: false,
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === "heading") {
              return "Heading…";
            }
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
          HTMLAttributes: {
            class: "text-indigo-400 underline",
          },
        }),
        CodeBlockLowlight.configure({
          // lowlight instance injected at runtime if syntax highlighting needed
          // lowlight,
        }),
        Markdown.configure({
          html: false,
          tightLists: true,
          tightListClass: "tight",
          bulletListMarker: "-",
          linkify: false,
          breaks: false,
          transformPastedText: true,
          transformCopiedText: false,
        }),
      ],
      editorProps: {
        attributes: {
          class: "min-h-[60vh] focus:outline-none",
        },
      },
      onUpdate: ({ editor }) => {
        // Sync H1 title changes to the MetadataPanel
        this.syncTitleToPanel(editor);
      },
    });

    // Hide loading spinner once editor mounts
    if (this.loadingEl) {
      this.loadingEl.remove();
      this.loadingEl = null;
    }
  }

  /**
   * Extracts the text of the first H1 node in the editor.
   * Returns empty string if none found.
   */
  getTitle(): string {
    let title = "";
    this.editor.state.doc.descendants((node) => {
      if (title) return false; // stop early
      if (node.type.name === "heading" && (node.attrs as { level: number }).level === 1) {
        title = node.textContent;
        return false;
      }
    });
    return title;
  }

  /**
   * Serializes the editor content to a markdown string via tiptap-markdown.
   */
  getMarkdown(): string {
    return this.editor.storage.markdown.getMarkdown();
  }

  /**
   * Loads markdown content into the editor.
   * Replaces any existing content.
   */
  setMarkdown(md: string): void {
    this.editor.commands.setContent(md);
  }

  /**
   * Destroys the TipTap editor instance. Call on unmount.
   */
  destroy(): void {
    this.editor.destroy();
  }

  private syncTitleToPanel(editor: Editor): void {
    let h1: string | null = null;
    editor.state.doc.descendants((node) => {
      if (h1 !== null) return false;
      if (node.type.name === "heading" && (node.attrs as { level: number }).level === 1) {
        h1 = node.textContent;
        return false;
      }
    });
    if (h1 !== null) {
      // Update metadata panel title without marking slug as manually edited
      this.metadataPanel.setValues({ title: h1 });
    }
  }
}
