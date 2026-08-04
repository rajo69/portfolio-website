import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { certifications } from "@/content/certifications";
import type { Certification } from "@/content/types";

/**
 * Certifications.
 *
 * FOUR. THE "SHOW ALL 13" TOGGLE WAS REMOVED on 4 August 2026 and should not
 * come back. Rajarshi's own application profile already carried a rule against
 * listing every credential he holds, and the toggle quietly broke it: showing
 * four by default while parking nine behind a button still put thirteen on the
 * page, one click away.
 *
 * Three cold reviewers were shown the site with no context and all three
 * independently named this section as damaging. The hiring manager read four
 * Oracle exams stamped in one month as a junior signal, "I need credentials"
 * rather than "I have output". The professor called it the single worst signal
 * on the page for an academic reader, on the grounds that a certification
 * measures compliance with a syllabus and a PhD is the opposite exercise. The
 * prospective client said thirteen certificates read like someone building a
 * CV rather than someone running a practice.
 *
 * The other nine are still in certifications.ts and belong on the CV, where a
 * reader is expecting a complete list. They do not belong here.
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
  const featured = certifications.filter((c) => c.featured);

  return (
    <Section id="certifications" marker="Certifications">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Certifications</Eyebrow>
        <SplitHeading size="h1" className="max-w-[18ch]">
          All of these link to the issuer.
        </SplitHeading>
        <Lede className="max-w-[54ch]">
          These four bear on the work. I hold others, and listing them all would
          only dilute these.
        </Lede>
      </Reveal>

      <Reveal className="mt-14">
        <ul className="border-t border-line">
          {featured.map((c) => (
            <Row key={c.name} cert={c} />
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
