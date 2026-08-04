import type { MetadataRoute } from "next";

import { profile } from "@/content/profile";

/**
 * robots.txt.
 *
 * Nothing is disallowed. This is a portfolio whose entire job is to be found,
 * and there are no private routes: drafts are excluded from
 * `generateStaticParams` and 404 in production, so there is no draft URL to
 * hide from a crawler in the first place.
 */
export default function robots(): MetadataRoute.Robots {
  const base = profile.meta.siteUrl.replace(/\/$/, "");

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
