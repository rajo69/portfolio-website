import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Counter } from "@/components/type/Counter";
import { Eyebrow, Label, Lede } from "@/components/type";
import { projects } from "@/content/projects";
import { CAPABILITY_LABEL } from "@/content/types";

/**
 * THE LAB, four projects chosen to span the four capabilities.
 *
 * Not the four newest and not the four most impressive in isolation: one
 * agentic system, one data platform, one interpretability study, one computer
 * vision piece. A reader who came for pipelines finds one in the first
 * screenful, and so does a reader who came for research.
 *
 * Cards alternate side so the eye has somewhere to go down a long section,
 * which is the reference's pattern.
 */
export function Lab() {
  const featured = projects.filter((p) => p.featured);

  return (
    <Section id="lab">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>The Lab</Eyebrow>
        <SplitHeading size="h1" className="max-w-[17ch]">
          Four projects, four different jobs.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          A production agent, a data platform, an interpretability study and a
          computer vision dissertation. Different problems, one method: build
          the pipeline, pick the model the problem actually needs, then make the
          result checkable.
        </Lede>
      </Reveal>

      <div className="mt-20 space-y-24">
        {featured.map((project, i) => (
          <Reveal key={project.slug} variant="stagger">
            <article
              className={`grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {project.capabilities.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-accent/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent"
                    >
                      {CAPABILITY_LABEL[c]}
                    </span>
                  ))}
                  <Label className="ml-1">{project.period}</Label>
                </div>

                <h3 className="t-display mt-5 text-[clamp(1.6rem,3vw,2.4rem)]">
                  {project.title}
                </h3>

                <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-paper-dim">
                  {project.description ?? project.summary}
                </p>

                {project.proves && (
                  <p className="mt-5 max-w-[52ch] border-l-2 border-accent pl-4 text-sm leading-relaxed text-paper">
                    {project.proves}
                  </p>
                )}

                <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                  {project.tech.map((t) => (
                    <li key={t}>
                      <Label>{t}</Label>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-4">
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-accent transition-opacity hover:opacity-80"
                    >
                      Open the live app
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-paper-dim transition-colors hover:text-paper"
                    >
                      Read the source
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                  {!project.repo && !project.demo && (
                    <Label className="opacity-60">
                      Client engagement, no public repository
                    </Label>
                  )}
                </div>
              </div>

              {/* Metrics panel. Deliberately typographic rather than a mock
                  dashboard: these are real numbers and inventing a chart
                  around them would undercut that. */}
              <div className="rounded-sm border border-ink-600 bg-ink-800 p-8">
                <Label className="block">Measured</Label>
                <dl className="mt-6 space-y-8">
                  {project.metrics?.map((m) => (
                    <div key={m.label}>
                      <dd>
                        <Counter
                          value={m.value}
                          className="font-display text-[clamp(2rem,4vw,3rem)] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums"
                        />
                      </dd>
                      <dt className="mt-2">
                        <Label>{m.label}</Label>
                      </dt>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
