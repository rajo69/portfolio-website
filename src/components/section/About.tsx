import Image from "next/image";

import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Eyebrow, Label } from "@/components/type";
import { profile } from "@/content/profile";

/**
 * ABOUT, with the portrait.
 *
 * The reference site has no photograph and gets away with it because the
 * author has twenty-five years of named commercial outcomes doing that job.
 * Without that, a face does real work: it makes the person concrete for a
 * hiring manager who is deciding whether to reply.
 *
 * Sized and priority-loaded off the critical path: it sits well below the
 * fold, so it must not compete with the hero for bandwidth.
 */
export function About() {
  return (
    <Section id="about">
      <div className="grid gap-14 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal className="mx-auto w-full max-w-[280px] lg:mx-0 lg:w-[300px]">
          <div className="relative overflow-hidden rounded-sm border border-line">
            <Image
              src="/headshot.png"
              alt={`${profile.name}, ${profile.title}`}
              width={436}
              height={582}
              sizes="(max-width: 1024px) 280px, 300px"
              className="h-auto w-full object-cover"
            />
            {/* Ties the portrait into the palette without tinting the face. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/45 via-transparent to-transparent"
            />
          </div>
          {/* Stacked, not a justify-between row: at 280px both labels wrapped
              to two lines and the pair read as four ragged fragments. */}
          <div className="mt-4 space-y-1">
            <Label className="block">{profile.name}</Label>
            <Label className="block">{profile.location}</Label>
          </div>
        </Reveal>

        <div>
          <Reveal variant="stagger" className="space-y-8">
            <Eyebrow>About</Eyebrow>
            <SplitHeading size="h1" className="max-w-[18ch]">
              Accuracy gets a demo. Explainability gets a user.
            </SplitHeading>
          </Reveal>

          <Reveal variant="stagger" className="mt-8 max-w-[58ch] space-y-5">
            <p className="text-sm leading-relaxed text-paper-dim">
              I started out building analytics for a US insurance carrier at IBM,
              where I learned the lesson that has shaped everything since: I
              deployed a churn model that cut attrition by 9%, and the business
              team ignored it for weeks because it read as a black box. It only
              got used once I could explain, in plain language, which features
              were driving each prediction.
            </p>
            <p className="text-sm leading-relaxed text-paper-dim">
              The same thing happened with a reporting migration. A sceptical
              analyst of twenty years asked why they should trust my black box.
              They adopted it after seeing both systems reconcile to identical
              numbers side by side, and then went on to train their peers on it.
            </p>
            <p className="text-sm leading-relaxed text-paper-dim">
              Since then I have taken an MSc in Data Science at Leeds, handled
              special category health data and its access controls at an NHS
              ADHD provider, and built production AI for regulated work. The
              current one is an AI accountant on Xero where every decision
              stores its own feature importances, a risk score and its reasoning
              in an audit log. Alongside that I run interpretability research on
              gated attention, which is the same question one level down.
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
