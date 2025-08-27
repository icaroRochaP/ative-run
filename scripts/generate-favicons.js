// Simple favicon generator using Jimp
// Usage: node ./scripts/generate-favicons.js <source-image-path>
// Example: node ./scripts/generate-favicons.js public/aleen-logo.png

const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];

async function generate(src) {
  if (!src) {
    console.error('Usage: node scripts/generate-favicons.js <source-image-path>');
    process.exit(1);
  }

  if (!fs.existsSync(src)) {
    console.error('Source image not found:', src);
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'public', 'favicons');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const image = await Jimp.read(src);
  // ensure square by cropping to min dimension
  const min = Math.min(image.bitmap.width, image.bitmap.height);
  image.crop(0, 0, min, min);

  for (const s of sizes) {
    const outPath = path.join(outDir, `favicon-${s}x${s}.png`);
    const clone = image.clone();
    clone.resize(s, s, Jimp.RESIZE_BICUBIC);
    await clone.writeAsync(outPath);
    console.log('Wrote', outPath);
  }

  // also write favicon.ico (multiple sizes) - Jimp doesn't write multi-ico, so write the 32x32 as fallback
  const icoPath = path.join(process.cwd(), 'public', 'favicon.ico');
  const icon = image.clone();
  icon.resize(32, 32, Jimp.RESIZE_BICUBIC);
  await icon.writeAsync(icoPath);
  console.log('Wrote', icoPath);

  // generate simple manifest
  const manifest = {
    name: 'Aleen.ai',
    short_name: 'Aleen',
    icons: sizes.map((s) => ({ src: `/favicons/favicon-${s}x${s}.png`, sizes: `${s}x${s}`, type: 'image/png' })),
    start_url: '/',
    display: 'standalone',
  };
  fs.writeFileSync(path.join(process.cwd(), 'public', 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log('Wrote site.webmanifest');
}

generate(process.argv[2]).catch((err) => {
  console.error(err);
  process.exit(1);
});
