// Large 3:2 covers for the three Featured cards on the home page, cut from images already on
// the site. Run from the repo root: node scripts/featured-covers.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const out = 'public/work/featured'
mkdirSync(out, { recursive: true })
const covers = [
  // the prototype's share dialog, centred
  ['drive-sharing', 'public/work/drive-sharing/overview-share-dialog-1800.webp', { left: 56, top: 0, width: 1688, height: 1125 }],
  // GEMA's first PDF page: headline and phone, above the rock
  ['gema', 'public/work/personal/gema/01-2000.webp', { left: 0, top: 0, width: 2000, height: 1333 }],
  ['tan90', 'public/work/covers/home/tan90-1200.webp', null],
]
for (const [name, src, box] of covers) {
  const base = box ? sharp(src).extract(box) : sharp(src)
  for (const w of [640, 1200]) {
    await base.clone().resize(w).avif({ quality: 60, effort: 6 }).toFile(`${out}/${name}-${w}.avif`)
    await base.clone().resize(w).webp({ quality: 84, effort: 6 }).toFile(`${out}/${name}-${w}.webp`)
  }
}
console.log('featured covers done')
