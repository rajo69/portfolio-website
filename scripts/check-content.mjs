/**
 * Fails the build if any TODO(rajarshi) placeholder survives into production.
 *
 * The site's entire argument is "receipts, not claims" — shipping a literal
 * "TODO" to a hiring manager would undercut that more than any design flaw.
 * Runs as part of `npm run build`.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CONTENT_DIR = join(process.cwd(), "src", "content");
const MARKER = "TODO(rajarshi)";

let hits = 0;

// types.ts is the schema, not content — it documents the marker rather than using it.
const SKIP = new Set(["types.ts"]);

for (const file of readdirSync(CONTENT_DIR)) {
  if (!file.endsWith(".ts") || SKIP.has(file)) continue;
  const lines = readFileSync(join(CONTENT_DIR, file), "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes(MARKER)) {
      hits++;
      console.error(`  src/content/${file}:${i + 1}  ${line.trim().slice(0, 100)}`);
    }
  });
}

if (hits > 0) {
  console.error(`\n✗ ${hits} unfilled placeholder${hits === 1 ? "" : "s"} in src/content/.`);
  console.error("  See CONTENT-BRIEF.md. Run with CONTENT_DRAFT=1 to bypass while drafting.\n");
  if (!process.env.CONTENT_DRAFT) process.exit(1);
} else {
  console.log("✓ content complete — no placeholders remaining");
}
