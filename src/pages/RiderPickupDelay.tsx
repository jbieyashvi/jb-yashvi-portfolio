import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import External from '../components/External'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import type { ImageItem } from '../data/images'

const PROTO = 'https://jbieyashvi.github.io/rider-pickup-delay-concept/'
const PLAY = 'https://play.google.com/store/apps/details?id=in.swiggy.deliveryapp'
const DIR = '/work/rider-pickup-delay'
const FROM_PROTO = 'My concept prototype with sample data. A proposed design, not the Swiggy app.'
const FROM_SKETCH = 'An early paper sketch from the AI-assisted wireframe exploration. Not tested with riders.'
const FROM_PLAY = 'Swiggy’s own image from its Play Store listing. Not my design.'

const sections = [
  { id: 'problem', label: 'The problem' },
  { id: 'evidence', label: 'Secondary evidence' },
  { id: 'exploration', label: 'Initial direction' },
  { id: 'shift', label: 'Change in thinking' },
  { id: 'approaches', label: 'Approaches' },
  { id: 'flow', label: 'Final flow' },
  { id: 'walkthrough', label: 'Scenario walkthrough' },
  { id: 'outcome', label: 'Outcome' },
]

/** Prototype screens, captured from the live prototype at 780 × 1640 (the phone only) */
const shots = {
  pickup: {
    caption: 'Pickup status with the latest restaurant estimate',
    alt: 'Prototype screen “Pickup status”, Subway order #6593 at 6:13 PM. Waiting 20 min, order is still being prepared, arrived at 5:53 PM, with a View pickup timeline link. Latest restaurant estimate: ready by 6:20 PM, updated at 6:10 PM, restaurant estimate, may change. A View restaurant update button. At the bottom: Need help with this delay? Get help with delay.',
  },
  'restaurant-update': {
    caption: 'The saved restaurant update, opened from the pickup screen',
    alt: 'Prototype bottom sheet “Restaurant update”: source Subway (simulated restaurant update), updated at 6:10 PM, ready by 6:20 PM, order is being prepared. A note says this is the last update saved for this order, and viewing it does not contact the restaurant or request a new estimate. Close button.',
  },
  'help-form': {
    caption: 'Reporting the delay with the order details already included',
    alt: 'Prototype screen “Help with pickup delay”. Issue: Restaurant is taking longer than expected. Details included: order Subway #6593, waiting so far 20 min, latest restaurant estimate ready by 6:20 PM, estimate updated 6:10 PM. An optional field “Anything else to add?” and a Contact support button.',
  },
  reported: {
    caption: 'Delay reported, with the request status',
    alt: 'Prototype screen “Pickup delay support”: Delay reported. Your delay details were sent to support. Request status: waiting for support, no reply yet. Details shared: issue restaurant delay, wait at time of report 20 min, reported 6:13 PM. View conversation and Back to pickup buttons.',
  },
  'follow-up': {
    caption: 'After the estimate passes: follow up in the same request',
    alt: 'Prototype “Pickup status” at 6:23 PM. Waiting 30 min, order is still not ready. A highlighted card: Last estimate has passed, restaurant estimated ready by 6:20 PM, updated at 6:10 PM, no new estimate yet. Latest support message from 6:13 PM: “Please wait another 10 minutes.” Request remains open. Update sent 6:23 PM, 30 min wait. At the bottom: Update sent to the same request, and View conversation.',
  },
  timeline: {
    caption: 'Pickup timeline, each event labelled with its source',
    alt: 'Prototype screen “Pickup timeline” for order #6593. Intro: events recorded so far, each with its source; a record of what was logged, not a decision about what caused a delay. Events: Expected arrival by 5:55 PM, Schedule; Arrival recorded 5:53 PM, App record; Restaurant estimate updated 6:10 PM, ready by 6:20 PM, Restaurant; Delay reported 6:13 PM, waiting 20 min, Rider; Support reply 6:13 PM, “Please wait another 10 minutes.”, Support; Still not ready 6:23 PM, waiting 30 min, Rider; Pickup recorded 6:25 PM, restaurant wait 32 min, App record.',
  },
  completed: {
    caption: 'Completed order with a sample late flag',
    alt: 'Prototype screen “Order completed” at 6:52 PM: Delivery completed, Subway order #6593, picked up at 6:25 PM, restaurant wait 32 min. A card labelled Sample flag: Delivery marked late. Expected delivery by 6:45 PM; delivery completed at 6:52 PM. Think the pickup delay affected this delivery? Request a review. Buttons: Request delay review, View pickup timeline.',
  },
  'review-form': {
    caption: 'Review request: the arrival time marked as disputed',
    alt: 'Prototype screen “Request delay review”. Reason: restaurant pickup delay. Pickup summary: expected arrival by 5:55 PM; arrival recorded 5:53 PM with a “Disputed by you” chip; pickup recorded 6:25 PM; total restaurant wait 32 min. A collapsed “View attached timeline, 7 events”. The checkbox “The recorded arrival time looks incorrect” is checked, and the explanation reads “I reached the restaurant before the recorded arrival time.” Below: Delivery marked late, sample flag, expected by 6:45 PM, completed at 6:52 PM. Footer: A review does not guarantee a change to the late-delivery flag. Submit review request.',
  },
  'review-submitted': {
    caption: 'Review request submitted',
    alt: 'Prototype screen “Delay review”: Review request submitted. Your pickup timeline and explanation were included. Status: Review pending. No decision yet; the flag stays as it is until the review is complete. View request and Back to completed order buttons.',
  },
  'review-pending': {
    caption: 'The saved request: Review pending',
    alt: 'Prototype screen “Delay review request”. Status: Pending, Review pending, no decision yet. Request details: order Subway #6593, reason restaurant pickup delay, submitted 6:52 PM. Delivery marked late, sample flag: expected by 6:45 PM, completed at 6:52 PM. Pickup summary with arrival recorded 5:53 PM marked Disputed by you.',
  },
  'review-explanation': {
    caption: 'The rider’s explanation, kept apart from the recorded events',
    alt: 'Lower part of the prototype’s “Delay review request”: Recorded events, with a collapsed “View attached timeline, 7 events”. Your explanation: added by you, attached separately from recorded events. Marked: the recorded arrival time (5:53 PM) looks incorrect. “I reached the restaurant before the recorded arrival time.” Then: related, kept separate, Pickup support conversation, delay reported 6:13 PM, referenced in this review, with a View conversation button.',
  },
} satisfies Record<string, { caption: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]

const sketches = {
  'sketch-pickup': {
    caption: 'Sketch: pickup status',
    alt: 'Hand-drawn wireframe on grid paper: Pickup status with a Help button, Subway order, a box “Waiting 20 min, order is still…”, a latest restaurant update “About 10 min more, updated 2 min ago” with “Check with resto”, and “Need help with the delay? Report the delay to support”. Annotations: 1 time already spent, 2 estimate and freshness, 3 clear next action.',
  },
  'sketch-help': {
    caption: 'Sketch: help with the pickup delay',
    alt: 'Hand-drawn wireframe on grid paper: Help with pickup delay, Subway order, an issue field, an “Order details included” box, “Anything else to add”, a Contact support button and Back. Annotations: 1 clear issue, 2 details filled in, 3 contact support.',
  },
  'sketch-reported': {
    caption: 'Sketch: delay reported',
    alt: 'Hand-drawn wireframe on grid paper: Pickup delay support, a tick with “Delay reported”, a request status box “waiting for support, no reply yet”, “Details shared”, a View convo button and Back to pickup. Annotations: 1 submission confirmed, 2 current request status, 3 continue same request.',
  },
} satisfies Record<string, { caption: string; alt: string }>

type Sketch = keyof typeof sketches
const sketchOrder = Object.keys(sketches) as Sketch[]

const play = {
  'play-home': {
    caption: 'Swiggy Play Store image: the app’s home screen',
    alt: 'Swiggy’s Play Store promotional image “Start delivering now”: Submit documents, Watch all training videos, Start delivering, above a phone showing the delivery app’s home screen with an Online toggle, Help and SOS buttons, and a banner “Still raining? Raise a ticket”.',
  },
  'play-help': {
    caption: 'Swiggy Play Store image: the Help Center',
    alt: 'Swiggy’s Play Store promotional image “24 X 7 Live Support On Duty”, above a phone showing “Welcome to the Delivery Partner Help Center”, “Need any help? Swiggy is here for you”, and “Raise a new issue” with “Order earning issue” below.',
  },
} satisfies Record<string, { caption: string; alt: string }>

type Play = keyof typeof play
const playOrder = Object.keys(play) as Play[]

const items: ImageItem[] = [
  ...order.map((slug) => ({ slug, src: `${DIR}/${slug}`, w: 780, h: 1640, ...shots[slug], label: FROM_PROTO })),
  ...sketchOrder.map((slug) => ({ slug, src: `${DIR}/${slug}`, w: 1800, h: 1800, ...sketches[slug], label: FROM_SKETCH })),
  ...playOrder.map((slug) => ({ slug, src: `${DIR}/${slug}`, w: 1080, h: 1920, ...play[slug], label: FROM_PLAY })),
]
const at = (slug: string) => items.findIndex((i) => i.slug === slug)

/** A prototype phone screen that opens the enlarged view */
function Phone({ slug, open, eager }: { slug: Shot; open: (i: number) => void; eager?: boolean }) {
  return (
    <button type="button" className="rp-phone" onClick={() => open(at(slug))} aria-label={`Enlarge: ${shots[slug].caption}`}>
      <img
        src={`${DIR}/${slug}-1800.webp`}
        srcSet={`${DIR}/${slug}-800.webp 390w, ${DIR}/${slug}-1800.webp 780w`}
        sizes="(max-width: 760px) 80vw, 300px"
        width={780}
        height={1640}
        alt={shots[slug].alt}
        loading={eager ? 'eager' : 'lazy'}
        ref={eager ? undefined : loadAhead}
        decoding="async"
      />
    </button>
  )
}

/** A paper sketch or a Play Store image on a plain mount, with its label above it */
function Mounted({ slug, open, tag, w, h, alt, caption }: {
  slug: string
  open: (i: number) => void
  tag: string
  w: number
  h: number
  alt: string
  caption: string
}) {
  return (
    <div className="dv-paper">
      <span className="dv-paper__tag">{tag}</span>
      <button type="button" className="dv-paper__zoom" onClick={() => open(at(slug))} aria-label={`Enlarge: ${caption}`}>
        <img
          src={`${DIR}/${slug}-1800.webp`}
          srcSet={`${DIR}/${slug}-800.webp ${w === h ? 800 : 540}w, ${DIR}/${slug}-1800.webp ${w}w`}
          sizes="(max-width: 560px) 100vw, 300px"
          width={w}
          height={h}
          alt={alt}
          loading="lazy"
          ref={loadAhead}
          decoding="async"
        />
      </button>
    </div>
  )
}

/** Public videos: secondary context, each with what it shows and what it doesn't */
const videos = [
  {
    href: 'https://www.youtube.com/watch?v=r5z4L5qCTO8',
    kind: 'App walkthrough',
    title: 'Swiggy new joining 2026: order pickup & drop full guide',
    by: 'The Shreemanji',
    date: '11 September 2026',
    shows: 'Pickup, a food-delay status, a waiting timer, Help and the delivery flow.',
  },
  {
    href: 'https://www.youtube.com/watch?v=eSwLfsiw2fE',
    kind: 'Help walkthrough',
    title: 'How to use Swiggy Help and Support',
    by: 'G K L',
    date: '12 September 2026',
    shows: 'The existing Help & Support categories and ticket flows. It doesn’t show the full restaurant-delay support flow during a live order.',
  },
  {
    href: 'https://www.youtube.com/shorts/6FMq7o5z-aI',
    kind: 'One rider’s account',
    title: 'Reality of Swiggy food delivery: restaurant delay 40 min',
    by: 'JoshiVlogRJ03',
    date: '30 June 2025',
    shows: 'He waited about 40 minutes, was asked to wait longer, contacted support, and collected the order after more than 44 minutes. He was worried about delivery targets and being blamed.',
  },
]

/** The four directions I compared */
const approaches = [
  { name: 'Better restaurant estimates', verdict: 'Useful', body: 'But it depends on restaurants updating reliably.' },
  { name: 'Faster support reporting', verdict: 'Useful', body: 'It cuts down on repeating details, but doesn’t guarantee anyone acts on them.' },
  { name: 'Pickup timeline + review request', verdict: 'Chosen', body: 'What was recorded and what the rider says, side by side in one request.' },
  { name: 'Compensation or reassignment', verdict: 'Left out', body: 'These need company policy and operational decisions I can’t design around.' },
] as const

/** The six screens that carry the flow, with the decision behind each */
const keyScreens = [
  {
    slug: 'pickup',
    title: 'Show the estimate with its time',
    body: 'The restaurant’s estimate shows when it was last updated and that it may change, so a stale estimate looks stale.',
  },
  {
    slug: 'follow-up',
    title: 'Follow up in the same request',
    body: 'When the estimate passes, the screen says so. “Still not ready” sends the new wait time to the open request instead of starting another one.',
  },
  {
    slug: 'timeline',
    title: 'Label every event with its source',
    body: 'Schedule, app record, restaurant, rider and support each have their own label. The timeline says it’s a record of what was logged, not a decision about what caused the delay.',
  },
  {
    slug: 'completed',
    title: 'Give the late flag its context',
    body: 'The flag shows expected and actual delivery times side by side, with a way to request a review.',
  },
  {
    slug: 'review-form',
    title: 'Dispute a record without changing it',
    body: 'Ticking “The recorded arrival time looks incorrect” marks it “Disputed by you”. The original 5:53 PM stays as it was recorded.',
  },
  {
    slug: 'review-explanation',
    title: 'Keep the explanation separate',
    body: 'The rider’s words are attached as their own item, apart from the recorded events. Submitting isn’t approval: the status reads “Review pending”, with no decision yet.',
  },
] as const satisfies readonly { slug: Shot; title: string; body: string }[]

/** The opening overview: three screens that carry the idea; the full flow comes later */
const flow: [Shot, string][] = [
  ['pickup', 'Pickup status'],
  ['timeline', 'Pickup timeline'],
  ['review-form', 'Review request'],
]

/** Where each kind of event comes from */
const sources = [
  ['App record', 'Logged by the app, such as arrival and pickup.'],
  ['Restaurant', 'An estimate the restaurant gave. It can change.'],
  ['Rider', 'What the rider reported, such as “Still not ready”.'],
  ['Support', 'Messages from the support conversation.'],
] as const

/** The other two walkthrough fixes, too small for a side-by-side */
const otherFixes = [
  ['The late flag had no context.', 'Added the expected and actual delivery times beside it.'],
  ['A long timeline pushed the explanation field down the screen.', 'Added a compact pickup summary, with the full timeline collapsed.'],
] as const

/**
 * A before-and-after drawn in HTML. No earlier prototype screen was saved, so neither side is a
 * screenshot; the real current screen opens from the link below it.
 */
function Compare({ title, before, after, why, children }: {
  title: string
  before: { mock: React.ReactNode; note: string }
  after: { mock: React.ReactNode; note: string }
  why: string
  children: React.ReactNode
}) {
  return (
    <article className="rp-iter">
      <h3 className="rp-iter__title">{title}</h3>
      <div className="rp-iter__pair">
        <figure className="rp-iter__side">
          <p className="rp-iter__when">Before</p>
          <div className="rp-mock" aria-hidden="true">{before.mock}</div>
          <figcaption>{before.note}</figcaption>
        </figure>
        <figure className="rp-iter__side is-after">
          <p className="rp-iter__when">After</p>
          <div className="rp-mock" aria-hidden="true">{after.mock}</div>
          <figcaption>{after.note}</figcaption>
        </figure>
      </div>
      <p className="rp-iter__why"><strong>Why:</strong> {why}</p>
      <p className="rp-iter__src"><span className="dv-tag">Illustrative comparison</span> {children}</p>
    </article>
  )
}

/** Grey bars standing in for the rider's own words, so no quote is invented */
const Lines = () => <span className="rp-mock__lines"><i /><i /></span>

function Head({ id, kicker, title, children }: { id: string; kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="dv-head">
      <p className="dv-kicker">{kicker}</p>
      <h2 id={`${id}-title`} className="dv-h2">{title}</h2>
      {children}
    </header>
  )
}

export default function RiderPickupDelay() {
  useTitle('Rider pickup delays | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)

  return (
    <article className="dv rp">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type">Independent concept · Not affiliated with Swiggy</p>
          <h1 className="dv-top__title">Making pickup delays easier to explain</h1>
          <p className="dv-top__lede">
            An independent Swiggy Delivery Partner concept for <mark>viewing pickup records</mark> and{' '}
            <mark>requesting a delay review</mark>.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>Timeline</dt>
                <dd>21–27 October 2026 · 1 week</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>Product design</dd>
              </div>
              <div>
                <dt>Prototype</dt>
                <dd>
                  Built with AI assistance, using Claude Code.{' '}
                  <a className="dv-top__try" href={PROTO} target="_blank" rel="noopener noreferrer">
                    Try the prototype <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt>Evaluation</dt>
                <dd>AI-assisted scenario walkthrough; no delivery-partner usability testing.</dd>
              </div>
            </dl>
            <div className="dv-signal">
              <p className="dv-signal__kind">What changed in my thinking</p>
              <p className="dv-signal__text">
                Getting a rider to support doesn’t necessarily resolve a long wait. So I looked at how a rider could
                see <mark>the recorded pickup timeline</mark> and ask for a review when they disagree with a late flag.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="dv-shell">
        <div className="dv-shell__inner dv-shell__grid">
          <CaseSidebar sections={sections} />

          <div className="dv-main">
            {/* The problem */}
            <section id="problem" className="dv-sec dv-sec--first" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="The restaurant is late. The rider waits, and worries about the blame.">
                <p className="dv-statement">
                  When a restaurant runs late, the rider is left waiting, and unsure how that delay will be counted
                  against them.
                </p>
                <p>
                  I explored how recorded pickup context could help a rider <mark>understand what happened</mark> and
                  request a review of a late-delivery flag they disagree with.
                </p>
              </Head>
              <figure>
                <p className="dv-diagram-label">The concept in three screens · my prototype, sample data</p>
                <ol className="rp-flow">
                  {flow.map(([slug, label], i) => (
                    <li key={slug}>
                      <Phone slug={slug} open={open} eager />
                      <span className="rp-flow__label"><span className="rp-flow__num">{i + 1}</span> {label}</span>
                    </li>
                  ))}
                </ol>
                <figcaption className="dv-cap">
                  The wait, the recorded timeline, and a review request. <a href="#flow">The full flow</a> comes later.
                </figcaption>
              </figure>
            </section>

            {/* Secondary evidence */}
            <section id="evidence" className="dv-sec" aria-labelledby="evidence-title" tabIndex={-1}>
              <Head id="evidence" kicker="Secondary evidence" title="What I learned from public sources.">
                <p>
                  I used public videos and Swiggy’s Play Store listing to understand the current app. They give context,
                  not proof of policy or of the latest app version.
                </p>
              </Head>
              <ul className="rp-sources">
                {videos.map((v) => (
                  <li key={v.href}>
                    <p className="dv-evidence__kind">{v.kind}</p>
                    <h3>
                      <a href={v.href} target="_blank" rel="noopener noreferrer">
                        {v.title} <span aria-hidden="true">↗</span><span className="sr-only"> (YouTube, opens in a new tab)</span>
                      </a>
                    </h3>
                    <p className="rp-sources__by">{v.by} · YouTube · {v.date}</p>
                    <p>{v.shows}</p>
                  </li>
                ))}
              </ul>
              <p className="dv-note">
                The third video is <mark>one public rider’s account</mark>. It isn’t an interview, a representative
                finding or a verified policy. His worry about blame doesn’t show that a penalty or flag was applied.
              </p>
              <div className="rp-play">
                <p className="dv-diagram-label">From Swiggy’s Play Store listing · Swiggy’s images, not my design</p>
                <div className="rp-play__grid">
                  {playOrder.map((slug) => (
                    <figure key={slug}>
                      <Mounted slug={slug} open={open} tag="Swiggy · Play Store" w={1080} h={1920} {...play[slug]} />
                      <figcaption className="dv-cap">{slug === 'play-home' ? 'Help and SOS sit on the home screen.' : 'Help Center: raise a new issue.'}</figcaption>
                    </figure>
                  ))}
                </div>
                <p className="dv-cap">
                  Source: <a href={PLAY} target="_blank" rel="noopener noreferrer">Swiggy Delivery Partner App on Google Play<span className="sr-only"> (opens in a new tab)</span></a>,
                  by Swiggy, viewed 30 October 2026. Promotional images, so they may not match the current app exactly.
                </p>
              </div>
            </section>

            {/* Initial direction */}
            <section id="exploration" className="dv-sec" aria-labelledby="exploration-title" tabIndex={-1}>
              <Head id="exploration" kicker="Initial direction" title="First, I made reporting a delay easier.">
                <p>
                  My first direction had three parts: clearer restaurant updates, a prefilled delay report, and follow-up
                  in the same support request.
                </p>
              </Head>
              <div className="dv-notebook">
                <p className="dv-diagram-label">Early exploration · paper sketches from an AI-assisted wireframe exploration</p>
                <div className="rp-sketches">
                  {sketchOrder.map((slug) => (
                    <figure key={slug}>
                      <Mounted slug={slug} open={open} tag="Early sketch" w={1800} h={1800} {...sketches[slug]} />
                      <figcaption className="dv-cap">{sketches[slug].caption.replace('Sketch: ', '')}</figcaption>
                    </figure>
                  ))}
                </div>
                <p className="dv-cap">For working through the layout, not evidence.</p>
              </div>
            </section>

            {/* Change in thinking */}
            <section id="shift" className="dv-sec" aria-labelledby="shift-title" tabIndex={-1}>
              <p className="dv-kicker">Change in thinking</p>
              <p className="dv-statement rp-shift">
                Getting a rider to support <mark>doesn’t necessarily resolve a long wait</mark>.
              </p>
              <dl className="rp-basis">
                <div>
                  <dt>What I saw</dt>
                  <dd>
                    The rider’s account highlighted long waiting and concern about blame. It didn’t show that a late flag
                    was applied.
                  </dd>
                </div>
                <div className="is-mine">
                  <dt>What I proposed</dt>
                  <dd>
                    I used a <mark>hypothetical late-flag scenario</mark> to explore how pickup context could support a
                    review.
                  </dd>
                </div>
              </dl>
              <p className="rp-shift__then">That led to a different question:</p>
              <h2 id="shift-title" className="dv-question">
                How might a rider understand their recorded pickup timeline and request a review when they disagree with
                a late-delivery flag?
              </h2>
              <p className="rp-shift__why">
                I explored a pickup timeline with a review request because it brings the recorded pickup context and the
                rider’s explanation together, without automatically assigning fault.
              </p>
              <p className="dv-scope-line">
                This assumes restaurant estimates and pickup events are recorded and available, and that riders can
                request a review. I haven’t verified any of these.
              </p>
            </section>

            {/* Approaches */}
            <section id="approaches" className="dv-sec" aria-labelledby="approaches-title" tabIndex={-1}>
              <Head id="approaches" kicker="Approaches" title="Four directions, one chosen." />
              <ul className="rp-approaches">
                {approaches.map((a) => (
                  <li key={a.name} className={a.verdict === 'Chosen' ? 'is-chosen' : undefined}>
                    <span className="rp-approaches__verdict">{a.verdict}</span>
                    <h3>{a.name}</h3>
                    <p>{a.body}</p>
                  </li>
                ))}
              </ul>
              <p className="dv-note">
                The timeline shows what was recorded. It <mark>doesn’t decide who was at fault</mark>, and it can’t
                promise a fair decision.
              </p>
            </section>

            {/* Final flow */}
            <section id="flow" className="dv-sec" aria-labelledby="flow-title" tabIndex={-1}>
              <Head id="flow" kicker="Final flow" title="From the wait to a review request.">
                <p>Six screens from the live prototype, with the decision behind each.</p>
              </Head>
              <ol className="dv-steps rp-steps">
                {keyScreens.map((s, i) => (
                  <li key={s.slug} className="rp-step">
                    <Phone slug={s.slug} open={open} />
                    <div className="dv-step__text">
                      <h3><span className="dv-num">{i + 1}</span> {s.title}</h3>
                      <p>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="rp-legend">
                <h3 className="dv-h3">Four kinds of information, kept apart</h3>
                <dl>
                  {sources.map(([name, body]) => (
                    <div key={name}>
                      <dt>{name}</dt>
                      <dd>{body}</dd>
                    </div>
                  ))}
                </dl>
                <p className="dv-cap">
                  When a rider disputes a record, <mark>the original timestamp stays unchanged</mark>. Their explanation is
                  attached separately.
                </p>
              </div>
            </section>

            {/* Scenario walkthrough */}
            <section id="walkthrough" className="dv-sec" aria-labelledby="walkthrough-title" tabIndex={-1}>
              <Head id="walkthrough" kicker="AI-assisted scenario walkthrough" title="Walking through it found four problems.">
                <p>I walked through the prototype with AI assistance, in three scenarios:</p>
              </Head>
              <ul className="ticks">
                <li>Using it for the first time</li>
                <li>Requesting a review without contacting support first</li>
                <li>Disagreeing with the recorded arrival time</li>
              </ul>
              <div className="rp-iters">
                <Compare
                  title="A · The restaurant action"
                  before={{
                    mock: (
                      <>
                        <span className="rp-mock__kicker">Latest restaurant estimate</span>
                        <span className="rp-mock__big">Ready by 6:20 PM</span>
                        <span className="rp-mock__btn">Check with restaurant</span>
                      </>
                    ),
                    note: '“Check with restaurant” sounded like it would contact the restaurant.',
                  }}
                  after={{
                    mock: (
                      <>
                        <span className="rp-mock__kicker">Latest restaurant estimate</span>
                        <span className="rp-mock__big">Ready by 6:20 PM</span>
                        <span className="rp-mock__btn">View restaurant update</span>
                      </>
                    ),
                    note: '“View restaurant update” says what it does: opens the last saved update.',
                  }}
                  why="The action opens a saved update. It doesn’t contact the restaurant or ask for a new estimate."
                >
                  No earlier prototype screen was saved. The early{' '}
                  <button type="button" className="rp-iter__link" onClick={() => open(at('sketch-pickup'))}>paper sketch</button>{' '}
                  shows the old label as “Check with resto”. See the{' '}
                  <button type="button" className="rp-iter__link" onClick={() => open(at('restaurant-update'))}>current screen</button>.
                </Compare>
                <Compare
                  title="B · Disputing the arrival record"
                  before={{
                    mock: (
                      <>
                        <span className="rp-mock__row"><span>Arrival recorded</span><b>5:53 PM</b></span>
                        <span className="rp-mock__label">Your explanation</span>
                        <span className="rp-mock__field"><Lines /></span>
                      </>
                    ),
                    note: 'Disagreement could go in the explanation, but nothing showed it beside the timestamp.',
                  }}
                  after={{
                    mock: (
                      <>
                        <span className="rp-mock__row"><span>Arrival recorded</span><b>5:53 PM</b><em>Disputed by you</em></span>
                        <span className="rp-mock__check">The recorded arrival time looks incorrect</span>
                        <span className="rp-mock__label">Your explanation · attached separately</span>
                        <span className="rp-mock__field"><Lines /></span>
                      </>
                    ),
                    note: 'A checkbox adds “Disputed by you”. The recorded 5:53 PM stays as it was, and the explanation is attached separately.',
                  }}
                  why="It makes the disagreement visible without treating it as a verified correction."
                >
                  Grey lines stand in for the rider’s words. See the{' '}
                  <button type="button" className="rp-iter__link" onClick={() => open(at('review-form'))}>current screen</button>.
                </Compare>
              </div>
              <h3 className="dv-h3 rp-others__title">Two smaller fixes</h3>
              <ul className="rp-others">
                {otherFixes.map(([issue, fix]) => (
                  <li key={issue}><span>{issue}</span> {fix}</li>
                ))}
              </ul>
            </section>

            {/* Outcome */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Outcome and limitations" title="A working concept, not a validated one." />
              <dl className="dv-results">
                <div>
                  <dt>What I made</dt>
                  <dd>A working interactive concept, with <mark>connected delay-reporting and review states</mark>.</dd>
                </div>
                <div>
                  <dt>What it’s meant to do · not measured</dt>
                  <dd>
                    Make recorded pickup context easier to reach, cut down on repeated explanation, and make the
                    difference between submitted, pending and approved clearer.
                  </dd>
                </div>
                <div>
                  <dt>Limitations</dt>
                  <dd>
                    No rider interviews or usability tests. No access to the full current app, Swiggy’s review process
                    or internal rules, so I’m not claiming the app lacks delay records or a review process. Restaurant
                    estimates and event recording are assumed. No evidence of shorter waits, higher earnings or reversed
                    flags. Any fairness depends on the quality of the data and the review process behind it.
                  </dd>
                </div>
                <div>
                  <dt>What I’d validate next</dt>
                  <dd>
                    How riders handle delays today, how accurate the records are, whether “Review pending” is
                    understood, and whether this route fills a real gap.
                  </dd>
                </div>
              </dl>
              <div className="dv-end">
                <External href={PROTO}>Try the prototype</External>
              </div>
            </section>
          </div>
        </div>
      </div>

      {lightbox}
      <NextProject slug="rider-pickup-delay" withPrevious />
    </article>
  )
}
