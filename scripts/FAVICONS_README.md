Generator for favicons

Usage:
1. Put your source square image in `public/` (e.g. `public/aleen-logo.png`).
2. From the project root run:

   node ./scripts/generate-favicons.js public/aleen-logo.png

This creates `public/favicons/` with multiple PNG sizes, writes `public/favicon.ico` (32x32) and `public/site.webmanifest`.

You can add the generated files to source control or keep them generated locally.

Notes:
- The script uses `jimp`. Install it with `pnpm add -D jimp` or run `pnpm install` after package.json changes.
- If you want a multi-resolution ICO (containing several sizes), consider using the `png-to-ico` package after generation.
