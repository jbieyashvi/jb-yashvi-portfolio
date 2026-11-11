import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import '../case-rv.css'
import CaseSidebar from '../components/CaseSidebar'
import CompassStory from '../components/CompassStory'
import External from '../components/External'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead, { warmUp } from '../components/loadAhead'
import type { ImageItem } from '../data/images'
import { mid } from '../components/srcset'
import CaseImpact from '../components/CaseImpact'
import { MarkedTitle, Pin, Tape, type TitleMark } from '../components/CaseFlair'
import useCaseReveal from '../components/useCaseReveal'

const LIVE = 'https://compass-mapperv2.vercel.app/worklist'
const PDF = `${import.meta.env.BASE_URL}work/compass/cmp-autobot-design-system.pdf`
const DIR = '/work/compass'

/** A photo from the project, taped up at a slight tilt like the screens */
function Photo({ name, tone, r, alt, cap }: { name: string; tone: 'sun' | 'sky' | 'rose' | 'lilac'; r: number; alt: string; cap: string }) {
  return (
    <figure className="cp-photo" data-reveal>
      <div className="cs-pin" style={{ '--r': `${r}deg` } as CSSProperties}>
        <Tape tone={tone} />
        <img
          src={`${DIR}/${name}-800.webp`}
          srcSet={`${DIR}/${name}-800.webp 800w, ${DIR}/${name}-1170.webp 1170w`}
          sizes="(max-width: 760px) 92vw, 640px"
          width={1170}
          height={635}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="dv-cap">{cap}</figcaption>
    </figure>
  )
}

/** Where each screen comes from: my own files, the live prototype, an exploration or the PDF */
const FINAL = 'Final design: My Tasks. Screenshot from my files.'
const EXPLORATION = 'Exploration. Screenshot from my files.'
const LIVE_CAPTURE = 'Live prototype at compass-mapperv2.vercel.app, captured October 2026. Demo data.'
const FROM_PDF = 'From the CMP Autobot design system PDF.'


/** Every screen the enlarged view steps through, in reading order */
const shots = {
  'final-worklist': {
    w: 1800,
    h: 1026,
    caption: 'My Tasks: the table-based worklist',
    label: FINAL,
    alt: 'CMP Autobot My Tasks worklist. Status filters across the top: All 677, Matches 499, Likely Matches 5, No Match 172 and Mapped 1, with Expand All, a search field, Columns and Filter. Each row shows an ingredient (MOG), its suggested article with pack size, code and category path, a status pill and Confirm, Reject and Link APL buttons. A Retired row for Barley Whole shows a faded Resolve and Link APL. Veg Nuggets Frozen has an expand arrow and “+1”. Footer: Showing 504 of 676 open mappings.',
  },
  'deep-bulkconfirm': {
    w: 1300,
    h: 604,
    caption: 'Bulk confirm previews every pairing first',
    label: LIVE_CAPTURE,
    alt: 'Confirm mapping dialog, “2 articles”: “Review the MOG → Article pairings below. This action maps each selected article to its parent ingredient.” A table lists Schezwan Sauce RTU and Falafel Frozen with their articles and codes. Cancel and Confirm 2 mappings.',
  },
  'deep-bulkreject': {
    w: 1300,
    h: 1102,
    caption: 'Bulk reject: one reason for every selected article',
    label: LIVE_CAPTURE,
    alt: 'Reject articles dialog for 2 articles: “Review the rejections below, then pick a reason. The reason applies to every selected article.” A table of the two MOGs and articles, a required Reason list (Price too high, Wrong pack size, Incorrect category, Duplicate article, Not available at site, Quality concerns), optional Additional notes, Cancel and Reject 2 articles.',
  },
  'deep-nomatch': {
    w: 1800,
    h: 556,
    caption: 'No Match: Link APL is the only way forward',
    label: LIVE_CAPTURE,
    alt: 'The No Match tab, 172 rows. Each row, such as Chicken Spring Roll Frozen, Apricot Jam and Tomato Juice, reads “No Articles”. Confirm and Reject are faded on every row and Link APL is the only active action. Expand All is faded and rows have no checkbox.',
  },
  'deep-toggle': {
    w: 1800,
    h: 156,
    caption: 'After testing: a decision can be switched',
    label: LIVE_CAPTURE,
    alt: 'Two rows after a decision. Pizza Sauce RTU was confirmed: its Confirm is faded and Reject is still active. Chicken Patty Frozen was rejected: its Reject is faded and Confirm is still active. Both keep Link APL.',
  },
  'deep-default': {
    w: 1800,
    h: 86,
    caption: 'After testing: the star sets the default article',
    label: LIVE_CAPTURE,
    alt: 'The Veg Nuggets Frozen row, “+1”, after starring its second candidate. The row now leads with Nuggets … #977279, with a filled yellow star, reason chips “✗ Pack size ✓ Price”, a Matches pill, and Confirm, Reject and Link APL.',
  },
  'deep-dashboard': {
    w: 1800,
    h: 1102,
    caption: 'Dashboard: where the day stands',
    label: LIVE_CAPTURE,
    alt: 'CMP Autobot Current Status dashboard. Today’s progress gauge: 0 / 20 MOGs completed, +12 new today, Continue mapping, Target 31 May 2026. Needs attention: 30 Articles in Likely Matches need a decision. Needs transition: 1 Article Retired. Totals: 676 MOGs, 0 incremental, 1 mapped, 675 unmapped, 4626 APLs. Work progress cards for Matches, Likely Matches, No Match and Retired, each with a one-line description, a progress bar, remaining and new today counts, open and done counts and View tasks.',
  },
  'deep-config': {
    w: 1800,
    h: 1102,
    caption: 'Settings: targets per site',
    label: LIVE_CAPTURE,
    alt: 'Settings, Configuration tab. Global default target 31/05/2026 with Save default, and “Exercise started on 04 Mar 2026. Original baseline frozen at that date.” A Demo helpers card: Simulate next ODS refresh, “Pretends the nightly batch ran”, with Run now. Per-site target dates: Hyderabad override 31/05/2026, Noida default 31/05/2026, Bangalore override 15/06/2026.',
  },
  'table-expanded': {
    w: 1800,
    h: 1024,
    caption: 'Exploration: a table with one ingredient expanded',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot My Tasks table. Tabs All 98, Likely Matches 29, Unmapped Articles 28, Matches 9 and Mapped 32. Vermicelli Roasted is expanded to show five candidate articles, each with Confirm and Reject, and a Link New option. Other rows show one article each with Confirm, Reject and Link New.',
  },
  'tasks-detail': {
    w: 1800,
    h: 1020,
    caption: 'Exploration: list and detail',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot My Tasks layout in list-and-detail view. Queue cards at the top left: 31 Likely Matches, 16 No Match, 10 Matches and 3 Retiring. Below, a list of ingredients with Mustard Seeds Black selected. On the right, two candidate articles, the first marked TOP PICK, each with Confirm and a dismiss cross; a CMP Autobot summary listing the checks it passed; and an Enter into CookBook button.',
  },
  'v1-cookbook': {
    w: 1800,
    h: 1023,
    caption: 'Exploration: a separate CookBook Entry page',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot CookBook Entry page. Tabs Pending 32 and Completed 0 over a list of ingredients. The main card, under “Manual entry queue — Enter these in CookBook”, shows Granular Sugar marked Green · Confirmed, “No APL to enter — log the action in CookBook”, what was acted on, and who reviewed it. A Mark entered in CookBook button with arrows to move between cards.',
  },
  'v1-review': {
    w: 1800,
    h: 980,
    caption: 'Exploration: item detail with a match confidence',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot worklist with Baking Soda selected in the Amber queue. Match confidence 75 out of 100, “Likely match”, with the note “Bot suggests this match — confirm before entry”. Audit log, Add APL and Confirm match buttons. A CMP Autobot summary and “What the bot checked”, with APL evidence below.',
  },
  'v1-priorities': {
    w: 1800,
    h: 980,
    caption: 'Exploration: a start page of ranked priorities',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot worklist. Queue tabs Amber 30, Red 16, Green 10 and Blue 3 above a list of ingredients. The main area reads “Aman, your top priorities for today. The Autobot ranked these by SLA risk”, with three Amber items. Sidebar: Dashboard, Worklist, CookBook Entry, Exceptions, Audit Trail and Settings.',
  },
  'v1-exceptions': {
    w: 1800,
    h: 1020,
    caption: 'Exploration: exceptions as list and detail',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot Exceptions page. Tabs MAM Type A 3, MAM Type B 3 and APL Quarantine 2. Curry Leaves Fresh is selected: “no APL in SAP”, with details and a Mark resolved button.',
  },
  'exceptions-table': {
    w: 1800,
    h: 980,
    caption: 'Exploration: exceptions as a table',
    label: EXPLORATION,
    alt: 'An earlier CMP Autobot Exceptions queue table. Six articles flagged Missing Shelf Type, Missing Category or Missing Fields, each with its category path. Four rows have a Notify SAP button; two are marked Resolved.',
  },
  'public-settings': {
    w: 1800,
    h: 1024,
    caption: 'Settings: the same table and controls in user management',
    label: LIVE_CAPTURE,
    alt: 'CMP Autobot Settings, User management: a table of users with role badges, site chips and Active switches, and an Add user button.',
  },
  'pdf-status': {
    w: 1800,
    h: 581,
    caption: 'Status and queue colours',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Status & Queue Colors: Green Matches #14874E, Amber Likely #CA8A10, Red No Match #D33B36 and Blue Retired #193CB8, each with its soft background, and a note on queue semantics.',
  },
  'pdf-decisions': {
    w: 1800,
    h: 1229,
    caption: 'Review actions, badges and inputs',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Worklist Decision Buttons, Badges, and Inputs & Select: soft green Confirm, soft red Reject and a Link APL button, badge variants, and Full name, Email, Role and search fields.',
  },
  'pdf-table': {
    w: 1800,
    h: 590,
    caption: 'The worklist table',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Worklist Table: rows for three articles with their ingredient, confidence, a queue pill (Matches, Likely Matches, No Match) and a Confirm, Confirm and Reject, or Link APL action.',
  },
  'pdf-brand': {
    w: 1800,
    h: 1035,
    caption: 'Brand gold and neutral surfaces',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Brand Gold and Surfaces: swatches for Brand #C68A1E, Brand Hover #B27A18, Brand Ink #7A5310, Brand Soft #FFF1D6 and Primary #232932, then Background #FEFDFC, Card #FFFFFF, Secondary #F0F2F4 and Accent #EBEFF4.',
  },
  'pdf-type': {
    w: 1800,
    h: 1626,
    caption: 'Typeface and type scale',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Typeface and Type Scale: a large Inter “Aa” specimen and a table of tokens Display 36px, H1 26px, H2 18px, H3 14px, Body 13px, Small 12px, Label 11px and Mono 11px with line heights, letter spacing and usage.',
  },
  'pdf-spacing': {
    w: 1800,
    h: 987,
    caption: 'Spacing scale',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Spacing Scale: dots from 2px to 24px and a table mapping tokens 0.5 to 6 to their pixel sizes and uses, from icon gaps to page gutters.',
  },
  'pdf-buttons': {
    w: 1800,
    h: 755,
    caption: 'Button variants and sizes',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Button Variants and Sizes: Default, Secondary, Outline, Ghost, Destructive and Link buttons, then small, default, large, extra-large and icon sizes with a disabled state.',
  },
  'pdf-toggles': {
    w: 1800,
    h: 784,
    caption: 'Selection controls',
    label: FROM_PDF,
    alt: 'Design system PDF excerpt, Checkbox and Toggle Switch: unchecked, checked green and indeterminate amber checkboxes, a site multi-select list, and switches for on, off, disabled and active.',
  },
} satisfies Record<string, { w: number; h: number; caption: string; label: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]
const items: ImageItem[] = order.map((slug) => ({ slug, src: `${DIR}/${slug}`, ...shots[slug] }))

/** x, y, width, height in the screenshot's own pixels */
type Box = readonly [number, number, number, number]

/**
 * Where to look in each screen. Inline, a screen shows only the part its text is about: a crop of
 * the screenshot, or a focus-* image cut by scripts/focus-crops.mjs where columns are joined. A
 * ring marks the detail inside it. The enlarged view still opens the full screen.
 */
const focus: Partial<Record<Shot, { crop?: Box; small?: Box; file?: { name: string; w: number; h: number }; ring?: Box }>> = {
  'deep-bulkreject': { crop: [40, 120, 1220, 640], small: [40, 440, 1220, 320], ring: [58, 486, 1188, 262] },
  'deep-nomatch': { file: { name: 'focus-nomatch', w: 996, h: 320 }, ring: [672, 50, 194, 264] },
  'deep-toggle': { file: { name: 'focus-toggle', w: 736, h: 156 }, ring: [404, 22, 324, 114] },
  'deep-default': { file: { name: 'focus-default', w: 960, h: 86 }, ring: [714, 12, 48, 40] },
  'deep-dashboard': { crop: [320, 70, 1460, 500], small: [1276, 66, 502, 176], ring: [1286, 76, 482, 156] },
  'deep-config': { crop: [330, 400, 1440, 218], small: [330, 400, 950, 218] },
}

const pct = (n: number) => `${(n * 100).toFixed(3)}%`

/** A screen that opens the enlarged view */
function Screen({ slug, open, size = 'full', sizes = '(max-width: 760px) 100vw, 520px', eager }: {
  slug: Shot
  open: (i: number) => void
  size?: 'sm' | 'md' | 'full'
  sizes?: string
  eager?: boolean
}) {
  const shot = shots[slug]
  const src = `${DIR}/${slug}`
  const f = focus[slug]
  if (f) {
    // the frame is the crop, the focus image or the whole screen; the ring is placed within it.
    // Phones can take a tighter crop (small), set as a second set of variables the CSS switches to.
    const frame = (c?: Box): Box => c ?? (f.file ? [0, 0, f.file.w, f.file.h] : [0, 0, shot.w, shot.h])
    const vars = (c: Box, end = '') => {
      const [fx, fy, fw, fh] = c
      const v: Record<string, string> = { [`--ar${end}`]: `${fw} / ${fh}` }
      if (f.crop) Object.assign(v, { [`--iw${end}`]: pct(shot.w / fw), [`--il${end}`]: pct(-fx / fw), [`--it${end}`]: pct(-fy / fh) })
      if (f.ring) {
        const [rx, ry, rw, rh] = f.ring
        Object.assign(v, { [`--rl${end}`]: pct((rx - fx) / fw), [`--rt${end}`]: pct((ry - fy) / fh), [`--rw${end}`]: pct(rw / fw), [`--rh${end}`]: pct(rh / fh) })
      }
      return v
    }
    const style = { ...vars(frame(f.crop)), ...(f.small ? vars(f.small, '-s') : {}) } as CSSProperties
    return (
      <div className={`dv-screen dv-screen--${size}`}>
        <button type="button" className="dv-screen__zoom dv-focus" onClick={() => open(order.indexOf(slug))} aria-label={`Enlarge the full screen: ${shot.caption}`}>
          <span className={`dv-focus__frame${f.crop ? ' dv-focus__frame--crop' : ''}`} style={style}>
            <img
              src={f.file ? `${DIR}/${f.file.name}-1800.webp` : `${src}-1800.webp`}
              width={f.file?.w ?? shot.w}
              height={f.file?.h ?? shot.h}
              alt={shot.alt}
              loading={eager ? 'eager' : 'lazy'}
              ref={eager ? undefined : loadAhead}
              decoding="async"
            />
            {f.ring && <span className="dv-focus__ring" aria-hidden="true" />}
          </span>
          <span className="dv-focus__full" aria-hidden="true"><span className="dv-focus__word">Full screen </span>⤢</span>
        </button>
      </div>
    )
  }
  return (
    <div className={`dv-screen dv-screen--${size}`}>
      <button type="button" className="dv-screen__zoom" onClick={() => open(order.indexOf(slug))} aria-label={`Enlarge: ${shot.caption}`}>
        <img
          src={`${src}-1800.webp`}
          srcSet={`${src}-800.webp 800w, ${mid(src, shot.w)}${src}-1800.webp ${shot.w}w`}
          sizes={sizes}
          width={shot.w}
          height={shot.h}
          alt={shot.alt}
          loading={eager ? 'eager' : 'lazy'}
          ref={eager ? undefined : loadAhead}
          decoding="async"
        />
      </button>
    </div>
  )
}

/** The workflow end to end: who does each step, and whether the prototype shows it */
const flow = [
  { kind: 'ai', shown: true, who: 'Autobot', name: 'Suggest', body: 'Finds a match' },
  { kind: 'human', shown: true, who: 'Operator', name: 'Review', body: 'Confirm or reject' },
  { kind: 'list', shown: true, who: 'Platform', name: 'Track', body: 'Counts update' },
  { kind: 'external', shown: false, who: 'Outside', name: 'CookBook', body: 'Typed in by hand' },
  { kind: 'ack', shown: false, who: 'Operator', name: 'Mark done', body: 'Closes the item' },
  { kind: 'system', shown: true, who: 'Platform', name: 'Dashboard', body: 'Shows progress' },
] as const

function Flow() {
  return (
    <figure className="cp-flow-wrap">
      <p id="flow-label" className="dv-diagram-label">How the work moves</p>
      <ol className="cp-flow" aria-labelledby="flow-label">
        {flow.map((s, i) => (
          <li key={s.name} className={`cp-flow__step cp-flow__step--${s.kind}${s.shown ? '' : ' cp-flow__step--off'}`}>
            <span className="cp-flow__who">{s.who}</span>
            <strong className="cp-flow__name"><span className="cp-flow__num">{i + 1}</span> {s.name}</strong>
            <span className="cp-flow__body">{s.body}</span>
            {!s.shown && <span className="sr-only">Not in this build.</span>}
          </li>
        ))}
      </ol>
      <figcaption className="dv-cap cp-flow__key">
        <span className="cp-flow__swatch" aria-hidden="true" /> Dashed steps happen outside this build.
      </figcaption>
    </figure>
  )
}

/** What each status means and what the row lets you do, as observed in the prototype */
const queues = [
  { key: 'match', name: 'Matches', means: 'The Autobot is fairly sure.', can: 'Confirm, Reject, Link APL', job: 'Clear them fast.' },
  { key: 'likely', name: 'Likely Matches', means: 'The Autobot isn’t sure.', can: 'Confirm, Reject, Link APL', job: 'Check before deciding.' },
  { key: 'none', name: 'No Match', means: 'No article suggested.', can: 'Link APL only', job: 'Find the article.' },
  { key: 'retired', name: 'Retired', means: 'The article is no longer sold.', can: 'Resolve, Reject', job: 'Pick a replacement.' },
  { key: 'mapped', name: 'Mapped', means: 'Confirmed.', can: 'Nothing left to do', job: 'Done.' },
] as const

/** The layouts explored, and the confirmed final one; trade-offs are my own analysis */
const approaches = [
  {
    key: 'A',
    title: 'Table with expandable rows',
    shot: 'table-expanded',
    does: 'One row per ingredient. Expand it to see every candidate.',
    good: 'Scanning and comparing many items.',
    hard: 'Long rows push the rest of the list down.',
  },
  {
    key: 'B',
    title: 'List and detail',
    shot: 'tasks-detail',
    does: 'A list on the left, the selected item in full on the right.',
    good: 'Looking closely at one hard item.',
    hard: 'Slow when most items are easy.',
  },
  {
    key: 'C',
    title: 'Separate CookBook queue',
    shot: 'v1-cookbook',
    does: 'Confirmed items move to their own page, to be entered in CookBook.',
    good: 'Shows the work left after review.',
    hard: 'One more page, and two kinds of “done”.',
  },
  {
    key: 'D',
    final: true,
    title: 'Table-based My Tasks',
    shot: 'final-worklist',
    does: 'The table from A, with the Autobot’s reasons from B as an optional column.',
    good: 'Many decisions in a row, without leaving the table.',
    hard: 'Only room for short reasons in a row.',
  },
] as const

/**
 * The four layouts as one scroll: the text steps through A to D while the screen beside it holds
 * still and changes to match. On small screens each step simply shows its own screen.
 */
function Approaches({ open }: { open: (i: number) => void }) {
  const ref = useRef<HTMLOListElement>(null)
  const [on, setOn] = useState(0)

  useEffect(() => {
    const steps = ref.current?.querySelectorAll<HTMLElement>('[data-step]')
    if (!steps) return
    // the step crossing the middle of the screen is the one shown
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setOn(Number((e.target as HTMLElement).dataset.step))
    }, { rootMargin: '-45% 0px -50% 0px' })
    steps.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <div className="cp-scroll">
      <ol ref={ref} className="cp-scroll__steps">
        {approaches.map((a, i) => {
          const final = 'final' in a
          return (
            <li key={a.key} data-step={i} className={`cp-scroll__step${i === on ? ' is-on' : ''}${final ? ' cp-scroll__step--final' : ''}`}>
              <p className={`cp-pair__tag${final ? ' cp-pair__tag--final' : ''}`}>{final ? 'Final design' : 'Exploration'}</p>
              <h3><span className="dv-badge">{a.key}</span> {a.title}</h3>
              <div className="cp-scroll__inline">
                <Screen slug={a.shot} open={open} />
                <span className={`cp-stamp${final ? ' cp-stamp--final' : ''}`} aria-hidden="true">{final ? 'Chosen ✓' : 'Explored'}</span>
              </div>
              <p className="cp-scroll__does">{a.does}</p>
              <ul className="cp-pros">
                <li className="cp-pros__good"><span className="sr-only">Good for: </span>{a.good}</li>
                <li className="cp-pros__hard"><span className="sr-only">Harder: </span>{a.hard}</li>
              </ul>
            </li>
          )
        })}
      </ol>
      <div className="cp-scroll__stage">
        <p className="cp-scroll__dots" aria-hidden="true">
          {approaches.map((a, i) => <span key={a.key} className={i === on ? 'is-on' : undefined}>{a.key}</span>)}
        </p>
        <div className="cp-scroll__frame">
          {approaches.map((a, i) => (
            <div key={a.key} className={`cp-scroll__shot${i === on ? ' is-on' : ''}`} inert={i !== on}>
              <Screen slug={a.shot} open={open} sizes="(max-width: 1100px) 60vw, 600px" />
              <span className={`cp-stamp${'final' in a ? ' cp-stamp--final' : ''}`} aria-hidden="true">{'final' in a ? 'Chosen ✓' : 'Explored'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** My part, end to end; each card points to where it is shown */
const role = [
  { icon: 'flow', title: 'Workflow', body: 'One flow, three screens, four queues.', href: '#flow', link: 'How it works' },
  { icon: 'layout', title: 'Interface', body: 'Four layouts explored, then three key decisions in My Tasks.', href: '#approaches', link: 'Approaches' },
  { icon: 'system', title: 'Design system', body: 'Built on shadcn/ui and Radix, documented in a PDF.', href: '#system', link: 'Design system' },
  { icon: 'code', title: 'Built with AI', body: 'I implemented the interface myself, with AI.', href: LIVE, link: 'Open the prototype' },
  { icon: 'fix', title: 'After testing', body: 'Fixed the two problems the client’s team found.', href: '#after', link: 'After testing' },
] as const

/** Small line icons for the role strip, drawn on a 24px grid */
const ICONS: Record<(typeof role)[number]['icon'], string> = {
  flow: 'M4 6h5v5H4zM15 13h5v5h-5zM9 8.5h3.5a2 2 0 0 1 2 2v5',
  layout: 'M3.5 5h17v14h-17zM3.5 9.5h17M9 9.5V19',
  system: 'M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM16 13v6M13 16h6',
  code: 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  fix: 'M5 12.5l4.5 4.5L19 7.5',
}

/** Problem, what I did, why: the same three beats for every decision, as three coloured notes */
function Beats({ need, does, why, did = 'What I did' }: { need: string; does: string; why: string; did?: string }) {
  return (
    <dl className="cp-beats">
      <div className="cp-beat cp-tone--rose"><dt>Problem</dt><dd>{need}</dd></div>
      <div className="cp-beat cp-tone--sky"><dt>{did}</dt><dd>{does}</dd></div>
      <div className="cp-beat cp-tone--sun"><dt>Why</dt><dd>{why}</dd></div>
    </dl>
  )
}

/** Three decisions in My Tasks: how much checking each action asks for */
const decisions = [
  {
    title: 'One click for one row, a preview for many',
    shot: 'deep-bulkconfirm',
    need: 'A pop-up on every Confirm slows people down, but one wrong row in a batch of twenty is easy to miss.',
    does: 'Confirm on one row works straight away. Confirming several first lists every pairing.',
    why: 'The bigger the possible mistake, the more checking it gets.',
  },
  {
    title: 'Every rejection has a reason',
    shot: 'deep-bulkreject',
    need: 'A plain “no” doesn’t say what went wrong.',
    does: 'Reject asks for a reason from a short list. In bulk, one reason covers every selected row.',
    why: 'The reasons match the Autobot’s checks, so each one says which check failed.',
  },
  {
    title: 'No Match rows only offer what helps',
    shot: 'deep-nomatch',
    wide: true,
    need: 'With no suggestion, there’s nothing to confirm or reject.',
    does: 'Confirm and Reject are greyed out. Link APL is the only action.',
    why: 'The buttons stay in the same place on every row, so nobody has to look for them.',
  },
] as const

/** What changed once the client's team tested it; reported by them, not measured */
const changes = [
  {
    title: 'Decisions can be switched',
    shot: 'deep-toggle',
    saw: 'Operators sometimes rejected an article they meant to confirm, or the other way round, with no easy way back.',
    did: 'After Confirm, Reject stays available, and the other way round. The button you pressed greys out.',
    why: 'Mistakes like this are often noticed later. Now the fix is right on the row.',
  },
  {
    title: 'A star for the first choice',
    shot: 'deep-default',
    saw: 'Some ingredients have more than one correct article, like two pack sizes. Operators needed to mark which comes first.',
    did: 'Each article has a star. The starred one becomes the default and shows first in the row.',
    why: 'Which article comes first is a different question from whether it’s right, so it got its own control.',
  },
] as const

/** Other explored screens, kept as supporting depth */
const explored = ['v1-review', 'v1-priorities', 'v1-exceptions', 'exceptions-table'] as const

/** The design system, each part tied to the work it supports */
const system = [
  { shot: 'pdf-status', title: 'Status colours', body: 'One colour per queue, always with a text label.' },
  { shot: 'pdf-decisions', title: 'Action buttons', body: 'Confirm, Reject and Link APL look the same everywhere.' },
  { shot: 'pdf-table', title: 'Compact tables', body: 'Small, clear text so many rows fit on screen.' },
  { shot: 'public-settings', title: 'Reused in Settings', body: 'The same table and switches manage users.' },
] as const

const library = ['pdf-brand', 'pdf-type', 'pdf-spacing', 'pdf-buttons', 'pdf-toggles'] as const

/** Supporting depth, closed by default: a native disclosure, so keyboard and screen readers work */
function More({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="dv-more">
      <summary onPointerEnter={warmUp} onFocus={warmUp}>{title}</summary>
      <div className="dv-more__body">{children}</div>
    </details>
  )
}

function Head({ id, kicker, title, mark, children }: { id: string; kicker: string; title: string; mark?: TitleMark; children?: React.ReactNode }) {
  return (
    <header className="dv-head" data-reveal>
      <p className={mark ? `dv-kicker cs-kicker cs-kicker--${mark.tone}` : 'dv-kicker'}>{kicker}</p>
      <h2 id={`${id}-title`} className="dv-h2"><MarkedTitle title={title} mark={mark} /></h2>
      {children}
    </header>
  )
}

/** The operator's brief, phrase by phrase, each tied to the part of the design that answers it */
const brief = [
  { text: 'see why', tone: 'sky', answer: 'An optional Reason column with the Autobot’s checks', href: '#approaches' },
  { text: 'decide quickly', tone: 'sun', answer: 'One click per row, a preview for many', href: '#decisions' },
  { text: 'fix it if I get it wrong', tone: 'rose', answer: 'Any decision can be switched on the row', href: '#after' },
] as const

/** Before and after, drawn: two tools with work going back and forth, then one table */
function TwoToOne() {
  return (
    <figure className="cp-two1">
      <div className="cp-two1__side">
        <svg viewBox="0 0 220 150" className="cp-two1__art" aria-hidden="true">
          {/* the spreadsheet */}
          <rect className="cp-ink cp-fill" x="8" y="22" width="112" height="96" rx="6" />
          <path className="cp-ink" d="M8 40h112M8 58h112M8 76h112M8 94h112M44 40v78M82 40v78" />
          {/* the other tool */}
          <rect className="cp-ink cp-fill" x="132" y="44" width="80" height="78" rx="6" />
          <path className="cp-ink" d="M132 60h80M142 74h44M142 86h56M142 98h36" />
          {/* the back and forth */}
          <path className="cp-ink cp-ink--accent" d="M70 14c24-16 70-14 96 22" />
          <path className="cp-ink cp-ink--accent" d="M158 30l9 7 1-11" />
          <path className="cp-ink cp-ink--accent" d="M170 136c-22 14-70 12-96-14" />
          <path className="cp-ink cp-ink--accent" d="M82 128l-9-6-2 11" />
        </svg>
        <p className="cp-two1__label"><span>Before</span> Excel plus another tool</p>
        <p className="cp-hand">“confusing and slow”</p>
      </div>
      <svg viewBox="0 0 60 30" className="cp-two1__arrow" aria-hidden="true">
        <path className="cp-ink" d="M4 17c14-8 32-8 48-2M44 7l9 8-11 5" />
      </svg>
      <div className="cp-two1__side">
        <svg viewBox="0 0 220 150" className="cp-two1__art" aria-hidden="true">
          <rect className="cp-ink cp-fill" x="20" y="18" width="180" height="114" rx="6" />
          <path className="cp-ink" d="M20 38h180" />
          {[56, 76, 96, 116].map((y, i) => (
            <g key={y}>
              <circle className={`cp-dot cp-dot--${['match', 'likely', 'none', 'retired'][i]}`} cx="36" cy={y - 4} r="4.5" />
              <path className="cp-ink" d={`M50 ${y - 4}h78`} />
              <rect className="cp-ink" x="148" y={y - 11} width="38" height="14" rx="4" />
            </g>
          ))}
        </svg>
        <p className="cp-two1__label"><span>After</span> One table for the whole review</p>
        <p className="cp-hand">confirm, reject or fix, in the row</p>
      </div>
      <figcaption className="sr-only">Before: the review was split across Excel and another tool. After: one table.</figcaption>
    </figure>
  )
}

/** What a match is: the ingredient a recipe needs, the article bought for it, and who does what */
function MatchIdea() {
  return (
    <figure className="cp-match">
      <ol className="cp-match__row">
        <li className="cp-match__card">
          <span className="cp-match__kind">MOG · what a recipe needs</span>
          <strong>Pizza Sauce RTU</strong>
        </li>
        <li className="cp-match__step cp-match__step--ai"><span>The Autobot suggests</span></li>
        <li className="cp-match__card cp-match__card--article">
          <span className="cp-match__kind">Article · what is bought</span>
          <span className="cp-match__lines" aria-hidden="true"><i /><i /><i /></span>
          <span className="cp-match__fields">a brand, a pack size, a code</span>
        </li>
        <li className="cp-match__step cp-match__step--you"><span>A person decides</span></li>
        <li className="cp-match__card cp-match__card--decide">
          <span className="cp-match__kind">The operator</span>
          <span className="cp-match__btns"><b>Confirm</b><b>Reject</b><b>Link APL</b></span>
        </li>
      </ol>
      <figcaption className="dv-cap">An illustration of one match. The real worklist has 676 MOGs and 4,626 articles for one site.</figcaption>
    </figure>
  )
}

const WIDE = '(max-width: 1100px) 100vw, 980px'

const sections = [
  { id: 'impact', label: 'Impact' },
  { id: 'problem', label: 'The problem' },
  { id: 'role', label: 'What I did' },
  { id: 'flow', label: 'How it works' },
  { id: 'approaches', label: 'Approaches' },
  { id: 'decisions', label: 'Design decisions' },
  { id: 'after', label: 'After testing' },
  { id: 'progress', label: 'Progress & targets' },
  { id: 'system', label: 'Design system' },
  { id: 'reflection', label: 'Reflection' },
]

/** Impact: user and site counts as of November 2026; the rest is from the shipped screens */
const impact = [
  { tone: 'sun', value: '30+', label: 'People using the platform' },
  { tone: 'mint', value: '7+ sites', label: 'Running their mapping review on it' },
  { tone: 'sky', value: '1 table', label: 'Replaced a review split across Excel and another tool' },
  { tone: 'rose', value: '6 reasons', label: 'Every rejection now says what went wrong' },
] as const

export default function Compass() {
  useTitle('Compass Group — Helping operators review AI ingredient matches | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)
  useCaseReveal()

  return (
    <article className="dv dv--rv">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type cp-client">
            <img className="cp-client__logo" src={`${import.meta.env.BASE_URL}work/compass/compass-logo.webp`} width={407} height={160} alt="Compass Group" />
            <img className="cp-client__logo cp-client__logo--dark" src={`${import.meta.env.BASE_URL}work/compass/compass-logo-dark.webp`} width={407} height={160} alt="" />
            <span>CMP Autobot</span>
          </p>
          <h1 className="dv-top__title">Helping operators review AI ingredient matches</h1>
          <p className="dv-top__lede">
            <mark>The AI suggests, a person decides.</mark> I designed the worklist where kitchen operators check its
            suggestions and confirm, reject or fix them, hundreds at a time.
          </p>
          <dl className="dv-top__meta cp-meta">
            <div>
              <dt>Client</dt>
              <dd>Compass Group India</dd>
            </div>
            <div>
              <dt>Time</dt>
              <dd>5 weeks, then fixes after testing</dd>
            </div>
            <div>
              <dt>My part</dt>
              <dd>The workflow, the screens and the design system. I also built the interface myself, with AI.</dd>
            </div>
            <div>
              <dt>Not mine</dt>
              <dd>The AI model, the backend and the data connections</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>Used every day by the client’s team</dd>
            </div>
          </dl>
          <figure className="cp-cover">
            <img
              src={`${DIR}/cover-1200.webp`}
              srcSet={`${DIR}/cover-800.webp 800w, ${DIR}/cover-1200.webp 1200w, ${DIR}/cover-1600.webp 1600w`}
              sizes="(max-width: 1200px) 92vw, 1120px"
              width={1600}
              height={1000}
              alt="The CMP Autobot dashboard in a browser window, beside a card of design tokens: the amber brand colour, Inter, four queue status pills and Confirm and Reject buttons. The signed-in name is blurred."
              fetchPriority="high"
              decoding="async"
            />
          </figure>
        </div>
      </header>

      <CompassStory />

      <div className="dv-shell">
        <div className="dv-shell__inner dv-shell__grid">
          <CaseSidebar sections={sections} />

          <div className="dv-main">
            <CaseImpact
              title="One place for the review, used every day."
              lede="More than 30 people across 7+ sites now do their mapping review here, every day, instead of in Excel and another tool. Each decision carries its reason, and a wrong click can be undone on the same row."
              stats={impact}
              note="User and site counts as of November 2026. I don’t have measured figures for time saved or accuracy."
            />

            {/* The problem */}
            <section id="problem" className="dv-sec dv-sec--first" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="Matching ingredients to articles, by hand." mark={{ text: 'by hand.', tone: 'rose', doodle: 'under' }}>
                <p>
                  Every ingredient in Compass’s kitchens has to be linked to the product actually bought for it. An
                  Autobot suggests the link. Operators <mark>confirm it, reject it, or pick a different one</mark>.
                </p>
              </Head>
              <dl className="dv-terms" aria-label="Words used on this page">
                <div>
                  <dt>MOG</dt>
                  <dd>An ingredient a recipe needs, like Pizza Sauce RTU.</dd>
                </div>
                <div>
                  <dt>Article</dt>
                  <dd>The actual product the team buys for it, with a brand, a pack size and a code.</dd>
                </div>
                <div>
                  <dt>Autobot</dt>
                  <dd>The AI that suggests which article goes with each MOG.</dd>
                </div>
                <div>
                  <dt>APL</dt>
                  <dd>An article from the master list. Link APL means searching that list and attaching the right one.</dd>
                </div>
              </dl>
              <div data-reveal>
                <MatchIdea />
              </div>
              <div className="cp-gap" data-reveal>
                <TwoToOne />
              </div>
              <div className="cp-brief" data-reveal>
                <p className="dv-diagram-label">Workflow framing</p>
                <p className="cp-brief__line">
                  “As an operator, I want to <span className="cs-mark cs-mark--sky">see why</span> the Autobot
                  suggested an article, <span className="cs-mark cs-mark--sun">decide quickly</span>, and{' '}
                  <span className="cs-mark cs-mark--rose">fix it if I get it wrong</span>.”
                </p>
                <ol className="cp-brief__answers">
                  {brief.map((b) => (
                    <li key={b.text} className={`cs-mark--${b.tone}`}>
                      <span className="cp-brief__q">{b.text}</span>
                      <span aria-hidden="true">→</span>
                      <a href={b.href}>{b.answer}</a>
                    </li>
                  ))}
                </ol>
                <p className="dv-cap">Workflow framing from discussions with the client about where workers struggled.</p>
              </div>
              <Photo
                name="team-sketch"
                tone="sky"
                r={-1.2}
                alt="Jb and two colleagues at a table, one of them sketching boxes and arrows in a notebook"
                cap="Talking through the flow on paper with the team."
              />
            </section>

            {/* What I did */}
            <section id="role" className="dv-sec" aria-labelledby="role-title" tabIndex={-1}>
              <Head id="role" kicker="What I did" title="From the first flow to the shipped screen." mark={{ text: 'shipped screen.', tone: 'sky', doodle: 'double' }}>
                <p>
                  I owned the design end to end, and <mark>built the interface myself with AI</mark>.
                </p>
              </Head>
              <ol className="cp-strip" data-reveal>
                {role.map((r, i) => {
                  const external = r.href.startsWith('http')
                  return (
                    <li key={r.title} className="cp-strip__card">
                      <span className="cp-strip__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                      <svg className="cp-strip__icon" viewBox="0 0 24 24" aria-hidden="true"><path d={ICONS[r.icon]} /></svg>
                      <h3>{r.title}</h3>
                      <p>{r.body}</p>
                      <a className="cp-role__link" href={r.href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {r.link} <span aria-hidden="true">{external ? '↗' : '→'}</span>
                        {external && <span className="sr-only"> (opens in a new tab)</span>}
                      </a>
                    </li>
                  )
                })}
              </ol>
              <p className="cp-notmine">
                <strong>Not mine:</strong> the AI model, the backend and the data integrations, built by others.
              </p>
              <Photo
                name="at-work"
                tone="sun"
                r={1}
                alt="Jb working at a laptop at a shared table, with teammates at their laptops in the background"
                cap="Heads down on CMP Autobot, at a shared table with the team."
              />
            </section>

            {/* How it works */}
            <section id="flow" className="dv-sec" aria-labelledby="flow-title" tabIndex={-1}>
              <Head id="flow" kicker="How it works" title="Each status is a different job." mark={{ text: 'different job.', tone: 'lilac', doodle: 'under' }}>
                <p>Three screens: a Dashboard, My Tasks and Settings, for one kitchen site at a time. The status decides which buttons a row shows.</p>
              </Head>
              <ul className="cp-queues" data-reveal>
                {queues.map((q) => (
                  <li key={q.key} className={`cp-queue cp-queue--${q.key}`}>
                    <span className="cp-queue__name">{q.name}</span>
                    <span className="cp-queue__means">{q.means}</span>
                    <strong className="cp-queue__job">{q.job}</strong>
                    <span className="cp-queue__can">{q.can}</span>
                  </li>
                ))}
              </ul>
              <div className="cp-gap">
                <Flow />
              </div>
              <p className="dv-note">
                <strong>Confirming isn’t the last step.</strong> The mapping is still typed into CookBook by hand. I
                explored a screen for that (C below); it isn’t in this build.
              </p>
            </section>

            {/* Approaches explored */}
            <section id="approaches" className="dv-sec" aria-labelledby="approaches-title" tabIndex={-1}>
              <Head id="approaches" kicker="Approaches" title="Four layouts, and why the table won." mark={{ text: 'the table won.', tone: 'sun', doodle: 'under' }}>
                <p>Most items are easy, a few are hard. A table keeps the easy ones fast, and the hard ones get help inside the row.</p>
              </Head>
              <Approaches open={open} />
              <More title="Other explored screens">
                <ol className="dv-grid">
                  {explored.map((slug) => (
                    <li key={slug} className="dv-grid__item">
                      <Screen slug={slug} open={open} sizes="(max-width: 760px) 100vw, 440px" />
                      <h3>{shots[slug].caption}</h3>
                    </li>
                  ))}
                </ol>
              </More>
            </section>

            {/* Design decisions */}
            <section id="decisions" className="dv-sec" aria-labelledby="decisions-title" tabIndex={-1}>
              <Head id="decisions" kicker="Design decisions" title="Three decisions in the worklist." mark={{ text: 'Three decisions', tone: 'lilac', doodle: 'under' }}>
                <p>Small, safe actions take one click. Bigger ones ask you to check first.</p>
              </Head>
              <ol className="cp-decisions">
                {decisions.map((d, i) => (
                  <li key={d.title} className={`cp-decision${'wide' in d ? ' cp-decision--wide' : ''}`} data-reveal>
                    <h3><span className="dv-badge">{String.fromCharCode(65 + i)}</span> {d.title}</h3>
                    <Screen slug={d.shot} open={open} sizes={'wide' in d ? WIDE : '(max-width: 760px) 100vw, 560px'} />
                    <Beats need={d.need} does={d.does} why={d.why} />
                  </li>
                ))}
              </ol>
            </section>

            {/* After testing */}
            <section id="after" className="dv-sec" aria-labelledby="after-title" tabIndex={-1}>
              <Head id="after" kicker="After testing" title="What changed once the team tried it." mark={{ text: 'tried it.', tone: 'rose', doodle: 'double' }}>
                <p>The client’s team found two problems while testing. Both were fixed in the row itself, with no new screens.</p>
              </Head>
              <ol className="cp-decisions">
                {changes.map((c, i) => (
                  <li key={c.title} className="cp-decision cp-decision--wide" data-reveal>
                    <h3><span className="dv-badge">{i + 1}</span> {c.title}</h3>
                    <Pin tone={i ? 'lilac' : 'rose'} r={i ? 0.8 : -0.8}>
                      <Screen slug={c.shot} open={open} sizes={WIDE} />
                    </Pin>
                    <Beats need={c.saw} does={c.did} why={c.why} did="What changed" />
                  </li>
                ))}
              </ol>
            </section>

            {/* Progress & targets */}
            <section id="progress" className="dv-sec" aria-labelledby="progress-title" tabIndex={-1}>
              <Head id="progress" kicker="Progress & targets" title="A dashboard that leads into the work." mark={{ text: 'into the work.', tone: 'sun', doodle: 'under' }}>
                <p>Each site has a deadline. Every card on the dashboard opens the matching queue.</p>
              </Head>
              <ol className="cp-decisions">
                <li className="cp-decision cp-decision--wide" data-reveal>
                  <h3><span className="dv-badge">A</span> Dashboard</h3>
                  <Screen slug="deep-dashboard" open={open} sizes={WIDE} />
                  <Beats
                    need="Operators need to know how much is left and where to start."
                    does="Today’s progress, what needs attention, and one card per queue with how much is left."
                    why="Every number is a link. “30 Articles need a decision” opens exactly those rows."
                  />
                </li>
                <li className="cp-decision cp-decision--wide" data-reveal>
                  <h3><span className="dv-badge">B</span> Targets per site</h3>
                  <Screen slug="deep-config" open={open} sizes={WIDE} />
                  <Beats
                    need="Sites run on different timelines."
                    does="One default date, which each site can override."
                    why="Each site sees its own deadline, not someone else’s."
                  />
                </li>
              </ol>
            </section>

            {/* Design system */}
            <section id="system" className="dv-sec" aria-labelledby="system-title" tabIndex={-1}>
              <Head id="system" kicker="Design system" title="A small system for dense, repeated decisions." mark={{ text: 'small system', tone: 'lilac', doodle: 'under' }}>
                <p>I made the design system, built on shadcn/ui and Radix.</p>
              </Head>
              <ol className="dv-grid">
                {system.map((s) => (
                  <li key={s.shot} className="dv-grid__item">
                    <Screen slug={s.shot} open={open} sizes="(max-width: 760px) 100vw, 440px" />
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ol>
              <More title="More from the design system">
                <ol className="dv-grid">
                  {library.map((slug) => (
                    <li key={slug} className="dv-grid__item">
                      <Screen slug={slug} open={open} sizes="(max-width: 760px) 100vw, 440px" />
                      <h3>{shots[slug].caption}</h3>
                    </li>
                  ))}
                </ol>
                <p>
                  The full documentation, including tokens, components and principles, is in the{' '}
                  <a href={PDF} target="_blank" rel="noopener noreferrer">
                    design system PDF<span className="sr-only"> (opens in a new tab)</span>
                  </a>.
                </p>
              </More>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Plan for the wrong click too." mark={{ text: 'wrong click', tone: 'rose', doodle: 'under' }} />
              <div className="dv-signal cs-note cp-lesson" data-reveal>
                <Tape tone="rose" />
                <p className="dv-signal__kind">
                  <img className="cs-note__me" src="/story/me-128.webp" width={128} height={128} alt="" loading="lazy" decoding="async" />
                  What I learned
                </p>
                <p className="dv-signal__text">
                  I spent most of the time helping people make the right call. The biggest change after testing was
                  about the wrong one. With hundreds of quick decisions, <mark>undo matters as much as getting it
                  right</mark>. Next time I’d plan for it from day one.
                </p>
              </div>
              <div className="dv-end cp-end">
                <External href={LIVE}>Open the prototype</External>
                <External href={PDF}>Design system PDF</External>
              </div>
            </section>
          </div>
        </div>
      </div>

      {lightbox}
      <NextProject slug="compass" withPrevious />
    </article>
  )
}
