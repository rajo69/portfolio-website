"use client";

import { useRef, type ElementType, type ReactNode } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * Scroll-in reveal. Two variants, both from the ui-ux-pro-max motion presets:
 *
 *   "fade"    a single element rises 24px and fades   (power2.out)
 *   "stagger" direct children do the same, staggered  (max 8, or the tail lags)
 *
 * Critically this animates *from* a hidden state rather than *to* one, so the
 * server-rendered markup is fully visible. Nothing here is load-bearing for
 * crawlers or for anyone whose JS never runs.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  variant = "fade",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  variant?: "fade" | "stagger";
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!ref.current) return;

      const targets =
        variant === "stagger" ? Array.from(ref.current.children) : ref.current;

      // Re-checked synchronously here, not just via the hook. If the tween is
      // ever created before the preference is known it writes opacity:0, and
      // reverting it afterwards can leave the content invisible.
      if (reduced || prefersReducedMotion()) {
        // Belt and braces: clear anything a previous pass may have left behind.
        gsap.set(targets, { clearProps: "opacity,transform" });
        return;
      }

      gsap.from(targets, {
        opacity: 0,
        y: 24,
        duration: 0.55,
        delay,
        ease: "power2.out",
        stagger: variant === "stagger" ? 0.08 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          // Play once. Re-running on every direction change is distracting
          // on a page this long.
          toggleActions: "play none none none",
        },
      });
    },
    { scope: ref, dependencies: [reduced, variant, delay] });

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
