import { generateSlug, generateBranchName } from "../../lib/editor/slug.ts";

export interface PostMetadata {
  title: string;
  pubDate: string;
  description?: string;
  tags?: string[];
  tier?: "featured" | "standard" | "archived";
}

export interface MetadataPanelValues extends PostMetadata {
  slug: string;
  branchName: string;
}

export interface MetadataPanelOptions {
  onImport?: (content: string, filename: string) => void;
  mode?: "new" | "edit";
}

/**
 * MetadataPanel — vanilla JS class that renders and manages the post metadata
 * sidebar form. Mounts into a given container element.
 *
 * Emits a `metadata:change` CustomEvent on the container whenever any field changes.
 */
export class MetadataPanel {
  private container: HTMLElement;
  private options: MetadataPanelOptions;
  private slugManuallyEdited = false;
  private branchManuallyEdited = false;

  // Form element references (populated after render)
  private titleEl!: HTMLInputElement;
  private slugEl!: HTMLInputElement;
  private branchEl!: HTMLInputElement;
  private pubDateEl!: HTMLInputElement;
  private descriptionEl!: HTMLTextAreaElement;
  private tagsEl!: HTMLInputElement;
  private tierEl!: HTMLSelectElement;
  private tagsList: string[] = [];

  constructor(container: HTMLElement, options: MetadataPanelOptions = {}) {
    this.container = container;
    this.options = options;
    this.render();
    this.attachListeners();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="space-y-4 text-sm">
        <!-- Title -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Title</label>
          <input
            id="mp-title"
            type="text"
            placeholder="Post title…"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
          <p class="mt-1 text-xs text-zinc-600">Syncs with first H1 in editor</p>
        </div>

        <!-- Slug -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Slug</label>
          <input
            id="mp-slug"
            type="text"
            placeholder="auto-from-title"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono text-xs"
          />
        </div>

        <!-- Branch -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Branch</label>
          <input
            id="mp-branch"
            type="text"
            placeholder="post/YYYY-MM-DD-slug"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none font-mono text-xs"
          />
        </div>

        <!-- pubDate -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Pub Date</label>
          <input
            id="mp-pubdate"
            type="date"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
            value="${new Date().toISOString().slice(0, 10)}"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Description</label>
          <textarea
            id="mp-description"
            rows="3"
            placeholder="One-sentence summary for SEO and previews…"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none resize-none"
          ></textarea>
        </div>

        <!-- Tags chip input -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Tags</label>
          <div id="mp-tags-chips" class="flex flex-wrap gap-1 mb-2"></div>
          <input
            id="mp-tags-input"
            type="text"
            placeholder="Type tag and press Enter…"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <!-- Tier select -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Tier</label>
          <select
            id="mp-tier"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none"
          >
            <option value="">— none —</option>
            <option value="featured">Featured</option>
            <option value="standard">Standard</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <!-- Import drop zone -->
        <div class="border-t border-zinc-800 pt-4">
          <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Import</p>
          <div
            id="mp-dropzone"
            class="rounded-lg border-2 border-dashed border-zinc-700 p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors"
          >
            <p class="text-zinc-400 text-xs">Drop .md / .txt here</p>
            <p class="text-zinc-600 text-xs mt-1">or</p>
            <label class="mt-2 inline-block cursor-pointer rounded-md bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-600 transition-colors">
              Browse files
              <input id="mp-file-input" type="file" accept=".md,.txt" class="sr-only" />
            </label>
          </div>
          <p id="mp-imported-file" class="hidden mt-2 text-xs text-zinc-500"></p>
          <!-- Bear hint -->
          <p class="mt-3 text-xs text-zinc-600 leading-relaxed">
            Bear users: export as Markdown first — <em>File → Export Notes → Markdown</em> — then drop the <code>.md</code> file here.
          </p>
        </div>
      </div>
    `;

    // Cache element refs
    this.titleEl = this.container.querySelector<HTMLInputElement>("#mp-title")!;
    this.slugEl = this.container.querySelector<HTMLInputElement>("#mp-slug")!;
    this.branchEl = this.container.querySelector<HTMLInputElement>("#mp-branch")!;
    this.pubDateEl = this.container.querySelector<HTMLInputElement>("#mp-pubdate")!;
    this.descriptionEl = this.container.querySelector<HTMLTextAreaElement>("#mp-description")!;
    this.tagsEl = this.container.querySelector<HTMLInputElement>("#mp-tags-input")!;
    this.tierEl = this.container.querySelector<HTMLSelectElement>("#mp-tier")!;
  }

  private attachListeners(): void {
    // Title → auto-generate slug and branch
    this.titleEl.addEventListener("input", () => {
      if (!this.slugManuallyEdited) {
        this.slugEl.value = generateSlug(this.titleEl.value);
      }
      this.updateBranchFromSlug();
      this.emitChange();
    });

    // Slug manual edit
    this.slugEl.addEventListener("input", () => {
      this.slugManuallyEdited = true;
      this.updateBranchFromSlug();
      this.emitChange();
    });

    // Branch manual edit
    this.branchEl.addEventListener("input", () => {
      this.branchManuallyEdited = true;
      this.emitChange();
    });

    // Other fields
    for (const el of [this.pubDateEl, this.descriptionEl, this.tierEl]) {
      el.addEventListener("change", () => this.emitChange());
      el.addEventListener("input", () => this.emitChange());
    }

    // Tags chip input
    this.tagsEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const tag = this.tagsEl.value.trim().replace(/,$/, "");
        if (tag && !this.tagsList.includes(tag)) {
          this.tagsList.push(tag);
          this.renderChips();
          this.emitChange();
        }
        this.tagsEl.value = "";
      }
    });

    // Drop zone
    const dropzone = this.container.querySelector<HTMLElement>("#mp-dropzone")!;
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("border-indigo-500");
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.classList.remove("border-indigo-500");
    });
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("border-indigo-500");
      const file = e.dataTransfer?.files[0];
      if (file) this.handleFile(file);
    });

    // File browse input
    const fileInput = this.container.querySelector<HTMLInputElement>("#mp-file-input")!;
    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (file) this.handleFile(file);
    });
  }

  private updateBranchFromSlug(): void {
    if (!this.branchManuallyEdited) {
      const mode = this.options.mode ?? "new";
      this.branchEl.value = generateBranchName(mode, this.pubDateEl.value, this.slugEl.value);
    }
  }

  private renderChips(): void {
    const chipsEl = this.container.querySelector<HTMLElement>("#mp-tags-chips")!;
    chipsEl.innerHTML = this.tagsList
      .map(
        (tag) => `
        <span class="inline-flex items-center gap-1 rounded-full border border-indigo-700 px-2 py-0.5 text-xs text-indigo-300">
          ${tag}
          <button type="button" data-tag="${tag}" class="text-indigo-500 hover:text-red-400 transition-colors">×</button>
        </span>`
      )
      .join("");

    // Remove tag on × click
    chipsEl.querySelectorAll<HTMLButtonElement>("button[data-tag]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.tag!;
        this.tagsList = this.tagsList.filter((t) => t !== tag);
        this.renderChips();
        this.emitChange();
      });
    });
  }

  private handleFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const importedLabel = this.container.querySelector<HTMLElement>("#mp-imported-file")!;
      importedLabel.textContent = `Imported: ${file.name}`;
      importedLabel.classList.remove("hidden");
      this.options.onImport?.(content, file.name);
    };
    reader.readAsText(file);
  }

  private emitChange(): void {
    this.container.dispatchEvent(
      new CustomEvent("metadata:change", {
        detail: this.getValues(),
        bubbles: true,
      })
    );
  }

  /** Returns the current form values. */
  getValues(): MetadataPanelValues {
    return {
      title: this.titleEl.value,
      slug: this.slugEl.value,
      branchName: this.branchEl.value,
      pubDate: this.pubDateEl.value,
      description: this.descriptionEl.value || undefined,
      tags: this.tagsList.length > 0 ? [...this.tagsList] : undefined,
      tier: (this.tierEl.value as PostMetadata["tier"]) || undefined,
    };
  }

  /** Sets form values programmatically (e.g., when loading an existing post). */
  setValues(values: Partial<MetadataPanelValues>): void {
    if (values.title !== undefined) this.titleEl.value = values.title;
    if (values.slug !== undefined) {
      this.slugEl.value = values.slug;
      this.slugManuallyEdited = true;
    }
    if (values.branchName !== undefined) {
      this.branchEl.value = values.branchName;
      this.branchManuallyEdited = true;
    }
    if (values.pubDate !== undefined) this.pubDateEl.value = values.pubDate;
    if (values.description !== undefined) this.descriptionEl.value = values.description;
    if (values.tags !== undefined) {
      this.tagsList = [...values.tags];
      this.renderChips();
    }
    if (values.tier !== undefined) this.tierEl.value = values.tier;
    this.emitChange();
  }
}
