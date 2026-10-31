import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import External from '../components/External'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import type { ImageItem } from '../data/images'

const LIVE = 'https://compass-mapperv2.vercel.app/worklist'
const PDF = `${import.meta.env.BASE_URL}work/compass/cmp-autobot-design-system.pdf`
const DIR = '/work/compass'

/** Where each screen comes from: my own files, the live prototype, an exploration or the PDF */
const FINAL = 'Final design: My Tasks. Screenshot from my files.'
const EXPLORATION = 'Exploration. Screenshot from my files.'
const LIVE_CAPTURE = 'Live prototype at compass-mapperv2.vercel.app, captured October 2026. Demo data.'
const FROM_PDF = 'From the CMP Autobot design system PDF.'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'context', label: 'Context' },
  { id: 'map', label: 'How it fits together' },
  { id: 'queues', label: 'Four queues' },
  { id: 'approaches', label: 'Approaches explored' },
  { id: 'decisions', label: 'Design decisions' },
  { id: 'finding', label: 'Finding the work' },
  { id: 'after', label: 'After launch' },
  { id: 'progress', label: 'Progress & targets' },
  { id: 'system', label: 'Design system' },
  { id: 'outcome', label: 'Outcome' },
  { id: 'reflection', label: 'Reflection' },
]

/** Every screen the enlarged view steps through, in reading order */
const shots = {
  'final-worklist': {
    w: 1800,
    h: 1026,
    caption: 'My Tasks: the table-based worklist',
    label: FINAL,
    alt: 'CMP Autobot My Tasks worklist. Status filters across the top: All 677, Matches 499, Likely Matches 5, No Match 172 and Mapped 1, with Expand All, a search field, Columns and Filter. Each row shows an ingredient (MOG), its suggested article with pack size, code and category path, a status pill and Confirm, Reject and Link APL buttons. A Retired row for Barley Whole shows a faded Resolve and Link APL. Veg Nuggets Frozen has an expand arrow and “+1”. Footer: Showing 504 of 676 open mappings.',
  },
  'deep-columns': {
    w: 1800,
    h: 1102,
    caption: 'A row, with the Reason and Last updated columns switched on',
    label: LIVE_CAPTURE,
    alt: 'My Tasks with the optional Reason and Last updated columns turned on. Each row: a checkbox, the MOG, the suggested article with its code, a star and its category path, then reason chips such as “✓ Quality ✗ Duplicate” or “✓ Availability ✓ Price”, a status pill, “197d ago”, and Confirm, Reject and Link APL. The Barley Whole row is Retired: its checkbox is faded, Resolve and Link APL are faded and Reject is active. Veg Nuggets Frozen has an expand arrow and “+1”.',
  },
  'deep-bulkbar': {
    w: 1800,
    h: 332,
    caption: 'Selecting rows brings up the bulk bar',
    label: LIVE_CAPTURE,
    alt: 'Two rows selected. A bar above the table reads “2 Articles selected”, with Clear, Reject selected and an amber Confirm Mapping button. The header checkbox shows a dash for a partial selection.',
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
  'deep-link': {
    w: 1800,
    h: 1385,
    caption: 'Link APL: search the Article master and attach',
    label: LIVE_CAPTURE,
    alt: 'Link APL to Apricot Jam dialog: “Search the Article master and pick one or more Articles to attach.” The search reads “jam”. A table with checkboxes, description, code and hierarchy path, for example BT Jam Kissan Mixed Fruit 1X1Kg PET, #641704, General › Apricot, which is ticked. The footer reads “1 Article selected”, with Cancel and Link 1.',
  },
  'final-states-crop': {
    w: 1779,
    h: 292,
    caption: 'Retired, beside two ordinary rows',
    label: FINAL,
    alt: 'Three worklist rows. Almond Flakes · 1X1Kg, Likely Matches, with Confirm, Reject and Link APL. Barley · 1X1Kg marked Retired, with a blue Retired pill, a faded Resolve, Reject, and a faded Link APL. SauceMrs foodrite · 12X1KG, Matches, with Confirm, Reject and Link APL.',
  },
  'deep-filter': {
    w: 1344,
    h: 782,
    caption: 'Filter: status, category and last updated',
    label: LIVE_CAPTURE,
    alt: 'The Filter menu open over the worklist. STATUS checkboxes for Matches, Likely Matches, No Match and Retired, each with its icon; a CATEGORY select reading All categories; LAST UPDATED from and to dates; and Clear filters.',
  },
  'deep-export': {
    w: 1044,
    h: 452,
    caption: 'Export Excel asks which rows you mean',
    label: LIVE_CAPTURE,
    alt: 'The Export Excel menu, CHOOSE SCOPE: Export all data (Everything), Export filtered data (Current view) and Export selected rows (Bulk-bar set). Beside it, Last refresh · 04:12 IST · 16/04/2026.',
  },
  'deep-site': {
    w: 660,
    h: 660,
    caption: 'The site switcher',
    label: LIVE_CAPTURE,
    alt: 'The sidebar site switcher open under CMP Autobot: HYD 119A (selected), NOIDA 123R and BLR 111C.',
  },
  'deep-toggle': {
    w: 1800,
    h: 156,
    caption: 'After launch: a decision can be switched',
    label: LIVE_CAPTURE,
    alt: 'Two rows after a decision. Pizza Sauce RTU was confirmed: its Confirm is faded and Reject is still active. Chicken Patty Frozen was rejected: its Reject is faded and Confirm is still active. Both keep Link APL.',
  },
  'deep-default': {
    w: 1800,
    h: 86,
    caption: 'After launch: the star sets the default article',
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
    alt: 'An earlier CMP Autobot CookBook Entry page. Tabs Pending 32 and Completed 0 over a list of ingredients. The main card, under “Manual entry queue — Enter these in CookBook”, shows Granular Sugar marked Green · Confirmed, “No APL to enter — log the action in CookBook”, what was acted on, and “Reviewed by Aman Verma”. A Mark entered in CookBook button with arrows to move between cards.',
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
  return (
    <div className={`dv-screen dv-screen--${size}`}>
      <button type="button" className="dv-screen__zoom" onClick={() => open(order.indexOf(slug))} aria-label={`Enlarge: ${shot.caption}`}>
        <img
          src={`${src}-1800.webp`}
          srcSet={`${src}-800.webp 800w, ${src}-1800.webp ${shot.w}w`}
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

/** The three places in the product and the question each one answers */
const surfaces = [
  { name: 'Dashboard', body: 'How much is done, and what needs attention today.' },
  { name: 'My Tasks', body: 'The worklist, where every suggestion is confirmed, rejected or replaced.' },
  { name: 'Settings', body: 'Users, sites and the target date for each site.' },
  { name: 'Site switcher', body: 'Everything is shown for one kitchen site at a time.' },
]

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
  { name: 'Matches', means: 'The Autobot is fairly sure.', can: 'Confirm, Reject, Link APL', job: 'Clear them fast.' },
  { name: 'Likely Matches', means: 'The Autobot isn’t sure.', can: 'Confirm, Reject, Link APL', job: 'Check before deciding.' },
  { name: 'No Match', means: 'No article suggested.', can: 'Link APL only', job: 'Find the article.' },
  { name: 'Retired', means: 'The article is no longer sold.', can: 'Resolve, Reject', job: 'Pick a replacement.' },
  { name: 'Mapped', means: 'Confirmed.', can: '—', job: 'Nothing.' },
] as const

/** The layouts explored, and the confirmed final one; trade-offs are my own analysis */
const approaches = [
  {
    key: 'A',
    title: 'Table with expandable rows',
    shot: 'table-expanded',
    does: 'One row per ingredient. Expand it to see every candidate article.',
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
    does: 'Confirmed items move to their own page to be entered in CookBook.',
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

/** Each final decision, with the screen that shows it */
const decisions = [
  {
    title: 'Everything needed to decide, in one row',
    shot: 'deep-columns',
    wide: true,
    need: 'Two articles can have the same name and differ only in pack size or category.',
    does: 'Each row shows the ingredient, the suggested article with its code and category, a status and the actions. An optional Reason column shows the Autobot’s checks as ✓ and ✗, like “✓ Price ✗ Pack size”.',
    why: 'The ✓ and ✗ tell you where to look before you decide. It’s optional because experienced operators mostly read the name and code.',
  },
  {
    title: 'One click for one row, a preview for many',
    shot: 'deep-bulkconfirm',
    need: 'Most matches are right, so a pop-up on every Confirm would just slow people down. But one wrong row in a batch of twenty is easy to miss.',
    does: 'Confirm on a single row works straight away. Confirming several rows at once first shows a list of every pairing.',
    why: 'The bigger the mistake could be, the more checking it gets.',
  },
  {
    title: 'Every rejection has a reason',
    shot: 'deep-bulkreject',
    need: 'A plain “no” doesn’t tell anyone what went wrong.',
    does: 'Reject asks for a reason from a short list, like Wrong pack size or Price too high. In bulk, one reason covers all selected rows.',
    why: 'The reasons match the Autobot’s own checks, so each rejection tells it which check failed.',
  },
  {
    title: 'No Match rows only offer what helps',
    shot: 'deep-nomatch',
    wide: true,
    need: 'With no suggestion, there’s nothing to confirm or reject.',
    does: 'Confirm and Reject are greyed out. Link APL, to search for an article, is the only action.',
    why: 'The buttons stay in the same place on every row, so nobody has to look for them.',
  },
  {
    title: 'Link APL: search for the right article',
    shot: 'deep-link',
    wide: true,
    need: 'When the suggestion is wrong or missing, the operator has to find the right article.',
    does: 'A search of all articles, showing code and category so similar ones can be told apart. More than one can be picked.',
    why: 'One ingredient can be bought in more than one pack size.',
  },
  {
    title: 'Retired items get their own action',
    shot: 'final-states-crop',
    wide: true,
    need: 'A retired article was correct once. Now it needs a replacement.',
    does: 'Retired rows are marked in blue, and Resolve takes the place of Confirm. They can’t be bulk-selected.',
    why: 'The job is different, so the button is different, but the row layout stays the same.',
  },
] as const

function Decision({ need, does, why }: { need: string; does: string; why: string }) {
  return (
    <dl className="dv-why cp-why">
      <div><dt>Problem</dt><dd>{need}</dd></div>
      <div><dt>What I did</dt><dd>{does}</dd></div>
      <div><dt>Why</dt><dd>{why}</dd></div>
    </dl>
  )
}

/** The tools around the table for narrowing down the work */
const finding = [
  { shot: 'deep-filter', title: 'Filter', body: 'By status, category and date.' },
  { shot: 'deep-export', title: 'Export to Excel', body: 'Everything, the current view, or only the selected rows.' },
  { shot: 'deep-site', title: 'Site switcher', body: 'Switch between the three kitchen sites.' },
  { shot: 'deep-bulkbar', title: 'Select many', body: 'Tick rows to confirm or reject them together.' },
] as const

/** What changed once operators were using it every day; reported by the client's team, not measured */
const changes = [
  {
    title: 'Decisions can be switched',
    shot: 'deep-toggle',
    saw: 'Operators sometimes rejected an article they meant to confirm, or the other way round, and there was no easy way back.',
    did: 'After Confirm, Reject stays available. After Reject, Confirm stays available. The button you pressed greys out.',
    why: 'Mistakes like this are often noticed later, not in the moment. Now the fix is right on the row.',
  },
  {
    title: 'A star for the first choice',
    shot: 'deep-default',
    saw: 'Some ingredients have more than one correct article, like the same item in two pack sizes. Operators needed to mark which one comes first.',
    did: 'Each article has a star. The starred one becomes the default and shows first in the row.',
    why: 'Which article comes first is a different question from whether it’s right, so it got its own small control.',
  },
] as const

function Change({ saw, did, why }: { saw: string; did: string; why: string }) {
  return (
    <dl className="dv-why cp-why">
      <div><dt>Problem</dt><dd>{saw}</dd></div>
      <div><dt>What changed</dt><dd>{did}</dd></div>
      <div><dt>Why</dt><dd>{why}</dd></div>
    </dl>
  )
}

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

const WIDE = '(max-width: 1100px) 100vw, 980px'

export default function Compass() {
  useTitle('Compass Group — Helping operators review AI ingredient matches | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)

  return (
    <article className="dv">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type">Compass Group — CMP Autobot</p>
          <h1 className="dv-top__title">Helping operators review AI ingredient matches</h1>
          <p className="dv-top__lede">
            A worklist where kitchen operators <mark>check the AI’s suggestions</mark> and confirm, reject or fix
            them, hundreds at a time.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>Client</dt>
                <dd>Compass Group India</dd>
              </div>
              <div>
                <dt>Design duration</dt>
                <dd>5 weeks, then changes after launch</dd>
              </div>
              <div>
                <dt>My contribution</dt>
                <dd>Workflow and interface design, and the design system. I implemented the interface with AI.</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>In use by the client’s workers</dd>
              </div>
              <div>
                <dt>Links</dt>
                <dd className="cp-links">
                  <a className="dv-top__try" href={LIVE} target="_blank" rel="noopener noreferrer">
                    Open the prototype <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <a className="dv-top__try" href={PDF} target="_blank" rel="noopener noreferrer">
                    Design system PDF <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
            <div className="dv-signal">
              <p className="dv-signal__kind">The insight that shaped it</p>
              <p className="dv-signal__text">
                <mark>The AI suggests, a person decides.</mark> So the screen is built around making that decision
                quick, and easy to undo.
              </p>
              <p className="dv-signal__note">I didn’t build the AI model, the backend or the data integrations.</p>
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
              <Head id="overview" kicker="Overview" title="One table for hundreds of small decisions.">
                <p>
                  Every ingredient in Compass’s kitchens has to be linked to the product actually bought for it. An
                  Autobot suggests the link. Operators <mark>confirm it, reject it, or pick a different one</mark>.
                </p>
                <p>
                  Most decisions are easy, but there are hundreds per site. The design had to keep the easy ones fast
                  and make mistakes easy to fix.
                </p>
              </Head>
              <figure>
                <Screen slug="final-worklist" open={open} sizes={WIDE} eager />
                <figcaption className="dv-cap">
                  My Tasks, the final design. <span className="dv-tag">Final design</span>
                </figcaption>
              </figure>
            </section>

            {/* Context */}
            <section id="context" className="dv-sec" aria-labelledby="context-title" tabIndex={-1}>
              <Head id="context" kicker="Context" title="Matching ingredients to articles, by hand.">
                <p>
                  An ingredient (called a MOG) is what a recipe needs, like “Pizza Sauce RTU”. An article is what’s
                  actually bought: a brand, a pack size, a code. The two have to be linked before anything can be ordered.
                </p>
                <p>
                  Before this, the team did it <mark>in Excel and another tool</mark>, which they found confusing and
                  slow.
                </p>
              </Head>
              <dl className="dv-facts" aria-label="Project context">
                <div>
                  <dt>Client</dt>
                  <dd>Compass Group India</dd>
                </div>
                <div>
                  <dt>How I learned the brief</dt>
                  <dd>Discussions with the client about the task and where workers struggled</dd>
                </div>
                <div>
                  <dt>Who uses it</dt>
                  <dd>The client’s menu planning operators, one site each</dd>
                </div>
                <div>
                  <dt>Scale in the prototype</dt>
                  <dd>676 MOGs and 4,626 articles for one site (demo data)</dd>
                </div>
              </dl>
              <p className="dv-diagram-label">Workflow framing</p>
              <p className="dv-statement">
                As an operator, I want to see why the Autobot suggested an article,{' '}
                <mark>decide quickly</mark>, and fix it if I get it wrong.
              </p>
            </section>

            {/* How it fits together */}
            <section id="map" className="dv-sec" aria-labelledby="map-title" tabIndex={-1}>
              <Head id="map" kicker="How it fits together" title="Three screens, each answering one question.">
                <p>
                  Each screen has one job.
                </p>
              </Head>
              <ul className="surfaces cp-surfaces">
                {surfaces.map((s) => (
                  <li key={s.name}>
                    <h3>{s.name}</h3>
                    <p>{s.body}</p>
                  </li>
                ))}
              </ul>
              <div className="cp-gap">
                <Flow />
              </div>
              <p className="dv-note">
                <strong>Confirming isn’t the last step.</strong> The mapping still has to be typed into CookBook. I
                explored a screen for that (C below), but it isn’t in this build.
              </p>
            </section>

            {/* Four queues */}
            <section id="queues" className="dv-sec" aria-labelledby="queues-title" tabIndex={-1}>
              <Head id="queues" kicker="Four queues" title="Each status is a different job.">
                <p>
                  The status decides which buttons a row shows.
                </p>
              </Head>
              <div className="dv-matrix cp-matrix">
                <table>
                  <caption className="sr-only">What each status means and what the row allows</caption>
                  <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">What it means</th>
                      <th scope="col">What the row allows</th>
                      <th scope="col">The operator’s job</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queues.map((q) => (
                      <tr key={q.name}>
                        <th scope="row">{q.name}</th>
                        <td data-label="What it means">{q.means}</td>
                        <td data-label="What the row allows">{q.can}</td>
                        <td data-label="The operator’s job">{q.job}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="dv-matrix__note">Behaviour as observed in the live prototype.</p>
              </div>
            </section>

            {/* Approaches explored */}
            <section id="approaches" className="dv-sec" aria-labelledby="approaches-title" tabIndex={-1}>
              <Head id="approaches" kicker="Approaches explored" title="Four layouts, and why the table won.">
                <p>
                  Most of the work is easy and repetitive, with a few hard items. A table handles the easy ones best,
                  and the hard ones get help inside the row. The pros and cons are my own judgement, not test results.
                </p>
              </Head>
              <ol className="cp-approaches">
                {approaches.map((a) => (
                  <li key={a.key} className={`cp-approach${'final' in a ? ' cp-approach--final' : ''}`}>
                    <p className={`cp-pair__tag${'final' in a ? ' cp-pair__tag--final' : ''}`}>
                      {'final' in a ? 'Final design' : 'Exploration'}
                    </p>
                    <h3><span className="dv-badge">{a.key}</span> {a.title}</h3>
                    <Screen slug={a.shot} open={open} sizes="(max-width: 760px) 100vw, 440px" />
                    <p>{a.does}</p>
                    <dl className="cp-approach__tradeoff">
                      <div><dt>Good for</dt><dd>{a.good}</dd></div>
                      <div><dt>Harder</dt><dd>{a.hard}</dd></div>
                    </dl>
                  </li>
                ))}
              </ol>
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

            {/* Final design decisions */}
            <section id="decisions" className="dv-sec" aria-labelledby="decisions-title" tabIndex={-1}>
              <Head id="decisions" kicker="Design decisions" title="Six decisions in the worklist.">
                <p>
                  Small, safe actions take one click. Bigger ones ask you to check first.
                </p>
              </Head>
              <ol className="dv-steps">
                {decisions.map((d, i) => (
                  <li key={d.title} className={`dv-step${'wide' in d ? ' cp-step--wide' : ''}`}>
                    <figure>
                      <Screen slug={d.shot} open={open} sizes={'wide' in d ? WIDE : undefined} />
                    </figure>
                    <div className="dv-step__text">
                      <h3><span className="dv-num">{String.fromCharCode(65 + i)}</span> {d.title}</h3>
                      <Decision {...d} />
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Finding the work */}
            <section id="finding" className="dv-sec" aria-labelledby="finding-title" tabIndex={-1}>
              <Head id="finding" kicker="Finding the work" title="Finding the right rows.">
                <p>
                  Nobody works top to bottom. Operators pick a queue, a category or a date, and clear that.
                </p>
              </Head>
              <ol className="dv-grid">
                {finding.map((f) => (
                  <li key={f.shot} className="dv-grid__item">
                    <Screen slug={f.shot} open={open} sizes="(max-width: 760px) 100vw, 440px" />
                    <h3>{f.title}</h3>
                    <p>{f.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* After launch */}
            <section id="after" className="dv-sec" aria-labelledby="after-title" tabIndex={-1}>
              <Head id="after" kicker="After launch" title="What changed once people used it every day.">
                <p>
                  Once the client’s operators were using it, their team reported two problems. Both were fixed in the
                  row itself.
                </p>
              </Head>
              <ol className="dv-steps">
                {changes.map((c, i) => (
                  <li key={c.title} className="dv-step cp-step--wide">
                    <figure>
                      <Screen slug={c.shot} open={open} sizes={WIDE} />
                    </figure>
                    <div className="dv-step__text">
                      <h3><span className="dv-num">{i + 1}</span> {c.title}</h3>
                      <Change {...c} />
                    </div>
                  </li>
                ))}
              </ol>
              <p className="dv-note">
                <strong>No new screens.</strong> The greyed-out button shows what was decided, and the star shows what
                comes first.
              </p>
            </section>

            {/* Progress & targets */}
            <section id="progress" className="dv-sec" aria-labelledby="progress-title" tabIndex={-1}>
              <Head id="progress" kicker="Progress & targets" title="A dashboard that leads into the work.">
                <p>
                  Each site has a deadline. The dashboard shows progress against it, and every card opens the matching
                  queue.
                </p>
              </Head>
              <ol className="dv-steps">
                <li className="dv-step cp-step--wide">
                  <figure>
                    <Screen slug="deep-dashboard" open={open} sizes={WIDE} />
                  </figure>
                  <div className="dv-step__text">
                    <h3><span className="dv-num">A</span> Dashboard</h3>
                    <Decision
                      need="Operators need to know how much is left and where to start."
                      does="Today’s progress, what needs attention, and one card per queue with how much is left."
                      why="Every number is a link. “30 Articles need a decision” opens exactly those rows."
                    />
                  </div>
                </li>
                <li className="dv-step cp-step--wide">
                  <figure>
                    <Screen slug="deep-config" open={open} sizes={WIDE} />
                  </figure>
                  <div className="dv-step__text">
                    <h3><span className="dv-num">B</span> Targets per site</h3>
                    <Decision
                      need="Sites run on different timelines."
                      does="One default date, which each site can override."
                      why="Each site sees its own deadline, not someone else’s."
                    />
                  </div>
                </li>
              </ol>
            </section>

            {/* Design system */}
            <section id="system" className="dv-sec" aria-labelledby="system-title" tabIndex={-1}>
              <Head id="system" kicker="Design system" title="A small system for dense, repeated decisions.">
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

            {/* Outcome */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Outcome" title="What changed for the operators.">
                <p>We didn’t measure before and after, so there are no numbers here.</p>
              </Head>
              <dl className="dv-results">
                <div>
                  <dt>One place instead of two</dt>
                  <dd>
                    <mark>All the review work in one table</mark>, instead of Excel plus another tool.
                  </dd>
                </div>
                <div>
                  <dt>Mistakes are cheap</dt>
                  <dd>A wrong Confirm or Reject can be switched on the same row.</dd>
                </div>
                <div>
                  <dt>Priority is explicit</dt>
                  <dd>The star shows which article to use first.</dd>
                </div>
                <div>
                  <dt>In use</dt>
                  <dd>The client’s operators use it day to day.</dd>
                </div>
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Plan for the wrong click too.">
                <p>
                  I spent most of the time on helping people make the right call. The biggest change after launch was
                  about the wrong one. When people make hundreds of quick decisions,{' '}
                  <mark>undo matters as much as getting it right</mark>. Next time I’d plan for it from day one.
                </p>
              </Head>
              <h3 className="dv-h3">What I’d tighten next</h3>
              <ul className="ticks">
                <li>Update the counts after a single Confirm, not only after bulk.</li>
                <li>Show “Mapped” on rows confirmed in bulk.</li>
                <li>Show who decided, and when, on each row.</li>
                <li>Show which rejection reasons come up most.</li>
                <li>Bring the CookBook step into the table.</li>
              </ul>
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
