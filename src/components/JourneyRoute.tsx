import IsoRoute, { type RouteStop, type Tone } from './IsoRoute'
import { U, V, along, f1, kit, type Pt } from './iso'

interface Stop {
  name: string
  /** role, dates and place, as on the résumé */
  when: string
  title: string
  body: string
  tone: Tone
  /** where the stop sits on the road, on the 1000-wide scene */
  at: Pt
  /** which side of the pin its label goes */
  label?: 'left' | 'right'
  /** the start of the name, which is all the pin shows on a small screen */
  short?: string
  /** how the road into this stop runs: along u, then v, then u again (or the other way round) */
  via?: 'uvu' | 'vuv'
  links?: { slug: string; name: string }[]
}

// every fact here is from the résumé (scripts/resume.py) and My journey (src/data/journey.ts);
// the places are as Yashvi gave them: MNIT, Urban Culture and Sneaco in Jaipur, POLO remote,
// Heizen in Hyderabad
const stops: Stop[] = [
  {
    name: 'MNIT Jaipur',
    when: 'B.Arch · Graduated 2025 · Jaipur',
    title: 'It started with architecture.',
    body: 'I studied architecture (B.Arch) at Malaviya National Institute of Technology Jaipur, and moved into product design along the way.',
    tone: 'sun',
    at: [120, 560],
  },
  {
    name: 'POLO',
    when: 'Product Design Intern · Remote · Oct – Dec 2023',
    title: 'My first product design role.',
    body: 'Supported the Senior Product Designer with high-fidelity UI screens and interactive prototypes.',
    tone: 'sky',
    at: [280, 330],
  },
  {
    name: 'Urban Culture',
    when: 'UI/UX Design Intern · May – Jul 2024 · Jaipur',
    title: 'Admin panels, made easier to use.',
    body: 'Refined admin-panel experiences with a focus on usability, information hierarchy and visual consistency.',
    tone: 'rose',
    at: [450, 560],
    via: 'vuv',
  },
  {
    name: 'Sneaco',
    when: 'Founding Product Designer · Part-time · Oct 2024 – Mar 2025 · Jaipur',
    title: 'Designing from the very start.',
    body: 'Interviewed hostel students and adults about laundry routines, spending and service needs to inform a one-day laundry and ironing service, then defined the first visual language and UI patterns.',
    tone: 'lilac',
    at: [585, 330],
  },
  {
    name: 'Heizen',
    when: 'Product Designer · From May 2025 · Hyderabad',
    title: 'Client products, end to end.',
    body: 'Owned web and mobile product design for clients, from business requirements and user flows to high-fidelity UI and developer-ready designs.',
    tone: 'mint',
    at: [780, 560],
    via: 'vuv',
    links: [
      { slug: 'compass', name: 'Compass Group' },
      { slug: 'shipway', name: 'Shipway' },
      { slug: 'nutrio', name: 'Nutrio' },
    ],
  },
  {
    name: 'Senior at Heizen',
    short: 'Senior',
    when: 'Senior Product Designer · May 2026 – Oct 2026 · Hyderabad',
    title: 'Promoted to Senior Product Designer.',
    body: 'Promoted in May 2026. Guided client design reviews with alternatives and trade-offs, and used AI-assisted prototypes in client reviews and engineering discussions.',
    tone: 'sun',
    at: [905, 320],
    label: 'left',
  },
]

/** MNIT: a long school block with arched windows, a pediment and a clock tower */
function school(door: Pt) {
  const k = kit(door, 56, 120)
  k.box(0, 0, 0, 56, 120, 40)
  for (let j = 0; j < 7; j++) k.winR(56, 8 + j * 15.5, 10, 8, 18)
  k.winL(120, 8, 10, 8, 18)
  k.winL(120, 40, 10, 8, 18)
  k.winL(120, 22, 0, 12, 22, 'win win--door')
  k.poly('accent', [[4, 120, 40], [52, 120, 40], [28, 120, 56]])
  k.box(18, 46, 40, 20, 24, 30)
  k.winR(38, 52, 52, 12, 12, 'win win--clock')
  k.poly('roof', [[18, 70, 70], [38, 70, 70], [28, 58, 90]])
  k.poly('accent', [[38, 46, 70], [38, 70, 70], [28, 58, 90]])
  return k.out
}

/** POLO: a small house, the desk at home, with wifi waves over the roof */
function home(door: Pt) {
  const k = kit(door, 50, 46)
  k.box(0, 0, 0, 50, 46, 32)
  k.poly('roof', [[0, 0, 32], [0, 46, 32], [25, 46, 54], [25, 0, 54]])
  k.poly('wall', [[0, 46, 32], [50, 46, 32], [25, 46, 54]])
  k.poly('accent', [[50, 0, 32], [50, 46, 32], [25, 46, 54], [25, 0, 54]])
  k.winL(46, 18, 0, 12, 20, 'win win--door')
  k.winR(50, 12, 12, 14, 12)
  k.winR(50, 30, 12, 8, 12)
  const [x, y] = k.at([25, 23, 66])
  k.out.push({ cls: 'wave', d: `M${x - 6} ${y} q6 -6 12 0 M${x - 12} ${y - 5} q12 -11 24 0 M${x - 18} ${y - 10} q18 -16 36 0` })
  return k.out
}

/** Urban Culture: a two-storey shop with a striped awning */
function shop(door: Pt) {
  const k = kit(door, 60, 78)
  k.box(0, 0, 0, 60, 78, 58)
  for (const y of [10, 32, 54]) k.winR(60, y, 36, 13, 14)
  for (const x of [10, 36]) k.winL(78, x, 36, 13, 14)
  k.winR(60, 8, 4, 62, 20)
  k.winL(78, 22, 0, 14, 24, 'win win--door')
  k.poly('accent', [[60, 4, 30], [60, 74, 30], [72, 74, 22], [72, 4, 22]])
  for (let y = 14; y < 74; y += 10) k.line('stripe', [[60, y, 30], [72, y, 22]])
  return k.out
}

/** Sneaco: a laundry with round machine windows and a washing line */
function laundry(door: Pt) {
  const k = kit(door, 60, 64)
  k.box(0, 0, 0, 60, 64, 40)
  for (const y of [14, 32, 50]) {
    k.ringR(60, y, 17, 7.5, 'win')
    k.ringR(60, y, 17, 4, 'accent')
  }
  k.winL(64, 20, 0, 14, 24, 'win win--door')
  k.poly('accent', [[10, 64, 44], [50, 64, 44], [50, 64, 54], [10, 64, 54]])
  k.line('pole', [[86, 6, 0], [86, 6, 34]])
  k.line('pole', [[86, 60, 0], [86, 60, 34]])
  const [a, b] = [k.at([86, 6, 34]), k.at([86, 60, 34])]
  k.out.push({ cls: 'pole', d: `M${a[0]} ${a[1]} Q${f1((a[0] + b[0]) / 2)} ${f1((a[1] + b[1]) / 2 + 8)} ${b[0]} ${b[1]}` })
  for (const [y, cls] of [[18, 'accent'], [33, 'cloth'], [47, 'accent']] as const) {
    const s = y > 25 && y < 40 ? 3 : 2
    k.poly(cls, [[86, y - 5, 32 - s], [86, y + 5, 32 - s], [86, y + 4, 22 - s], [86, y - 4, 22 - s]])
  }
  return k.out
}

/** Heizen: an office block with a grid of windows */
function office(door: Pt) {
  const k = kit(door, 66, 66)
  k.box(0, 0, 0, 66, 66, 84)
  for (const z of [24, 42, 60]) {
    for (const y of [8, 23, 38, 53]) k.winR(66, y, z, 8, 10, 'win win--lit')
    for (const x of [8, 23, 38, 53]) k.winL(66, x, z, 8, 10, 'win win--lit')
  }
  k.winL(66, 24, 0, 16, 16, 'win win--door')
  k.winR(66, 10, 4, 46, 12)
  k.box(12, 12, 84, 18, 14, 8)
  return k.out
}

/** Senior at Heizen: a taller tower with a flag on top */
function tower(door: Pt) {
  const k = kit(door, 46, 46)
  k.box(0, 0, 0, 46, 46, 150)
  for (let z = 22; z < 140; z += 16) {
    for (const y of [8, 20, 32]) k.winR(46, y, z, 6, 9, 'win win--lit')
    for (const x of [8, 20, 32]) k.winL(46, x, z, 6, 9, 'win win--lit')
  }
  k.winL(46, 16, 0, 14, 16, 'win win--door')
  k.line('pole', [[23, 23, 150], [23, 23, 182]])
  k.poly('accent flag', [[23, 23, 182], [44, 23, 175], [23, 23, 168]])
  return k.out
}

const builders = [school, home, shop, laundry, office, tower]
const route: RouteStop[] = stops.map((s, k) => ({
  ...s,
  meta: s.when,
  sub: s.when.split(' · ').find((w) => /\d{4}/.test(w)) ?? '',
  shapes: builders[k](s.at),
}))

// a few trees and people around the scene, just for life
const trees: Pt[] = [[60, 450], [300, 612], [350, 280], [395, 470], [520, 290], [640, 612], [700, 430], [960, 610], [975, 420], [180, 250]]
const walkers: { at: Pt; to: Pt; t: number }[] = [
  { at: [250, 470], to: along([0, 0], U, 40), t: 7 },
  { at: [520, 470], to: along([0, 0], V, 36), t: 6 },
  { at: [690, 380], to: along([0, 0], U, 30), t: 8 },
  { at: [880, 500], to: along([0, 0], V, 40), t: 7.5 },
  { at: [140, 380], to: along([0, 0], U, 28), t: 6.5 },
]

/**
 * The route: where I started and every stop since, as a little isometric town drawn in ink.
 * Each stop is a building: the school, a home desk, a shop, a laundry, an office and a tower.
 */
export default function JourneyRoute() {
  return (
    <IsoRoute
      id="route"
      kicker="The route"
      title="From architecture school to product design."
      stepsLabel="Stops on the route"
      stops={route}
      trees={trees}
      walkers={walkers}
    />
  )
}
