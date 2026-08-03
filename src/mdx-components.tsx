import type { MDXComponents } from "mdx/types";

/**
 * How MDX elements render inside a post.
 *
 * Prose in a blog post is read, not scanned, so it runs a little larger and
 * looser than the site's UI copy and is capped at a comfortable measure.
 * Everything still resolves to the same tokens, so a palette change carries
 * through to posts without touching this file.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children, ...props }) => (
      <h2
        className="t-display mt-14 scroll-mt-24 text-[clamp(1.5rem,2.5vw,2rem)] [&_a]:text-inherit [&_a]:no-underline"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="t-display mt-10 scroll-mt-24 text-xl [&_a]:text-inherit [&_a]:no-underline" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mt-5 text-[1.0625rem] leading-[1.75] text-paper-dim" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mt-5 list-disc space-y-2 pl-5 text-paper-dim marker:text-accent" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-5 text-paper-dim marker:text-accent" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-[1.7]" {...props}>
        {children}
      </li>
    ),
    a: ({ children, ...props }) => (
      <a
        className="text-paper underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent"
        {...props}
      >
        {children}
      </a>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-medium text-paper" {...props}>
        {children}
      </strong>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="mt-6 border-l-2 border-accent pl-5 text-paper-dim italic"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        className="rounded-sm bg-ink-700 px-1.5 py-0.5 font-mono text-[0.9em] text-accent"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="mt-6 overflow-x-auto rounded-sm border border-line bg-ink-800 p-5 font-mono text-sm leading-relaxed text-paper-dim"
        {...props}
      >
        {children}
      </pre>
    ),
    hr: (props) => <hr className="mt-12 border-line" {...props} />,
    table: ({ children, ...props }) => (
      // Wide tables scroll inside their own box; the page never scrolls sideways.
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border-b border-line-strong py-2.5 pr-6 text-left font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border-b border-line py-2.5 pr-6 text-paper-dim" {...props}>
        {children}
      </td>
    ),
    ...components,
  };
}
