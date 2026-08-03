import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Post registry.
 *
 * Posts are MDX files in `src/content/posts/`. Each exports a `meta` object
 * alongside its default component, so the file is the single source of truth
 * for both the writing and its metadata; there is no separate index to fall
 * out of sync.
 *
 * Server-only: reads the filesystem at build time.
 */

export interface PostMeta {
  title: string;
  /** One or two sentences. Shown on the index card and used as the description. */
  summary: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  /** e.g. "Interpretability", "Agents", "Retrieval". */
  topic: string;
  /** The paper under discussion. Omitted for posts that are not paper reviews. */
  paper?: {
    title: string;
    authors: string;
    year: number;
    /** arXiv, DOI or publisher URL. */
    url: string;
    venue?: string;
  };
  /** Hidden from the index and from generateStaticParams until ready. */
  draft?: boolean;
}

export interface Post extends PostMeta {
  slug: string;
}

const POSTS_DIR = join(process.cwd(), "src", "content", "posts");

function slugs(): string[] {
  try {
    return readdirSync(POSTS_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

/** Load one post's metadata. Returns null if the file has no `meta` export. */
export async function getPostMeta(slug: string): Promise<Post | null> {
  try {
    const mod = await import(`@/content/posts/${slug}.mdx`);
    if (!mod.meta) return null;
    return { ...(mod.meta as PostMeta), slug };
  } catch {
    return null;
  }
}

/**
 * All publishable posts, newest first.
 *
 * Drafts are excluded in production but kept in development, so a
 * work-in-progress is visible while writing without ever shipping.
 */
export async function getPosts(): Promise<Post[]> {
  const all = await Promise.all(slugs().map(getPostMeta));
  const showDrafts = process.env.NODE_ENV === "development";

  return all
    .filter((p): p is Post => Boolean(p) && (showDrafts || !p!.draft))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Distinct topics across published posts, for the index filter. */
export async function getTopics(): Promise<string[]> {
  const posts = await getPosts();
  return [...new Set(posts.map((p) => p.topic))].sort();
}

export function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
