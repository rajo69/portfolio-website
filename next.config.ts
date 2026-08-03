import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

/**
 * Plugins are named as strings, not imported and passed as functions.
 *
 * Turbopack serialises loader options to hand them to its Rust side, and a
 * function reference cannot be serialised. Passing the imported plugin fails
 * the dev server outright with "does not have serializable options", so the
 * string form is required rather than merely preferred.
 */
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm", {}]],
    // Slugged headings plus anchor links, so a long paper write-up is
    // linkable section by section.
    rehypePlugins: [
      ["rehype-slug", {}],
      ["rehype-autolink-headings", { behavior: "wrap" }],
    ],
  },
});

export default withMDX(nextConfig);
