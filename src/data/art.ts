import type { ImageItem } from './images'

export type ArtKind = 'art' | 'studio' | 'personal'

export interface ArtItem extends ImageItem {
  kind: ArtKind
}

/** Gallery chapters, in page order: filter names, chapter headings and their introductions */
export const artKinds: { kind: ArtKind; label: string; intro: string }[] = [
  { kind: 'art', label: 'Art', intro: 'Paintings, sketchbook pages and digital drawings.' },
  { kind: 'studio', label: 'Studio', intro: 'The desk, walls and corners where the drawing happens.' },
  { kind: 'personal', label: 'Personal', intro: 'Places and quiet moments away from the screen.' },
]

/*
 * Outside the brief: Jb's art, studio and personal photos, kept apart from Ideas in
 * motion (UI and logo work). Captions describe only what is visible: no invented titles,
 * materials, places or dates, and personal photos are never credited as "photography by" Jb.
 * Files are optimised copies in public/gallery; a few screenshots are cropped to drop
 * interface chrome (a "1/2" counter, a "•••" menu, a scrollbar, white side bars) without
 * touching the artwork. Every piece is shown in its original colour.
 */
const items: (Omit<ArtItem, 'label' | 'src'> & { file: string })[] = [
  // Art
  {
    kind: 'art', slug: 'earth', file: 'earth-painting', w: 1170, h: 1323,
    caption: 'Earth painting',
    alt: 'A painting of Earth against a starry black sky, on a white tray beside a plant pot and a pen',
  },
  {
    kind: 'art', slug: 'galaxy', file: 'galaxy-painting', w: 1170, h: 1144,
    caption: 'Galaxy painting',
    alt: 'A painting of a spiral galaxy with a glowing orange and yellow core on a starry black background, on a green cutting mat',
  },
  {
    kind: 'art', slug: 'faces', file: 'three-face-sketch', w: 1140, h: 1168,
    caption: 'Three-face sketch',
    alt: 'A sketch of three stylised faces on a spiral sketchbook page, with leaf shadows falling across it',
  },
  {
    kind: 'art', slug: 'skulls', file: 'skull-sketch', w: 1140, h: 1447,
    caption: 'Skull sketch',
    alt: 'A sketch of three stacked skulls with heavy hatched shading, in a spiral sketchbook',
  },
  {
    kind: 'art', slug: 'portrait', file: 'digital-portrait-on-tablet', w: 1166, h: 1800,
    caption: 'Digital portrait illustration',
    alt: 'A digital illustration of a face in swirling blue and cream shapes with dark curly hair, on a tablet screen in a dark room',
  },
  {
    kind: 'art', slug: 'seated-figure', file: 'seated-figure-illustration', w: 882, h: 1192,
    caption: 'Seated figure illustration',
    alt: 'A digital illustration on a tablet of a seated figure in a striped jacket and patterned blue jeans, hugging their knees and holding a small creature to their face, with scattered yellow dots around them',
  },
  {
    kind: 'art', slug: 'face-drawing', file: 'face-drawing-on-tablet', w: 620, h: 1194,
    caption: 'Face drawing on a tablet',
    alt: 'A line drawing of a face with blue glasses and blue accents on a tablet screen, in a room lit red',
  },
  {
    kind: 'art', slug: 'skull-pencil', file: 'skull-and-pencil-sketch', w: 884, h: 1200,
    caption: 'Skull sketch with pencil',
    alt: 'An ink sketch of a skull with a jagged break across it, in a spiral sketchbook with a pencil resting on the page, signed and dated below',
  },
  {
    kind: 'art', slug: 'bearded-figure', file: 'bearded-figure-sketch', w: 888, h: 1198,
    caption: 'Bearded figure sketch',
    alt: 'A loose digital sketch of a bearded figure in profile over blue and yellow zigzag strokes, on a tablet against a red background',
  },
  // Studio
  {
    kind: 'studio', slug: 'studio-corner', file: 'studio-corner', w: 1170, h: 1512,
    caption: 'Studio corner',
    alt: 'A desk with a laptop beneath a wall of pinned sketches and space paintings, beside a blue curtain and a string of lights',
  },
  {
    kind: 'studio', slug: 'red-wall', file: 'studio-wall-red-light', w: 1170, h: 1648,
    caption: 'Studio wall in red light',
    alt: 'A wall of pinned drawings and a mirror outlined with string lights, all lit red',
  },
  {
    kind: 'studio', slug: 'rocket', file: 'rocket-sketch-and-desk', w: 1133, h: 1800,
    caption: 'Rocket sketch and desk at night',
    alt: 'A photo of a sketchbook page with a rocket drawing, set as an inset over a desk by a window in warm lamp light',
  },
  {
    kind: 'studio', slug: 'study', file: 'sketchbook-study-and-pastels', w: 1138, h: 1800,
    caption: 'Sketchbook study',
    alt: 'A sketchbook portrait study in blue and brown beside a box of oil pastels, a grid notebook and sticky notes under a lamp',
  },
  {
    kind: 'studio', slug: 'toys', file: 'toy-collection-windowsill', w: 1157, h: 1800,
    caption: 'Toy collection on a windowsill',
    alt: 'Small collectible toy figures lined up on a white windowsill, with the overlaid text “Kinders >> butterflies”',
  },
  // Personal moments
  {
    kind: 'personal', slug: 'roof', file: 'lattice-roof', w: 1350, h: 1800,
    caption: 'Lattice roof',
    alt: 'A steel lattice roof hung with dark perforated panels, over a tiled courtyard with people walking below',
  },
  {
    kind: 'personal', slug: 'cliff', file: 'cliff-above-the-sea', w: 1350, h: 1800,
    caption: 'Above the sea',
    alt: 'Jb Yashvi sitting on a rocky cliff edge, seen from behind, looking out over the sea',
  },
  {
    kind: 'personal', slug: 'window', file: 'working-by-the-window', w: 1800, h: 1350,
    caption: 'Working by the window',
    alt: 'Jb Yashvi working on a laptop at a window desk, with forested hills outside',
  },
  {
    kind: 'personal', slug: 'swing', file: 'red-ball-swing', w: 1350, h: 1800,
    caption: 'On a ball swing',
    alt: 'Jb Yashvi sitting on a ball swing hanging from a chain, head bowed, in a courtyard',
  },
  {
    kind: 'personal', slug: 'sunset', file: 'beach-sunset', w: 1800, h: 1350,
    caption: 'Sunset at the beach',
    alt: 'Legs stretched out on a beach towards the sea at sunset, with a cap resting in the lap',
  },
  {
    kind: 'personal', slug: 'shoreline', file: 'shoreline-under-clouds', w: 1350, h: 1800,
    caption: 'Shoreline under clouds',
    alt: 'Jb Yashvi standing barefoot at the water’s edge under a cloudy sky',
  },
  {
    kind: 'personal', slug: 'water', file: 'beside-the-water', w: 1350, h: 1800,
    caption: 'Beside the water',
    alt: 'Jb Yashvi sitting on the grass beside the water, with palm trees and houses on the far bank',
  },
]

const LABEL = Object.fromEntries(artKinds.map((k) => [k.kind, k.label])) as Record<ArtKind, string>

export const art: ArtItem[] = items.map(({ file, ...i }) => ({ ...i, src: `/gallery/${file}`, label: LABEL[i.kind] }))

/** Home page teaser: one piece from each gallery chapter, the first shown largest */
export const artPreview = ['earth', 'studio-corner', 'sunset'].map((slug) => art.find((i) => i.slug === slug)!)
