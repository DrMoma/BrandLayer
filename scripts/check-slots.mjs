#!/usr/bin/env node
/**
 * Fails the build if any placeholder slot is still present in content.
 *
 * The brand template ships with visible "[ CLIENT NAME ]" slots on
 * purpose, so the structure is finished before the facts are. This guard is
 * what stops one of them reaching production by accident.
 *
 * Run `npm run check:slots` before deploying. It is intentionally NOT wired
 * into `npm run build`, because the site must stay buildable while the slots
 * are still being filled in.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../content", import.meta.url));
// Slots live in source as SLOT("...") and only become "[ ... ]" at runtime,
// so match the call, not the rendered form.
const PATTERN = /SLOT\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

let found = 0;
for (const file of walk(ROOT).filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(file, "utf8");
  src.split("\n").forEach((line, i) => {
    if (line.includes("export const SLOT") || line.trimStart().startsWith("*")) return;
    for (const [, label] of line.matchAll(PATTERN)) {
      console.error(`  ${file.replace(ROOT, "content")}:${i + 1}  [ ${label.slice(0, 60)} ]`);
      found++;
    }
  });
}

if (found) {
  console.error(`\n✗ ${found} unfilled placeholder slot${found === 1 ? "" : "s"}.`);
  console.error("  Replace them with real material, or remove the brand.\n");
  process.exit(1);
}
console.log("✓ No placeholder slots remain.");
