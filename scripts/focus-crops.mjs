// Focused crops for the Compass, Shipway, Drive and WAVO case studies, cut from screenshots already
// on the site so the detail a section talks about is readable inline. The full screenshot still
// opens in the enlarged view. Run from the repo root: node scripts/focus-crops.mjs
import sharp from 'sharp'

const save = async (img, base, w) => {
  const buf = await img.png().toBuffer()
  const { width } = await sharp(buf).metadata()
  await sharp(buf).resize({ width: Math.min(width, 1800) }).webp({ quality: 88 }).toFile(`${base}-1800.webp`)
  await sharp(buf).resize({ width: Math.min(width, w ?? 800) }).webp({ quality: 86 }).toFile(`${base}-800.webp`)
  console.log(base, width)
}

// Compass: a row's name beside its actions, the middle columns cut out and marked with a dashed line
async function joinCols(src, parts, base, top = 0, h) {
  const height = h ?? (await sharp(src).metadata()).height
  const gap = 36
  const width = parts.reduce((s, p) => s + p.width, 0) + gap * (parts.length - 1)
  let left = 0
  const layers = []
  for (const [i, p] of parts.entries()) {
    layers.push({ input: await sharp(src).extract({ left: p.left, top, width: p.width, height }).toBuffer(), left, top: 0 })
    left += p.width
    if (i < parts.length - 1) {
      const dash = Buffer.from(`<svg width="${gap}" height="${height}"><line x1="${gap / 2}" y1="6" x2="${gap / 2}" y2="${height - 6}" stroke="#9aa1ab" stroke-width="2" stroke-dasharray="6 6"/></svg>`)
      layers.push({ input: dash, left, top: 0 })
      left += gap
    }
  }
  await save(sharp({ create: { width, height, channels: 3, background: '#ffffff' } }).composite(layers), base)
}

const c = 'public/work/compass'
await joinCols(`${c}/deep-toggle-1800.webp`, [{ left: 0, width: 360 }, { left: 1460, width: 340 }], `${c}/focus-toggle`)
await save(sharp(`${c}/deep-default-1800.webp`).extract({ left: 0, top: 0, width: 960, height: 86 }), `${c}/focus-default`)
// the status and action columns of the final worklist, for "one row works straight away"
await save(sharp(`${c}/detail-actions.webp`), `${c}/focus-actions`)
// No Match rows: the ingredient and its empty article beside the actions, the blank middle cut out
await joinCols(`${c}/deep-nomatch-1800.webp`, [{ left: 100, width: 620 }, { left: 1455, width: 340 }], `${c}/focus-nomatch`, 100, 320)
// the bulk bar alone: the selection count on the left, the two bulk actions on the right
await joinCols(`${c}/deep-bulkbar-1800.webp`, [{ left: 0, width: 300 }, { left: 1372, width: 418 }], `${c}/focus-bulkbar`, 64, 62)
