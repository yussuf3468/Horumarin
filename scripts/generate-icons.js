/**
 * MIDEEYE Icon Generator
 * Generates all required PNG icons from public/favicon.svg
 * Run: node scripts/generate-icons.js
 */

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SVG_SOURCE = path.join(__dirname, "../public/favicon.svg");
const OUTPUT_DIR = path.join(__dirname, "../public/icons");

// All required icon sizes
const ICONS = [
  // PWA / manifest
  { name: "icon-72x72.png", size: 72 },
  { name: "icon-96x96.png", size: 96 },
  { name: "icon-128x128.png", size: 128 },
  { name: "icon-144x144.png", size: 144 },
  { name: "icon-152x152.png", size: 152 },
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-384x384.png", size: 384 },
  { name: "icon-512x512.png", size: 512 },
  // Web favicons
  { name: "icon-32x32.png", size: 32 },
  { name: "icon-16x16.png", size: 16 },
  // iOS
  { name: "icon-20x20.png", size: 20 },
  { name: "icon-40x40.png", size: 40 },
  { name: "icon-60x60.png", size: 60 },
  { name: "icon-120x120.png", size: 120 },
  { name: "icon-180x180.png", size: 180 },
  { name: "icon-76x76.png", size: 76 },
  { name: "icon-167x167.png", size: 167 },
  // App Store / Play Store
  { name: "icon-1024x1024.png", size: 1024 },
  // Apple touch
  { name: "apple-touch-icon.png", size: 180 },
];

// Read SVG and expand it with a solid background for maskable / iOS (no transparency)
const svgSource = fs.readFileSync(SVG_SOURCE);

// Expand SVG to a larger canvas with background (for maskable icons)
function buildMaskableSvg(size) {
  const padding = Math.round(size * 0.1);
  const inner = size - padding * 2;
  return Buffer.from(`
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#0f1117"/>
      <image href="data:image/svg+xml;base64,${svgSource.toString("base64")}"
             x="${padding}" y="${padding}" width="${inner}" height="${inner}"/>
    </svg>
  `);
}

async function generate() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`Generating ${ICONS.length} icons into ${OUTPUT_DIR} ...\n`);

  for (const icon of ICONS) {
    const outPath = path.join(OUTPUT_DIR, icon.name);
    const svg = buildMaskableSvg(icon.size);

    await sharp(svg).png().toFile(outPath);

    console.log(`  ✓  ${icon.name}  (${icon.size}×${icon.size})`);
  }

  console.log("\n✅ All icons generated successfully.");
}

generate().catch((err) => {
  console.error("Icon generation failed:", err);
  process.exit(1);
});
