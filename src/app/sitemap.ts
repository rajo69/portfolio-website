import type { MetadataRoute } from "next";

import { profile } from "@/content/profile";
import { getPosts } from "@/lib/posts";

/**
 * Sitemap.
 *
 * Every URL is built off `profile.meta.siteUrl`, so confirming the domain is a
 * one-line change in one file rather than a hunt through hardcoded strings.
 *
 * Drafts are filtered explicitly rather than relying on `getPosts` to do it.
 * That function keeps drafts visible in development, which is right for
 * writing but would be wrong here if this ever ran outside a production
 * build. A draft in a sitemap is an invitation to index a page that 404s.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = profile.meta.siteUrl.replace(/\/$/, "");
  const posts = (await getPosts()).filter((p) => !p.draft);

  const newestPost = posts[0]?.date;

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/blog`,
      // The index is only as fresh as the newest thing on it.
      lastModified: newestPost ? new Date(`${newestPost}T00:00:00Z`) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
