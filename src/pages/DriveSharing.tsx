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
const FROM_PROTO = 'Study prototype, a proposed design. Not the current Google Drive interface.'

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

const FROM_NOTEBOOK = 'My own notebook, kept while exploring. Not participant data, and not evidence of how Drive behaves.'

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

const flows = {
  A: ['Share', 'Alex’s role', 'Remove access', 'Choose scope', 'Choose folder', 'Choose people', 'Review', 'Apply'],
  B: ['Share', 'Alex’s role', 'Restrict access to this file…', 'Folder and people', 'Review', 'Apply'],
}
const keySteps = ['Remove access', 'Restrict access to this file…']

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
  ['Create a subfolder', 'A separate place for the selected file.'],
  ['Move the file', 'Move it into that subfolder.'],
  ['Enable limited access', 'Change the folder’s sharing settings.'],
  ['Manage people', 'Choose who can open the folder.'],
] as const
const proposed = [
  ['Start from file sharing', 'Choose ‘Restrict access to this file…’.'],
  ['Choose destination + people', 'Set the folder and who retains access.'],
  ['Review changes', 'Check the file move and resulting access.'],
  ['Confirm', 'Apply and see what changed.'],
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
  { title: 'Make the change clear' },
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
      <p id="story-label" className="dv-diagram-label">Illustrative scenario</p>
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
            <div><dt>Team access</dt><dd><Access role="Preserved" /></dd></div>
          </dl>
          <Art n={3} />
        </li>
      </ol>
      <figcaption className="dv-board__cap">
        <span className="dv-board__lead">My proposal makes the file move and access changes visible before confirmation.</span>
        <span className="dv-cap">An illustrated scenario written for this case study. The dialogue isn’t participant testimony or a recorded session.</span>
      </figcaption>
    </figure>
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
            A guided way to <mark>restrict a selected file</mark>, <mark>preserve team access</mark>, and review the
            consequences.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>My role</dt>
                <dd>Research, problem framing, interaction design and prototype testing. Prototype implementation was assisted by Claude Code.</dd>
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
              <p className="dv-signal__kind">Early testing outcome</p>
              <p className="dv-signal__text">
                A participant restored file access <mark>without guidance</mark> and correctly explained what Alex could
                open.
              </p>
              <p className="dv-signal__note">Formative prototype testing. Production impact was not measured.</p>
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
              <Head id="overview" kicker="Overview" title="One shared project. One file to restrict. The rest stays shared.">
                <p>
                  I explored how an owner could restrict File A for Alex, preserve the team’s access, and later share that
                  file with Alex again.
                </p>
                <p className="dv-head__note">My Drive web prototype with simulated permissions.</p>
              </Head>
              <figure>
                <Screen slug="overview-share-dialog" open={open} size="full" sizes="(max-width: 1100px) 100vw, 900px" eager />
                <figcaption className="dv-cap">
                  The study prototype. Everyone’s access to File A comes from the project folder. <span className="dv-tag">Proposed design, not current Drive</span>
                </figcaption>
              </figure>
            </section>

            {/* The problem */}
            <section id="problem" className="dv-sec" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="One project. Different access needs.">
                <p className="dv-statement">
                  Project owners sharing most of a folder may need to{' '}
                  <mark>keep selected files available to a smaller group</mark>. In this study, discovering the
                  folder-based restriction workflow and understanding its consequences created uncertainty about what to
                  do next.
                </p>
              </Head>
              <ol className="dv-evidence" aria-label="What the product does, what I found, and what I designed">
                <li>
                  <p className="dv-evidence__kind">Official product context</p>
                  <p>
                    Google Drive supports limited-access folders for keeping selected content available to a smaller group
                    within a shared project.
                  </p>
                  <Sources of={['help', 'access', 'sharing']} />
                </li>
                <li>
                  <p className="dv-evidence__kind">Finding from my study</p>
                  <p>
                    In my exploratory research, the limited-access folder approach was unfamiliar, and{' '}
                    <mark>the next action for restricting a selected file was unclear</mark>.
                  </p>
                </li>
                <li>
                  <p className="dv-evidence__kind">My design scope</p>
                  <p>
                    I explored a guided flow that brings file restriction into the sharing context, helps owners choose who
                    retains access, and previews the change before confirmation.
                  </p>
                </li>
              </ol>
              <p className="dv-evidence__note">
                Google’s pages describe how Drive behaves and why it changed. They don’t test or confirm my finding.
              </p>
              <p className="dv-scenario">
                In the example, Maya and Ravi are the team and Alex is the external collaborator. All three work in Client
                Project. File B is for everyone; File A should stay with the team.
              </p>
              <div className="dv-matrix">
                <p className="dv-diagram-label" aria-hidden="true">Diagram · current access and the intended change</p>
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
                                    <dt>Current</dt>
                                    <dd><Access role={p.today[i]} /><span className="dv-was">inherited from {cols[0]}</span></dd>
                                  </div>
                                  <div className="dv-change__goal">
                                    <dt>Intended</dt>
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
                <p className="dv-matrix__note">
                  One cell changes. Alex has Editor on File A today, inherited from Client Project; the owner intends No
                  access. Client Project and File B stay Editor for Alex.
                </p>
              </div>
            </section>

            {/* Research & insights */}
            <section id="research" className="dv-sec" aria-labelledby="research-title" tabIndex={-1}>
              <Head id="research" kicker="Research & insights" title="I started with removal. The problem became more specific." />
              <ol className="dv-trail">
                <li>
                  <h3>Offboarding first</h3>
                  <p>The study began with taking someone’s access away, repeatedly, as people leave a project.</p>
                </li>
                <li>
                  <h3>A lead I couldn’t confirm</h3>
                  <p>I saw a disabled bulk-removal state but couldn’t establish why it was disabled, so I didn’t build on it.</p>
                </li>
                <li>
                  <h3>A narrower gap</h3>
                  <p>My exploration suggested owners could struggle to discover limited-access folders and to tell exactly what an access change would reach.</p>
                </li>
              </ol>

              <div className="dv-notebook">
                <p className="dv-diagram-label">From my notebook · my own notes, not participant data</p>
                <div className="dv-notebook__grid">
                  <figure>
                    <Notebook slug="nb-sharing-notes" open={open} tag="Understanding sharing" />
                    <figcaption className="dv-cap">
                      Walking through Drive’s sharing settings in a practice folder. The highlighted lines record what I
                      tried, what happened, and where I got stuck: finding how to remove an external member after sharing.
                    </figcaption>
                  </figure>
                  <figure>
                    <Notebook slug="nb-offboarding-flow" open={open} tag="Early direction" early />
                    <figcaption className="dv-cap">
                      My first framing: offboarding someone who leaves, from finding where they have access to removing it.
                      The question marks are steps I couldn’t resolve, and the study narrowed from here.
                    </figcaption>
                  </figure>
                </div>
              </div>

              <div className="dv-pair">
                <div className="dv-pair__text">
                  <h3>Drive can already do this. It was unfamiliar.</h3>
                  <ul className="ticks">
                    <li>Access to a file can come from its parent folder.</li>
                    <li>A limited-access subfolder keeps its content to a smaller group. <Sources of={['help']} /></li>
                    <li>In checks with dummy accounts, the collaborator kept the parent folder while the private folder stayed blocked.</li>
                    <li>In research conversations, <mark>this capability, and the right next step, were unfamiliar</mark>.</li>
                  </ul>
                </div>
                <figure className="dv-tree">
                  <p className="dv-diagram-label">Diagram · the permission model from the dummy-account checks</p>
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
                  <figcaption className="dv-cap">A diagram, not a screenshot of Drive.</figcaption>
                </figure>
              </div>
            </section>

            {/* Design direction */}
            <section id="direction" className="dv-sec" aria-labelledby="direction-title" tabIndex={-1}>
              <p className="dv-kicker">Design direction</p>
              <h2 id="direction-title" className="dv-question">
                How might we help project owners restrict selected files and understand who will retain access?
              </h2>
              <div className="dv-wf">
                <p className="dv-diagram-label">Conceptual comparison · not a measured click count</p>
                <h3 id="wf-current" className="dv-wf__title">Current documented workflow</h3>
                <Workflow steps={documented} labelledBy="wf-current" />
                <Sources of={['help']} />
                <p className="dv-wf__hand">Same permission model, guided interaction.</p>
                <h3 id="wf-proposed" className="dv-wf__title">My proposed interaction</h3>
                <Workflow steps={proposed} labelledBy="wf-proposed" />
              </div>
              <p className="dv-wf__takeaway">
                The proposal brings the folder-based workflow into the selected file’s sharing context and makes the
                consequences visible before confirmation.
              </p>
              <p className="dv-note">
                My proposal <mark>guides the existing folder-based mechanism</mark>. It doesn’t introduce a new file-level
                permission rule: the file still ends up in a limited-access folder, and the owner reviews the move and
                the access changes before confirming.
              </p>
              <dl className="dv-terms">
                <div>
                  <dt>General access: Restricted</dt>
                  <dd>Controls who can open an item from its link: only people who have been added. On its own it doesn’t remove access that comes from a parent folder.</dd>
                </div>
                <div>
                  <dt>Limited access</dt>
                  <dd>A folder setting: only people given permission to the folder can open it, even if they can open its parent. <Sources of={['help']} /></dd>
                </div>
              </dl>
              <div className="dv-scope">
                <div>
                  <h3>In scope</h3>
                  <ul className="ticks">
                    <li>One project in My Drive</li>
                    <li>Restricting selected files</li>
                    <li><strong>Keeping the team’s access</strong></li>
                    <li>Reviewing consequences before applying</li>
                    <li>Sharing a file again later</li>
                  </ul>
                </div>
                <div>
                  <h3>Left out on purpose</h3>
                  <ul className="dv-out">
                    <li>Organization-wide offboarding</li>
                    <li>Groups and public links</li>
                    <li>Changing other owners’ permissions</li>
                    <li>Restoring full access from the parent</li>
                    <li>A real Drive integration</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* A vs B */}
            <section id="ab" className="dv-sec" aria-labelledby="ab-title" tabIndex={-1}>
              <Head id="ab" kicker="A vs B" title="The same goal, reached from two places.">
                <p>Both are proposed designs. A is not the current Drive flow; it was my first design, starting from Remove access.</p>
              </Head>
              <div className="dv-compare">
                {(['A', 'B'] as const).map((v) => (
                  <figure key={v} className="dv-compare__col">
                    <figcaption>
                      <h3><span className="dv-badge">{v}</span> {v === 'A' ? 'Start from Remove access' : 'Restrict from the role menu'}</h3>
                      <ol className="dv-flow" aria-label={`Version ${v} steps`}>
                        {flows[v].map((s) => <li key={s} className={keySteps.includes(s) ? 'is-key' : undefined}>{s}</li>)}
                      </ol>
                    </figcaption>
                    <div className="dv-focus">
                      <p className="dv-focus__label">{v === 'A' ? 'Separate scope decision' : 'Explicit restriction action'}</p>
                      <Screen slug={v === 'A' ? 'a-choose-scope-detail' : 'b-role-menu-detail'} open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                    </div>
                    <p className="dv-cap">
                      {v === 'A'
                        ? 'After Remove access, A asks what it should mean. Folder and people follow on separate screens.'
                        : 'B adds “Restrict access to this file…” beside the roles, as its own action, and asks for folder and people on one screen.'}
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
                  <p className="dv-cap">
                    A’s folder step started on paper: pick an existing limited-access folder or create one, then continue.
                    The prototype screen kept that structure and added a location and a note that nothing has changed yet.
                  </p>
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
                <strong>Why B.</strong> A was understandable and could be completed, but felt like too many clicks. A
                participant suggested putting <mark>restriction near the role controls</mark>, so B tests that as a hypothesis. I chose B
                to explore further; this was not a fair comparison, and it doesn’t show B is better.
              </p>
            </section>

            {/* Proposed solution */}
            <section id="solution" className="dv-sec" aria-labelledby="solution-title" tabIndex={-1}>
              <Head id="solution" kicker="Proposed solution" title="Restrict one file. See who keeps access first.">
                <p>
                  Restrict access is <mark>a separate action, not a role</mark>. Roles stay as they are: You are Owner, Maya is Editor,
                  Ravi is Viewer, and Alex is Editor on the project.
                </p>
              </Head>
              <ol className="dv-steps">
                <li className="dv-step">
                  <Screen slug="b-role-menu-detail" open={open} marks={[{ n: 1, x: 56, y: 74.7 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">1</span> Find it where you manage the person</h3>
                    <p>The action sits below Alex’s roles, apart from them, so it doesn’t read as a fourth role. A detail of the B screen above.</p>
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-restrict-setup" open={open} size="sm" marks={[{ n: 2, x: 4.3, y: 27 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">2</span> Choose the folder and who keeps access</h3>
                    <p>File A moves into a new limited-access folder in the project. Maya and Ravi stay ticked; Alex doesn’t, and the line under his name says what that means.</p>
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-review" open={open} marks={[{ n: 3, x: 38, y: 53.6 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">3</span> Review each person’s access</h3>
                    <p>Before and after, for File A and the rest of the project. Alex goes from Editor to No access on File A only. <strong>Nothing changes until you confirm.</strong></p>
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-result" open={open} size="sm" marks={[{ n: 4, x: 4.3, y: 75.6 }]} />
                  <div className="dv-step__text">
                    <h3><span className="dv-num">4</span> Apply, and see the result</h3>
                    <p>The result lists what was done and who can open File A now, in the same terms as the review.</p>
                    <ul className="dv-outcomes">
                      <li><Access role="No access" /> Alex can’t open File A or Private files.</li>
                      <li><Access role="Kept" /> Maya and Ravi keep their roles.</li>
                      <li><Access role="Unchanged" /> Client Project and File B stay as they were.</li>
                    </ul>
                  </div>
                </li>
                <li className="dv-step">
                  <Screen slug="b-project-after" open={open} />
                  <div className="dv-step__text">
                    <h3>Afterwards, in the project</h3>
                    <p>Private files appears in Client Project, marked Limited access.</p>
                  </div>
                </li>
              </ol>
            </section>

            {/* Restore access */}
            <section id="restore" className="dv-sec" aria-labelledby="restore-title" tabIndex={-1}>
              <Head id="restore" kicker="Restore access" title="Share the file again without opening the folder.">
                <p>Later, Alex needs File A. The owner shares that one file. This is file-level sharing; <mark>the folder keeps its limited access</mark>.</p>
              </Head>
              <ol className="dv-grid">
                {([
                  ['b-restricted-share', 'Open File A’s sharing', 'A note says File A is in a limited-access folder, so project sharing doesn’t reach it.'],
                  ['b-reshare-add', 'Add Alex as Viewer', 'The scope is stated up front: File A only, not the folder.'],
                  ['b-reshare-review', 'Review the scope', 'File A goes from No access to Viewer. The folder, project and File B are unchanged.'],
                  ['b-reshare-result', 'Confirm', 'Alex can open File A by its link, as Viewer. Private files stays blocked.'],
                ] as const).map(([slug, title, body], i) => (
                  <li key={slug} className="dv-grid__item">
                    <Screen slug={slug} open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                    <h3><span className="dv-num">{i + 1}</span> {title}</h3>
                    <p>{body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Testing & iteration */}
            <section id="testing" className="dv-sec" aria-labelledby="testing-title" tabIndex={-1}>
              <Head id="testing" kicker="Testing & iteration" title="Testing changed the design.">
                <p>Testing was formative and involved a limited sample. Findings should be interpreted in that context.</p>
              </Head>
              <div className="dv-feedback">
                <p className="dv-feedback__kind">Participant feedback · paraphrased</p>
                <p className="dv-feedback__text">The participant completed the flow but felt it involved too many clicks.</p>
              </div>
              <div className="dv-iter" role="group" aria-label="How the design changed after this feedback">
                <figure className="dv-iter__col">
                  <h3 className="dv-iter__title"><span className="dv-badge">A</span> Separate decisions</h3>
                  <Screen slug="a-destination" open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                  <Screen slug="a-people" open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                  <figcaption className="dv-cap">The folder and the people who keep access were chosen on two separate screens.</figcaption>
                </figure>
                <figure className="dv-iter__col">
                  <h3 className="dv-iter__title"><span className="dv-badge">B</span> Related decisions together</h3>
                  <Screen slug="b-restrict-setup" open={open} size="full" sizes="(max-width: 760px) 100vw, 440px" />
                  <figcaption className="dv-cap">B brings both choices onto one screen, under a summary of who keeps and who loses access.</figcaption>
                </figure>
              </div>
              <p className="dv-iter__qual">
                B was selected for further exploration. A controlled comparison has not established that it performs better.
              </p>
              <div className="dv-strip" role="table" aria-label="Feedback, design response and observed result">
                <div className="dv-strip__row dv-strip__row--head" role="row">
                  <span role="columnheader">Feedback</span>
                  <span role="columnheader">Design response</span>
                  <span role="columnheader">Observed result</span>
                </div>
                <div className="dv-strip__row" role="row">
                  <p role="cell">A follow-up case I added, not participant feedback: an owner may later need to give one restricted file back.</p>
                  <p role="cell">A restore task: share File A only, with the scope stated before and after confirming.</p>
                  <p role="cell">A participant <mark>completed the restore task without guidance</mark> and correctly explained the resulting access: Alex could open the shared file and the unrestricted project files.</p>
                </div>
              </div>
              <div className="dv-verify">
                <h3>Prototype checks, separate from testing</h3>
                <p>
                  I ran restrict, then share-again, as one sequence in both versions without a reset. Simulated direct-link
                  previews showed File A opening for Alex as Viewer while Private files stayed blocked. This confirms the
                  prototype behaves as designed; it is not user evidence.
                </p>
              </div>
            </section>

            {/* Outcome */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Outcome" title="An early signal, with clear limits." />
              <dl className="dv-results">
                <div>
                  <dt>Observed</dt>
                  <dd>A participant <mark>completed the restore task without guidance</mark>, with a correct explanation of who could open what.</dd>
                </div>
                <div>
                  <dt>Intended benefit</dt>
                  <dd>Clearer decisions about access to selected files, without breaking collaboration on the rest.</dd>
                </div>
                <div>
                  <dt>Not measured</dt>
                  <dd>Security outcomes, adoption, support load or time saved.</dd>
                </div>
                <div>
                  <dt>Limitations</dt>
                  <dd>A small sample, repeated exposure, no conclusive A/B comparison, simulated permissions, and only some permission paths covered.</dd>
                </div>
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Understanding the model made the problem smaller, and easier to defend.">
                <p>
                  I set out to redesign removal. Learning how Drive’s permissions already work showed the capability existed.
                  My exploration pointed to an opportunity to make the existing capability easier to discover and its
                  consequences clearer. That narrowed the work to one bounded flow.
                </p>
              </Head>
              <h3 className="dv-h3">What I’d evaluate next</h3>
              <ul className="ticks">
                <li>More sessions with people who manage shared projects</li>
                <li>Whether people can predict who keeps access before they confirm</li>
                <li>Unintended changes, such as removing the wrong person</li>
                <li>A comparison with the current Drive workflow</li>
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
