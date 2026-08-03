"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { HEADING_SIZE, type HeadingSize } from "@/components/type";
import { cn } from "@/lib/cn";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Section headline with a per-character blur-in on scroll.
 *
 * This is the reveal DESIGN.md §5 specifies as the site's signature scroll
 * behaviour, and it's what the reference uses on every section headline. The
 * generic Reveal (fade + 24px rise) is deliberately understated for body
 * content; used on headlines it made the whole page read as static.
 *
 * Characters resolve out of blur in a fast left-to-right cascade, which
 * rhymes with the hero's logit-lens decode without repeating it.
 */
export function SplitHeading({
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
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const Tag: ElementType = as ?? (size === "hero" ? "h1" : size === "h3" ? "h3" : "h2");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduced || prefersReducedMotion()) return;

      // SplitText rewrites the element's DOM into one span per character, so
      // it must be reverted on cleanup, otherwise assistive tech is left
      // reading a pile of single-character nodes instead of a sentence.
      const split = new SplitText(el, { type: "chars,words", tag: "span" });

      const tween = gsap.from(split.chars, {
        opacity: 0,
        yPercent: 40,
        filter: "blur(9px)",
        duration: 0.62,
        stagger: 0.014,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          toggleActions: "play none none none",
        },
        // Clear the inline filter afterwards: a lingering blur(0px) keeps the
        // text on its own compositor layer and softens the type at rest.
        onComplete: () => gsap.set(split.chars, { clearProps: "filter" }),
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduced] });

  return (
    <Tag ref={ref} className={cn("t-display", HEADING_SIZE[size], className)}>
      {children}
    </Tag>
  );
}
