import { DissertationCard } from "@/components/projects/DissertationCard";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label, Lede } from "@/components/type";
import { education } from "@/content/education";
import { experience } from "@/content/experience";

/**
 * EXPERIENCE.
 *
 * Same discipline as the flagship blocks: numbers first, then short bullets,
 * never paragraphs. A reader should be able to take the shape of six years in
 * one pass and only slow down where a number catches them.
 *
 * Laid out as a rail with the dates pinned left on wide screens, so the
 * chronology is legible without reading a single bullet.
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function fmt(iso: string) {
  if (iso === "present") return "Present";
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** Whole months between two points, rendered as years and months. */
function duration(start: string, end: string) {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] =
    end === "present"
      ? [now.getUTCFullYear(), now.getUTCMonth() + 1]
      : end.split("-").map(Number);
  const months = (ey - sy) * 12 + (em - sm);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years && rest) return `${years} yr ${rest} mo`;
  if (years) return `${years} yr`;
  return `${Math.max(rest, 1)} mo`;
}

export function Experience() {
  const roles = experience.filter((r) => !r.hidden);

  return (
    <Section id="experience" bloom marker="Experience">
      <Reveal variant="stagger" className="space-y-8">
        <Eyebrow>Experience</Eyebrow>
        <SplitHeading size="h1" className="max-w-[18ch]">
          Consulting, then the NHS, then building my own.
        </SplitHeading>
        <Lede className="max-w-[56ch]">
          Six years across insurance analytics, healthcare data and independent
          AI engineering. The through-line is the same one everywhere: get the
          pipeline right, then make the output something a person will act on.
        </Lede>
      </Reveal>

      <div className="mt-16 border-t border-line">
        {roles.map((role) => (
          <Reveal
            key={`${role.company}-${role.start}`}
            variant="stagger"
            className="grid gap-6 border-b border-line py-12 lg:grid-cols-[200px_1fr] lg:gap-12"
          >
            {/* Rail */}
            <div>
              <Label className="block text-paper">
                {fmt(role.start)} to {fmt(role.end)}
              </Label>
              <Label className="mt-1.5 block opacity-60">
                {duration(role.start, role.end)}
              </Label>
              <Label className="mt-1.5 block opacity-60">{role.location}</Label>
            </div>

            <div>
              <h3 className="t-display text-[clamp(1.4rem,2.6vw,2rem)]">
                {role.company}
              </h3>
              <p className="mt-1.5 text-sm text-paper">{role.role}</p>
              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-paper-dim">
                {role.summary}
              </p>

              {role.metrics && (
                <dl className="mt-7 grid gap-6 sm:grid-cols-3">
                  {role.metrics.map((m) => (
                    <div key={m.caption}>
                      <dd className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-bold leading-none tracking-[-0.03em] text-accent tabular-nums">
                        {m.value}
                      </dd>
                      <dt className="mt-2">
                        <Label>{m.caption}</Label>
                      </dt>
                    </div>
                  ))}
                </dl>
              )}

              <ul className="mt-7 space-y-2.5">
                {role.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex gap-3 text-sm leading-snug text-paper-dim"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] block size-1 shrink-0 rounded-full bg-paper-faint"
                    />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {role.tech && role.tech.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {role.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-sm border border-line-strong px-2 py-0.5 font-mono text-[10px] text-paper-faint"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        ))}

        {/* Education sits on the same rail: it is chronology, not a separate topic. */}
        {education.map((ed) => (
          <Reveal
            key={ed.institution}
            variant="stagger"
            className="grid gap-6 border-b border-line py-12 lg:grid-cols-[200px_1fr] lg:gap-12"
          >
            <div>
              <Label className="block text-paper">
                {fmt(ed.start)} to {fmt(ed.end)}
              </Label>
              <Label className="mt-1.5 block opacity-60">{ed.location}</Label>
            </div>

            {/* min-w-0 is load bearing. A grid item defaults to
                `min-width: auto`, so it grows to fit its widest content and
                the dissertation card's `overflow-x-auto` table never gets to
                scroll. Without this the page overflows by 103px at 375. */}
            <div className="min-w-0">
              <h3 className="t-display text-[clamp(1.4rem,2.6vw,2rem)]">
                {ed.institution}
              </h3>
              <p className="mt-1.5 text-sm text-paper">
                {ed.degree} {ed.field}
                {ed.grade ? `, ${ed.grade}` : ""}
              </p>
              {ed.thesis && (
                <>
                  <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-paper-dim">
                    Dissertation: {ed.thesis}
                  </p>
                  {/* Only Leeds carries a thesis, so this is the association.
                      The result used to be flagship block 06; it belongs here,
                      at this size, because a taught dissertation is education. */}
                  <DissertationCard />
                </>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
