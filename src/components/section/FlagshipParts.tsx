import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Label } from "@/components/type";

/**
 * Shared pieces for the flagship blocks.
 *
 * Bullets, not paragraphs. Anyone who wants the prose version can open the
 * README, which is linked from every block and goes far deeper than this ever
 * should. The site's job is to get the key facts across fast.
 */

export function GithubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/** A headline number with one line under it. */
export function Stat({ value, caption }: { value: string; caption: string }) {
  return (
    <div>
      <dd className="font-display text-[clamp(1.75rem,3.2vw,2.6rem)] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums">
        {value}
      </dd>
      <dt className="mt-2">
        <Label>{caption}</Label>
      </dt>
    </div>
  );
}

export function Stats({ items }: { items: { value: string; caption: string }[] }) {
  return (
    <Reveal as="dl" variant="stagger" className="grid gap-6 sm:grid-cols-3">
      {items.map((s) => (
        <Stat key={s.caption} {...s} />
      ))}
    </Reveal>
  );
}

/** A titled list of short bullets. Never prose. */
export function Points({
  title,
  items,
}: {
  title: string;
  items: (string | ReactNode)[];
}) {
  return (
    <Reveal variant="stagger" className="space-y-4">
      <Label as="h4">{title}</Label>
      <ul className="space-y-2.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-3 text-sm leading-snug text-paper-dim">
            <span aria-hidden="true" className="mt-[0.45rem] block size-1 shrink-0 rounded-full bg-paper-faint" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/** Problem on top in paper, the fix under it in dim. Two lines each, maximum. */
export function Fix({ problem, fix }: { problem: string; fix: string }) {
  return (
    <li className="border-l-2 border-line-strong pl-4">
      <p className="text-sm leading-snug text-paper">{problem}</p>
      <p className="mt-1.5 text-sm leading-snug text-paper-dim">{fix}</p>
    </li>
  );
}

export function Fixes({ items }: { items: { problem: string; fix: string }[] }) {
  return (
    <Reveal variant="stagger" className="space-y-4">
      <Label as="h4">Where it broke</Label>
      <ul className="space-y-4">
        {items.map((f) => (
          <Fix key={f.problem} {...f} />
        ))}
      </ul>
    </Reveal>
  );
}

export function Links({
  items,
}: {
  items: { label: string; href: string; primary?: boolean; icon?: "gh" }[];
}) {
  return (
    <Reveal className="mt-10 flex flex-wrap gap-3">
      {items.map((l) => (
        <a
          key={l.href}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className={
            l.primary
              ? "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
              : "inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm text-paper-dim transition-colors hover:border-accent hover:text-paper"
          }
        >
          {l.icon === "gh" ? <GithubMark /> : null}
          {l.label}
          {l.icon !== "gh" && <ArrowUpRight className="size-4" aria-hidden="true" />}
        </a>
      ))}
    </Reveal>
  );
}

export function Block({
  index,
  capabilities,
  period,
  title,
  lede,
  artifact,
  stats,
  children,
  links,
}: {
  index: string;
  capabilities: string[];
  period: string;
  title: string;
  /** One sentence. The whole point in a breath. */
  lede: string;
  artifact: ReactNode;
  stats: { value: string; caption: string }[];
  children: ReactNode;
  links: { label: string; href: string; primary?: boolean; icon?: "gh" }[];
}) {
  return (
    <article className="border-t border-line pt-14">
      <Reveal variant="stagger">
        <div className="flex flex-wrap items-center gap-2">
          <Label className="text-accent">{index}</Label>
          {capabilities.map((c) => (
            <span
              key={c}
              className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim"
            >
              {c}
            </span>
          ))}
          <Label className="ml-1">{period}</Label>
        </div>

        <h3 className="t-display mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)]">{title}</h3>
        <p className="mt-3 max-w-[56ch] text-[1.0625rem] leading-relaxed text-paper-dim">
          {lede}
        </p>
      </Reveal>

      <Reveal className="mt-9">{artifact}</Reveal>

      <div className="mt-10">
        <Stats items={stats} />
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">{children}</div>

      <Links items={links} />
    </article>
  );
}
