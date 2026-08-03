import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Standard section wrapper: full-bleed, consistent vertical rhythm, gutters
 * from the `--gutter` token. Every section on the page uses this so the
 * spacing can't drift between them.
 */
export function Section({
  children,
  className,
  id,
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Skip the inner max-width shell — for full-bleed lists and rows. */
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-(--gutter) py-24 md:py-36",
        // Anchor links land below the sticky header rather than under it.
        id && "scroll-mt-20",
        className,
      )}
    >
      {bleed ? children : <div className="mx-auto w-full max-w-(--shell)">{children}</div>}
    </section>
  );
}
