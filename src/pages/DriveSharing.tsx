import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import External from '../components/External'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import type { ImageItem } from '../data/images'

const PROTO = 'https://jbieyashvi.github.io/drive-sharing-study-prototype/'
const DIR = '/work/drive-sharing'
const FROM_PROTO = 'My study prototype, a proposed design. Not how Google Drive looks today.'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The problem' },
  { id: 'research', label: 'Research & insights' },
  { id: 'direction', label: 'Design direction' },
  { id: 'ab', label: 'A vs B' },
  { id: 'solution', label: 'Proposed solution' },
  { id: 'restore', label: 'Restore access' },
  { id: 'testing', label: 'Testing & iteration' },
  { id: 'outcome', label: 'Outcome' },
  { id: 'reflection', label: 'Reflection' },
]

/** Every prototype screen the enlarged view steps through, in reading order */
const shots = {
  'overview-share-dialog': {
    w: 1800,
    h: 1125,
    caption: 'File A’s share dialog in the prototype',
    alt: 'Prototype of a Drive-style file list for Client Project with the Share “File A.png” dialog open. You is Owner; Maya is Editor, Ravi is Viewer and Alex is Editor, each with “Access from Client Project”.',
  },
  'a-choose-scope': {
    w: 1312,
    h: 816,
    caption: 'Version A: choosing what Remove access should mean',
    alt: 'Version A dialog “Change Alex’s access”: “Alex has access to this file through Client Project.” Two options: Remove access to the project, or Keep project access, restrict this file.',
  },
  'a-destination': {
    w: 1312,
    h: 1104,
    caption: 'Version A: choosing the folder for File A',
    alt: 'Version A dialog “Choose a folder for File A”: Use an existing limited-access folder, or Create a new limited-access folder (selected), named Private files, in Client Project. A note says no files have been moved or permissions changed yet. Back and Continue buttons.',
  },
  'a-people': {
    w: 1312,
    h: 1306,
    caption: 'Version A: choosing who keeps access, on a separate screen',
    alt: 'Version A dialog “Who can open File A?”: choose who should keep access after this file moves. You, Owner, always keeps access; Maya, Editor, and Ravi, Viewer, are checked and keep access; Alex, Editor, is unchecked and will lose access to File A after confirmation. A note says no files moved or permissions changed yet. Back and Review changes buttons.',
  },
  'b-role-menu': {
    w: 1312,
    h: 1460,
    caption: 'Version B: Restrict access to this file, in Alex’s role menu',
    alt: 'Version B share dialog for File A with Alex’s role menu open: Viewer and Commenter marked not available in this prototype, Editor checked, then a separate group with “Restrict access to this file…” and “Remove access…”.',
  },
  'b-restrict-setup': {
    w: 1312,
    h: 1508,
    caption: 'Choose the folder and who keeps access, on one screen',
    alt: 'Dialog “Restrict access to File A”. A summary: Alex will lose access to File A; Maya and Ravi will keep access; access to the rest of Client Project stays unchanged. Then “Move File A.png into a new limited-access folder” inside Client Project, named Private files, and “Who keeps access” with You always, Maya and Ravi checked, and Alex unchecked: will lose access to File A after confirmation. Footer: No changes applied yet, Review changes.',
  },
  'b-review': {
    w: 1632,
    h: 1618,
    caption: 'Review: access before and after, per person',
    alt: 'Dialog “Review access changes”: File A.png moves from Client Project to Client Project / Private files. A table of File A before, after and rest of project: You Owner, Maya Editor and Ravi Viewer unchanged; Alex Editor before, No access after, Editor on the rest of the project. A list of what will happen, “Nothing has changed yet”, and a Move file and update access button.',
  },
  'b-result': {
    w: 1312,
    h: 1354,
    caption: 'Result: what was done, and who can open File A now',
    alt: 'Dialog “File moved and access updated”: created the folder Private files inside Client Project, shared it with Maya (Editor) and Ravi (Viewer), moved File A.png into it. Who can open File A.png: You Owner, Maya Editor, Ravi Viewer, Alex No access. “Alex can’t open File A.png. Access to Client Project was not changed.”',
  },
  'b-project-after': {
    w: 1800,
    h: 1125,
    caption: 'Client Project afterwards: a Private files folder with limited access',
    alt: 'Prototype file list for Client Project after the change: a Private files folder marked Limited access, then File B.png, Final presentation.pptx, Meeting notes.docx, Project brief.pdf and Timeline.xlsx.',
  },
  'b-restricted-share': {
    w: 1312,
    h: 1394,
    caption: 'Sharing File A, now inside Private files',
    alt: 'Share dialog for File A inside Private files with a note: this file is in Private files, a folder with limited access; sharing on Client Project doesn’t apply to it. Maya and Ravi have access from Private files.',
  },
  'b-reshare-add': {
    w: 1312,
    h: 874,
    caption: 'Adding Alex to File A as Viewer',
    alt: 'Share “File A.png” dialog: “This shares File A only. It does not share the Private files folder.” Alex is added with role Viewer, and a note: Alex will be able to open File A from its link as Viewer, but still won’t be able to open the Private files folder. Continue button.',
  },
  'b-reshare-review': {
    w: 1312,
    h: 1672,
    caption: 'Reviewing the scope before sharing',
    alt: 'Dialog “Review sharing for File A”: Alex’s access before and after. File A.png from No access to Viewer; Private files folder No access, unchanged; Client Project, File B.png and the other four files Editor, unchanged. You, Maya and Ravi keep their current access. Share File A button.',
  },
  'b-reshare-result': {
    w: 1312,
    h: 628,
    caption: 'File A shared with Alex, folder unchanged',
    alt: 'Dialog “File A shared with Alex”: Alex can open File A as Viewer. Access to the Private files folder was not changed. Copy file link and Done buttons.',
  },
} satisfies Record<string, { w: number; h: number; caption: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]

const FROM_NOTEBOOK = 'My own notebook from while I was exploring. Not participant data, and not proof of how Drive works.'

/** Notebook photos: shown inline with empty margins trimmed; the enlarged view is the whole page */
const notes = {
  'nb-sharing-notes': {
    w: 1800,
    h: 2446,
    caption: 'Notebook: walking through Drive’s sharing settings',
    alt: 'Handwritten notebook page. Google Drive: folder, Share, then 1 Add people and 2 General access, Restricted or Anyone with the link. Settings, Access: 1 Allow editors to change permissions and share, 2 Limit access to ‘Client project – Practice’. Individual folder and file access: three dots, Share. Then: “Folder is shared. Now I want to remove an external member.” Highlighted notes: Actions tried, the Share button. What happened (written in Hindi): who I can share with and give permission to edit, view or comment. Confusion: after sharing I was confused about where to remove the external candidate, but found that clicking the icons let me edit that as well and remove the person.',
  },
  'nb-offboarding-flow': {
    w: 1800,
    h: 2442,
    caption: 'Notebook: an early offboarding flow',
    alt: 'Handwritten flow diagram in a notebook. Person leaves, because of a switch in their job role. Then Search and filter: find where that person is involved in the particular folder. Then a box written in Hindi, “change it yourself”, with the note that someone who isn’t the owner can’t change it themselves, and bulk actions are hard to find too. Then Removal request, with two question marks. Then Complete, with two question marks.',
  },
  'nb-folder-sketch': {
    w: 1800,
    h: 1420,
    caption: 'Notebook: sketch of choosing a folder for File A',
    alt: 'Hand-drawn wireframe in a notebook: a dialog titled “Choose a folder for File A”. One option, “Use an existing limited a…”, sits above a short scrolling list of folders; the other, “Create a new limited access f…”, has a Name field. Back and Next buttons at the bottom.',
  },
} satisfies Record<string, { w: number; h: number; caption: string; alt: string }>

type Note = keyof typeof notes
const noteOrder = Object.keys(notes) as Note[]

const items: ImageItem[] = [
  ...order.map((slug) => ({ slug, src: `${DIR}/${slug}`, ...shots[slug], label: FROM_PROTO })),
  // the uncropped page, 1800 × 2400
  ...noteOrder.map((slug) => ({ slug, src: `${DIR}/${slug}-full`, ...notes[slug], w: 1800, h: 2400, label: FROM_NOTEBOOK })),
]

/** A crop shown inline in place of a full screen; enlarging it opens the full screen */
const crops = {
  'a-choose-scope-detail': {
    of: 'a-choose-scope',
    w: 1312,
    h: 556,
    alt: 'Detail of Version A’s dialog “Change Alex’s access”: Alex has access to this file through Client Project. Two options: Remove access to the project, or Keep project access, restrict this file.',
  },
  'b-role-menu-detail': {
    of: 'b-role-menu',
    w: 1312,
    h: 625,
    alt: 'Detail of Version B’s share dialog: Alex’s role menu is open below Editor. Viewer and Commenter are marked not available in this prototype, Editor is checked, and below a divider are “Restrict access to this file…” and “Remove access…”.',
  },
} satisfies Record<string, { of: Shot; w: number; h: number; alt: string }>

interface Mark { n: number; x: number; y: number }

/** A prototype screen that opens the enlarged view. Numbered marks sit over it as a separate
 *  layer; the screenshot itself is only cropped. */
function Screen({ slug, open, marks = [], size = 'md', sizes = '(max-width: 760px) 100vw, 520px', eager }: {
  slug: Shot | keyof typeof crops
  open: (i: number) => void
  marks?: Mark[]
  /** caps the width, so tall screens stay a readable height */
  size?: 'sm' | 'md' | 'full'
  sizes?: string
  eager?: boolean
}) {
  const crop = slug in crops ? crops[slug as keyof typeof crops] : null
  const target = crop ? crop.of : (slug as Shot)
  const item = items[order.indexOf(target)]
  const src = `${DIR}/${slug}`
  const w = crop?.w ?? item.w
  const h = crop?.h ?? item.h
  return (
    <div className={`dv-screen dv-screen--${size}`}>
      <button type="button" className="dv-screen__zoom" onClick={() => open(order.indexOf(target))} aria-label={`Enlarge: ${item.caption}`}>
        <img
          src={`${src}-1800.webp`}
          srcSet={`${src}-800.webp 800w, ${src}-1800.webp ${w}w`}
          sizes={sizes}
          width={w}
          height={h}
          alt={crop?.alt ?? item.alt}
          loading={eager ? 'eager' : 'lazy'}
          ref={eager ? undefined : loadAhead}
          decoding="async"
        />
      </button>
      {marks.map((m) => (
        <span key={m.n} className="dv-mark" style={{ left: `${m.x}%`, top: `${m.y}%` }} aria-hidden="true">
          {m.n}
        </span>
      ))}
    </div>
  )
}

/** A notebook photo on a plain paper mount, with a small label; it opens the whole page */
function Notebook({ slug, open, tag, early, sizes = '(max-width: 760px) 100vw, 340px' }: {
  slug: Note
  open: (i: number) => void
  tag: string
  early?: boolean
  sizes?: string
}) {
  const note = notes[slug]
  const src = `${DIR}/${slug}`
  return (
    <div className="dv-paper">
      <span className={`dv-paper__tag${early ? ' dv-paper__tag--early' : ''}`}>{tag}</span>
      <button type="button" className="dv-paper__zoom" onClick={() => open(order.length + noteOrder.indexOf(slug))} aria-label={`Enlarge the whole page: ${note.caption}`}>
        <img
          src={`${src}-1800.webp`}
          srcSet={`${src}-800.webp 800w, ${src}-1800.webp ${note.w}w`}
          sizes={sizes}
          width={note.w}
          height={note.h}
          alt={note.alt}
          loading="lazy"
          ref={loadAhead}
          decoding="async"
        />
      </button>
    </div>
  )
}

/** Access in the illustrative scenario: what the owner wants, and what changes from today */
const people = [
  { name: 'You', note: 'Project owner', today: ['Owner', 'Owner', 'Owner'], goal: ['Owner', 'Owner', 'Owner'] },
  { name: 'Maya', note: 'Team', today: ['Editor', 'Editor', 'Editor'], goal: ['Editor', 'Editor', 'Editor'] },
  { name: 'Ravi', note: 'Team', today: ['Viewer', 'Viewer', 'Viewer'], goal: ['Viewer', 'Viewer', 'Viewer'] },
  { name: 'Alex', note: 'External collaborator', today: ['Editor', 'Editor', 'Editor'], goal: ['Editor', 'No access', 'Editor'] },
]
const cols = ['Client Project', 'File A', 'File B']

function Access({ role }: { role: string }) {
  const none = role === 'No access'
  return <span className={`dv-role${none ? ' dv-role--none' : ''}`}><span aria-hidden="true">{none ? '✕' : '✓'}</span> {role}</span>
}

/** Official Google sources: product behaviour and rationale, not validation of this study */
const sources = {
  help: { href: 'https://support.google.com/drive/answer/14254362?hl=en', label: 'Drive Help: limited access' },
  access: { href: 'https://workspaceupdates.googleblog.com/2025/02/updating-access-experience-in-google-drive.html', label: 'Workspace Updates, Feb 2025' },
  sharing: { href: 'https://workspaceupdates.googleblog.com/2025/09/upcoming-change-to-drive-sharing.html', label: 'Workspace Updates, Sep 2025' },
}

function Sources({ of }: { of: (keyof typeof sources)[] }) {
  return (
    <span className="dv-src">
      {of.map((k) => (
        <a key={k} href={sources[k].href} target="_blank" rel="noreferrer">
          {sources[k].label}<span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </span>
  )
}

/** The two workflows, stage for stage: the same four colours line up across both rows */
const documented = [
  ['Create a subfolder', 'A separate place for the file.'],
  ['Move the file', 'Move it into that subfolder.'],
  ['Turn on limited access', 'Change the folder’s sharing settings.'],
  ['Manage people', 'Choose who can open the folder.'],
] as const
const proposed = [
  ['Start from the file’s sharing', 'Choose ‘Restrict access to this file…’.'],
  ['Pick folder + people', 'Pick the folder and who keeps access.'],
  ['Check the changes', 'See where the file goes and who can open it.'],
  ['Confirm', 'Save, then see what changed.'],
] as const

function Workflow({ steps, labelledBy }: { steps: typeof documented | typeof proposed; labelledBy: string }) {
  return (
    <ol className="dv-wf__row" aria-labelledby={labelledBy}>
      {steps.map(([title, body], i) => (
        <li key={title} className={`dv-wf__step dv-wf__step--${i + 1}`}>
          <span className="dv-wf__num">{i + 1}</span>
          <strong className="dv-wf__name">{title}</strong>
          <span className="dv-wf__body">{body}</span>
          {i < steps.length - 1 && (
            <svg className="dv-wf__arrow" viewBox="0 0 24 12" width="24" height="12" aria-hidden="true">
              <path d="M1 6h20M16 1.5 21.5 6 16 10.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  )
}

/**
 * Art for each storyboard panel, as a path under DIR (e.g. 'story-1'), or null to draw the panel's
 * file-and-folder diagram instead. Dialogue and labels stay as HTML; the art is decorative.
 */
const storyArt: Record<1 | 2 | 3, string | null> = { 1: null, 2: null, 3: null }

const story = [
  { title: 'Share most of the project' },
  { title: 'But where do I change access?' },
  { title: 'See what will change' },
] as const

const INK = '#111'
const YELLOW = '#ffe45c'
const LAVENDER = '#ddd5f3'

/** A folder outline with its tab, top left at (x, y) */
function Folder({ x, y, w, h, fill = '#fff' }: { x: number; y: number; w: number; h: number; fill?: string }) {
  const t = w * 0.3
  return (
    <g>
      <path
        d={`M${x + 4} ${y}h${t}l8 8h${w - t - 16}a4 4 0 0 1 4 4v${h - 16}a4 4 0 0 1-4 4h${-(w - 8)}a4 4 0 0 1-4-4v${-(h - 8)}a4 4 0 0 1 4-4z`}
        fill={fill}
      />
      <path d={`M${x} ${y + 16}h${w}`} />
    </g>
  )
}

/** A file card with a folded corner and two text lines */
function File({ x, y, fill = '#fff', w = 22, h = 28 }: { x: number; y: number; fill?: string; w?: number; h?: number }) {
  return (
    <g>
      <path d={`M${x} ${y}h${w - 7}l7 7v${h - 7}h${-w}z`} fill={fill} />
      <path d={`M${x + 5} ${y + 13}h${w - 10}M${x + 5} ${y + 19}h${w - 13}`} strokeWidth={1.5} />
    </g>
  )
}

function Avatar({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={15} fill={LAVENDER} />
      <text x={x} y={y + 5.5} textAnchor="middle" fontSize={16} fontWeight={700} fill={INK} stroke="none">A</text>
    </g>
  )
}

function Lock({ x, y }: { x: number; y: number }) {
  return (
    <g strokeWidth={1.8}>
      <path d={`M${x - 3.5} ${y}v-3a3.5 3.5 0 0 1 7 0v3`} fill="none" />
      <rect x={x - 5.5} y={y} width={11} height={8} rx={1.5} fill={INK} />
    </g>
  )
}

/** Six files in two rows inside a folder; `mark` picks which are yellow (kept internal) */
function Files({ x, y, mark }: { x: number; y: number; mark: number[] }) {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <File key={i} x={x + (i % 3) * 32} y={y + Math.floor(i / 3) * 38} fill={mark.includes(i) ? YELLOW : '#fff'} />
      ))}
    </g>
  )
}

const diagrams: Record<1 | 2 | 3, React.ReactNode> = {
  // a shared project folder; two files stay internal; Alex is shared on the folder
  1: (
    <>
      <Folder x={18} y={38} w={136} h={118} />
      <Files x={36} y={70} mark={[1, 5]} />
      <path d="M190 92c-12 0-20 2-30 6" fill="none" />
      <path d="M166 92l-7 6 9 3" fill="none" />
      <Avatar x={206} y={92} />
    </>
  ),
  // one file in the folder, and two places the change could reach
  2: (
    <>
      <Folder x={18} y={38} w={136} h={118} fill="none" />
      <rect x={10} y={30} width={152} height={134} rx={8} fill="none" strokeDasharray="5 5" strokeWidth={1.5} />
      <Files x={36} y={70} mark={[1]} />
      <circle cx={79} cy={84} r={22} fill="none" strokeDasharray="5 5" strokeWidth={1.5} />
      <circle cx={204} cy={44} r={18} fill={YELLOW} />
      <text x={204} y={52} textAnchor="middle" fontSize={24} fontWeight={700} fill={INK} stroke="none">?</text>
      <path d="M190 120c-12 0-20-2-28-6" fill="none" strokeDasharray="4 4" />
      <Avatar x={206} y={124} />
    </>
  ),
  // File A now sits in a limited-access folder; Alex keeps the project, not File A
  3: (
    <>
      <Folder x={14} y={36} w={154} h={122} />
      <File x={30} y={70} />
      <File x={62} y={70} />
      <File x={30} y={110} />
      <File x={62} y={110} />
      <Folder x={98} y={70} w={56} h={64} fill={LAVENDER} />
      <File x={115} y={94} fill={YELLOW} w={20} h={26} />
      <Lock x={147} y={64} />
      <path d="M192 84L168 58" fill="none" />
      <circle cx={180} cy={70} r={8} fill="#fff" />
      <path d="M176 70l3 3 5-6" fill="none" strokeWidth={2} />
      <path d="M192 108h-36" fill="none" strokeDasharray="4 4" />
      <circle cx={174} cy={108} r={8} fill={YELLOW} />
      <path d="M171 105l6 6M177 105l-6 6" fill="none" strokeWidth={2} />
      <Avatar x={207} y={98} />
    </>
  ),
}

function Art({ n }: { n: 1 | 2 | 3 }) {
  const src = storyArt[n]
  if (src) return <img className="dv-panel__art" src={`${DIR}/${src}.webp`} alt="" loading="lazy" decoding="async" />
  return (
    <svg className="dv-panel__art dv-panel__svg" viewBox="0 0 240 180" aria-hidden="true" focusable="false"
      fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      {diagrams[n]}
    </svg>
  )
}

function Storyboard() {
  return (
    <figure className="dv-board" aria-labelledby="story-label">
      <p id="story-label" className="dv-diagram-label">An example scenario</p>
      <ol className="dv-panels">
        <li className="dv-panel">
          <h3 className="dv-panel__title"><span className="dv-panel__num">1</span> {story[0].title}</h3>
          <p className="dv-bubble dv-bubble--think"><span className="sr-only">The owner thinks: </span>Alex needs the project. These files stay internal.</p>
          <Art n={1} />
        </li>
        <li className="dv-panel">
          <h3 className="dv-panel__title"><span className="dv-panel__num">2</span> {story[1].title}</h3>
          <p className="dv-bubble dv-bubble--think"><span className="sr-only">The owner thinks: </span>Just this file—or the whole project?</p>
          <p className="dv-bubble dv-bubble--alex"><span className="dv-bubble__who">Alex</span><span className="sr-only">says: </span>I still need the project.</p>
          <Art n={2} />
        </li>
        <li className="dv-panel">
          <h3 className="dv-panel__title"><span className="dv-panel__num">3</span> {story[2].title}</h3>
          <dl className="dv-summary" aria-label="Access summary before confirming">
            <div><dt>File A <span aria-hidden="true">→</span><span className="sr-only">for</span> Alex</dt><dd><Access role="No access" /></dd></div>
            <div><dt>Rest of project <span aria-hidden="true">→</span><span className="sr-only">for</span> Alex</dt><dd><Access role="Editor" /></dd></div>
            <div><dt>Rest of the team</dt><dd><Access role="Keeps access" /></dd></div>
          </dl>
          <Art n={3} />
        </li>
      </ol>
      <figcaption className="dv-board__cap">
        <span className="dv-board__lead">In my design, you see the file move and who loses access before you confirm anything.</span>
        <span className="dv-cap">I made up this scenario for the case study. The lines aren’t quotes from participants or from a recorded session.</span>
      </figcaption>
    </figure>
  )
}

/** The decisions behind B, shown beside the screens they shaped */
const decisions = [
  {
    decision: 'Make the option easier to find.',
    why: 'In the walkthroughs, people weren’t sure where to start. So I put ‘Restrict access to this file…’ in the menu where you already change that person’s access.',
    tradeoff: 'Sitting next to roles like Editor, it could look like just another role. I used a divider and clear wording to set it apart.',
    next: 'Whether people find it without help.',
  },
  {
    decision: 'Choose the folder and people on one screen.',
    why: 'One person said A had too many clicks. In B, I put both choices together.',
    tradeoff: 'Fewer screens, but more to read at once.',
    next: 'Whether this is actually quicker. I didn’t time either version.',
  },
  {
    decision: 'Show what will change before saving.',
    why: 'Moving the file changes who can open it. I wanted that to be clear before anyone confirms.',
    tradeoff: 'One more step before saving.',
    next: 'Whether the review helps people spot someone they unticked by mistake.',
  },
] as const

function Decision({ decision, why, tradeoff, next }: (typeof decisions)[number]) {
  return (
    <dl className="dv-why">
      <div><dt>What I did</dt><dd>{decision}</dd></div>
      <div><dt>Why</dt><dd>{why}</dd></div>
      <div><dt>Trade-off</dt><dd>{tradeoff}</dd></div>
      <div><dt>Still to check</dt><dd>{next}</dd></div>
    </dl>
  )
}

/** Restore: the two screens that carry the idea, then the whole sequence on request */
const restoreAll = [
  ['b-restricted-share', 'Open File A’s sharing', 'A note says File A is in a limited-access folder, so sharing on the project doesn’t reach it.'],
  ['b-reshare-add', 'Add Alex as Viewer', 'It says up front that this shares File A only, not the folder.'],
  ['b-reshare-review', 'Check what changes', 'File A goes from No access to Viewer. The folder, the project and File B stay the same.'],
  ['b-reshare-result', 'Confirm', 'Alex can open File A from its link, as Viewer. Private files stays blocked.'],
] as const
const restoreKey = [
  ['b-reshare-add', 'Share File A only', 'It says up front: this file, not the folder.'],
  ['b-reshare-result', 'Alex can open File A', 'The private folder is still blocked.'],
] as const

/** Supporting depth, closed by default: a native disclosure, so keyboard and screen readers work */
function More({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="dv-more">
      <summary>{title}</summary>
      <div className="dv-more__body">{children}</div>
    </details>
  )
}

function Head({ id, kicker, title, children }: { id: string; kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="dv-head">
      <p className="dv-kicker">{kicker}</p>
      <h2 id={`${id}-title`} className="dv-h2">{title}</h2>
      {children}
    </header>
  )
}

export default function DriveSharing() {
  useTitle('Google Drive access study | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)

  return (
    <article className="dv">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type">Independent product study. Not affiliated with Google.</p>
          <h1 className="dv-top__title">Share the project. Keep a few files private.</h1>
          <p className="dv-top__lede">
            A clearer way to <mark>keep one file private</mark>, <mark>keep access for the rest of the team</mark>, and see
            what will change before saving.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>My role</dt>
                <dd>I did the research, framed the problem, designed the flow and tested it with people. I built the prototype with help from Claude Code.</dd>
              </div>
              <div>
                <dt>Prototype</dt>
                <dd>
                  <a className="dv-top__try" href={PROTO} target="_blank" rel="noopener noreferrer">
                    Try the prototype <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
            <div className="dv-signal">
              <p className="dv-signal__kind">What I saw in testing</p>
              <p className="dv-signal__text">
                I tested with three people, and the <mark>results were mixed</mark>. What I saw changed how the
                restrict flow works. One person also restored access without help and explained the result
                correctly.
              </p>
              <p className="dv-signal__note">I tested A first, then B. It wasn’t a controlled experiment, and I didn’t measure anything in real Drive.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="dv-shell">
        <div className="dv-shell__inner dv-shell__grid">
          <CaseSidebar sections={sections} />

          <div className="dv-main">
            {/* Overview */}
            <section id="overview" className="dv-sec dv-sec--first" aria-labelledby="overview-title" tabIndex={-1}>
              <Storyboard />
              <Head id="overview" kicker="Overview" title="One shared project. One file to keep private.">
                <p>
                  I looked at how a project owner could take File A away from Alex, let the rest of the team keep it, and
                  later share it with Alex again.
                </p>
                <p className="dv-head__note">I built it as a Drive-style web prototype. The permissions are simulated.</p>
              </Head>
              <figure>
                <Screen slug="overview-share-dialog" open={open} size="full" sizes="(max-width: 1100px) 100vw, 900px" eager />
                <figcaption className="dv-cap">
                  My prototype. Everyone gets File A through the project folder. <span className="dv-tag">Proposed design, not current Drive</span>
                </figcaption>
              </figure>
            </section>

            {/* The problem */}
            <section id="problem" className="dv-sec" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="Most of the project is shared. One file isn’t.">
                <p className="dv-statement">
                  When people tried this in Drive as it is today, they weren’t sure how to{' '}
                  <mark>keep one file private and leave the rest of the project shared</mark>.
                </p>
                <p>
                  So I designed a guided flow. It starts from the file’s share settings, lets you pick who keeps access,
                  and shows you the change before anything is saved.
                </p>
              </Head>
              <p className="dv-context">
                <span className="dv-evidence__kind">What Drive already has</span>
                Drive already handles this with limited-access folders. Google’s pages explain how that works. They
                don’t test or back up anything I found. <Sources of={['help', 'access', 'sharing']} />
              </p>
              <div className="dv-matrix">
                <p className="dv-diagram-label" aria-hidden="true">Diagram · who has access now, and the one change</p>
                <table>
                  <caption className="sr-only">Diagram: each person’s current access, and the one change the owner intends. Cells without a change stay as they are.</caption>
                  <thead>
                    <tr>
                      <th scope="col">Person</th>
                      {cols.map((c) => <th key={c} scope="col">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((p) => (
                      <tr key={p.name} className={p.name === 'Alex' ? 'is-focus' : undefined}>
                        <th scope="row">{p.name}<span>{p.note}</span></th>
                        {p.goal.map((g, i) => {
                          const changes = p.today.some((t, j) => t !== p.goal[j])
                          return (
                            <td key={cols[i]}>
                              {g === p.today[i] ? (
                                <>
                                  <Access role={g} />
                                  {changes && <span className="dv-was">Unchanged</span>}
                                </>
                              ) : (
                                <dl className="dv-change">
                                  <div>
                                    <dt>Now</dt>
                                    <dd><Access role={p.today[i]} /><span className="dv-was">through {cols[0]}</span></dd>
                                  </div>
                                  <div className="dv-change__goal">
                                    <dt>After</dt>
                                    <dd><Access role={g} /></dd>
                                  </div>
                                </dl>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="dv-matrix__note">Only one thing changes: Alex loses File A but keeps the rest of the project.</p>
              </div>
            </section>

            {/* Research & insights */}
            <section id="research" className="dv-sec" aria-labelledby="research-title" tabIndex={-1}>
              <Head id="research" kicker="Research & insights" title="I started with removing people. The problem got smaller." />
              <dl className="dv-facts" aria-label="Research summary">
                <div>
                  <dt>Dates</dt>
                  <dd>26–27 October 2026</dd>
                </div>
                <div>
                  <dt>Participants</dt>
                  <dd>3: a data-science student doing part-time work, a video editor and a project coordinator</dd>
                </div>
                <div>
                  <dt>Activities</dt>
                  <dd>Interviews, walkthroughs of Google Drive as it is today, and testing my prototype</dd>
                </div>
                <div>
                  <dt>Versions</dt>
                  <dd>All three tried Version A. They tried Version B after that.</dd>
                </div>
              </dl>

              <ol className="dv-evidence" aria-label="What I saw people do in Drive today, and what I think it means">
                <li>
                  <p className="dv-evidence__kind">What I saw · paraphrased</p>
                  <p>People weren’t sure what to do next.</p>
                </li>
                <li>
                  <p className="dv-evidence__kind">What I saw · paraphrased</p>
                  <p>One workaround that came up was moving the files into another folder or project.</p>
                </li>
                <li>
                  <p className="dv-evidence__kind">What I think it means</p>
                  <p>
                    Moving files does work. The hard part is <mark>picking where the file goes, setting who can open it,
                    and knowing what will happen</mark>.
                  </p>
                </li>
              </ol>

              <div className="dv-notebook">
                <p className="dv-diagram-label">From my notebook · my own notes, not participant data</p>
                <div className="dv-notebook__grid">
                  <figure>
                    <Notebook slug="nb-sharing-notes" open={open} tag="Understanding sharing" />
                    <figcaption className="dv-cap">Clicking through Drive’s sharing settings, and where I got stuck.</figcaption>
                  </figure>
                  <figure>
                    <Notebook slug="nb-offboarding-flow" open={open} tag="Early direction" early />
                    <figcaption className="dv-cap">My first idea: removing someone when they leave.</figcaption>
                  </figure>
                </div>
              </div>

              <More title="How my focus changed">
                <p className="dv-more__note">This is my own exploring, not what participants did.</p>
                <ol className="dv-trail">
                  <li>
                    <h3>Removing people first</h3>
                    <p>I started with taking away someone’s access when they leave a project.</p>
                  </li>
                  <li>
                    <h3>Something I couldn’t explain</h3>
                    <p>The bulk-remove option was greyed out for me, and I couldn’t work out why. So I didn’t build on it.</p>
                  </li>
                  <li>
                    <h3>A smaller problem</h3>
                    <p>Drive could already keep selected files private. Finding that, and knowing what it would change, was the hard part.</p>
                  </li>
                </ol>
                <div className="dv-pair">
                  <div className="dv-pair__text">
                    <h3>What I found with dummy accounts</h3>
                    <ul className="ticks">
                      <li>A file can get its access from the folder it’s in.</li>
                      <li>A limited-access subfolder keeps its files to a smaller group.</li>
                      <li>Alex could still open the main project folder, but not the private one.</li>
                    </ul>
                  </div>
                  <figure className="dv-tree">
                    <p className="dv-diagram-label">Diagram · how access worked in my dummy-account tests</p>
                    <ul>
                      <li>
                        <span className="dv-node dv-node--folder">Client Project <em>Maya, Ravi and Alex</em></span>
                        <ul>
                          <li><span className="dv-node">File B <em>from the folder: all three</em></span></li>
                          <li>
                            <span className="dv-node dv-node--limited">Private files <em>limited access: Maya and Ravi</em></span>
                            <ul>
                              <li><span className="dv-node">File A <em>Alex can’t open it</em></span></li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <figcaption className="dv-cap">A diagram, not a Drive screenshot.</figcaption>
                  </figure>
                </div>
              </More>
            </section>

            {/* Design direction */}
            <section id="direction" className="dv-sec" aria-labelledby="direction-title" tabIndex={-1}>
              <p className="dv-kicker">Design direction</p>
              <h2 id="direction-title" className="dv-question">
                How can a project owner keep a few files private, and know who still has access?
              </h2>
              <div className="dv-wf">
                <p className="dv-diagram-label">Rough comparison · I didn’t count clicks</p>
                <h3 id="wf-current" className="dv-wf__title">What Drive’s help pages describe today</h3>
                <Workflow steps={documented} labelledBy="wf-current" />
                <p className="dv-wf__hand">Same rules underneath, with guidance on top.</p>
                <h3 id="wf-proposed" className="dv-wf__title">My proposed flow</h3>
                <Workflow steps={proposed} labelledBy="wf-proposed" />
              </div>
              <p className="dv-wf__takeaway">
                My design <mark>walks you through the folder method Drive already uses</mark>, starting from the file’s
                share settings.
              </p>
              <p className="dv-scope-line">
                What I covered: one My Drive project, keeping selected files private while the team keeps access,
                checking before saving, and sharing a file again later.
              </p>
              <More title="What the permission terms mean">
                <dl className="dv-terms">
                  <div>
                    <dt>General access: Restricted</dt>
                    <dd>Decides who can open something from its link: only people you’ve added. On its own, it doesn’t take away access someone gets from a parent folder.</dd>
                  </div>
                  <div>
                    <dt>Limited access</dt>
                    <dd>A folder setting. Only people added to the folder can open it, even if they can open the folder above it.</dd>
                  </div>
                </dl>
              </More>
              <More title="What I didn’t cover">
                <ul className="dv-out">
                  <li>Removing people across a whole organization</li>
                  <li>Groups and public links</li>
                  <li>Changing other owners’ permissions</li>
                  <li>Giving back full access through the parent folder</li>
                  <li>Connecting to the real Drive</li>
                </ul>
              </More>
            </section>

            {/* A vs B */}
            <section id="ab" className="dv-sec" aria-labelledby="ab-title" tabIndex={-1}>
              <Head id="ab" kicker="A vs B" title="Two ways to start the same task.">
                <p>I designed both. A isn’t how Drive works today. It was just my first attempt.</p>
              </Head>
              <div className="dv-compare">
                {(['A', 'B'] as const).map((v) => (
                  <figure key={v} className="dv-compare__col">
                    <figcaption>
                      <h3><span className="dv-badge">{v}</span> {v === 'A' ? 'Starts from Remove access' : 'Restrict from the role menu'}</h3>
                    </figcaption>
                    <div className="dv-focus">
                      <p className="dv-focus__label">{v === 'A' ? 'Asks what “remove” means first' : 'Restrict is its own option'}</p>
                      <Screen slug={v === 'A' ? 'a-choose-scope-detail' : 'b-role-menu-detail'} open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                    </div>
                    <p className="dv-cap">
                      {v === 'A'
                        ? 'A asks what Remove access should mean, then asks for the folder and the people on two separate screens.'
                        : 'B gives restrict its own option, then asks for the folder and the people on one screen.'}
                    </p>
                    <a className="dv-compare__try" href={`${PROTO}?variant=${v}`} target="_blank" rel="noopener noreferrer">
                      Open Version {v} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </figure>
                ))}
              </div>
              <figure className="dv-sketch">
                <figcaption>
                  <h3>Sketch → Prototype</h3>
                  <p className="dv-cap">I sketched A’s folder step on paper first. The prototype kept the same layout.</p>
                </figcaption>
                <div className="dv-sketch__pair">
                  <div className="dv-sketch__col">
                    <Notebook slug="nb-folder-sketch" open={open} tag="Sketch" sizes="(max-width: 760px) 100vw, 380px" />
                  </div>
                  <span className="dv-sketch__arrow" aria-hidden="true">→</span>
                  <div className="dv-sketch__col">
                    <span className="dv-paper__tag dv-paper__tag--proto">Prototype · Version A</span>
                    <Screen slug="a-destination" open={open} size="full" sizes="(max-width: 760px) 100vw, 380px" />
                  </div>
                </div>
              </figure>
              <p className="dv-note">
                One person felt A was too long, so I explored B next. I tested them one after the other,{' '}
                <mark>not as a controlled A/B test</mark>, so this doesn’t show that B is better.
              </p>
              <More title="Other ideas I considered">
                <dl className="dv-alts">
                  <div>
                    <dt>Move the files to a separate folder or project</dt>
                    <dd>This came up as a workaround in the walkthroughs. It works, but it changes how the project is organised and where you manage access.</dd>
                  </div>
                  <div>
                    <dt>Remove Alex from the whole project</dt>
                    <dd>Doesn’t work here. Alex still needs the rest of the project.</dd>
                  </div>
                  <div>
                    <dt>Keep the folder and people on separate screens</dt>
                    <dd>More step-by-step help. That was Version A, and one person found it too long.</dd>
                  </div>
                </dl>
              </More>
            </section>

            {/* Proposed solution */}
            <section id="solution" className="dv-sec" aria-labelledby="solution-title" tabIndex={-1}>
              <Head id="solution" kicker="Proposed solution" title="Restrict one file. See who keeps access first.">
                <p>Restrict access is <mark>its own option, not another role</mark>. Nothing changes until you confirm.</p>
              </Head>
              <ol className="dv-steps">
                <li className="dv-step">
                  <Screen slug="b-role-menu-detail" open={open} marks={[{ n: 1, x: 56, y: 74.7 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">1</span> Start where you manage the person</h3>
                    <Decision {...decisions[0]} />
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-restrict-setup" open={open} size="sm" marks={[{ n: 2, x: 4.3, y: 27 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">2</span> Choose the folder and who keeps access</h3>
                    <Decision {...decisions[1]} />
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-review" open={open} marks={[{ n: 3, x: 38, y: 53.6 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">3</span> Check each person’s access</h3>
                    <Decision {...decisions[2]} />
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-result" open={open} size="sm" marks={[{ n: 4, x: 4.3, y: 75.6 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">4</span> Save, and see the result</h3>
                    <p>The result uses the same words as the review. Alex loses File A. The team and the rest of the project stay the same.</p>
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-project-after" open={open} />
                  <div className="dv-step__text">
                    <h3>Afterwards, in the project</h3>
                    <p>A Private files folder now shows up in Client Project, marked Limited access.</p>
                  </div>
                </li>
              </ol>
            </section>

            {/* Restore access */}
            <section id="restore" className="dv-sec" aria-labelledby="restore-title" tabIndex={-1}>
              <Head id="restore" kicker="Restore access" title="Share the file again without opening the folder.">
                <p>Later, Alex needs File A again. You share just that file, and <mark>the folder stays limited</mark>.</p>
              </Head>
              <ol className="dv-grid">
                {restoreKey.map(([slug, title, body], i) => (
                  <li key={slug} className="dv-grid__item">
                    <Screen slug={slug} open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                    <h3><span className="dv-num">{i + 1}</span> {title}</h3>
                    <p>{body}</p>
                  </li>
                ))}
              </ol>
              <More title="See all four restore steps">
                <ol className="dv-grid">
                  {restoreAll.map(([slug, title, body], i) => (
                    <li key={slug} className="dv-grid__item">
                      <Screen slug={slug} open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                      <h3><span className="dv-num">{i + 1}</span> {title}</h3>
                      <p>{body}</p>
                    </li>
                  ))}
                </ol>
              </More>
            </section>

            {/* Testing & iteration */}
            <section id="testing" className="dv-sec" aria-labelledby="testing-title" tabIndex={-1}>
              <Head id="testing" kicker="Testing & iteration" title="What testing changed.">
                <p className="dv-statement">
                  I tested A first, then B, with three people. <mark>The results were mixed</mark>: one finished without
                  help, one needed help, and one figured it out after some time. One person also restored access on
                  their own and explained the result correctly.
                </p>
                <p className="dv-head__note">
                  These notes cover both the restrict and the restore tasks. I didn’t record a separate result for each
                  person and task.
                </p>
              </Head>
              <div className="dv-feedback">
                <p className="dv-feedback__kind">Feedback on Version A · paraphrased</p>
                <p className="dv-feedback__text">One person felt there were too many clicks.</p>
              </div>
              <div className="dv-iter" role="group" aria-label="Version A and Version B: choosing the folder and the people">
                <figure className="dv-iter__col">
                  <h3 className="dv-iter__title"><span className="dv-badge">A</span> Separate steps</h3>
                  <Screen slug="a-destination" open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                  <Screen slug="a-people" open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                  <figcaption className="dv-cap">The folder and the people on two screens.</figcaption>
                </figure>
                <figure className="dv-iter__col">
                  <h3 className="dv-iter__title"><span className="dv-badge">B</span> Both choices together</h3>
                  <Screen slug="b-restrict-setup" open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                  <figcaption className="dv-cap">Both on one screen: fewer screens, but more to read at once.</figcaption>
                </figure>
              </div>
              <More title="How I checked the prototype">
                <p>
                  I ran restrict and then share-again as one sequence in both versions, without resetting. In the
                  simulated link previews, Alex could open File A as Viewer while Private files stayed blocked. That shows
                  the prototype works the way I designed it. It isn’t evidence from users.
                </p>
              </More>
            </section>

            {/* Outcome */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Outcome" title="What worked, and what I still need to check." />
              <dl className="dv-results">
                <div>
                  <dt>What happened</dt>
                  <dd>Testing <mark>shaped a second version of the restrict flow</mark>. I didn’t measure how it would do in real Drive.</dd>
                </div>
                <div>
                  <dt>What to keep in mind</dt>
                  <dd>
                    Only three people. Everyone saw A before B, and I helped some of them along the way. I didn’t time
                    either version or record results for each task. And the permissions were simulated.
                  </dd>
                </div>
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Learning how Drive works made the problem smaller.">
                <p>
                  I started out wanting to redesign how you remove people. Once I understood how Drive’s permissions
                  already work, <mark>I could narrow it down</mark> to one clear flow. Drive already had this option. I
                  wanted to make it easier to find and use.
                </p>
              </Head>
              <h3 className="dv-h3">What I’d test next</h3>
              <ul className="ticks">
                <li>Whether people can finish on their own, and correctly guess who keeps access</li>
                <li>Whether the review helps people spot someone they unticked by mistake</li>
                <li>How it compares with Drive’s current steps, and A vs B in a fair order, with half the people seeing B first</li>
              </ul>
              <div className="dv-end">
                <External href={PROTO}>Try the prototype</External>
              </div>
            </section>
          </div>
        </div>
      </div>

      {lightbox}
      <NextProject slug="drive-sharing" withPrevious />
    </article>
  )
}
