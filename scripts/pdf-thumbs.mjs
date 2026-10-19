// Makes the Personal Projects thumbnails from the project PDFs in public/work/personal/.
// Each PDF is one tall page; a full-width 4:3 band (a cover or final screen) is cut from it at
// the listed top offset, in PDF points, and saved 400px wide as AVIF and WebP beside the PDF.
// Needs pdftoppm (poppler). The PDFs themselves are never changed.
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const DIR = 'public/work/personal'
const DPI = 144
const CROPS = { gema: 0, roam: 350, zensenta: 0, influish: 3000, relay: 0 }

const tmp = mkdtempSync(join(tmpdir(), 'pdf-thumbs-'))
for (const [name, top] of Object.entries(CROPS)) {
  const pdf = `${DIR}/${name}.pdf`
  const info = execFileSync('pdfinfo', [pdf], { encoding: 'utf8' })
  const width = Number(info.match(/Page size:\s+([\d.]+)/)[1])
  const s = DPI / 72
  const out = join(tmp, name)
  execFileSync('pdftoppm', ['-png', '-r', String(DPI), '-singlefile', '-x', '0', '-y', String(Math.round(top * s)),
    '-W', String(Math.round(width * s)), '-H', String(Math.round(width * 0.75 * s)), pdf, out])
  const img = () => sharp(`${out}.png`).resize({ width: 400 })
  await img().avif({ quality: 60, effort: 6 }).toFile(`${DIR}/${name}-thumb.avif`)
  await img().webp({ quality: 84, effort: 6 }).toFile(`${DIR}/${name}-thumb.webp`)
  console.log(name)
}
