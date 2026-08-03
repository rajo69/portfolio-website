"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** Synchronous read. Safe to call inside effects and event handlers. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/**
 * Tracks `prefers-reduced-motion`, reacting to runtime changes.
 *
 * The initial value is read synchronously rather than in an effect. Deferring
 * it by one render is not a cosmetic detail: an animation that starts before
 * the preference is known has already written `opacity: 0` onto the element,
 * and tearing the tween down afterwards can leave that value behind, content
 * permanently invisible for exactly the users who asked for less motion.
 *
 * This does not risk a hydration mismatch: the value only gates animation, it
 * never changes rendered markup.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    setReduced(query.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
