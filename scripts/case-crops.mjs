// Detail crops for the Compass and NUTRIO case studies, cut from images already on the site
// (and, for the dialog, from the design system PDF) so small UI text stays readable on phones.
// Run from the repo root: node scripts/case-crops.mjs
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const webp = (img, dest) => img.webp({ quality: 86 }).toFile(dest)

// Compass: worklist status + actions columns, and the dashboard's attention banners (2016px screenshots)
const c = 'public/work/compass'
await webp(sharp(`${c}/wl.webp`).extract({ left: 1478, top: 128, width: 538, height: 425 }), `${c}/detail-actions.webp`)
await webp(sharp(`${c}/home.webp`).extract({ left: 1440, top: 84, width: 545, height: 170 }), `${c}/detail-attention.webp`)

// Compass: the destructive "Retire APL link?" dialog from the design system PDF, rendered at 2x
const dialog = join(tmpdir(), 'cmp-dialog')
execFileSync('pdftoppm', ['-png', '-singlefile', '-scale-to-x', '3600', '-scale-to-y', '-1', '-x', '980', '-y', '15750', '-W', '800', '-H', '290', `${c}/cmp-autobot-design-system.pdf`, dialog])
await webp(sharp(`${dialog}.png`), `${c}/detail-dialog.webp`)

// NUTRIO: ordering choices, scheduling and meal setup, from the 2000px case-study slices. The designs
// run across slice breaks, so slices 08-10 (1600px tall each) are joined first and cropped from that.
const n = 'public/case-studies/nutrio'
const out = 'public/work/nutrio'
mkdirSync(out, { recursive: true })
const slices = ['08', '09', '10']
const joined = await sharp({ create: { width: 2000, height: 1600 * slices.length, channels: 3, background: '#fff' } })
  .composite(slices.map((s, i) => ({ input: `${n}/${s}-2000.webp`, top: 1600 * i, left: 0 })))
  .png()
  .toBuffer()
const crops = [
  ['plans', { left: 80, top: 590, width: 1840, height: 1355 }],
  ['schedule', { left: 90, top: 2150, width: 1820, height: 960 }],
  ['meals', { left: 170, top: 3140, width: 1680, height: 1090 }],
]
for (const [name, box] of crops) {
  const base = sharp(joined).extract(box)
  await webp(base.clone().resize(1800), `${out}/${name}-1800.webp`)
  await webp(base.clone().resize(800), `${out}/${name}-800.webp`)
}
// Compass: the full screenshots at the lightbox's size, so they can be opened larger
for (const name of ['home', 'wl', 'settings']) await webp(sharp(`${c}/${name}.webp`).resize(1800), `${c}/${name}-1800.webp`)
console.log('crops done')
