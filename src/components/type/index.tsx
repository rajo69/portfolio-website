import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Type primitives. Every section is built from these four, which is what
 * gives the page the reference's relentless rhythm:
 *
 *   Eyebrow → DisplayHeading → Lede → content
 *
 * Sizes live here, not in the sections, so the scale can't drift.
 */

/** The tracked-out uppercase micro-label preceded by a small accent square. */
export function Eyebrow({
  children,
  className,
  marker = true,
}: {
  children: ReactNode;
  className?: string;
  marker?: boolean;
}) {
  return (
    <p className={cn("t-label flex items-start gap-2.5", className)}>
      {marker && (
        // items-start + optical nudge, so the square tracks the first line
        // when the label wraps rather than floating between two lines.
        <span
          aria-hidden="true"
          className="mt-[0.3em] inline-block size-2 shrink-0 bg-accent"
        />
      )}
      {children}
    </p>
  );
}

/** Bare micro-label, no marker — stat captions, meta, categories. */
export function Label({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={cn("t-label", className)}>{children}</Tag>;
}

export type HeadingSize = "hero" | "h1" | "h2" | "h3";

/** Exported so SplitHeading shares one scale — it must not drift from this. */
export const HEADING_SIZE: Record<HeadingSize, string> = {
  hero: "text-[clamp(2.75rem,7vw,6.25rem)] tracking-[-0.04em] leading-[0.92]",
  h1: "text-[clamp(2.25rem,5vw,4.25rem)] tracking-[-0.035em] leading-[0.94]",
  h2: "text-[clamp(1.5rem,2.5vw,2.25rem)] tracking-[-0.02em] leading-[1.05]",
  h3: "text-xl tracking-[-0.01em] leading-[1.2]",
};

export function DisplayHeading({
  children,
  className,
  size = "h1",
  as,
}: {
  children: ReactNode;
  className?: string;
  size?: HeadingSize;
  as?: ElementType;
}) {
  const Tag: ElementType = as ?? (size === "hero" ? "h1" : size === "h3" ? "h3" : "h2");
  return (
    <Tag className={cn("t-display", HEADING_SIZE[size], className)}>{children}</Tag>
  );
}

/** The muted 2–3 line paragraph that follows every heading. Capped at 62ch. */
export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("t-body", className)}>{children}</p>;
}
