import type { PostMetadata } from "./MetadataPanel.ts";

type Mode = "new" | "edit";

/**
 * SubmitFlow — handles the PR confirmation modal and submission progress UI.
 *
 * Vanilla JS, no framework dependencies. Mounts/unmounts a modal overlay
 * into document.body.
 */
export class SubmitFlow {
  private overlay: HTMLElement | null = null;
  private confirmCallbacks: Array<() => void> = [];

  /**
   * Renders the confirmation modal with a summary of what will be published.
   */
  showConfirmModal(metadata: PostMetadata & { slug: string; branchName: string }, mode: Mode): void {
    this.removeOverlay();
    this.confirmCallbacks = [];

    const filename = `src/content/blog/${metadata.pubDate}-${metadata.slug}.md`;
    const prTitle = `post: ${metadata.title}`;
    const modeLabel = mode === "edit"
      ? `<span class="text-yellow-400">Editing existing: ${filename}</span>`
      : `<span class="text-green-400">New post</span>`;

    const overlay = document.createElement("div");
    overlay.id = "submit-flow-overlay";
    overlay.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm";

    overlay.innerHTML = `
      <div class="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-4">
        <h2 class="text-lg font-bold text-zinc-100">Confirm Publish</h2>

        <div class="space-y-2 text-sm text-zinc-300">
          <div class="flex justify-between">
            <span class="text-zinc-500">Mode</span>
            <span>${modeLabel}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-500">Title</span>
            <span class="font-medium">${escapeHtml(metadata.title)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-500">Slug</span>
            <code class="text-xs text-indigo-400">${escapeHtml(metadata.slug)}</code>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-500">Pub Date</span>
            <span>${escapeHtml(metadata.pubDate)}</span>
          </div>
          ${metadata.tags?.length ? `
          <div class="flex justify-between">
            <span class="text-zinc-500">Tags</span>
            <span>${metadata.tags.map(escapeHtml).join(", ")}</span>
          </div>` : ""}
          ${metadata.tier ? `
          <div class="flex justify-between">
            <span class="text-zinc-500">Tier</span>
            <span>${escapeHtml(metadata.tier)}</span>
          </div>` : ""}
          <div class="flex justify-between">
            <span class="text-zinc-500">File path</span>
            <code class="text-xs text-zinc-400 break-all">${escapeHtml(filename)}</code>
          </div>
        </div>

        <!-- Branch (editable one last time) -->
        <div>
          <label class="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Branch</label>
          <input
            id="submit-branch-input"
            type="text"
            value="${escapeHtml(metadata.branchName)}"
            class="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-indigo-500 focus:outline-none font-mono text-xs"
          />
        </div>

        <div class="flex justify-between items-center text-xs text-zinc-500">
          <span>PR title: <em>${escapeHtml(prTitle)}</em></span>
        </div>

        <!-- Progress area (hidden until confirm) -->
        <div id="submit-progress" class="hidden rounded-lg bg-zinc-800 p-3 text-sm text-zinc-300"></div>

        <!-- Actions -->
        <div id="submit-actions" class="flex gap-3 justify-end">
          <button
            id="submit-cancel"
            class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-confirm"
            class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Publish PR ▶
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;

    // Cancel
    overlay.querySelector("#submit-cancel")?.addEventListener("click", () => {
      this.removeOverlay();
    });

    // Confirm
    overlay.querySelector("#submit-confirm")?.addEventListener("click", () => {
      this.confirmCallbacks.forEach((cb) => cb());
    });

    // Click outside to cancel
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) this.removeOverlay();
    });
  }

  /**
   * Registers a callback to invoke when the user clicks "Publish PR".
   */
  onConfirm(callback: () => void): void {
    this.confirmCallbacks.push(callback);
  }

  /**
   * Updates the modal to show which step of the API sequence is running.
   * Hides the action buttons while in progress.
   */
  showProgress(step: string): void {
    const actionsEl = this.overlay?.querySelector<HTMLElement>("#submit-actions");
    const progressEl = this.overlay?.querySelector<HTMLElement>("#submit-progress");
    if (actionsEl) actionsEl.classList.add("hidden");
    if (progressEl) {
      progressEl.classList.remove("hidden");
      progressEl.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-indigo-400 shrink-0"></div>
          <span>${escapeHtml(step)}</span>
        </div>
      `;
    }
  }

  /**
   * Shows the success state with a link to the newly opened PR.
   */
  showSuccess(prUrl: string): void {
    const progressEl = this.overlay?.querySelector<HTMLElement>("#submit-progress");
    if (progressEl) {
      progressEl.classList.remove("hidden");
      progressEl.innerHTML = `
        <div class="space-y-3">
          <p class="text-green-400 font-semibold">PR opened successfully!</p>
          <a
            href="${escapeHtml(prUrl)}"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-indigo-400 underline"
          >
            View PR on GitHub ↗
          </a>
        </div>
      `;
    }
    // Show a close button instead of publish/cancel
    const actionsEl = this.overlay?.querySelector<HTMLElement>("#submit-actions");
    if (actionsEl) {
      actionsEl.classList.remove("hidden");
      actionsEl.innerHTML = `
        <button
          id="submit-close"
          class="rounded-lg bg-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-600 transition-colors"
        >
          Close
        </button>
      `;
      actionsEl.querySelector("#submit-close")?.addEventListener("click", () => {
        this.removeOverlay();
      });
    }
  }

  /**
   * Shows the error state for a given step with a retry button.
   */
  showError(step: string, error: string): void {
    const progressEl = this.overlay?.querySelector<HTMLElement>("#submit-progress");
    if (progressEl) {
      progressEl.classList.remove("hidden");
      progressEl.innerHTML = `
        <div class="space-y-2">
          <p class="text-red-400 font-semibold">Failed at: ${escapeHtml(step)}</p>
          <p class="text-zinc-400 text-xs break-words">${escapeHtml(error)}</p>
        </div>
      `;
    }
    // Show retry + cancel buttons
    const actionsEl = this.overlay?.querySelector<HTMLElement>("#submit-actions");
    if (actionsEl) {
      actionsEl.classList.remove("hidden");
      actionsEl.innerHTML = `
        <button
          id="submit-cancel-after-error"
          class="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Cancel
        </button>
        <button
          id="submit-retry"
          class="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
        >
          Retry
        </button>
      `;
      actionsEl.querySelector("#submit-cancel-after-error")?.addEventListener("click", () => {
        this.removeOverlay();
      });
      actionsEl.querySelector("#submit-retry")?.addEventListener("click", () => {
        this.confirmCallbacks.forEach((cb) => cb());
      });
    }
  }

  private removeOverlay(): void {
    this.overlay?.remove();
    this.overlay = null;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
