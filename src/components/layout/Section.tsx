import type { ReactNode } from "react";

import { SectionRail } from "@/components/layout/SectionRail";
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
  bloom = false,
  marker,
  markerSteps,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Skip the inner max-width shell, for full-bleed lists and rows. */
  bleed?: boolean;
  /**
   * A single soft accent bloom at the top of the section. Atmospheric only,
   * and used sparingly: more than two or three on the page and the flat black
   * that makes the type work starts to go muddy.
   */
  bloom?: boolean;
  /**
   * Pin a marker in the left gutter for the life of this section: the section
   * name, and a hairline that fills with scroll progress. xl and up only, see
   * SectionRail. Pass the same words as the inline eyebrow.
   */
  marker?: string;
  /** Selector for repeating children, so the marker can count them. */
  markerSteps?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative px-(--gutter) py-24 md:py-36",
        bloom && "bloom isolate",
        // Anchor links land below the sticky header rather than under it.
        id && "scroll-mt-20",
        className)}
    >
      {/* Direct child of the section on purpose: the rail measures scroll
          progress against its own parentElement. */}
      {marker && <SectionRail label={marker} stepSelector={markerSteps} />}

      {bleed ? children : <div className="mx-auto w-full max-w-(--shell)">{children}</div>}
    </section>
  );
}
