import IsoRoute, { type RouteStop } from './IsoRoute'
import { U, V, along, kit, type Pt } from './iso'

/** a letter on a sign: the A and B of the two versions */
const letter = {
  A: (x: number, y: number) => `M${x - 6} ${y + 7} L${x} ${y - 7} L${x + 6} ${y + 7} M${x - 3.5} ${y + 2} H${x + 3.5}`,
  B: (x: number, y: number) =>
    `M${x - 5} ${y - 7} V${y + 7} H${x + 1} Q${x + 6} ${y + 7} ${x + 6} ${y + 3} Q${x + 6} ${y} ${x + 1} ${y} H${x - 5} M${x - 5} ${y - 7} H${x} Q${x + 5} ${y - 7} ${x + 5} ${y - 3.5} Q${x + 5} ${y} ${x} ${y}`,
}

/** a sign on a pole over the roof, with something drawn on it */
function sign(k: ReturnType<typeof kit>, top: [number, number, number], d: (x: number, y: number) => string) {
  const [cx, cy, z] = top
  k.line('pole', [[cx, cy, z], [cx, cy, z + 14]])
  const [x, y] = k.at([cx, cy, z + 30])
  k.out.push({ cls: 'roof', d: `M${x - 14} ${y - 14} H${x + 14} V${y + 14} H${x - 14}Z` })
  k.out.push({ cls: 'wave', d: d(x, y) })
}

/** the shared project: a building shaped like a folder, its files as windows, one of them File A */
function folder(door: Pt) {
  const k = kit(door, 70, 56)
  k.box(0, 0, 0, 70, 56, 40)
  k.box(0, 0, 40, 30, 22, 7)
  for (let j = 0; j < 4; j++) k.winL(56, 7 + j * 15, 8, 10, 22, j === 2 ? 'accent' : 'win')
  for (const y of [10, 32]) k.winR(70, y, 14, 14, 14, 'win win--lit')
  return k.out
}

/** talking to three people: a small house with three lit windows and a magnifying glass */
function lens(door: Pt) {
  const k = kit(door, 50, 46)
  k.box(0, 0, 0, 50, 46, 30)
  k.poly('roof', [[0, 0, 30], [0, 46, 30], [25, 46, 50], [25, 0, 50]])
  k.poly('wall', [[0, 46, 30], [50, 46, 30], [25, 46, 50]])
  k.poly('accent', [[50, 0, 30], [50, 46, 30], [25, 46, 50], [25, 0, 50]])
  k.winL(46, 18, 0, 12, 20, 'win win--door')
  for (const y of [6, 19, 32]) k.winR(50, y, 12, 9, 10, 'win win--lit')
  const [x, y] = k.at([25, 23, 80])
  k.out.push({ cls: 'wave', d: `M${x + 11} ${y + 11} L${x + 24} ${y + 24}` })
  k.out.push({ cls: 'roof', d: `M${x + 16} ${y} A16 16 0 1 0 ${x - 16} ${y} A16 16 0 1 0 ${x + 16} ${y}Z` })
  k.out.push({ cls: 'accent', d: `M${x + 9} ${y} A9 9 0 1 0 ${x - 9} ${y} A9 9 0 1 0 ${x + 9} ${y}Z` })
  return k.out
}

/** the problem got smaller: a building that steps in at each floor */
function steps(door: Pt) {
  const k = kit(door, 72, 72)
  k.box(0, 0, 0, 72, 72, 22)
  k.box(13, 13, 22, 46, 46, 20)
  k.box(25, 25, 42, 22, 22, 20, 'accent')
  k.winL(72, 30, 0, 13, 18, 'win win--door')
  for (const y of [10, 30, 50]) k.winR(72, y, 6, 10, 10)
  k.winR(59, 28, 28, 16, 8, 'win win--lit')
  return k.out
}

/** Version A: the folder and the people on two separate screens, so two separate buildings */
function versionA(door: Pt) {
  const k = kit(door, 32, 80)
  k.box(0, 0, 0, 32, 30, 30)
  k.box(0, 50, 0, 32, 30, 30)
  k.winR(32, 8, 8, 14, 12)
  k.winR(32, 58, 8, 14, 12)
  k.winL(80, 10, 0, 12, 18, 'win win--door')
  k.line('stripe', [[16, 30, 0], [16, 50, 0]])
  sign(k, [16, 15, 30], letter.A)
  return k.out
}

/** Version B: both choices on one screen, so one building with a tick over the door */
function versionB(door: Pt) {
  const k = kit(door, 58, 58)
  k.box(0, 0, 0, 58, 58, 34)
  k.winL(58, 22, 0, 13, 22, 'win win--door')
  k.winR(58, 8, 12, 18, 14, 'win win--lit')
  k.winR(58, 32, 12, 18, 14, 'win win--lit')
  k.poly('accent', [[58, 4, 30], [58, 54, 30], [66, 54, 24], [66, 4, 24]])
  sign(k, [29, 29, 34], letter.B)
  return k.out
}

/** the private files: a vault with a padlock over it */
function vault(door: Pt) {
  const k = kit(door, 52, 52)
  k.box(0, 0, 0, 52, 52, 66)
  k.winL(52, 18, 0, 16, 22, 'accent')
  for (const z of [30, 46]) {
    k.winR(52, 10, z, 12, 9, 'win win--lit')
    k.winR(52, 30, z, 12, 9, 'win win--lit')
  }
  k.box(16, 16, 66, 20, 20, 6)
  const [x, y] = k.at([26, 26, 98])
  k.out.push({ cls: 'wave', d: `M${x - 7} ${y} v-6 a7 7 0 0 1 14 0 v6` })
  k.out.push({ cls: 'accent', d: `M${x - 12} ${y} h24 v18 h-24Z` })
  k.out.push({ cls: 'dot', d: `M${x} ${y + 8} h0.01` })
  return k.out
}

// every fact here is from the Google Drive study below: the problem, the research, the narrowed
// focus, Version A, what testing changed and the outcome; nothing is measured
const stops: RouteStop[] = [
  {
    name: 'Problem',
    sub: 'Before',
    meta: 'Independent study · Not affiliated with Google',
    title: 'Hide one file. Keep the rest shared.',
    body: 'A team shares a project folder in Google Drive. The owner wants to hide one file from one person, Alex, but keep everything else shared with them. People didn’t know how to do this.',
    tone: 'rose',
    at: [120, 560],
    shapes: [],
  },
  {
    name: 'Research',
    sub: '3 people',
    meta: 'Interviews and Drive walkthroughs',
    title: 'I watched 3 people try it.',
    body: 'They weren’t sure what to do next. One way people got around it was moving the file to another folder. That works, but choosing the folder and who can open it was the hard part.',
    tone: 'sky',
    at: [280, 330],
    shapes: [],
  },
  {
    name: 'Focus',
    sub: 'A smaller problem',
    meta: 'How my focus changed',
    title: 'Drive could already do it. It was hard to find.',
    body: 'I started out wanting to redesign how you remove people. Then I learned Drive already has private folders with limited access. So I made that easier to find, starting from the file’s share button.',
    tone: 'lilac',
    at: [450, 560],
    via: 'vuv',
    shapes: [],
  },
  {
    name: 'Design',
    sub: 'Version A',
    meta: 'My first version',
    title: 'A step-by-step flow.',
    body: 'You click Remove access next to Alex. It asks what you mean, then asks for the folder and the people on two screens. You see who keeps access before anything is saved.',
    tone: 'sun',
    at: [585, 330],
    shapes: [],
  },
  {
    name: 'Test',
    sub: 'Version B',
    meta: 'Testing and iteration',
    title: 'Testing made it shorter.',
    body: 'One person said Version A had too many clicks. So in Version B, Restrict access is its own option in the menu, and the folder and the people are on one screen.',
    tone: 'mint',
    at: [780, 560],
    via: 'vuv',
    shapes: [],
  },
  {
    name: 'Outcome',
    sub: 'Prototype',
    meta: 'Working prototype',
    title: 'Alex loses one file. Nothing else changes.',
    body: 'Alex loses File A and keeps the rest of the project. Later, you can share File A again without opening the folder. Results were mixed: one person finished alone, one needed help, one got there in time.',
    tone: 'rose',
    at: [905, 320],
    label: 'left',
    shapes: [],
    facts: [
      { value: '3 people', label: 'Interviewed and tested' },
      { value: 'A → B', label: 'A second version, from testing' },
      { value: '2 → 1', label: 'Screens to choose folder and people' },
    ],
  },
]
const builders = [folder, lens, steps, versionA, versionB, vault]
stops.forEach((s, k) => { s.shapes = builders[k](s.at) })

const trees: Pt[] = [[60, 450], [300, 612], [370, 290], [395, 470], [520, 290], [640, 612], [700, 430], [960, 610], [975, 420], [180, 250]]
const walkers: { at: Pt; to: Pt; t: number }[] = [
  { at: [250, 470], to: along([0, 0], U, 40), t: 7 },
  { at: [520, 470], to: along([0, 0], V, 36), t: 6 },
  { at: [690, 380], to: along([0, 0], U, 30), t: 8 },
  { at: [880, 500], to: along([0, 0], V, 40), t: 7.5 },
]

/**
 * The Google Drive story before the case study: the shared folder, the three people I watched,
 * the smaller problem, the two versions and the private file, walked as a little ink town.
 */
export default function DriveStory() {
  return (
    <IsoRoute
      id="drive-story"
      kicker="The story"
      title="From one shared folder to one private file."
      stepsLabel="Steps in the Google Drive story"
      stops={stops}
      trees={trees}
      walkers={walkers}
    />
  )
}
