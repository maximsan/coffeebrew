#!/usr/bin/env node
/**
 * Downloads hero images for bundled catalog recipes from Unsplash (same URLs
 * the app used before switching to local assets). Run from repo:
 *   cd app && node scripts/download-recipe-images.mjs
 * Requires Node 18+ (global fetch).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "../assets/images/recipes");

/**
 * Unsplash sources for bundled recipe heroes (catalog ids 1–14). Several URLs
 * from the original in-app catalog now return 404 from images.unsplash.com;
 * those slots use working alternatives (still coffee-themed stock).
 */
const RECIPE_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=1200&q=80",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1200&q=80",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=1200&q=80",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=1200&q=80",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80",
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&q=80",
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80",
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
  },
  {
    id: 13,
    url: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=1200&q=80",
  },
  {
    id: 14,
    url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
  },
];

async function download(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const { id, url } of RECIPE_IMAGES) {
    const filename = `recipe-${String(id).padStart(2, "0")}.jpg`;
    const dest = path.join(OUT_DIR, filename);
    process.stdout.write(`Downloading ${filename}… `);
    const buf = await download(url);
    fs.writeFileSync(dest, buf);
    console.log(`${(buf.length / 1024).toFixed(1)} KiB`);
  }

  const first = path.join(OUT_DIR, "recipe-01.jpg");
  const def = path.join(OUT_DIR, "default-recipe.jpg");
  fs.copyFileSync(first, def);
  console.log(`Wrote ${path.relative(process.cwd(), def)} (copy of recipe-01)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
