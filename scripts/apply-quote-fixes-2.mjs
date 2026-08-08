// Second fact-check remediation pass (2026-08-09), covering issues found by
// an independent audit after the first pass. Each entry below was
// individually re-verified (mostly via WebFetch against Wikiquote) before
// being included here — see the commit message for what was checked and
// what was left unchanged because the original fix already had a solid
// citation (e.g. 01-31 Oliver Goldsmith was re-confirmed, not reverted).
// Same mechanics as apply-quote-fixes.mjs: loads src/data/quotes.ts, applies
// the patch map, validates, rewrites in the same format.
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const dataPath = path.join(root, "src/data/quotes.ts");
const { QUOTES } = await import(dataPath);

const PATCHES = {
  // Flagship example quote from the original design mockup — keep the text,
  // but "Chinese Proverb" has no verifiable source (checked against both
  // Wikiquote's and Wikipedia's "Chinese proverbs" pages: absent from both).
  "01-01": { author: "Proverb" },

  // "Whether you think you can..." — absent from Ford's Wikiquote page in
  // two independent checks (main + Misattributed sections). Keep the text
  // (it's the Favorites-screen example from the mockup) but drop the
  // unconfirmed attribution.
  "01-04": { author: "Proverb" },

  // Real Stoic philosophy, but not verbatim Meditations text — Wikiquote's
  // closest match (VIII.47) reads differently. Label as a paraphrase rather
  // than implying this is a direct translation.
  "03-03": { author: "Marcus Aurelius（意訳）" },

  // Same issue: closest Wikiquote match (Enchiridion 5) is meaningfully
  // different wording. Paraphrase, not verbatim.
  "03-06": { author: "Epictetus（意訳）" },

  // Wikiquote and the Walden Woods Project both flag this as a commonly
  // misquoted modernization of Walden's actual (longer, conditional) sentence.
  "03-09": { author: "Henry David Thoreau（意訳）" },

  // "It's not the size of the dog in the fight..." — absent from Twain's
  // Wikiquote page entirely (checked directly). Independently traced to a
  // 1911 Arthur G. Lewis piece, published after Twain's 1910 death, so the
  // attribution is not just unsourced but implausible. Full replacement.
  "09-02": {
    en: "Penny wise, pound foolish.",
    author: "English Proverb",
    ja: "一ペニーを惜しんで、一ポンドを失う。（小さな倹約が大きな損につながる）",
    note: "\"penny\" と \"pound\" はどちらもイギリスの通貨単位。小さい額と大きい額を対比させている。",
  },

  // Wikiquote lists this as one of the "doubtful fragments" attributed to
  // Epictetus long after his death — not confirmed as genuinely his, and no
  // single alternative source is well-established enough to name instead.
  "09-12": { author: "Proverb" },

  // Not a traditional Japanese proverb: no source earlier than a 1990s
  // management-writing context, closely echoing Joel Arthur Barker's
  // "vision without action" formulation. Keep the (genuinely useful) line,
  // drop the false cultural specificity.
  "09-21": { author: "Proverb" },

  // "Energy and persistence conquer all things" — this was my own
  // replacement text from the first remediation pass, picked from memory
  // without checking it. Re-verified now: absent from Franklin's Wikiquote
  // page entirely. Replacing again, this time with a plain unattributed
  // proverb to avoid repeating the same mistake.
  "10-01": {
    en: "You cannot make an omelette without breaking eggs.",
    author: "English Proverb",
    ja: "卵を割らずに、オムレツは作れない。（犠牲なしに物事は成し遂げられない）",
    note: "\"without -ing\" は「〜することなしに」という意味の否定的な条件を表す表現。",
  },

  // Sourced only to a 2005 self-help book (Sango Mbella's "Sophia's Fire"),
  // not to anything Bell himself wrote or said. A modern secondary source
  // dressed up as a 19th-century inventor's words.
  "10-12": {
    en: "A penny saved is a penny earned.",
    author: "English Proverb",
    ja: "一ペニーの節約は、一ペニーの稼ぎに等しい。",
    note: "\"saved\" と \"earned\" はどちらも過去分詞で、ここでは形容詞的に使われている。",
  },
};

let changed = 0;
for (const q of QUOTES) {
  if (PATCHES[q.id]) {
    Object.assign(q, PATCHES[q.id]);
    changed++;
  }
}

const ids = new Set(QUOTES.map((q) => q.id));
if (ids.size !== QUOTES.length) throw new Error("duplicate ids after patch");
const ens = new Map();
for (const q of QUOTES) {
  if (ens.has(q.en)) throw new Error(`duplicate en text: ${q.id} and ${ens.get(q.en)}`);
  ens.set(q.en, q.id);
}
for (const q of QUOTES) {
  const expected = String(q.month).padStart(2, "0") + "-" + String(q.day).padStart(2, "0");
  if (q.id !== expected) throw new Error(`id/month/day mismatch: ${q.id}`);
}

console.log(`Applied patches, ${changed} entries touched. Integrity OK. Writing file...`);

function esc(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const header = `import type { Quote } from "./types";\n\nexport const QUOTES: Quote[] = [\n`;
const body = QUOTES.map(
  (q) =>
    `  {\n` +
    `    id: "${q.id}",\n` +
    `    month: ${q.month},\n` +
    `    day: ${q.day},\n` +
    `    en: "${esc(q.en)}",\n` +
    `    author: "${esc(q.author)}",\n` +
    `    ja: "${esc(q.ja)}",\n` +
    `    note: "${esc(q.note)}",\n` +
    `  },`
).join("\n");
const footer = `\n];\n`;

await writeFile(dataPath, header + body + footer, "utf8");
console.log(`Wrote ${QUOTES.length} entries to src/data/quotes.ts`);
