// Large 3:2 covers for the Featured cards and the personal tiles in More projects on the home
// page, cut from images already on the site. Run from the repo root: node scripts/featured-covers.mjs
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const out = 'public/work/featured'
mkdirSync(out, { recursive: true })
const covers = [
  // the prototype's share dialog on a laptop on a tiled ledge (screen fitted onto a stock photo)
  ['drive-sharing', 'public/work/drive-sharing/cover.png', null],
  // the prototype's Pickup status screen on an iPhone leaning on concrete steps (screen fitted onto a design-inspiration photo)
  ['rider-pickup-delay', 'public/work/rider-pickup-delay/cover-phone.webp', null],
  // the real admin dashboard on a laptop held up against the sky (screen fitted onto a stock photo)
  ['tan90', 'public/work/covers/home/tan90-1200.webp', null],
  // the real Orders and Track Order screens on two iPhones against the sky (screens fitted onto a stock photo, sky extended at the sides)
  ['shipway', 'public/work/shipway/cover.png', null],
  // the real dashboard on a laptop on someone's lap (screen fitted onto a stock photo)
  ['compass', 'public/work/covers/home/compass-laptop.png', null],
  // the WAVO prototype's Welcome screen on an iPhone held up against the sky (free MOCKUPASIA mockup, sky extended at the sides)
  ['wavo', 'public/work/wavo/cover.png', null],
]
for (const [name, src, box] of covers) {
  const base = box ? sharp(src).extract(box) : sharp(src)
  for (const w of [640, 1200]) {
    await base.clone().resize(w).avif({ quality: 60, effort: 6 }).toFile(`${out}/${name}-${w}.avif`)
    await base.clone().resize(w).webp({ quality: 84, effort: 6 }).toFile(`${out}/${name}-${w}.webp`)
  }
}
console.log('featured covers done')
