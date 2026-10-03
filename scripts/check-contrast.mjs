#!/usr/bin/env node
/**
 * WCAG 2.2 AA contrast audit for every tone.
 *
 * Sections sit on paper, stone or the deep footer, and each tone re-declares
 * the colour tokens locally — so every text pair has to clear 4.5:1 on each
 * ground it can appear on. Reads the tokens straight out of globals.css so
 * this cannot drift from what actually renders.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const css = readFileSync(fileURLToPath(new URL("../app/globals.css", import.meta.url)), "utf8");

function tokens(selector) {
  const i = css.indexOf(selector);
  if (i === -1) throw new Error(`Could not find ${selector} in globals.css`);
  const open = css.indexOf("{", i);
  const src = css.slice(open, css.indexOf("}", open));
  const out = {};
  for (const [, name, value] of src.matchAll(/(--[a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) out[name] = value;
  return out;
}

const paper = tokens(":root,\n.tone-paper");
// Stone only overrides the ground and strokes; text tokens inherit from paper.
const stone = { ...paper, ...tokens(".tone-stone {") };
const deep = tokens(".tone-deep {");

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c) => (c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const L = (h) => { const [r, g, b] = hex(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
const ratio = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const PAIRS = [
  ["--text-default", "--bg-default"],
  ["--text-default", "--bg-raised"],
  ["--text-neutral", "--bg-default"],
  ["--text-neutral", "--bg-raised"],
  ["--text-faint", "--bg-default"],
  ["--text-faint", "--bg-raised"],
  ["--accent", "--bg-default"],
  ["--accent", "--bg-raised"],
];

const MIN = 4.5;
let failures = 0;

for (const [name, t] of Object.entries({ paper, stone, deep })) {
  for (const [fg, bg] of PAIRS) {
    if (!t[fg] || !t[bg]) throw new Error(`${name} is missing ${!t[fg] ? fg : bg}`);
    const r = ratio(t[fg], t[bg]);
    const ok = r >= MIN;
    if (!ok) failures++;
    console.log(
      `${ok ? "PASS" : "FAIL"}  ${name.padEnd(5)} ${`${fg} on ${bg}`.padEnd(34)} ${r.toFixed(2)}:1`
    );
  }
}

if (failures) {
  console.error(`\n✗ ${failures} pair(s) below ${MIN}:1.`);
  process.exit(1);
}
console.log(`\n✓ All pairs clear WCAG 2.2 AA (${MIN}:1) on paper, stone and deep.`);
