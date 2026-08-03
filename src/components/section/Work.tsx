"use client";

import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { projects } from "@/content/projects";
import { CAPABILITY_LABEL, type Capability } from "@/content/types";

/**
 * The Work list, filterable by capability.
 *
 * A multi-domain portfolio needs a consistent tag vocabulary and a way to
 * filter by it, otherwise a visitor who came for one thing has to read past
 * everything else to find it. The tags are the same four capabilities used on
 * the Lab cards, so the vocabulary is consistent across the whole site.
 *
 * Counts are shown on each filter so the balance of the work is legible
 * before anything is clicked.
 */

const FILTERS: (Capability | "all")[] = ["all", "ai", "data", "research", "vision"];

export function Work() {
  const [active, setActive] = useState<Capability | "all">("all");

  const rows = useMemo(
    () => projects.filter((p) => !p.featured),
    [],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const p of rows) {
      for (const cap of p.capabilities) c[cap] = (c[cap] ?? 0) + 1;
    }
    return c;
  }, [rows]);

  const visible =
    active === "all" ? rows : rows.filter((p) => p.capabilities.includes(active));

  return (
    <Section id="work">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Work</Eyebrow>
        <SplitHeading size="h1" className="max-w-[18ch]">
          Everything else, by capability.
        </SplitHeading>
        <Lede className="max-w-[54ch]">
          Retrieval systems, fine-tuning studies, statistical analysis and
          earlier product builds. Filter by what you came for.
        </Lede>
      </Reveal>

      <Reveal className="mt-12">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by capability">
          {FILTERS.map((f) => {
            const on = active === f;
            const n = counts[f] ?? 0;
            if (f !== "all" && n === 0) return null;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={on}
                className={`rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ${
                  on
                    ? "border-accent bg-accent text-on-accent"
                    : "border-ink-500 text-paper-dim hover:border-accent hover:text-paper"
                }`}
              >
                {f === "all" ? "All" : CAPABILITY_LABEL[f]}
                <span className={on ? "ml-2 opacity-70" : "ml-2 opacity-50"}>{n}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <ul className="mt-10 border-t border-ink-600">
        {visible.map((project) => {
          const Wrapper = project.repo ? "a" : "div";
          return (
            <li key={project.slug} className="border-b border-ink-600">
              <Wrapper
                {...(project.repo
                  ? { href: project.repo, target: "_blank", rel: "noreferrer" }
                  : {})}
                className="group grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-baseline md:gap-10"
              >
                <div className="max-w-[62ch]">
                  <h3 className="t-display text-lg transition-colors duration-200 group-hover:text-accent">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-paper-dim">
                    {project.summary}
                  </p>
                </div>

                <div className="flex items-center gap-4 md:justify-end">
                  <span className="rounded-full border border-ink-500 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-faint">
                    {project.category}
                  </span>
                  <Label>{project.period}</Label>
                  {project.repo && (
                    <ArrowUpRight
                      className="size-3.5 shrink-0 text-paper-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </Wrapper>
            </li>
          );
        })}
      </ul>

      {/* Announced politely rather than as a layout shift, so a filter that
          empties the list does not just look broken. */}
      <p aria-live="polite" className="mt-6 text-xs text-paper-faint">
        Showing {visible.length} of {rows.length}
      </p>
    </Section>
  );
}
