import { ImageResponse } from "next/og";

import { profile } from "@/content/profile";

/**
 * The Open Graph card.
 *
 * WHY IT EXISTS. `twitter.card` was already set to `summary_large_image` with
 * no image behind it, which is worse than not setting it: LinkedIn, Slack and
 * X all reserve the large slot and then render it empty. For a site whose whole
 * job is being pasted into an application or a message, the card is the first
 * thing most people see and it was blank.
 *
 * WHY THE COLOURS ARE LITERAL HERE, against rule 3. This renders in Satori, a
 * standalone layout engine with no browser, no stylesheet and therefore no CSS
 * custom properties: `var(--accent)` resolves to nothing and the text comes out
 * transparent. The four values below are copied from globals.css and are the
 * only place in the codebase allowed to do that. If a token changes there,
 * change it here too.
 *
 * NO EXTERNAL REQUESTS. No fonts are fetched and no images are embedded, so the
 * card cannot fail to build because a network call timed out. Satori's default
 * face does the work, with the type set large enough that it reads at the size
 * these cards are actually shown.
 */

export const alt = profile.meta.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK_900 = "#08090a";
const INK_600 = "#1a1e21";
const PAPER = "#f4f3f0";
const PAPER_FAINT = "#6b6e6b";
const ACCENT = "#00e88c";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK_900,
          padding: "64px 72px",
        }}
      >
        {/* Eyebrow, matching the page's own micro-label treatment. */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 16, height: 16, background: ACCENT }} />
          <div
            style={{
              color: PAPER_FAINT,
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {profile.title}
          </div>
        </div>

        {/* The headline is the thesis, so it is the card. */}
        <div
          style={{
            display: "flex",
            color: PAPER,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: -2.5,
            maxWidth: 980,
          }}
        >
          {profile.headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: `1px solid ${INK_600}`,
            paddingTop: 32,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ color: PAPER, fontSize: 32, fontWeight: 600 }}>
              {profile.name}
            </div>
            <div style={{ color: PAPER_FAINT, fontSize: 24 }}>
              {profile.location}
            </div>
          </div>

          {/* The same three numbers the hero leads on, so the card and the
              page do not disagree with each other. */}
          <div style={{ display: "flex", gap: 48 }}>
            {profile.stats.map((s) => (
              <div
                key={s.caption}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
              >
                <div style={{ color: ACCENT, fontSize: 44, fontWeight: 700 }}>
                  {s.value}
                </div>
                <div
                  style={{
                    color: PAPER_FAINT,
                    fontSize: 17,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    maxWidth: 190,
                  }}
                >
                  {s.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size
  );
}
