// Makes the smaller web versions of large homepage images. Selected work covers: from the original PNGs in
// public/work/covers/home/ (the PNGs are kept untouched as the masters).
// Each cover gets a 640w and a 1200w file (or its own width, if smaller) as AVIF and WebP:
// the cards are at most ~560 CSS px wide, so 1200w covers 2x screens and 640w covers phones.
import sharp from 'sharp'
import { readdirSync } from 'node:fs'

const DIR = 'public/work/covers/home'
const WIDTHS = [640, 1200]

for (const file of readdirSync(DIR).filter((f) => f.endsWith('.png'))) {
  const src = `${DIR}/${file}`
  const base = src.replace(/\.png$/, '')
  for (const w of WIDTHS) {
    const img = () => sharp(src).resize({ width: w, withoutEnlargement: true })
    await img().avif({ quality: 60, effort: 6 }).toFile(`${base}-${w}.avif`)
    await img().webp({ quality: 84, effort: 6 }).toFile(`${base}-${w}.webp`)
  }
  console.log(file)
}

// About photos: a 700w copy beside each full-size file, for phones and 1x/2x desktop cells
for (const name of ['portrait-purple-sari', 'assembling-a-model']) {
  await sharp(`public/about/${name}.webp`).resize({ width: 700 }).webp({ quality: 82, effort: 6 }).toFile(`public/about/${name}-700.webp`)
  console.log(name)
}
