import type { Certification } from "./types";

/**
 * Certifications, newest first.
 *
 * TODO(rajarshi): send me name · issuer · issued (YYYY-MM) · expiry if any
 * · credential ID · verification URL · category.
 *
 * The verification URL matters more than it looks. The reference site's entire
 * thesis is "receipts, not claims" — a cert that links to a live credential
 * page is proof; one that doesn't is a line of text. Send the URLs.
 */
export const certifications: Certification[] = [
  {
    name: "TODO(rajarshi)",
    issuer: "TODO(rajarshi)",
    issued: "TODO", // YYYY-MM
    credentialId: "",
    url: "",
    category: "TODO(rajarshi)", // e.g. "ML" | "Cloud" | "Data"
  },
];
