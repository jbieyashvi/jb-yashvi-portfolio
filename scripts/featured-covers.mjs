// Large 3:2 covers for the Featured cards and the personal tiles in More projects on the home
// page, cut from images already on the site. Run from the repo root: node scripts/featured-covers.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const out = 'public/work/featured'
mkdirSync(out, { recursive: true })
const covers = [
  // the prototype's share dialog, centred
  ['drive-sharing', 'public/work/drive-sharing/overview-share-dialog-1800.webp', { left: 56, top: 0, width: 1688, height: 1125 }],
  // GEMA's first PDF page: headline and phone, above the rock
  ['gema', 'public/work/personal/gema/01-2000.webp', { left: 0, top: 0, width: 2000, height: 1333 }],
  // three prototype screens on a warm ground, made from the case study's own screenshots
  ['rider-pickup-delay', 'public/work/rider-pickup-delay/cover-1800.webp', null],
  ['tan90', 'public/work/covers/home/tan90-1200.webp', null],
  // Relay's first PDF page: the monitor on the desk, above the caption band
  ['relay', 'public/work/personal/relay/01-2000.webp', { left: 0, top: 100, width: 2000, height: 1333 }],
  // app-store style cards around the real app screens, rendered from an HTML layout
  ['shipway', 'public/work/covers/home/shipway-promo.png', null],
  // the real dashboard on a laptop against a sunlit wall, rendered from an HTML layout
  ['compass', 'public/work/covers/home/compass-laptop.png', null],
]
for (const [name, src, box] of covers) {
  const base = box ? sharp(src).extract(box) : sharp(src)
  for (const w of [640, 1200]) {
    await base.clone().resize(w).avif({ quality: 60, effort: 6 }).toFile(`${out}/${name}-${w}.avif`)
    await base.clone().resize(w).webp({ quality: 84, effort: 6 }).toFile(`${out}/${name}-${w}.webp`)
  }
}
console.log('featured covers done')
