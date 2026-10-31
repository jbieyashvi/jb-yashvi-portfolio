import IsoRoute, { type RouteStop } from './IsoRoute'
import { U, V, along, f1, kit, type Pt } from './iso'

/** the two tools the work was split across: a spreadsheet board and a second, smaller panel */
function sheets(door: Pt) {
  const k = kit(door, 70, 62)
  k.box(40, 0, 0, 28, 30, 46)
  for (const z of [14, 26]) k.winR(68, 6, z, 18, 7)
  k.box(0, 44, 0, 70, 14, 66)
  for (let x = 6; x < 64; x += 12) {
    for (let z = 8; z < 58; z += 10) k.winL(58, x, z, 10, 8, (x + z) % 5 === 0 ? 'accent' : 'win')
  }
  // a looping line between the two: the back and forth of using both
  const [a, b] = [k.at([20, 44, 70]), k.at([54, 14, 50])]
  k.out.push({ cls: 'wave', d: `M${a[0]} ${a[1]} C${a[0]} ${a[1] - 34} ${b[0]} ${b[1] - 34} ${b[0]} ${b[1]}` })
  return k.out
}

/** talking it through with the client: a small house with two speech bubbles over it */
function talk(door: Pt) {
  const k = kit(door, 48, 44)
  k.box(0, 0, 0, 48, 44, 30)
  k.poly('roof', [[0, 0, 30], [0, 44, 30], [24, 44, 50], [24, 0, 50]])
  k.poly('wall', [[0, 44, 30], [48, 44, 30], [24, 44, 50]])
  k.poly('accent', [[48, 0, 30], [48, 44, 30], [24, 44, 50], [24, 0, 50]])
  k.winL(44, 17, 0, 12, 20, 'win win--door')
  k.winR(48, 12, 12, 20, 11)
  const [x, y] = k.at([24, 22, 62])
  const bubble = (cx: number, cy: number, w: number, tail: number) =>
    `M${cx - w / 2 + 6} ${cy - 12} H${cx + w / 2 - 6} Q${cx + w / 2} ${cy - 12} ${cx + w / 2} ${cy - 6} V${cy + 2} Q${cx + w / 2} ${cy + 8} ${cx + w / 2 - 6} ${cy + 8} H${cx + tail + 6} L${cx + tail} ${cy + 15} L${cx + tail - 1} ${cy + 8} H${cx - w / 2 + 6} Q${cx - w / 2} ${cy + 8} ${cx - w / 2} ${cy + 2} V${cy - 6} Q${cx - w / 2} ${cy - 12} ${cx - w / 2 + 6} ${cy - 12}Z`
  k.out.push({ cls: 'roof', d: bubble(x - 18, y - 2, 34, 6) })
  k.out.push({ cls: 'accent', d: bubble(x + 20, y - 22, 30, -6) })
  for (const dx of [-8, 0, 8]) k.out.push({ cls: 'dot', d: `M${f1(x - 18 + dx)} ${f1(y - 4)} h0.01` })
  return k.out
}

/** four layouts tried, side by side; the table, the one that won, flies the flag */
function drafts(door: Pt) {
  const k = kit(door, 84, 84)
  k.box(0, 0, 0, 30, 30, 26)
  k.winR(30, 7, 9, 16, 9)
  k.box(54, 0, 0, 30, 30, 34)
  k.winR(84, 6, 7, 7, 20)
  k.winR(84, 17, 7, 7, 20)
  k.box(0, 54, 0, 30, 30, 18)
  k.winL(84, 7, 5, 16, 8)
  k.box(54, 54, 0, 30, 30, 44, 'accent')
  for (const z of [10, 20, 30]) k.line('stripe', [[84, 58, z], [84, 80, z]])
  k.line('pole', [[69, 69, 44], [69, 69, 72]])
  k.poly('accent flag', [[69, 69, 72], [90, 69, 65], [69, 69, 58]])
  return k.out
}

/** My Tasks: a long, low block whose roof is the worklist, rows with their buttons at the end */
function table(door: Pt) {
  const k = kit(door, 52, 128)
  k.box(0, 0, 0, 52, 128, 30)
  for (const z of [9, 18]) k.line('stripe', [[52, 6, z], [52, 122, z]])
  k.winL(128, 20, 0, 13, 20, 'win win--door')
  for (let x = 8; x < 48; x += 10) {
    k.line('stripe', [[x, 6, 30], [x, 92, 30]])
    k.poly('accent', [[x - 3, 98, 30], [x + 3, 98, 30], [x + 3, 108, 30], [x - 3, 108, 30]])
    k.poly('win', [[x - 3, 112, 30], [x + 3, 112, 30], [x + 3, 122, 30], [x - 3, 122, 30]])
  }
  return k.out
}

/** after launch: a workshop with an undo arrow and a star on its sign */
function workshop(door: Pt) {
  const k = kit(door, 54, 54)
  k.box(0, 0, 0, 54, 54, 38)
  k.winL(54, 20, 0, 13, 22, 'win win--door')
  k.winR(54, 10, 12, 14, 14, 'win win--lit')
  k.winR(54, 30, 12, 14, 14, 'win win--lit')
  k.line('pole', [[27, 27, 38], [27, 27, 52]])
  const [x, y] = k.at([27, 27, 70])
  k.out.push({ cls: 'roof', d: `M${x - 26} ${y - 14} H${x + 26} V${y + 14} H${x - 26}Z` })
  // the undo arrow, and a star beside it
  k.out.push({ cls: 'wave', d: `M${x - 6} ${y + 6} A8 8 0 1 0 ${x - 14} ${y - 2} M${x - 14} ${y - 8} V${y - 2} H${x - 8}` })
  const star = Array.from({ length: 10 }, (_, j) => {
    const r = j % 2 ? 3.4 : 8
    const a = (j / 10) * Math.PI * 2 - Math.PI / 2
    return `${f1(x + 13 + r * Math.cos(a))} ${f1(y + r * Math.sin(a))}`
  })
  k.out.push({ cls: 'accent', d: `M${star.join(' L')}Z` })
  return k.out
}

/** in use every day: a kitchen with an awning and steam from the chimney */
function kitchen(door: Pt) {
  const k = kit(door, 66, 66)
  k.box(0, 0, 0, 66, 66, 52)
  k.box(44, 10, 52, 12, 12, 24)
  for (const y of [8, 26, 44]) k.winR(66, y, 18, 13, 16, 'win win--lit')
  k.winL(66, 8, 18, 13, 16, 'win win--lit')
  k.winL(66, 30, 0, 14, 24, 'win win--door')
  k.poly('accent', [[66, 4, 40], [66, 62, 40], [76, 62, 33], [76, 4, 33]])
  for (let y = 12; y < 62; y += 9) k.line('stripe', [[66, y, 40], [76, y, 33]])
  const [x, y] = k.at([50, 16, 80])
  for (const [dx, n] of [[-4, 0], [4, 1]] as const) {
    k.out.push({ cls: `steam steam--${n}`, d: `M${f1(x + dx)} ${f1(y)} q-5 -7 0 -14 q5 -7 0 -14` })
  }
  return k.out
}

// every word here is from the Compass case study below: the brief, the approaches, the six
// decisions, what changed after launch and the outcome; nothing is measured
const stops: RouteStop[] = [
  {
    name: 'Problem',
    sub: 'Before',
    meta: 'Context · Compass Group India',
    title: 'Matching food items by hand.',
    body: 'Every ingredient in Compass’s kitchens has to be matched to the item the team actually buys. They did this by hand, in Excel and another tool. It was slow and confusing.',
    tone: 'rose',
    at: [120, 560],
    shapes: [],
  },
  {
    name: 'Understand',
    sub: 'The brief',
    meta: 'Discussions with the client',
    title: 'The AI suggests, a person decides.',
    body: 'I talked with the client to learn the task. There are hundreds of matches per site, and most are easy. So the easy ones had to be quick, and mistakes had to be easy to fix.',
    tone: 'sky',
    at: [280, 330],
    shapes: [],
  },
  {
    name: 'Explore',
    sub: '4 layouts',
    meta: 'Approaches explored',
    title: 'I tried four layouts. A table won.',
    body: 'Most of the work is easy and repeats, and a table is best for that. The hard items get extra help inside their row.',
    tone: 'lilac',
    at: [450, 560],
    via: 'vuv',
    shapes: [],
  },
  {
    name: 'Solve',
    sub: 'My Tasks',
    meta: 'Final design · Design system · Built with AI',
    title: 'One table for all the matches.',
    body: 'Each row shows what you need to decide, with Confirm and Reject buttons. You can confirm or reject many rows at once. I also built the design system and the screens myself, with AI.',
    tone: 'sun',
    at: [585, 330],
    shapes: [],
  },
  {
    name: 'Refine',
    sub: 'After launch',
    meta: 'Reported by the client’s team',
    title: 'Fixed two problems after launch.',
    body: 'The team found two problems once they used it every day. Now you can undo a wrong Confirm or Reject on the same row, and a star picks which match comes first.',
    tone: 'mint',
    at: [780, 560],
    via: 'vuv',
    shapes: [],
  },
  {
    name: 'Impact',
    sub: 'In daily use',
    meta: 'Outcome',
    title: 'Now done in one place, every day.',
    body: 'The client’s team now does this work in one table every day, instead of two tools.',
    tone: 'rose',
    at: [905, 320],
    label: 'left',
    shapes: [],
    facts: [
      { value: '2 → 1', label: 'Excel plus another tool became one table' },
      { value: 'Daily', label: 'In use by the client’s operators' },
      { value: '5 weeks', label: 'Of design, then changes after launch' },
    ],
  },
]
const builders = [sheets, talk, drafts, table, workshop, kitchen]
stops.forEach((s, k) => { s.shapes = builders[k](s.at) })

const trees: Pt[] = [[60, 450], [300, 612], [370, 290], [395, 470], [520, 290], [640, 612], [700, 430], [960, 610], [975, 420], [180, 250]]
const walkers: { at: Pt; to: Pt; t: number }[] = [
  { at: [250, 470], to: along([0, 0], U, 40), t: 7 },
  { at: [520, 470], to: along([0, 0], V, 36), t: 6 },
  { at: [690, 380], to: along([0, 0], U, 30), t: 8 },
  { at: [880, 500], to: along([0, 0], V, 40), t: 7.5 },
]

/**
 * The Compass story before the case study: the problem, how I understood it, what I explored,
 * what I made, what changed after launch and where it ended up, walked as a little ink town.
 */
export default function CompassStory() {
  return (
    <IsoRoute
      id="compass-story"
      kicker="The story"
      title="From two tools to one table."
      stepsLabel="Steps in the Compass story"
      stops={stops}
      trees={trees}
      walkers={walkers}
    />
  )
}
