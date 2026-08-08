// Generates the app icon / splash / Android adaptive icon / favicon from the
// Modernist tokens and the app's own typeface: a memo-page ground with the
// red margin rule, and a single oversized Archivo "A".
//
// Requires dev-only deps that aren't in package.json (kept out so a rarely-run
// script doesn't bloat install):
//   npm install --no-save sharp opentype.js
//   node scripts/generate-icons.mjs
import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";
import opentype from "opentype.js";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const assets = path.join(root, "assets");
mkdirSync(assets, { recursive: true });

// Modernist tokens (mirrors src/theme/tokens.ts)
const BG = "#f3f2f2";
const INK = "#201e1d";
const ACCENT = "#ec3013";

const archivo = opentype.parse(
  readFileSync(path.join(root, "node_modules/@expo-google-fonts/archivo/800ExtraBold/Archivo_800ExtraBold.ttf")).buffer
);

/**
 * Lays out a string glyph-by-glyph, advancing the pen manually. Avoids
 * font.getPath()'s shaping pipeline, which throws on Archivo's GSUB table
 * ("substitutionType 62 lookupType 6 not yet supported").
 */
function layout(font, text, size) {
  const upem = font.unitsPerEm;
  const merged = new opentype.Path();
  let pen = 0;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    merged.commands.push(...g.getPath(pen, 0, size).commands);
    pen += (g.advanceWidth * size) / upem;
  }
  return merged;
}

/** Renders text as a path whose ink box is `h` tall and centered on (cx, cy). */
function mark(font, text, { h, cx, cy, fill }) {
  const probe = layout(font, text, 1000);
  const pb = probe.getBoundingBox();
  const size = (h / (pb.y2 - pb.y1)) * 1000;

  const p = layout(font, text, size);
  const bb = p.getBoundingBox();
  const dx = cx - (bb.x1 + bb.x2) / 2;
  const dy = cy - (bb.y1 + bb.y2) / 2;

  return `<path d="${p.toPathData(2)}" fill="${fill}" transform="translate(${dx.toFixed(2)} ${dy.toFixed(2)})"/>`;
}

/**
 * `size`-square icon. Authored against a 1024 grid and scaled, so every
 * output size keeps identical proportions.
 * The rule is deliberately heavy — a hairline disappears at 60px.
 */
function iconSvg(size) {
  const s = (n) => (n * size) / 1024;
  const ruleX = s(206);
  const ruleW = s(28);
  // Center the letter in the page area to the right of the rule.
  const cx = (ruleX + ruleW / 2 + size) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  <rect x="${ruleX}" y="0" width="${ruleW}" height="${size}" fill="${ACCENT}"/>
  ${mark(archivo, "A", { h: s(600), cx, cy: size / 2, fill: INK })}
</svg>`;
}

/**
 * Android adaptive foreground: the system crops to roughly the middle 66%,
 * so drop the rule (it would be cropped off-center) and keep just the letter.
 */
function foregroundSvg(size) {
  const s = (n) => (n * size) / 1024;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  ${mark(archivo, "A", { h: s(420), cx: size / 2, cy: size / 2, fill: INK })}
</svg>`;
}

async function write(svg, size, outName, { opaque = false } = {}) {
  let img = sharp(Buffer.from(svg)).resize(size, size);
  if (opaque) img = img.flatten({ background: BG });
  await img.png().toFile(path.join(assets, outName));
  console.log(`  ${outName} (${size}x${size})`);
}

console.log("Generating assets/");
// Apple rejects icons with an alpha channel, so this one is flattened.
await write(iconSvg(1024), 1024, "icon.png", { opaque: true });
await write(iconSvg(1024), 1024, "splash-icon.png");
await write(foregroundSvg(1024), 1024, "android-icon-foreground.png");
await write(foregroundSvg(1024), 1024, "android-icon-monochrome.png");
await write(iconSvg(48), 48, "favicon.png");

await sharp({ create: { width: 1024, height: 1024, channels: 3, background: BG } })
  .png()
  .toFile(path.join(assets, "android-icon-background.png"));
console.log("  android-icon-background.png (1024x1024)");

console.log("Done.");
