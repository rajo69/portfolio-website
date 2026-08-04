"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SectionLink } from "@/components/layout/SectionLink";
import { Label } from "@/components/type";
import { profile } from "@/content/profile";
import { lockScroll } from "@/lib/scroll-lock";

/**
 * Navigation below 768px.
 *
 * Until now the header's links were `hidden md:flex` and nothing replaced
 * them, so on a phone the only routes out of the page were the wordmark and a
 * mailto. Projects, Experience, Work and Writing were unreachable from the top
 * of the page on the viewport most visitors arrive on.
 *
 * NO-JS BEHAVIOUR. The panel is not rendered at all while closed, rather than
 * rendered and hidden, so no server markup carries strings a reader cannot
 * see. Without JS this button does nothing, and the footer's index carries the
 * same four links on every page, so navigation still works.
 *
 * SCROLL LOCK. See lib/scroll-lock.ts. Lenis is paused rather than the
 * document being given `overflow: hidden`, because Lenis measures its limit
 * off the document element.
 *
 * THE PANEL IS PORTALLED TO <body>, AND IT HAS TO BE.
 *
 * It used to render in place, inside <header>. The header is sticky and picks
 * up `backdrop-blur-md` once the page is scrolled, and **an ancestor with a
 * backdrop-filter becomes the containing block for any `position: fixed`
 * descendant**. So the moment a visitor had scrolled anywhere, `fixed inset-0`
 * stopped meaning "the viewport" and started meaning "the header box", roughly
 * 64px tall. The menu collapsed into a strip at the top with the page showing
 * around and over it. Unscrolled it was fine, which is what made it look
 * intermittent.
 *
 * `transform`, `filter`, `perspective`, `contain` and `will-change` do the same
 * thing. A full-screen overlay cannot be nested inside a header that carries
 * any of them, so it goes to the body instead of relying on that never
 * changing. `z-80` clears ScrollProgress and CursorRing, both fixed at z-50.
 */

export function MobileNav({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  /* No `mounted` guard needed before the portal. `open` starts false and can
     only be set by a click, so by the time anything is portalled we are on the
     client and `document` exists. Server and first client render both produce
     nothing here, so there is no hydration mismatch to avoid. */

  // Crossing to the desktop layout leaves an overlay with no way to close it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    const unlock = lockScroll();
    const panel = panelRef.current;
    const trigger = buttonRef.current;
    panel?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;

      // Focus stays inside the dialog while it owns the screen.
      const focusable = panel.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlock();
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="-mr-2 p-2 text-paper-dim transition-colors duration-200 hover:text-paper md:hidden motion-reduce:transition-none"
      >
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">Open menu</span>
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          /*
            SOLID, AND NOT VIA AN OPACITY MODIFIER.

            This was `bg-ink-900/95 backdrop-blur-lg` and it rendered as
            transparent on a real phone: the page text showed straight through
            the open menu. Tailwind compiles the `/95` modifier to
            `color-mix(in oklab, var(--color-ink-900) 95%, transparent)`, and
            `color-mix` with an oklab interpolation space needs Safari 16.4+.
            Where it fails to parse, the declaration is dropped entirely and the
            panel keeps no background at all, which is exactly what a full-screen
            dialog must never do.

            `background: var(--ink-900)` has no such dependency. The blur went
            with it: a full-screen modal has no reason to show the page behind
            it, and the filter was costing a phone GPU real frames for an effect
            nobody could see through an opaque panel anyway.
          */
          style={{ background: "var(--ink-900)" }}
          className="fixed inset-0 z-[80] flex flex-col overscroll-contain outline-none md:hidden"
        >
          <div className="flex items-center justify-between px-(--gutter) py-5">
            <Label>Menu</Label>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-mr-2 p-2 text-paper-dim transition-colors duration-200 hover:text-paper motion-reduce:transition-none"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Primary" className="flex-1 px-(--gutter) pt-6">
            <ul className="space-y-1">
              {items.map((item, i) => (
                <li key={item.href} className="border-b border-line">
                  <SectionLink
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-5"
                  >
                    <span className="font-mono text-[11px] text-paper-faint tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="t-display text-[clamp(1.75rem,9vw,2.5rem)] text-paper">
                      {item.label}
                    </span>
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-(--gutter) pb-10 pt-8">
            <a
              href={`mailto:${profile.email}`}
              onClick={() => setOpen(false)}
              className="inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-on-accent"
            >
              Talk to me
            </a>
            <p className="mt-5">
              <Label>{profile.location}</Label>
            </p>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
