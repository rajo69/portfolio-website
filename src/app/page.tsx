import { About } from "@/components/section/About";
import { Certifications } from "@/components/section/Certifications";
import { Flagship } from "@/components/section/Flagship";
import { Hero } from "@/components/section/Hero";
import { Method } from "@/components/section/Method";
import { Spine } from "@/components/section/Spine";
import { Stack } from "@/components/section/Stack";
import { Work } from "@/components/section/Work";

/**
 * Order is an argument, not a layout.
 *
 * Hero states the thesis, Spine explains the shape of the work (Pipeline,
 * Model, Trust), Flagship proves it with something running, Lab spreads that
 * across all four capabilities, Work lets a reader filter to whichever one
 * they came for, then Method, About, Stack and Certifications back it up.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Spine />
      <Flagship />
      <Work />
      <Method />
      <About />
      <Stack />
      <Certifications />
    </>
  );
}
