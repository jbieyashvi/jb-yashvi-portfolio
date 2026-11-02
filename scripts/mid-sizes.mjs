// Makes the in-between size for every large image, so a phone or a 2x laptop does not jump to the
// biggest file. A 440 CSS px slot on a 2x screen needs 880 px and a phone at 3x needs ~1170 px:
// with only 800w and 1800w files both took the 1800w one, which on a slow connection stayed blank.
// - each `*-1800.webp` wider than 1300 px gets a `*-1200.webp` (pages add it with mid() in src/components/srcset.ts)
// - each `*-2000.webp` (PDF pages) wider than 1500 px gets a `*-1400.webp` (pdfMid())
// Made from the large file itself; rerun after adding or replacing images.
import sharp from 'sharp'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))
const STEPS = [
  { from: '-1800.webp', to: '-1200.webp', width: 1200, over: 1300 },
  { from: '-2000.webp', to: '-1400.webp', width: 1400, over: 1500 },
]

let made = 0
for (const file of walk('public')) {
  const step = STEPS.find((s) => file.endsWith(s.from))
  if (!step) continue
  const { width } = await sharp(file).metadata()
  if (width <= step.over) continue
  const out = file.slice(0, -step.from.length) + step.to
  await sharp(file).resize({ width: step.width }).webp({ quality: 80, effort: 6 }).toFile(out)
  made++
  console.log(`${out}  ${Math.round(statSync(file).size / 1024)}KB -> ${Math.round(statSync(out).size / 1024)}KB`)
}
console.log(`${made} files`)
