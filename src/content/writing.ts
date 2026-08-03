import type { WritingItem } from "./types";

/**
 * Posts, papers, notebooks, talks.
 *
 * Optional — if this array stays empty the Writing section and its nav link
 * are omitted entirely. An empty "Writing" page is worse than no Writing page.
 *
 * Worth considering: several of your interpretability notebooks read as
 * publishable write-ups already (gate sparsity, SAE adversarial robustness,
 * clustering stability). Rendering those as proper pages — with the figures —
 * would be the strongest possible Writing section, and it's content you have
 * already produced.
 */
export const writing: WritingItem[] = [];
