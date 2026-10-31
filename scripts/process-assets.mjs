// Converts raw captures (capture/) + PDF renders into optimized WebP assets in public/work/.
import sharp from 'sharp'
import { mkdirSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const out = (p) => { mkdirSync(p, { recursive: true }); return p }
const webp = (src, dest, width, opts = {}) => sharp(src, { limitInputPixels: false }).resize({ width, withoutEnlargement: true }).webp({ quality: 82, ...opts }).toFile(dest)

// Case-study covers: crop the opening spread of each PDF render
const nutrio = join(tmpdir(), 'nutrio-render.png')
const covers = out('public/work/covers')
await sharp(nutrio, { limitInputPixels: false }).extract({ left: 0, top: 0, width: 2000, height: 1026 }).resize(1600).webp({ quality: 84 }).toFile(`${covers}/nutrio.webp`)

// Medurun
const m = out('public/work/medurun')
await webp('capture/medurun-hero.png', `${m}/hero.webp`, 2000)
await webp('capture/medurun-hero.png', `${covers}/medurun.webp`, 1600)
for (const s of ['positioning', 'services', 'why', 'how2', 'contact']) await webp(`capture/medurun-still-${s}.png`, `${m}/${s}.webp`, 1600)
await webp('capture/medurun-mobile-hero.png', `${m}/mobile-hero.webp`, 780)
copyFileSync('capture/medurun-scroll.webm', `${m}/scroll.webm`)
await webp('capture/frame9.png', `${m}/scroll-poster.webp`, 1280)

// IICA (390x844 @3x -> 780w)
const i = out('public/work/iica')
for (const [src, name] of [['home', 'home'], ['catalogue', 'catalogue'], ['artist_ananya-rao', 'profile'], ['collaborate', 'collaborate'], ['collaborate_recommendations', 'matches'], ['collaborate_match_ananya-rao', 'match-detail'], ['event_ragas-of-dusk', 'event'], ['events', 'events'], ['shop', 'shop'], ['masterclass', 'masterclass'], ['explore', 'explore']]) {
  await webp(`capture/iica_${src}.png`, `${i}/${name}.webp`, 780)
}
// Retina (340x700 @2x)
const r = out('public/work/retina')
for (const [n, name] of [['01', 'login'], ['03', 'articles'], ['04', 'not-in-store'], ['05', 'scan'], ['06', 'capture'], ['07', 'submitted'], ['08', 'done'], ['09', 'progress'], ['10', 'retry']]) {
  await webp(`capture/retina-${n}.png`, `${r}/${name}.webp`, 680)
}
console.log('assets done')
