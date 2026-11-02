/**
 * The in-between sizes made by scripts/mid-sizes.mjs. A 440 CSS px slot on a 2x screen needs 880 px
 * and a phone at 3x needs ~1170 px; with only the small and large files both would take the large
 * one. Each returns a srcset entry plus its trailing comma, or nothing when the image is too narrow
 * to have one: put it between the small and large entries.
 */
// every `*-1800.webp` wider than 1300 px has a `*-1200.webp`
export const mid = (base: string, w: number) => (w > 1300 ? `${base}-1200.webp 1200w, ` : '')
// every PDF page `*-2000.webp` wider than 1500 px has a `*-1400.webp`
export const pdfMid = (base: string, w: number) => (w > 1500 ? `${base}-1400.webp 1400w, ` : '')
