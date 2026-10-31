import IsoRoute, { type RouteStop } from './IsoRoute'
import { U, V, along, f1, kit, type Pt } from './iso'

/** the desktop platform: a wide monitor, its screen a table of nine columns beside a filter panel */
function desktop(door: Pt) {
  const k = kit(door, 92, 30)
  k.box(26, 2, 0, 40, 24, 4)
  k.box(40, 6, 4, 12, 8, 14)
  k.box(0, 12, 18, 92, 8, 62)
  k.winL(20, 4, 22, 86, 54)
  k.winL(20, 7, 26, 14, 46, 'accent')
  for (let z = 30; z < 72; z += 8) k.line('stripe', [[25, 20, z], [86, 20, z]])
  for (let c = 0; c < 9; c++) k.line('stripe', [[25 + c * 7.6, 20, 26], [25 + c * 7.6, 20, 72]])
  return k.out
}

/** the order journey: a warehouse with five bays, one for each stage */
function warehouse(door: Pt) {
  const k = kit(door, 54, 112)
  k.box(0, 0, 0, 54, 112, 32)
  k.poly('roof', [[0, 0, 32], [0, 112, 32], [27, 112, 50], [27, 0, 50]])
  k.poly('accent', [[54, 0, 32], [54, 112, 32], [27, 112, 50], [27, 0, 50]])
  k.poly('wall', [[0, 112, 32], [54, 112, 32], [27, 112, 50]])
  for (let j = 0; j < 5; j++) {
    const y = 7 + j * 21
    k.winR(54, y, 0, 15, 20, j === 0 ? 'win win--door' : 'win')
    for (const z of [5, 10, 15]) k.line('stripe', [[54, y, z], [54, y + 15, z]])
  }
  k.winL(112, 20, 6, 14, 14)
  return k.out
}

/** the decisions: parcels stacked up, each one taped like a card that holds only what it needs */
function parcels(door: Pt) {
  const k = kit(door, 58, 58)
  k.box(0, 0, 0, 58, 58, 26)
  k.box(8, 8, 26, 42, 42, 22, 'accent')
  k.box(16, 16, 48, 26, 26, 18)
  k.line('stripe', [[58, 29, 0], [58, 29, 26]])
  k.line('stripe', [[29, 58, 0], [29, 58, 26]])
  k.line('stripe', [[50, 29, 26], [50, 29, 48]])
  k.line('stripe', [[29, 50, 26], [29, 50, 48]])
  k.line('stripe', [[16, 29, 66], [42, 29, 66]])
  k.line('stripe', [[29, 16, 66], [29, 42, 66]])
  k.winL(58, 8, 8, 14, 9, 'win win--lit')
  return k.out
}

/** onboarding: a small office with a checklist on its sign */
function checklist(door: Pt) {
  const k = kit(door, 52, 52)
  k.box(0, 0, 0, 52, 52, 36)
  k.winL(52, 20, 0, 13, 22, 'win win--door')
  k.winR(52, 10, 14, 14, 12, 'win win--lit')
  k.winR(52, 30, 14, 14, 12, 'win win--lit')
  k.line('pole', [[26, 26, 36], [26, 26, 50]])
  const [x, y] = k.at([26, 26, 76])
  k.out.push({ cls: 'roof', d: `M${x - 20} ${y - 22} H${x + 20} V${y + 22} H${x - 20}Z` })
  for (let j = 0; j < 3; j++) {
    const ry = y - 12 + j * 12
    k.out.push({ cls: j < 2 ? 'accent' : 'win', d: `M${x - 13} ${ry - 4} h8 v8 h-8Z` })
    k.out.push({ cls: 'stripe', d: `M${x - 1} ${ry} H${x + 13}` })
    if (j < 2) k.out.push({ cls: 'wave', d: `M${x - 11.5} ${ry} l2 2.5 l4 -5` })
  }
  return k.out
}

/** after launch: a kiosk whose sign is an order card with its extra lines struck out */
function trimmed(door: Pt) {
  const k = kit(door, 54, 54)
  k.box(0, 0, 0, 54, 54, 36)
  k.winL(54, 20, 0, 13, 22, 'win win--door')
  k.winR(54, 6, 4, 42, 16)
  k.poly('accent', [[54, 2, 28], [54, 52, 28], [64, 52, 21], [64, 2, 21]])
  k.line('pole', [[27, 27, 36], [27, 27, 50]])
  const [x, y] = k.at([27, 27, 80])
  k.out.push({ cls: 'roof', d: `M${x - 18} ${y - 26} H${x + 18} V${y + 26} H${x - 18}Z` })
  for (let j = 0; j < 5; j++) {
    const ly = f1(y - 17 + j * 8.5)
    const w = j % 2 ? 18 : 26
    k.out.push({ cls: 'stripe', d: `M${x - 12} ${ly} h${w}` })
    if (j > 2) k.out.push({ cls: 'wave', d: `M${x - 14} ${ly} h${w + 4}` })
  }
  return k.out
}

/** the app on Google Play: a tower shaped like a phone, with a download arrow over it */
function phone(door: Pt) {
  const k = kit(door, 22, 58)
  k.box(0, 0, 0, 22, 58, 112)
  k.winR(22, 5, 8, 48, 96, 'win')
  k.winR(22, 9, 84, 40, 14, 'accent')
  for (let z = 22; z < 80; z += 14) {
    k.winR(22, 9, z, 9, 9, 'win win--lit')
    k.line('stripe', [[22, 22, z + 6], [22, 48, z + 6]])
  }
  k.winR(22, 24, 2, 10, 3, 'accent')
  const [x, y] = k.at([11, 29, 142])
  k.out.push({ cls: 'wave', d: `M${x} ${y - 14} V${y + 6} M${x - 8} ${y - 2} L${x} ${y + 6} L${x + 8} ${y - 2} M${x - 12} ${y + 12} H${x + 12}` })
  return k.out
}

// every word here is from the Shipway case study below: the overview, the challenge, the three
// decisions, the iteration and the delivery; the download count is from the Google Play listing
const stops: RouteStop[] = [
  {
    name: 'Problem',
    sub: 'Before',
    meta: 'Shipway by Unicommerce · Through Heizen',
    title: 'A big desktop tool had to fit on a phone.',
    body: 'Shipway helps online sellers send orders through many courier companies. Everything ran on a desktop website with wide tables. Almost all of it had to work on a phone.',
    tone: 'rose',
    at: [120, 560],
    shapes: [],
  },
  {
    name: 'Map',
    sub: '5 stages',
    meta: 'Desktop-to-mobile challenge',
    title: 'I followed the order, step by step.',
    body: 'The hard part was choosing what each small screen shows first. So the app follows an order’s 5 steps: new, choose a courier, processing, pickup and tracking.',
    tone: 'sky',
    at: [280, 330],
    shapes: [],
  },
  {
    name: 'Design',
    sub: '3 decisions',
    meta: 'Three key design decisions',
    title: 'Show only what matters now.',
    body: 'Each order is a small card with only what its step needs. The 8 couriers are a simple list, not a grid. Full details are one tap away.',
    tone: 'lilac',
    at: [450, 560],
    via: 'vuv',
    shapes: [],
  },
  {
    name: 'Iterate',
    sub: 'Onboarding',
    meta: 'Iteration · Before launch',
    title: 'Made sign-up shorter.',
    body: 'My first design asked for everything at sign-up: profile, KYC documents, warehouse and sales channel. Now sign-up asks only for the account and business address. The rest became a checklist on Home.',
    tone: 'sun',
    at: [585, 330],
    shapes: [],
  },
  {
    name: 'Refine',
    sub: 'After launch',
    meta: 'Iteration · After launch',
    title: 'Cut down the order card.',
    body: 'After launch, I checked every order card again. I kept only what you need for the next step. The rest is one tap away.',
    tone: 'mint',
    at: [780, 560],
    via: 'vuv',
    shapes: [],
  },
  {
    name: 'Impact',
    sub: 'On Google Play',
    meta: 'Delivery',
    title: 'Live on Google Play.',
    body: 'Shipway’s Android app is live on Google Play. The download count is for the whole app.',
    tone: 'rose',
    at: [905, 320],
    label: 'left',
    shapes: [],
    facts: [
      { value: '10K+', label: 'Downloads on Google Play' },
      { value: '9 → 1', label: 'Desktop columns into one order card' },
      { value: '8 couriers', label: 'In one list instead of a grid' },
    ],
  },
]
const builders = [desktop, warehouse, parcels, checklist, trimmed, phone]
stops.forEach((s, k) => { s.shapes = builders[k](s.at) })

const trees: Pt[] = [[60, 450], [300, 612], [370, 290], [395, 470], [520, 290], [640, 612], [700, 430], [960, 610], [975, 420], [180, 250]]
const walkers: { at: Pt; to: Pt; t: number }[] = [
  { at: [250, 470], to: along([0, 0], U, 40), t: 7 },
  { at: [520, 470], to: along([0, 0], V, 36), t: 6 },
  { at: [690, 380], to: along([0, 0], U, 30), t: 8 },
  { at: [880, 500], to: along([0, 0], V, 40), t: 7.5 },
]

/**
 * The Shipway story before the case study: the desktop platform, the order journey, the three
 * decisions, the onboarding cut, the card revision after launch and the app on Google Play,
 * walked as a little ink town.
 */
export default function ShipwayStory() {
  return (
    <IsoRoute
      id="shipway-story"
      kicker="The story"
      title="From a desktop platform to an app in your pocket."
      stepsLabel="Steps in the Shipway story"
      stops={stops}
      trees={trees}
      walkers={walkers}
    />
  )
}
