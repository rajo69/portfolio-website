"use client";

import { useEffect, useState } from "react";

import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Lab", href: "#lab" },
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Writing", href: "/blog" },
];

/**
 * Sticky header. Transparent over the hero, then picks up a blurred fill and
 * a hairline once scrolled, the reference's behaviour, and it keeps the
 * headline uncluttered at the top of the page.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled && "border-b border-ink-600 bg-ink-900/80 backdrop-blur-md")}
    >
      <div className="flex items-center justify-between px-(--gutter) py-5">
        <a
          href="#top"
          className="group flex items-center gap-2.5 text-[0.95rem] font-bold tracking-tight text-paper"
          style={{ fontFamily: "var(--ff-display), sans-serif" }}
        >
          <Mark />
          {profile.name}
        </a>

        <nav aria-label="Primary" className="flex items-center gap-7">
          <ul className="hidden items-center gap-7 md:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="t-label transition-colors duration-200 hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${profile.email}`}
            className="rounded-full border border-accent px-4 py-2 text-xs font-medium tracking-wide text-accent transition-colors duration-200 hover:bg-accent hover:text-on-accent"
          >
            Talk to me
          </a>
        </nav>
      </div>
    </header>
  );
}

/**
 * Logo mark: three nodes and their attention edges, the site's concept
 * compressed into 20px. Currents nodes are the Research/Engineering/Product
 * spine; the filled one is the operator holding all three.
 */
function Mark() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M10 3.5 L3.5 15.5 M10 3.5 L16.5 15.5 M3.5 15.5 L16.5 15.5"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="10" cy="3.5" r="1.6" fill="var(--accent)" />
      <circle cx="3.5" cy="15.5" r="1.6" fill="var(--accent)" opacity="0.6" />
      <circle cx="16.5" cy="15.5" r="1.6" fill="var(--accent)" opacity="0.6" />
    </svg>
  );
}
