import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Eyebrow, Label } from "@/components/type";
import { formatDate, getPostMeta, getPosts } from "@/lib/posts";
import { profile } from "@/content/profile";

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostMeta(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: [profile.name],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostMeta(slug);
  if (!post) notFound();

  // Drafts are readable by direct URL in development, never in production.
  if (post.draft && process.env.NODE_ENV !== "development") notFound();

  const { default: Body } = await import(`@/content/posts/${slug}.mdx`);

  return (
    <Section className="max-w-none">
      <article className="mx-auto w-full max-w-[68ch]">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-paper-faint transition-colors hover:text-paper"
        >
          <ArrowLeft
            className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <Label className="transition-colors group-hover:text-paper">
            All writing
          </Label>
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>{post.topic}</Eyebrow>
            {post.draft && (
              <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-paper-faint">
                Draft
              </span>
            )}
          </div>

          <h1 className="t-display mt-5 text-[clamp(2rem,4.5vw,3.25rem)]">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Label>{formatDate(post.date)}</Label>
            <Label>{profile.name}</Label>
          </div>

          {post.paper && (
            <div className="mt-8 rounded-sm border border-line bg-ink-800 p-5">
              <Label className="block">The paper</Label>
              <a
                href={post.paper.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-2 inline-flex items-start gap-1.5 text-paper transition-colors hover:text-accent"
              >
                <span className="text-[0.95rem] leading-snug">
                  {post.paper.title}
                </span>
                <ArrowUpRight
                  className="mt-1 size-3.5 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </a>
              <p className="mt-1.5 font-mono text-[11px] text-paper-faint">
                {post.paper.authors}, {post.paper.year}
                {post.paper.venue ? ` · ${post.paper.venue}` : ""}
              </p>
            </div>
          )}
        </header>

        <div className="mt-12">
          <Body />
        </div>
      </article>
    </Section>
  );
}
