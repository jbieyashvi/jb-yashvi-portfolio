import CaseNav from '../components/CaseNav'
import DeviceMockup from '../components/DeviceMockup'
import External from '../components/External'
import NextProject from '../components/NextProject'
import ProjectHeader from '../components/ProjectHeader'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import type { ImageItem } from '../data/images'
import { getProject } from '../data/projects'
import loadAhead from '../components/loadAhead'

const LIVE = 'https://compass-mapperv2.vercel.app/'
const PDF = `${import.meta.env.BASE_URL}work/compass/cmp-autobot-design-system.pdf`
const FROM_PDF = 'From the CMP Autobot design system PDF'
const FROM_BUILD = 'Screenshot of the CMP Autobot platform'

/** The four mapping queues, in the colours the design system gives them */
const queues = [
  { name: 'Matches', color: '#14874E', soft: '#D5F9E0', body: 'Auto-matched and ready for CookBook.' },
  { name: 'Likely', color: '#CA8A10', soft: '#FFF0CC', body: 'A likely match: review the Autobot’s reasoning.' },
  { name: 'No match', color: '#D33B36', soft: '#FFE8E3', body: 'No credible match: needs human investigation.' },
  { name: 'Retired', color: '#193CB8', soft: '#E1EFFF', body: 'The mapped article is retired in SAP.' },
]

const sections = [
  { id: 'glance', label: 'At a glance' },
  { id: 'problem', label: 'User & problem' },
  { id: 'control', label: 'Human control' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'contrib', label: 'My role' },
  { id: 'found', label: 'Design system' },
  { id: 'use', label: 'In use' },
  { id: 'outcome', label: 'Outcome' },
]

/** The three review actions on a worklist row */
const actions = [
  {
    name: 'Confirm',
    tone: 'confirm',
    body: 'Accepts the Autobot’s suggested article for this ingredient. In the build, even rows in the high-confidence Matches queue carry it, and the dashboard counts them as open tasks.',
  },
  {
    name: 'Reject',
    tone: 'reject',
    body: 'Turns the suggestion down. It sits next to Confirm on every pending row, in the same place and order: one click, like Confirm.',
  },
  {
    name: 'Link APL',
    tone: 'link',
    body: 'Lets the reviewer link an article themselves. In the system’s worklist template it is the only action on a No match row, where the Autobot has no candidate.',
  },
]

const details = [
  {
    src: '/work/compass/detail-actions.webp',
    w: 538,
    h: 425,
    title: 'The decision column',
    body: 'Status on the left, actions on the right. On a Retired row the actions change: Confirm becomes a faded Resolve and Link APL is greyed out. There the job is planning a transition, not accepting a match.',
    alt: 'Close-up of the worklist: five Likely Matches rows, each with Confirm, Reject and Link APL buttons, and a Retired row where Confirm is replaced by a faded Resolve and Link APL is greyed out.',
  },
  {
    src: '/work/compass/detail-attention.webp',
    w: 545,
    h: 170,
    title: 'Pointing people to the decisions',
    body: 'The dashboard leads with what needs a person: how many Likely matches are waiting for a decision, and which articles were retired and need a transition.',
    alt: 'Dashboard banners: an amber Needs Attention banner reading “30 Articles in Likely Matches need a decision” and a blue Needs Transition banner reading “1 Article Retired”.',
  },
  {
    src: '/work/compass/detail-dialog.webp',
    w: 800,
    h: 290,
    title: 'A check before anything is undone',
    body: 'Retiring a mapping is the one destructive step, so it asks for confirmation and names what to have done first: plan the ingredient transition.',
    alt: 'Design system confirm dialog titled “Retire APL link?”: “The article was retired in SAP. Confirm you’ve planned the ingredient transition before retiring this mapping.” with Cancel and a red Retire link button.',
  },
]

/** Design decisions, each grounded in what the design system PDF states or the screens show */
const decisions = [
  {
    title: 'Colour is reserved for state',
    body: 'Green confirms, amber flags a decision, red rejects, blue informs. Gold, the brand colour, marks identity only, so amber the brand and amber “Likely” never get read as the same thing.',
    source: 'Design principle 3, Status-first colour',
  },
  {
    title: 'Confirm and Reject never move',
    body: 'Always a pair, always Confirm then Reject, same colours, never swapped or stacked. They are text-only and sized to the row, so a dense table stays calm and the hand learns where they are.',
    source: 'Design principle 6, Consistent pairing',
  },
  {
    title: 'One primary action per screen',
    body: 'Everything else is outline or ghost. Solid and destructive buttons are kept for the single primary step in a dialog, like Retire link or Save user.',
    source: 'Design principle 5, One primary action',
  },
  {
    title: 'Dense, but readable',
    body: 'Operators work through rows, so the base size is 15px for a compact density, with tabular numbers so counts and IDs line up down a column.',
    source: 'Design principles 1 and 4, Data-dense and Tabular numbers',
  },
]

interface Excerpt {
  slug: string
  w: number
  h: number
  title: string
  body: string
  alt: string
  decision?: { title: string; body: string }
}

const foundations: Excerpt[] = [
  {
    slug: 'pdf-brand',
    w: 1800,
    h: 1035,
    title: 'Amber brand, neutral surfaces',
    body: 'Brand Gold #C68A1E with hover, ink and soft tints, a dark primary for ink-heavy actions, and four near-white surfaces that keep the workspace quiet.',
    alt: 'Design system PDF excerpt, Brand Gold and Surfaces: swatches for Brand #C68A1E, Brand Hover #B27A18, Brand Ink #7A5310, Brand Soft #FFF1D6 and Primary #232932, then Background #FEFDFC, Card #FFFFFF, Secondary #F0F2F4 and Accent #EBEFF4.',
    decision: {
      title: 'Iteration: softer neutrals',
      body: 'The neutrals are a cool slate, softened from pure black after client feedback.',
    },
  },
  {
    slug: 'pdf-status',
    w: 1800,
    h: 581,
    title: 'Status and queue colours',
    body: 'Each queue gets one strong tone and a soft background: green, amber, red and blue. Pills, filter tabs and progress bars all use the same pairs.',
    alt: 'Design system PDF excerpt, Status & Queue Colors: Green Matches #14874E, Amber Likely #CA8A10, Red No Match #D33B36 and Blue Retired #193CB8, each with its soft background, and a note on queue semantics.',
  },
  {
    slug: 'pdf-type',
    w: 1800,
    h: 1626,
    title: 'Inter, one family for the whole UI',
    body: 'Weights 400 to 700 with tabular numbers, on a compact scale from Display 36 down to Body 13, Small 12 and 11px labels.',
    alt: 'Design system PDF excerpt, Typeface and Type Scale: a large Inter “Aa” specimen and a table of tokens Display 36px, H1 26px, H2 18px, H3 14px, Body 13px, Small 12px, Label 11px and Mono 11px with line heights, letter spacing and usage.',
  },
  {
    slug: 'pdf-spacing',
    w: 1800,
    h: 987,
    title: 'Compact spacing',
    body: 'Tailwind’s 4px scale applied tightly: small paddings inside tables and pills, wider gaps only between sections.',
    alt: 'Design system PDF excerpt, Spacing Scale: dots from 2px to 24px and a table mapping tokens 0.5 to 6 to their pixel sizes and uses, from icon gaps to page gutters.',
  },
]

const components: Excerpt[] = [
  {
    slug: 'pdf-buttons',
    w: 1800,
    h: 755,
    title: 'Buttons',
    body: 'The six shadcn/ui button variants and four sizes. The app leans on outline and ghost; default and destructive are kept for the one primary action in a dialog.',
    alt: 'Design system PDF excerpt, Button Variants and Sizes: Default, Secondary, Outline, Ghost, Destructive and Link buttons, then small, default, large, extra-large and icon sizes with a disabled state.',
  },
  {
    slug: 'pdf-decisions',
    w: 1800,
    h: 1229,
    title: 'Review actions, badges and inputs',
    body: 'Custom inline Confirm and Reject buttons for the worklist, the Link APL secondary button, five badge variants, and text inputs, search and a Radix select.',
    alt: 'Design system PDF excerpt, Worklist Decision Buttons, Badges, and Inputs & Select: soft green Confirm, soft red Reject and a Link APL button, badge variants, and Full name, Email, Role and search fields.',
  },
  {
    slug: 'pdf-toggles',
    w: 1800,
    h: 784,
    title: 'Selection controls',
    body: 'Radix checkbox and switch. Checked is green, indeterminate is amber, for bulk selection in the worklist and the site multi-select.',
    alt: 'Design system PDF excerpt, Checkbox and Toggle Switch: unchecked, checked green and indeterminate amber checkboxes, a site multi-select list, and switches for on, off, disabled and active.',
  },
  {
    slug: 'pdf-table',
    w: 1800,
    h: 590,
    title: 'The worklist table',
    body: 'Uppercase 10px headers, mono tabular IDs, one queue pill per row, and decision buttons sized to the row.',
    alt: 'Design system PDF excerpt, Worklist Table: rows for three articles with their MOG ingredient, confidence, a queue pill (Matches, Likely Matches, No Match) and a Confirm, Confirm and Reject, or Link APL action.',
  },
]

const inUse = [
  {
    slug: 'home',
    title: 'Dashboard',
    body: 'Queue colours carry the page: the Needs Attention and Needs Transition banners and each Work progress card take the colour of their queue, while the brand gold marks the product in the sidebar.',
    alt: 'CMP Autobot Current Status dashboard: a progress gauge, amber Needs Attention and blue Needs Transition banners, stat cards, and Work progress cards with green, amber, red and blue queue pills and progress bars.',
  },
  {
    slug: 'wl',
    title: 'Mapping worklist',
    body: 'Filter tabs by queue, then the table pattern from the system: checkboxes, articles with their IDs, one status pill per row, and Confirm, Reject and Link APL on each row.',
    alt: 'CMP Autobot My Tasks worklist: filter tabs for All, Matches, Likely Matches, No Match and Mapped, then a table of MOG ingredients and articles with status pills and Confirm, Reject and Link APL actions.',
  },
  {
    slug: 'settings',
    title: 'Settings',
    body: 'The same table, badges and switches in user management, with Add user as the single primary action.',
    alt: 'CMP Autobot Settings, User management: tabs for Users, Configuration and Sites, and a table of users with role badges, site chips and Active switches, with an Add user button.',
  },
]

const toItem = (e: Excerpt): ImageItem => ({
  slug: e.slug,
  src: `/work/compass/${e.slug}`,
  w: e.w,
  h: e.h,
  alt: e.alt,
  caption: e.title,
  label: FROM_PDF,
})

const excerpts = [...foundations, ...components]
const items: ImageItem[] = [
  ...excerpts.map(toItem),
  ...inUse.map((s) => ({ slug: s.slug, src: `/work/compass/${s.slug}`, w: 1800, h: 1071, alt: s.alt, caption: s.title, label: FROM_BUILD })),
]

function ExcerptList({ list, open }: { list: Excerpt[]; open: (i: number) => void }) {
  return (
    <div className="ds__list">
      {list.map((e) => (
        <figure key={e.slug} className="ds__item">
          <button
            type="button"
            className="ds__zoom"
            onClick={() => open(excerpts.indexOf(e))}
            aria-label={`Enlarge: ${e.title}`}
          >
            <img
              src={`/work/compass/${e.slug}-1800.webp`}
              srcSet={`/work/compass/${e.slug}-800.webp 800w, /work/compass/${e.slug}-1800.webp 1800w`}
              sizes="(max-width: 760px) 100vw, 60vw"
              width={e.w}
              height={e.h}
              alt={e.alt}
              loading="lazy" ref={loadAhead}
              decoding="async"
            />
          </button>
          <figcaption>
            <h3>{e.title}</h3>
            <p>{e.body}</p>
            {e.decision && (
              <div className="decision">
                <h4>{e.decision.title}</h4>
                <p>{e.decision.body}</p>
              </div>
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

export default function Compass() {
  useTitle('Compass Group — CMP Autobot, design system & AI-assisted platform | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)
  const links = (
    <>
      <External href={LIVE}>View platform</External>
      <External href={PDF} variant="ghost">
        View design system PDF
      </External>
    </>
  )

  return (
    <article>
      <ProjectHeader
        name="Compass Group — CMP Autobot"
        type="Design system & AI-assisted platform"
        intro={
          <>
            <p className="lede">
              CMP Autobot is an ingredient–article mapping workspace for Compass Group India. An Autobot suggests which
              article each ingredient maps to; people review the suggestions and confirm, reject or link the right article.
            </p>
            <p>
              I created the design system for the project and built the platform’s interface using AI. This page covers
              the review workflow, the decisions behind it, and the system that holds it together.
            </p>
          </>
        }
        meta={[
          { label: 'For', value: 'Compass Group India' },
          { label: 'My contribution', value: 'Design system (my own design work); platform interface built using AI' },
          { label: 'Built on', value: 'Next.js, Tailwind, shadcn/ui and Radix' },
        ]}
        actions={links}
      />

      <CaseNav sections={sections} />

      <section className="wrap showcase" aria-label="Dashboard preview">
        <DeviceMockup mockup={getProject('compass').mockup!} tone="paper" eager className="mock--hero" />
      </section>

      <section id="glance" className="wrap glance" aria-labelledby="glance-title" tabIndex={-1}>
        <h2 id="glance-title" className="section-title">At a glance</h2>
        <dl className="glance__list">
          <div>
            <dt>User</dt>
            <dd>Operators at Compass Group India mapping ingredients to SAP articles, site by site, in a desktop workspace.</dd>
          </div>
          <div>
            <dt>Problem</dt>
            <dd>The Autobot’s suggestions range from confident to none at all, and mapped articles can be retired. Each needs a different human response.</dd>
          </div>
          <div>
            <dt>What I did</dt>
            <dd>Created the design system: tokens, components, page templates and principles. Built the platform’s interface using AI, applying that system.</dd>
          </div>
          <div>
            <dt>Key idea</dt>
            <dd>The Autobot suggests; a person decides. Confirm, Reject and Link APL sit on every row in a fixed place.</dd>
          </div>
        </dl>
      </section>

      <section id="problem" className="wrap split" aria-labelledby="problem-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="problem-title" className="section-title">User, problem and workflow</h2>
          <p>
            Teams map each ingredient (a MOG) to an article in SAP. The Autobot proposes a match and sorts every
            ingredient into one of four queues. The queue tells the reviewer what to do next.
          </p>
          <p>
            The workspace is data-dense by design, keeping operators focused on rows, not chrome: a dashboard that
            points to what needs a decision, then a worklist where each decision is one click.
          </p>
        </div>
        <div className="split__media">
          <ul className="queues">
            {queues.map((q) => (
              <li key={q.name} className="queue">
                <span className="queue__pill" style={{ color: q.color, background: q.soft }}>
                  <span className="queue__dot" style={{ background: q.color }} aria-hidden="true" />
                  {q.name}
                </span>
                <p>{q.body}</p>
              </li>
            ))}
          </ul>
          <ol className="steps">
            <li><strong>See what needs attention.</strong> The dashboard shows progress and the queues waiting for a decision.</li>
            <li><strong>Work a queue.</strong> The worklist filters by queue, with search and bulk selection.</li>
            <li><strong>Decide each row.</strong> Confirm the suggestion, reject it, or link an article by hand.</li>
            <li><strong>Handle retired articles.</strong> Plan the transition, then retire the old link with a confirmation.</li>
          </ol>
        </div>
      </section>

      <section id="control" className="wrap control" aria-labelledby="control-title" tabIndex={-1}>
        <div className="control__head">
          <h2 id="control-title" className="section-title">Human control over AI suggestions</h2>
          <p>
            The Autobot proposes; people decide. In the build, every suggestion, even a high-confidence one, waits for
            one of three actions, and they look and sit the same on every row.
          </p>
        </div>
        <ul className="acts">
          {actions.map((a) => (
            <li key={a.name} className="act">
              <span className={`act__btn act__btn--${a.tone}`} aria-hidden="true">
                {a.tone === 'link' && '+ '}
                {a.name}
              </span>
              <h3>{a.name}</h3>
              <p>{a.body}</p>
            </li>
          ))}
        </ul>
        <div className="details">
          {details.map((d) => (
            <figure key={d.src} className="detail">
              <div className="detail__frame">
                <img src={d.src} alt={d.alt} width={d.w} height={d.h} loading="lazy" ref={loadAhead} decoding="async" />
              </div>
              <figcaption>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="decisions" className="wrap split" aria-labelledby="decisions-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="decisions-title" className="section-title">Key design decisions</h2>
          <p>Each one is written into the design system, so it holds on every screen, not just the ones shown here.</p>
        </div>
        <ol className="split__media dlist">
          {decisions.map((d) => (
            <li key={d.title} className="dlist__item">
              <h3>{d.title}</h3>
              <p>{d.body}</p>
              <p className="dlist__src">{d.source}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="contrib" className="wrap split" aria-labelledby="contrib-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="contrib-title" className="section-title">My contribution</h2>
          <p>Two pieces of work, one feeding the other. The design decisions are mine; AI helped me implement them.</p>
        </div>
        <div className="split__media contrib">
          <div className="contrib__part">
            <h3>The design system: my design work</h3>
            <ul className="ticks">
              <li>Colour, type, spacing and radius tokens, including the four queue colour pairs.</li>
              <li>Usage rules for each component, and the pieces this workspace needed: queue pills and the inline Confirm, Reject and Link APL actions.</li>
              <li>Page templates: app shell, worklist table, cards and banners, dialogs and settings.</li>
              <li>Six design principles that the screens follow.</li>
            </ul>
            <p>
              It builds on shadcn/ui and Radix. The base buttons, inputs, selects, checkboxes and switches come from
              there; the system sets how they look and when to use them.
            </p>
          </div>
          <div className="contrib__part">
            <h3>The platform: built using AI</h3>
            <ul className="ticks">
              <li>I built the platform’s interface using AI, applying the system across the dashboard, mapping worklist and settings.</li>
              <li>The style guide PDF is generated from the prototype’s own tokens and component code, so it documents what was actually built.</li>
            </ul>
            <p>The screens on this page are from that build.</p>
          </div>
        </div>
      </section>

      <section id="found" className="wrap ds" aria-labelledby="found-title" tabIndex={-1}>
        <div className="ds__head">
          <h2 id="found-title" className="section-title">Foundations</h2>
          <p>Excerpts from the design system PDF. Select one to see it larger.</p>
        </div>
        <ExcerptList list={foundations} open={open} />
      </section>

      <section className="wrap ds" aria-labelledby="comp-title">
        <div className="ds__head">
          <h2 id="comp-title" className="section-title">Components</h2>
          <p>shadcn/ui and Radix bases, set up for a compact, data-heavy workspace.</p>
        </div>
        <ExcerptList list={components} open={open} />
      </section>

      <section id="use" className="wrap highlights" aria-labelledby="use-title" tabIndex={-1}>
        <h2 id="use-title" className="section-title">The system in use</h2>
        <div className="highlights__list highlights__list--single">
          {inUse.map((s, i) => (
            <figure key={s.slug} className="highlight">
              <button
                type="button"
                className="ds__zoom highlight__zoom"
                onClick={() => open(excerpts.length + i)}
                aria-label={`Enlarge: ${s.title}`}
              >
                <img
                  src={`/work/compass/${s.slug}-1800.webp`}
                  srcSet={`/work/compass/${s.slug}-1800.webp 1800w, /work/compass/${s.slug}.webp 2016w`}
                  sizes="(max-width: 1440px) 100vw, 1344px"
                  alt={s.alt}
                  width={2016}
                  height={1200}
                  loading="lazy" ref={loadAhead}
                  decoding="async"
                />
              </button>
              <figcaption>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="outcome" className="wrap split" aria-labelledby="outcome-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="outcome-title" className="section-title">Outcome</h2>
          <p>What exists today, and where to see it.</p>
        </div>
        <div className="split__media">
          <ul className="ticks ticks--lg">
            <li>A working build of the platform covering the dashboard, the mapping worklist and settings, online at the link below.</li>
            <li>A documented design system: tokens, components, templates and principles in one style guide.</li>
            <li>One review pattern, Confirm, Reject and Link APL, applied the same way on every row.</li>
          </ul>
          <div className="end-cta end-cta--pair end-cta--start">{links}</div>
        </div>
      </section>

      {lightbox}
      <NextProject slug="compass" />
    </article>
  )
}
