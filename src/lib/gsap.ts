import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Single registration point for GSAP plugins.
 *
 * All plugins — including SplitText and Flip — have been free under the
 * standard licence since GSAP 3.13 (May 2025). The ui-ux-pro-max skill's
 * motion.csv still describes SplitText as a paid Club plugin; that is stale.
 *
 * Registration is idempotent, so importing this from several components is safe.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip);
}

export { useGSAP } from "@gsap/react";
export { gsap, ScrollTrigger, SplitText, Flip };
