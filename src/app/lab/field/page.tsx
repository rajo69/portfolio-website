import type { Metadata } from "next";

import { FieldLab } from "@/components/layout/fields/FieldLab";

/**
 * Background chooser.
 *
 * A taste decision is settled far faster by looking at the options than by
 * reading a description of them, so all four candidates render here on top of
 * a real slab of page furniture, with glass cards on and off.
 *
 * Not linked from anywhere and `noindex`. It is a workbench, not a page.
 */
export const metadata: Metadata = {
  title: "Field lab",
  robots: { index: false, follow: false },
};

export default function FieldLabPage() {
  return <FieldLab />;
}
