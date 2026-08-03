"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { certifications } from "@/content/certifications";
import type { Certification } from "@/content/types";

/**
 * Certifications.
 *
 * Four surfaced, the rest behind a toggle. That split is not a layout
 * preference: Rajarshi's own application profile carries an explicit rule
 * against listing every credential he holds, because the full pile dilutes
 * the signal and reads as padding.
 *
 * Every link here was checked and returns 200 with a page title matching the
 * certificate. Re-check before launch; an unverifiable credential link is
 * worse than printing the name on its own.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function issuedLabel(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

function Row({ cert }: { cert: Certification }) {
  const verifiable = Boolean(cert.url);
  const Wrapper = verifiable ? "a" : "div";

  return (
    <li className="border-b border-line">
      <Wrapper
        {...(verifiable
          ? { href: cert.url, target: "_blank", rel: "noreferrer" }
          : {})}
        className={`group grid gap-2 py-5 md:grid-cols-[1fr_auto] md:items-baseline md:gap-8 ${
          verifiable ? "cursor-pointer" : ""
        }`}
      >
        <div>
          <p className="text-sm leading-snug text-paper">{cert.name}</p>
          <p className="mt-1 text-xs text-paper-faint">
            {cert.issuer}
            {cert.credentialId ? ` · ${cert.credentialId.slice(0, 24)}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-4 md:justify-end">
          <Label>{issuedLabel(cert.issued)}</Label>
          {verifiable ? (
            <span className="inline-flex items-center gap-1">
              <Label className="transition-colors duration-200 group-hover:text-accent">
                Verify
              </Label>
              <ArrowUpRight
                className="size-3 text-paper-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                aria-hidden="true"
              />
            </span>
          ) : (
            <Label className="opacity-40">On file</Label>
          )}
        </div>
      </Wrapper>
    </li>
  );
}

export function Certifications() {
  const [expanded, setExpanded] = useState(false);

  const featured = certifications.filter((c) => c.featured);
  const rest = certifications.filter((c) => !c.featured);

  return (
    <Section id="certifications">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Certifications</Eyebrow>
        <SplitHeading size="h1" className="max-w-[18ch]">
          Verifiable, not decorative.
        </SplitHeading>
        <Lede className="max-w-[54ch]">
          Every one of these links to its issuer. The four below are the ones
          that bear on the work; the rest are available underneath rather than
          stacked up front.
        </Lede>
      </Reveal>

      <Reveal className="mt-14">
        <ul className="border-t border-line">
          {featured.map((c) => (
            <Row key={c.name} cert={c} />
          ))}
          {expanded && rest.map((c) => <Row key={c.name} cert={c} />)}
        </ul>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2 text-xs tracking-wide text-paper-dim transition-colors duration-200 hover:border-accent hover:text-paper"
        >
          {expanded ? "Show fewer" : `Show all ${certifications.length}`}
        </button>
      </Reveal>
    </Section>
  );
}
