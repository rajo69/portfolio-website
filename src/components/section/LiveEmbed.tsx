"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Label } from "@/components/type";

/**
 * A live preview of the AI Accountant landing page, inside browser chrome.
 *
 * WHY A REAL IFRAME AND NOT A SCREENSHOT
 * The app's landing page animates its background gradient. A static capture
 * loses exactly the thing that makes it feel alive, so the frame renders the
 * real page.
 *
 * WHY IT IS NOT INTERACTIVE
 * `pointer-events: none`, with the whole frame wrapped in a link to the app.
 * If clicks reached the embedded page, "Connect with Xero" would start an
 * OAuth flow inside an iframe, and Xero sets its own framing restrictions, so
 * it would dead-end. A live preview that opens the real app on click is both
 * better looking and better behaved.
 *
 * WHY THE ORIGIN CHECK
 * The app allows framing only from origins named in its
 * `Content-Security-Policy: frame-ancestors` allowlist. From anywhere else the
 * browser blocks the frame and renders an empty box, which would look broken.
 * So the iframe is only mounted when this site is served from an allowlisted
 * origin; everywhere else the capture is shown instead. Server render is
 * always the capture, so crawlers and no-JS visitors get a real image.
 *
 * KEEP IN SYNC: frontend/vercel.json in rajo69/agentic-ai-accounting. Adding
 * the production domain there without adding it here leaves the live embed
 * switched off in production.
 */

const LIVE_URL = "https://agentic-ai-accounting.vercel.app";

/** Origins listed in the app's frame-ancestors allowlist. */
const FRAMEABLE_FROM = ["http://localhost:3000"];

/** Width the embedded page is rendered at before being scaled down. */
const EMBED_WIDTH = 1440;

export function LiveEmbed() {
  const [canFrame, setCanFrame] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCanFrame(FRAMEABLE_FROM.includes(window.location.origin));
  }, []);

  /**
   * The iframe is laid out at a fixed 1440px and scaled to fit, so the
   * embedded page renders its desktop layout instead of collapsing to mobile
   * inside a narrow frame.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !canFrame) return;

    const apply = () => {
      stage.style.setProperty(
        "--embed-scale",
        String(stage.clientWidth / EMBED_WIDTH),
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [canFrame]);

  return (
    <a
      href={LIVE_URL}
      target="_blank"
      rel="noreferrer"
      className="group block overflow-hidden rounded-lg border border-ink-600 bg-ink-800 transition-colors duration-300 hover:border-accent/40"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-ink-600 px-4 py-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="block size-2.5 rounded-full bg-ink-500" />
          <span className="block size-2.5 rounded-full bg-ink-500" />
          <span className="block size-2.5 rounded-full bg-ink-500" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-sm bg-ink-900 px-3 py-1 font-mono text-[11px] text-paper-faint">
          agentic-ai-accounting.vercel.app
        </span>
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
          </span>
          <Label>{canFrame ? "Live" : "Preview"}</Label>
        </span>
      </div>

      <div ref={stageRef} className="relative aspect-[16/10] w-full overflow-hidden">
        {canFrame ? (
          <iframe
            src={LIVE_URL}
            title="AI Accountant, live landing page"
            loading="lazy"
            // No allow-forms, allow-popups or allow-top-navigation: this is a
            // preview, and the frame should not be able to navigate anything.
            sandbox="allow-scripts allow-same-origin"
            // Rendered at desktop width then scaled down, so the embedded page
            // lays out as a desktop site rather than collapsing to mobile.
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{ width: "1440px", height: "900px", transform: "scale(var(--embed-scale))" }}
          />
        ) : (
          <Image
            src="/ai-accountant-landing.png"
            alt="The AI Accountant landing page: Accounting, automated. Connect Xero. AI categorises transactions, reconciles bank statements, and drafts management letters."
            fill
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="object-cover object-top"
          />
        )}

        <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink-900/80 via-transparent to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-on-accent">
            Open the live app
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        </span>
      </div>
    </a>
  );
}
