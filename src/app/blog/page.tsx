import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { formatDate, getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "One AI or machine learning paper a week, read closely and written up with the data behind it.",
};

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <Section id="writing">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Writing</Eyebrow>
        <SplitHeading size="h1" className="max-w-[17ch]">
          One paper a week, read properly.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          Each week I take one AI or machine learning paper, work through what it
          actually claims, and write up what I think it means. Where I can run
          something myself, the numbers and the charts are mine rather than
          reprinted from the paper.
        </Lede>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal className="mt-16">
          <p className="text-sm text-paper-faint">
            First post is in progress.
          </p>
        </Reveal>
      ) : (
        <Reveal as="ul" variant="stagger" className="mt-16 border-t border-line">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-line">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid gap-4 py-8 md:grid-cols-[1fr_auto] md:gap-12"
              >
                <div className="max-w-[62ch]">
                  <div className="flex flex-wrap items-center gap-3">
                    <Label className="text-accent">{post.topic}</Label>
                    {post.draft && (
                      <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">
                        Draft
                      </span>
                    )}
                  </div>

                  <h2 className="t-display mt-3 text-[clamp(1.25rem,2.2vw,1.75rem)] transition-colors duration-200 group-hover:text-accent">
                    {post.title}
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-paper-dim">
                    {post.summary}
                  </p>

                  {post.paper && (
                    <p className="mt-3 font-mono text-[11px] leading-relaxed text-paper-faint">
                      {post.paper.authors}, {post.paper.year}
                      {post.paper.venue ? ` · ${post.paper.venue}` : ""}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-3 md:justify-end">
                  <Label>{formatDate(post.date)}</Label>
                  <ArrowUpRight
                    className="size-3.5 shrink-0 text-paper-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </Reveal>
      )}
    </Section>
  );
}
