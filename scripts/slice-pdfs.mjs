// Renders case-study PDFs into stacked image slices (full-res + half-res WebP) so the original
// layout can be shown at a legible size. Every page is rendered, in order, 2000px wide.
// Usage: node scripts/slice-pdfs.mjs [id ...]   (no ids = all; other entries in the manifest are kept)
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

sharp.cache(false)
sharp.concurrency(2)

const personal = (id) => ({ id, pdf: `public/work/personal/${id}.pdf`, out: `public/work/personal/${id}` })
const cases = [
  { id: 'nutrio', pdf: 'public/case-studies/nutrio-case-study.pdf', out: 'public/case-studies/nutrio' },
  { id: 'tan90', pdf: 'public/case-studies/tan90-case-study.pdf', out: 'public/case-studies/tan90' },
  ...['gema', 'roam', 'zensenta', 'influish', 'relay'].map(personal),
]
const SLICE = 1600 // px tall per slice at full width (2000px)
const MANIFEST = 'src/data/caseSlices.json'
const only = process.argv.slice(2)
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {}

for (const c of cases.filter((c) => !only.length || only.includes(c.id))) {
  rmSync(c.out, { recursive: true, force: true })
  mkdirSync(c.out, { recursive: true })
  const pages = Number(execFileSync('pdfinfo', [c.pdf], { encoding: 'utf8' }).match(/Pages:\s+(\d+)/)[1])
  const slices = []
  for (let page = 1; page <= pages; page++) {
    const base = join(tmpdir(), `${c.id}-render-${page}`)
    execFileSync('pdftoppm', ['-png', '-singlefile', '-f', String(page), '-l', String(page), '-scale-to-x', '2000', '-scale-to-y', '-1', c.pdf, base])
    const { width, height } = await sharp(`${base}.png`, { limitInputPixels: false }).metadata()
    for (let top = 0; top < height; top += SLICE) {
      const h = Math.min(SLICE, height - top)
      const name = String(slices.length + 1).padStart(2, '0')
      const buf = await sharp(`${base}.png`, { limitInputPixels: false }).extract({ left: 0, top, width, height: h }).toBuffer()
      await sharp(buf).webp({ quality: 82 }).toFile(`${c.out}/${name}-2000.webp`)
      await sharp(buf).resize(1000).webp({ quality: 80 }).toFile(`${c.out}/${name}-1000.webp`)
      slices.push({ src: `/${c.out.replace(/^public\//, '')}/${name}`, w: width, h })
    }
    rmSync(`${base}.png`, { force: true })
  }
  manifest[c.id] = slices
  console.log(c.id, pages, 'page(s)', slices.length, 'slices')
}
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
