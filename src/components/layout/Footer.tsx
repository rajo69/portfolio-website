import { ArrowUpRight } from "lucide-react";

import { Label } from "@/components/type";
import { profile } from "@/content/profile";

const NAV = [
  { label: "Lab", href: "#lab" },
  { label: "Work", href: "#work" },
  { label: "Receipts", href: "#receipts" },
  { label: "About", href: "#about" },
  { label: "Writing", href: "/blog" },
];

export function Footer() {
  const socials = [
    { label: "GitHub", href: profile.socials.github },
    { label: "LinkedIn", href: profile.socials.linkedin },
    { label: "Scholar", href: profile.socials.scholar },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="border-t border-ink-600 px-(--gutter) py-14">
      <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <a
            href={`mailto:${profile.email}`}
            className="t-display text-2xl text-paper transition-colors duration-200 hover:text-accent"
          >
            {profile.email}
          </a>
          <p className="mt-3 text-sm leading-relaxed text-paper-faint">
            {profile.contact.body}
          </p>
        </div>

        <div className="flex gap-16">
          <nav aria-label="Footer">
            <Label as="h2" className="mb-4 block">
              Index
            </Label>
            <ul className="space-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-paper-dim transition-colors duration-200 hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {socials.length > 0 && (
            <div>
              <Label as="h2" className="mb-4 block">
                Elsewhere
              </Label>
              <ul className="space-y-2.5">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 text-sm text-paper-dim transition-colors duration-200 hover:text-paper"
                    >
                      {s.label}
                      <ArrowUpRight
                        className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-3 border-t border-ink-600 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Label>{profile.location}</Label>
        <Label>
          {`${profile.name} · MMXXVI · Built with Next.js, GSAP & a canvas`}
        </Label>
      </div>
    </footer>
  );
}
