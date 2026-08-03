"use client";

import { useRef } from "react";

import { cn } from "@/lib/cn";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useReducedMotion } from "@/lib/use-reduced-motion";

/**
 * THE LOGIT LENS, the hero's signature animation.
 *
 * The reference site dissolves its headline into particles. This one *decodes*
 * it. Each word cycles through plausible token candidates in dimmed mono, then
 * locks into the display face as a confidence rail fills, the way you'd watch
 * a language model resolve a sequence, which is the work this site is about.
 *
 * Accessibility: the real headline is always present twice, once visually in
 * the animated layer (so no-JS and crawlers get it), and once in a `sr-only`
 * copy that assistive tech reads. The animated layer is `aria-hidden`, so a
 * screen reader never encounters a half-decoded candidate.
 */

/**
 * Candidate tokens. Drawn from ML and general vocabulary so the alternates
 * read as a real vocabulary being ranked rather than random scrambling.
 * Filtered by length at runtime so swaps stay visually plausible.
 */
const VOCAB = [
  "model", "modal", "module", "method", "matrix", "metric", "memory",
  "build", "built", "buffer", "bundle", "binary", "branch", "bridge",
  "open", "opens", "opaque", "output", "object", "offset", "option",
  "then", "than", "them", "there", "these", "theory", "thread",
  "the", "and", "for", "with", "into", "from", "that", "this",
  "layer", "logit", "token", "tensor", "vector", "weight", "gated",
  "probe", "trace", "value", "query", "score", "graph", "shard",
  "up", "in", "on", "at", "it", "is", "as", "an", "of", "to",
  "I", "we", "you", "they",
];

/** Candidates for one word: near-length vocabulary plus truncations of itself. */
function candidatesFor(word: string, count: number): string[] {
  const bare = word.replace(/[^\p{L}\p{N}]/gu, "");
  const target = bare.length || word.length;

  const pool = VOCAB.filter(
    (v) => v.toLowerCase() !== bare.toLowerCase() && Math.abs(v.length - target) <= 2);

  const picked: string[] = [];
  while (picked.length < count && pool.length) {
    const [taken] = pool.splice(Math.floor(Math.random() * pool.length), 1);
    picked.push(taken);
  }

  // A truncation of the real word, the model narrowing in on the right token.
  if (bare.length > 3) picked.push(bare.slice(0, Math.max(2, bare.length - 2)));

  // Preserve trailing punctuation so line rhythm doesn't jump.
  const punctuation = word.slice(bare.length ? word.indexOf(bare) + bare.length : word.length);
  return picked.map((p) => p + punctuation);
}

export function LogitLens({
  text,
  className,
  railRef,
  readoutRef,
}: {
  text: string;
  className?: string;
  /** Owned by the parent so the rail can sit anywhere in the layout. */
  railRef?: React.RefObject<HTMLSpanElement | null>;
  readoutRef?: React.RefObject<HTMLSpanElement | null>;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  const words = text.split(" ");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      // Read synchronously as well as via the hook, see Reveal for why.
      if (reduced || prefersReducedMotion()) return;

      const spans = Array.from(
        root.querySelectorAll<HTMLElement>("[data-word]"));
      if (!spans.length) return;

      // Pin each word to its final width *before* swapping in candidates of
      // different lengths, otherwise every swap reflows the whole headline.
      for (const span of spans) {
        span.style.minWidth = `${span.getBoundingClientRect().width}px`;
      }

      // The rail ships in its resolved state so no-JS and reduced-motion
      // users see a coherent "resolved" readout. Only wind it back once we
      // know the animation is actually going to run.
      if (railRef?.current) gsap.set(railRef.current, { scaleX: 0 });
      if (readoutRef?.current) readoutRef.current.textContent = "decoding 0%";

      const tl = gsap.timeline();
      let locked = 0;

      spans.forEach((span, i) => {
        const final = span.textContent ?? "";
        const candidates = candidatesFor(final, 4);
        const at = i * 0.115;

        candidates.forEach((candidate, k) => {
          tl.call(
            () => {
              span.textContent = candidate;
              span.dataset.state = "decoding";
            },
            undefined,
            at + k * 0.105);
        });

        // Lock: real token, display face, blur resolving to sharp.
        tl.call(
          () => {
            span.textContent = final;
            span.dataset.state = "locked";
            span.style.minWidth = "";
            gsap.fromTo(
              span,
              { filter: "blur(10px)", opacity: 0.4, yPercent: 12 },
              { filter: "blur(0px)", opacity: 1, yPercent: 0, duration: 0.72, ease: "expo.out" });

            locked++;
            const pct = Math.round((locked / spans.length) * 100);
            if (railRef?.current) {
              gsap.to(railRef.current, {
                scaleX: locked / spans.length,
                duration: 0.35,
                ease: "power2.out",
              });
            }
            if (readoutRef?.current) {
              readoutRef.current.textContent =
                locked === spans.length ? "resolved" : `decoding ${pct}%`;
            }
          },
          undefined,
          at + candidates.length * 0.105);
      });

      return () => {
        // Guarantee the real text is restored if this unmounts mid-run.
        for (const span of spans) {
          span.style.minWidth = "";
          span.dataset.state = "locked";
        }
      };
    },
    { scope: ref, dependencies: [reduced, text] });

  return (
    <>
      <span className="sr-only">{text}</span>

      <span ref={ref} aria-hidden="true" className={cn("block", className)}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span
              data-word
              data-state="locked"
              className="inline-block text-center align-baseline data-[state=decoding]:font-mono data-[state=decoding]:text-[0.86em] data-[state=decoding]:font-normal data-[state=decoding]:tracking-normal data-[state=decoding]:text-paper-faint"
            >
              {word}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}

/**
 * The confidence rail that sits under the headline. Separate component so the
 * hero controls its placement, but it shares refs with the decode above.
 */
export function LogitLensRail({
  railRef,
  readoutRef,
  className,
}: {
  railRef: React.RefObject<HTMLSpanElement | null>;
  readoutRef: React.RefObject<HTMLSpanElement | null>;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span className="relative block h-px w-28 bg-ink-500">
        <span
          ref={railRef}
          className="absolute inset-0 block origin-left bg-accent"
          // Ships resolved; LogitLens winds it back to 0 only if it animates.
          style={{ transform: "scaleX(1)" }}
        />
      </span>
      <span ref={readoutRef} className="t-label">
        resolved
      </span>
    </span>
  );
}
