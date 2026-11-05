import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead, { warmUp } from '../components/loadAhead'
import type { ImageItem } from '../data/images'
import CaseImpact from '../components/CaseImpact'

const DIR = '/work/wavo'
const FROM_APP = 'WAVO interactive concept, sample data. Simulated payments, locks and checks.'

const sections = [
  { id: 'impact', label: 'Impact' },
  { id: 'problem', label: 'The problem' },
  { id: 'references', label: 'Public references' },
  { id: 'pay', label: 'What am I paying for?' },
  { id: 'return', label: 'Where to return it' },
  { id: 'check', label: 'Checks before paying' },
  { id: 'end', label: 'Has it ended?' },
  { id: 'iteration', label: 'Before and after' },
  { id: 'outcome', label: 'Outcome' },
]

/** Screens captured from the interactive app at 390 × 844, 2× (780 × 1688); the earlier
 *  setup screen is a screenshot of the previous build, cropped to its screen (735 × 1529) */
const shots = {
  welcome: {
    caption: 'Welcome: what WAVO is, with Let’s ride and Explore the map',
    alt: 'WAVO welcome screen: an illustration of a tree-lined road under a bright blue sky, seen from a scooter’s handlebar with a phone showing a map. Below, the WAVO logo, the line “A little ride. A lot to explore.”, “Rent an electric scooty by the hour from hubs around Sarovar Layout.”, a Let’s ride button, Explore the map, and a note that no account is needed and everything is simulated.',
  },
  find: {
    caption: 'Find a scooty: the full map with nearby scooties',
    alt: 'WAVO map screen with a search field “Where to?”, Range 5+ km and Kamal Park South filters, scooty markers with battery badges at Kamal Park Gate and Sarovar Metro, the rider’s location pin, and a Nearby scooties strip: WAVO S2, 2 min walk, about 73 km, WV-0874, 8 available.',
  },
  sheet: {
    caption: 'Scooty details: the map with the vehicle sheet',
    alt: 'The map with the WV-0874 marker selected and the vehicle sheet open at its default height: WAVO S2 e-scooty, 2 min walk, about 73 km range, battery 91%, pickup at Kamal Park Gate hub bay 3, helmets 4 in the locker at the last check, not reserved. Footer: 2 hrs from ₹179, deposit hold ₹500, and a Set up rental button.',
  },
  map: {
    caption: 'Find: nearby scooties on the map',
    alt: 'WAVO map screen with a search field “Where to?”, Range 5+ km and Sarovar Layout filters, scooty markers at Kamal Park Gate, and a Nearby scooties list: WAVO S2, 2 min walk, about 73 km, WV-0874, Kamal Park.',
  },
  scooty: {
    caption: 'The scooty sheet: walk, range and pickup hub',
    alt: 'Bottom sheet for WAVO S2 e-scooty WV-0874: 2 min walk, about 73 km range, battery 91%, pickup at Kamal Park Gate hub bay 3, open 6 am to 11 pm, helmets: 4 in the locker at the last check, not reserved. Footer: 2 hrs from ₹179, deposit hold ₹500, and a Set up rental button.',
  },
  plan: {
    caption: 'Set up rental: plans with included kilometres, and the scooty’s own range',
    alt: 'Set up rental for WV-0874 from Kamal Park Gate. Duration, tagged Illustrative prices: 1 hr ₹99 with 15 km included, 2 hrs ₹179 with 30 km (selected), 4 hrs ₹319 with 50 km, 8 hrs ₹549 with 80 km. Each plan includes the distance shown; over it ₹6 per started km; late ₹30 per started 15 min. Estimated battery range: 73 km. How range works, Check trip distance, and Return hub: the rental can only end at this hub, Kamal Park Gate (same hub). Footer: Rental ₹179, deposit hold ₹500, Review booking.',
  },
  warning: {
    caption: 'An optional trip-distance check, with the extra cost spelled out',
    alt: 'Check trip distance expanded: trip distance 42 km with a Check button. Note: only used to warn you about range and included distance. Message: 42 km is 12 km over the 30 km included, about ₹72 extra, or choose 4 hours (50 km included). Below: Return hub, the rental can only end at this hub, Kamal Park Gate; and a simulated Licence check with a Check my licence button.',
  },
  hub: {
    caption: 'Return hub chosen before booking; licence check passed',
    alt: 'Lower part of Set up rental: 4 hrs ₹319 and 8 hrs ₹549 plans, estimated battery range 73 km, Return hub “The rental can only end at this hub” set to Kamal Park Gate (same hub), south gate of Kamal Park, open 6 am to 11 pm. Licence check, simulated: Eligible to book. Footer: Review booking.',
  },
  review: {
    caption: 'Review booking, step 3 of 3',
    alt: 'Review booking, step 3 of 3: WAVO S2 e-scooty WV-0874, 91%, about 73 km range. Rental: duration 2 hrs, due back 2 hrs after unlock; included distance 30 km; pickup and return at Kamal Park Gate hub, the rental can only end inside this hub; helmet 4 in the locker at the last check, not reserved. Charges, illustrative prices: rental ₹179, deposit hold ₹500. Footer: held free for 12 min, no charge yet, and Confirm and hold.',
  },
  reserved: {
    caption: 'Scooty reserved, with the hold countdown',
    alt: 'Scooty reserved with an 11:54 countdown: hold ends at 3:10 am; if it runs out, it’s released and nothing is charged. Kamal Park Gate hub bay 3, white scooty WV-0874. Payment happens at the scooty, after the safety checks. Buttons: I’m at the scooty, and Cancel hold (free).',
  },
  scan: {
    caption: 'Identify the scooty: scan the QR, or enter its code',
    alt: 'Find it, 1 of 3, hold 11:48. A dark camera view with a QR frame: Point at the QR code below the handlebar. Simulated: your camera isn’t opened; scanning identifies the scooty, it unlocks after your checks. Buttons: Scan QR code, Enter code, Get help.',
  },
  checks: {
    caption: 'Checks in two groups, before any payment',
    alt: 'Checks, 2 of 3: Check WV-0874, identified, still locked, 91% battery. Tick each item yourself; your hold keeps running while you check. Vehicle condition: both brakes grip firmly when squeezed; tyres look inflated, with no cuts or bulges; headlight, brake light, indicators and horn work; both mirrors are fitted and adjusted. Helmet and readiness below. Footer: 0 of 7 checked, Continue to payment disabled.',
  },
  'checks-done': {
    caption: 'All seven checks ticked; reporting a problem stays separate',
    alt: 'Checks with all items ticked: helmet fastened, carrying my driving licence, I know my return hub and deadline. Something wrong? If anything is unsafe, don’t ride; reporting it ends the booking free, with a Report a problem button. Footer: 7 of 7 checked, Continue to payment.',
  },
  pay: {
    caption: 'Pay and unlock: the charge and the deposit hold on separate lines',
    alt: 'Pay, 3 of 3. Pay and unlock: by UPI the rental is charged and the deposit is held, then you unlock. At unlock, simulated payment: rental 2 hrs, 30 km ₹179; deposit hold, refundable ₹500; late return ₹30 per started 15 min late; return only at Kamal Park Gate. When the deposit is released: simulated, no UPI request is sent. Footer: Pay with UPI.',
  },
  ride: {
    caption: 'During the ride: time, cost and distance first; the return hub stays in view',
    alt: 'Rental in progress over an illustration labelled “not your route”. Time left 1:59:53, cost so far ₹179, distance 0.0 of 30 km, about 73 km estimated range left. Return to Kamal Park Gate, due by 4:58 am, with a Change link. Finding the bays. End rental button and a Need more time? link.',
  },
  'end-location': {
    caption: 'End rental, step 1: inside the return hub',
    alt: 'End rental, step 1 Location: Return at Kamal Park Gate; your booking can only end here. A small map with you inside the hub. You’re inside Kamal Park Gate. Continue.',
  },
  'end-photo': {
    caption: 'End rental, step 2: parking photo and helmet',
    alt: 'End rental, step 2 Photo and helmet: parking photo of the whole seated scooty in a bay on its centre stand, with Retake. Helmet: Locker helmet back in the Kamal Park Gate locker (selected) or I used my own helmet. Continue.',
  },
  'end-request': {
    caption: 'End rental, step 3: request the return, and what happens next',
    alt: 'End rental, step 3 Request: time used 15 s of 2 hrs, distance 0.0 km of 30 km, return hub Kamal Park Gate. Charges so far, illustrative prices: rental 2 hrs ₹179; total if you request now ₹179. What happens next: billing stops once your return request at the return hub is accepted; the rental is complete only when the scooty is confirmed locked; if the lock can’t be confirmed, billing still stops at your request. Request return and lock.',
  },
  summary: {
    caption: 'Rental summary: charges first, deposit release shown as pending',
    alt: 'Rental summary: Scooty locked, return confirmed. WV-0874, booking B-ASNW. Charges: rental 2 hrs, 30 km included ₹179; total charged ₹179. Deposit hold, release pending ₹500: the deposit is held, not charged; its release starts once the scooty is confirmed locked; release timing isn’t fixed. Charge details, Report an issue with this charge. Return: lock confirmed 2:59 am at Kamal Park Gate. Start a new rental.',
  },
  'unsafe-report': {
    caption: 'Report a problem: cosmetic issues vs safety issues',
    alt: 'What’s wrong? sheet over the checks: Cosmetic, you can still ride: scratches or scuffs, dent or cracked body panel, torn or dirty seat. Safety, don’t ride: brakes weak or not working (selected), flat or damaged tyre, missing or broken mirror, lights indicators or horn not working, something else feels unsafe. Continue and Cancel.',
  },
  'unsafe-confirm': {
    caption: 'A safety issue ends the booking with no charge',
    alt: 'Dialog: Don’t ride WV-0874. You reported brakes weak or not working. This ends the booking at no charge and takes WV-0874 out of service for inspection; we’ll suggest the nearest replacement. Buttons: Report and end booking (red), Go back.',
  },
  'unsafe-ended': {
    caption: 'Booking ended, and an alternative that is not reserved',
    alt: 'Don’t ride WV-0874. Thanks for reporting; WV-0874 has been taken out of service for inspection and your booking ended, free of charge. Nothing was charged and no deposit was taken. Your duration, return hub and payment choice are kept for your next booking. WV-2481, Kamal Park Gate, about 66 km range, 2 min walk. Book WV-2481 instead, Back to map.',
  },
  'payment-pending': {
    caption: 'Payment pending: not confirmed, don’t pay again',
    alt: 'Pay, 3 of 3, hold 11:45. Payment pending: not confirmed yet. Don’t pay again; check the status. If your hold runs out first, any authorisation is released. At unlock: rental ₹179, deposit hold ₹500. Check payment status.',
  },
  'lock-failed': {
    caption: 'Return requested, but the lock didn’t engage',
    alt: 'Return requested. The lock didn’t engage: push the scooty fully onto its stand in the bay, then try again; your return is requested but not confirmed. Return requested 2:52 am; scooty locked: not yet confirmed; billing: stopped at 2:52 am; hub Kamal Park Gate. Keep the scooty on its stand inside the bay and stay until the lock is confirmed. Try locking again, Still stuck? Get assistance.',
  },
  'lock-assist': {
    caption: 'Close with assistance: the rental closes, the check stays pending',
    alt: 'Dialog: Close with assistance? Billing stays stopped at your return request. The rental closes, but because the lock isn’t confirmed, WV-0874 still needs a check at Kamal Park Gate and your deposit stays held until then. Leave it on its stand inside the bay. Assistance is simulated. Close the rental, Keep trying.',
  },
  'before-setup': {
    caption: 'Earlier version of Set up rental, before the hierarchy pass',
    alt: 'Earlier Set up your rental screen for WV-0874: a large heading, a line with 91%, about 73 km estimated range and Kamal Park Gate; a Duration card with four plan buttons, 1 hr ₹99 with 15 km allowance selected, 2 hrs ₹179, 4 hrs ₹319, 8 hrs ₹549, and a paragraph explaining that included km is a pricing allowance, not a battery promise; a second card, Planned distance optional, with a km field, a Check button and a note; and a footer button that combines Review booking with ₹99 + ₹500 held, 15 km, free 12-min hold.',
  },
  'pending-summary': {
    caption: 'An assisted closure: billing closed, scooty check pending',
    alt: 'Rental summary with an amber status: Billing closed, scooty check pending. The lock couldn’t be confirmed, so the rental was closed with assistance; the scooty still needs to be checked at Kamal Park Gate. Charges: rental ₹179, total charged ₹179. Deposit hold, kept until scooty check ₹500; its release can start once the scooty check is complete.',
  },
} satisfies Record<string, { caption: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]

const size = (slug: Shot): [number, number] => (slug === 'before-setup' ? [735, 1529] : [780, 1688])
const items: ImageItem[] = order.map((slug) => {
  const [w, h] = size(slug)
  return { slug, src: `${DIR}/${slug}`, w, h, ...shots[slug], label: FROM_APP }
})
const at = (slug: string) => items.findIndex((i) => i.slug === slug)

/** A numbered marker on a screen, `top` as a % of the screen's height */
type Pin = { n: number; top: number }

/** An app screen that opens the enlarged view; pins mark the rows the text refers to */
function Phone({ slug, open, eager, pins, sizes = '(max-width: 760px) 70vw, 300px' }: {
  slug: Shot
  open: (i: number) => void
  eager?: boolean
  pins?: Pin[]
  sizes?: string
}) {
  const [w, h] = size(slug)
  return (
    <div className="wv-phone">
      <button type="button" className="wv-phone__zoom" onClick={() => open(at(slug))} aria-label={`Enlarge: ${shots[slug].caption}`}>
        <img
          src={`${DIR}/${slug}-1800.webp`}
          srcSet={`${DIR}/${slug}-800.webp 390w, ${DIR}/${slug}-1800.webp ${w}w`}
          sizes={sizes}
          width={w}
          height={h}
          alt={shots[slug].alt}
          loading={eager ? 'eager' : 'lazy'}
          ref={eager ? undefined : loadAhead}
          decoding="async"
        />
      </button>
      {pins?.map((p) => (
        <span key={p.n} className="wv-pin" style={{ top: `${p.top}%` }} aria-hidden="true">{p.n}</span>
      ))}
    </div>
  )
}

/** Notes keyed to the pins on a screen */
function Notes({ notes }: { notes: string[] }) {
  return (
    <ol className="wv-notes">
      {notes.map((n, i) => (
        <li key={n}><span className="wv-notes__n" aria-hidden="true">{i + 1}</span>{n}</li>
      ))}
    </ol>
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

/** The first three screens, shown under the title */
const opening: [Shot, string][] = [
  ['welcome', 'Welcome'],
  ['find', 'Find a scooty'],
  ['sheet', 'Scooty details'],
]

/** The rental decisions in three screens: what you commit to, what you pay, how it ends */
const hero: [Shot, string][] = [
  ['plan', 'Set up rental'],
  ['pay', 'Pay and unlock'],
  ['summary', 'Rental summary'],
]

/** Public references, each with what it suggested for WAVO and what it can't tell me */
const references = [
  {
    kind: 'Help article · old',
    title: 'Yulu: How to end your ride?',
    short: 'Yulu help article',
    href: 'https://yulu.freshdesk.com/support/solutions/articles/35000127783-how-to-end-your-ride-',
    says: 'To end a ride, you must be inside a Yulu Zone. The steps differ by vehicle.',
    use: 'Where you can return, and whether the scooty is locked, need to be clear.',
    limit: 'Last updated June 2019. It doesn’t show a usability problem or cover every current vehicle.',
  },
  {
    kind: 'FAQ · similar service',
    title: 'Bounce Daily: Questions riders ask',
    short: 'Bounce Daily FAQ',
    href: 'https://www.bouncedaily.in/faq',
    says: 'Weekly and monthly rentals, picked up and returned at a hub. The deposit comes back after an inspection. Real range varies.',
    use: 'Handover, deposit status and range need explaining.',
    limit: 'Long plans and staffed hubs don’t map directly to hourly WAVO.',
  },
  {
    kind: 'Rider agreement',
    title: 'Bounce Daily: Online rider agreement',
    short: 'Bounce Daily rider agreement',
    href: 'https://hire.bouncedaily.in/terms',
    says: 'Covers checks before riding, returning the vehicle, deposits and damage.',
    use: 'Checks and rider duties belong in the flow.',
    limit: 'Not legal rules for everyone. Its wording differs from the FAQ, so I kept the two apart.',
  },
]

/** The main journey, in order, as three legs of a trip; each stop opens its screen */
const legs: { name: string; stops: [string, Shot][] }[] = [
  { name: 'Before you go', stops: [['Find', 'map'], ['Plan and return hub', 'plan'], ['Review', 'review'], ['Hold', 'reserved']] },
  { name: 'At the scooty', stops: [['Identify', 'scan'], ['Check', 'checks'], ['Pay', 'pay'], ['Unlock and ride', 'ride']] },
  { name: 'Returning', stops: [['Request return', 'end-request'], ['Confirm lock', 'summary'], ['Summary', 'summary']] },
]

/** Design-led changes from my own review of the setup screens; not measured with users */
const changes = [
  ['Mixed text sizes, cards inside cards, prices inside buttons.', 'Clear sizes (16 px text, 14 px labels, 22–24 px headings), simple dividers, and one summary line above one button.'],
  ['Checks in one long list.', 'Two groups, a tick count at the bottom, and “Report a problem” on its own.'],
  ['“Total authorised” mixed the rental charge and the deposit.', 'Rental and deposit on separate lines, never added together.'],
  ['During the ride, a boxed return card competed with “End rental”.', 'Time, cost and range first, a simple “Return to” line, and one main button.'],
  ['The summary opened with a map and big number tiles, and showed ₹0 rows.', 'Charges, deposit and return status first, ₹0 rows under “Charge details”, map last.'],
] as const

/** Service rules the screens depend on but can't settle; all are proposed, none confirmed */
const unresolved = [
  ['Detour billing', 'If your return hub is full or closed, switching to another one is free to ask for, but the extra time and km are still billed. Should the operator pay when it caused the detour? I’d look at a detour allowance before calling the rule fair.'],
  ['Deposit by payment method', 'The screens show ₹500 as held, not charged. Whether a hold works, and when it’s released, differs for UPI and card and depends on the payment provider. The summary says “release pending” and gives no date.'],
  ['Assisted return', 'If the lock can’t be confirmed, “Close with assistance” keeps the scooty check pending and the deposit held. Who gets the request, how fast they reply, and how checks and disputes work is still undecided.'],
] as const

/** The three things the planned test checks first; each draws on tasks below */
const themes = [
  ['Cost comprehension', 'T1–T3', 'Can riders say what they’ll pay and what’s held, how late charges work, and explain included km and battery range in their own words?'],
  ['Unsafe-vehicle recovery', 'T5', 'With a weak front brake, do they read the checks and report it, or tick through every box?'],
  ['Return confirmation', 'T7, T8', 'At each step, can a rider tell if they can leave and what’s still open, and tell “billing stopped” from “scooty locked”? Their real trips also show if fixed return hubs work at all.'],
] as const

/** Planned formative tasks. None has been run. */
const tasks = [
  ['T1', 'Choose and reserve', 'Do they book the right plan and hub, and know they’ll pay ₹179 with ₹500 held?'],
  ['T2', 'Explain trip costs', 'If they’re 20 minutes late, do they expect two 15-minute late charges, and see there’s no grace period?'],
  ['T3', 'Km vs range', 'Can they explain included km and battery range in their own words?'],
  ['T4', 'QR won’t scan', 'Do they find code entry without booking twice?'],
  ['T5', 'Unsafe scooty', 'With a weak front brake, do they report it instead of ticking every box?'],
  ['T6', 'Payment pending', 'Do they check the status instead of paying again or riding off?'],
  ['T7', 'Return hub full', 'Do they find another hub and understand the rental isn’t over yet?'],
  ['T8', 'Lock not confirmed', 'Can they tell “billing stopped” from “scooty locked”, and not assume the deposit is back?'],
] as const

/** An expandable block; its screens start loading as soon as the summary is hovered or focused */
function More({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="dv-more">
      <summary onPointerEnter={warmUp} onFocus={warmUp}>{title}</summary>
      <div className="dv-more__body">{children}</div>
    </details>
  )
}

/** A key decision: the likely confusion, what the screen does instead, and why; limits fold away */
function Decision({ title, confusion, response, notes, reason, children }: {
  title: string
  confusion: string
  response: string
  notes: string[]
  reason: string
  children?: React.ReactNode
}) {
  return (
    <div className="dv-step__text">
      <h3>{title}</h3>
      <div className="wv-flip">
        <p className="wv-flip__risk"><span>Could confuse</span>{confusion}</p>
        <p className="wv-flip__fix"><span>So the screen</span>{response}</p>
      </div>
      <Notes notes={notes} />
      <p className="wv-reason"><strong>Why:</strong> {reason}</p>
      {children && (
        <details className="wv-alt">
          <summary>Alternative and limits</summary>
          <dl className="dv-why">{children}</dl>
        </details>
      )}
    </div>
  )
}

/** Two things a rider could mix up, set side by side with what each one means */
function Pair({ a, b }: { a: [string, string]; b: [string, string] }) {
  return (
    <dl className="cp-two wv-pair">
      {[a, b].map(([term, meaning]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{meaning}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A caveat placed where it matters: what kind of claim this is, and what that means */
function Caveat({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <p className="wv-caveat">
      <span className="dv-tag">{tag}</span> {children}
    </p>
  )
}

/** The four questions the page is built around */
const questions = [
  ['pay', 'What am I paying for?', 'Included km vs battery range. Rental charge vs deposit.'],
  ['return', 'Where can I return the scooty?', 'One return hub, chosen before you book.'],
  ['check', 'What should I check before paying?', 'Find it, check it, then pay.'],
  ['end', 'How do I know the rental has really ended?', '“Return requested” vs “lock confirmed”.'],
] as const

/** Impact: what the concept does on screen; no rider has used it yet */
const impact = [
  { tone: 'sun', value: '4', label: 'Rider questions, each answered on screen' },
  { tone: 'mint', value: '₹0', label: 'Charged before the rider has checked the scooty' },
  { tone: 'rose', value: '3', label: 'Recovery flows: an unsafe scooty, a pending payment, a lock that won’t confirm' },
  { tone: 'sky', value: '4 widths', label: 'Layouts checked from 320 to 430 px' },
] as const

export default function Wavo() {
  useTitle('WAVO | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)

  // the app's own two typefaces, only for the visual-system specimens on this page
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600&text=BricolageGrotesque%20&family=Inter:wght@500;600&display=swap'
    document.head.appendChild(link)
    return () => link.remove()
  }, [])

  return (
    <article className="dv wv">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type">Independent concept · Not a launched service</p>
          <h1 className="dv-top__title">WAVO — hourly electric scooty rentals</h1>
          <p className="dv-top__lede">
            A concept designed to make <mark>rental costs, vehicle checks and returns</mark> easier to understand.
          </p>
          <ol className="wv-stage" aria-label="The first three screens of the app">
            {opening.map(([slug, label]) => (
              <li key={slug}>
                <Phone slug={slug} open={open} eager sizes="(max-width: 760px) 72vw, 300px" />
                <span className="wv-stage__label">{label}</span>
              </li>
            ))}
          </ol>
          <dl className="dv-top__meta wv-summary">
            <div>
              <dt>Status</dt>
              <dd>
                Concept: a working app and editable Figma screens. Not linked to the services I reviewed.
                <br />
                Rider testing <span className="dv-tag">Planned</span>
              </dd>
            </div>
            <div>
              <dt>My part</dt>
              <dd>Product framing, interaction and visual design, recovery flows, and iteration direction.</dd>
            </div>
            <div>
              <dt>Built with AI help</dt>
              <dd>AI tools supported exploration, coding the app and moving the screens into editable Figma.</dd>
            </div>
            <div>
              <dt>Sample data</dt>
              <dd>The location, scooties and prices are illustrative. Payments, locks, scans and checks are simulated.</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className="dv-shell">
        <div className="dv-shell__inner dv-shell__grid">
          <CaseSidebar sections={sections} />

          <div className="dv-main">
            <CaseImpact
              title="Fewer surprises in a rental, ready to test."
              lede="Before a rider pays, the screens show what is charged and what is held, where the scooty must go back, and what to check. At the end, they say plainly whether the rental is over."
              stats={impact}
              note="A concept with sample data. No riders have tested it yet, so this is what the design does, not a measured result."
            />

            {/* The problem, who it's for, and the four questions */}
            <section id="problem" className="dv-sec dv-sec--first" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="Renting is more than picking the nearest scooty.">
                <p className="dv-statement">
                  A rental has many parts: included km, battery range, where to return it, safety checks and a
                  deposit. Riders need to <mark>know what they’re agreeing to</mark>, and when it’s really over.
                </p>
                <p>
                  The problem came from my own design work, not from research with riders. I don’t know yet how often
                  riders face it.
                </p>
              </Head>
              <dl className="wv-audience">
                <div>
                  <dt>Intended audience</dt>
                  <dd>
                    People in Indian cities who have ridden a seated scooty, both renters and first-timers, for a
                    1–4 hour trip or errand. This is who I’d invite to test, not a proven user group.
                  </dd>
                </div>
                <div>
                  <dt>What they need</dt>
                  <dd>
                    “When I need a scooty for a short trip, help me see if it fits, know what I’m agreeing to, and
                    get a clear confirmation when I return it.”
                    <span className="wv-audience__note">My own framing, not a rider’s quote.</span>
                  </dd>
                </div>
              </dl>
              <h3 className="dv-h3 cp-gap">Four questions the design answers</h3>
              <ol className="wv-questions wv-questions--four">
                {questions.map(([id, q, short]) => (
                  <li key={id}>
                    <h3><a href={`#${id}`}>{q}</a></h3>
                    <p>{short}</p>
                  </li>
                ))}
              </ol>
              <figure className="wv-overview-fig">
                <p className="dv-diagram-label">The rental in three screens · sample data</p>
                <ol className="wv-hero">
                  {hero.map(([slug, label], i) => (
                    <li key={slug}>
                      <Phone slug={slug} open={open} sizes="(max-width: 560px) 30vw, (max-width: 760px) 28vw, 260px" />
                      <span className="wv-hero__label"><span className="wv-hero__num">{i + 1}</span> {label}</span>
                    </li>
                  ))}
                </ol>
                <figcaption className="dv-cap">
                  What you agree to, what you pay, and how it ends. Tap a screen to make it bigger.
                </figcaption>
              </figure>
              <More title="The whole journey, step by step">
                <div className="wv-journey">
                  <ol className="wv-route">
                    {legs.map((leg, l) => {
                      const first = legs.slice(0, l).reduce((n, g) => n + g.stops.length, 0)
                      const screens = [...new Set(leg.stops.map(([, slug]) => slug))]
                      return (
                        <li key={leg.name} className="wv-leg">
                          <p className="wv-leg__name"><span aria-hidden="true">{String.fromCharCode(65 + l)}</span> {leg.name}</p>
                          <div className="wv-fan" style={{ '--n': screens.length } as React.CSSProperties}>
                            {screens.map((slug, i) => (
                              <button
                                key={slug}
                                type="button"
                                className="wv-fan__card"
                                style={{ '--i': i } as React.CSSProperties}
                                onClick={() => open(at(slug))}
                                aria-label={`Enlarge: ${shots[slug].caption}`}
                              >
                                <img src={`${DIR}/${slug}-800.webp`} width={390} height={844} alt="" loading="lazy" ref={loadAhead} decoding="async" />
                              </button>
                            ))}
                          </div>
                          <ol className="wv-leg__stops" start={first + 1}>
                            {leg.stops.map(([name, slug], i) => (
                              <li key={name}>
                                <button type="button" onClick={() => open(at(slug))}>
                                  <span className="wv-journey__n">{String(first + i + 1).padStart(2, '0')}</span> {name}
                                </button>
                              </li>
                            ))}
                          </ol>
                        </li>
                      )
                    })}
                  </ol>
                </div>
                <dl className="dv-facts wv-scope">
                  <div>
                    <dt>In scope</dt>
                    <dd>Pick a scooty, a plan and a return hub. Find and check it. Pay and unlock. Return it, with a clear lock status and bill.</dd>
                  </div>
                  <div>
                    <dt>Left out</dt>
                    <dd>Sign-up, real ID checks, live maps, hardware and operations. A real service would need all of these.</dd>
                  </div>
                </dl>
              </More>
            </section>

            {/* Reference review */}
            <section id="references" className="dv-sec" aria-labelledby="references-title" tabIndex={-1}>
              <Head id="references" kicker="Public references" title="Public documents showed what to explain.">
                <p>
                  I read three public documents from two services. They don’t prove riders want WAVO’s hourly plans
                  or fixed return hubs, and I didn’t test any competitor apps.
                </p>
              </Head>
              <div className="dv-matrix wv-compare">
                <table>
                  <thead>
                    <tr><th scope="col">Source</th><th scope="col">What it suggested for WAVO</th></tr>
                  </thead>
                  <tbody>
                    {references.map((r) => (
                      <tr key={r.href}>
                        <th scope="row">{r.short}<span>{r.kind}</span></th>
                        <td>{r.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <More title="Sources, dates and limits">
                <ul className="wv-refs">
                  {references.map((r) => (
                    <li key={r.href}>
                      <p className="dv-evidence__kind">{r.kind}</p>
                      <h3>
                        <a href={r.href} target="_blank" rel="noopener noreferrer">
                          {r.title} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </h3>
                      <dl>
                        <div><dt>What it says</dt><dd>{r.says}</dd></div>
                        <div className="is-limit"><dt>Limit</dt><dd>{r.limit}</dd></div>
                      </dl>
                    </li>
                  ))}
                </ul>
                <p>
                  All three were accessed on 2 November 2026. A small, focused review, not a full competitor audit or
                  user research.
                </p>
              </More>
            </section>

            {/* Question 1: cost */}
            <section id="pay" className="dv-sec" aria-labelledby="pay-title" tabIndex={-1}>
              <Head id="pay" kicker="Question 1" title="What am I paying for?">
                <p>Two pairs of numbers are easy to mix up. The screens keep each pair apart.</p>
              </Head>
              <Pair
                a={['Included km', 'Part of the price. A 2-hour plan includes 30 km; going over costs extra per km.']}
                b={['Estimated battery range', 'How far the current charge might go. An estimate, not a promise, and it doesn’t grow with a longer plan.']}
              />
              <ol className="dv-steps wv-steps">
                <li className="wv-step">
                  <div className="wv-step__pair">
                    <Phone slug="plan" open={open} pins={[{ n: 1, top: 34 }, { n: 2, top: 59 }]} />
                    <Phone slug="warning" open={open} pins={[{ n: 3, top: 36 }]} />
                  </div>
                  <Decision
                    title="Keep the plan’s km and the battery range apart"
                    confusion="Included km and battery range look like one promise about distance."
                    response="Gives each number its own place."
                    reason="Included km is part of the price. Battery range is an estimate on the current charge, not a guaranteed travel distance."
                    notes={[
                      'Each plan shows its included km.',
                      'Battery range is shown on its own as an estimate.',
                      'An optional distance check shows the extra cost and suggests a better plan.',
                    ]}
                  >
                    <div><dt>Alternative</dt><dd>Show battery % only. Riders would have to work out the distance themselves.</dd></div>
                  </Decision>
                </li>
              </ol>
              <Pair
                a={['Rental charge', 'What the ride costs. Charged at unlock: ₹179 for 2 hours in the sample.']}
                b={['Deposit hold', 'Money held, not charged: ₹500 in the sample. It’s released after the return is confirmed.']}
              />
              <ol className="dv-steps wv-steps">
                <li className="wv-step">
                  <div className="wv-step__pair">
                    <Phone slug="review" open={open} />
                    <Phone slug="pay" open={open} pins={[{ n: 1, top: 43 }]} />
                  </div>
                  <Decision
                    title="Never add the rental and the deposit together"
                    confusion="An earlier “Total authorised” line mixed the rental charge and the deposit."
                    response="Puts them on separate lines, everywhere."
                    reason="A rider should know what they’ve spent and what they’ll get back."
                    notes={['At payment, the rental and the refundable deposit hold sit on separate lines, with the late rate below.']}
                  />
                </li>
              </ol>
              <More title="When the payment is pending">
                <div className="wv-step">
                  <div className="wv-step__pair">
                    <Phone slug="payment-pending" open={open} pins={[{ n: 1, top: 22 }]} />
                  </div>
                  <div className="dv-step__text">
                    <p>
                      “Payment pending” can look like paid. The screen says it’s not confirmed yet, tells you not to
                      pay again, and offers a status check.
                    </p>
                  </div>
                </div>
              </More>
              <Caveat tag="Illustrative prices">
                The prices, the ₹6 per extra km and the ₹30 late charge are sample numbers, not a real tariff.
              </Caveat>
              <Caveat tag="Unresolved">
                {unresolved[1][1]}
              </Caveat>
            </section>

            {/* Question 2: return hub */}
            <section id="return" className="dv-sec" aria-labelledby="return-title" tabIndex={-1}>
              <Head id="return" kicker="Question 2" title="Where can I return the scooty?">
                <p>
                  In WAVO, a rental can only end at one return hub. A nearby pickup is no use if you can’t return the
                  scooty where you’re going.
                </p>
              </Head>
              <ol className="dv-steps wv-steps">
                <li className="wv-step">
                  <div className="wv-step__pair">
                    <Phone slug="hub" open={open} pins={[{ n: 1, top: 52 }]} />
                    <Phone slug="ride" open={open} pins={[{ n: 2, top: 70 }]} />
                  </div>
                  <Decision
                    title="Show the return hub before you book"
                    confusion="Finding out where you must return only at the end of the ride."
                    response="Asks for the return hub before you reserve."
                    reason="A strict return rule should be part of the choice, not a surprise at the end."
                    notes={[
                      '“The rental can only end at this hub” sits next to the choice.',
                      'During the ride, the hub and its deadline stay on screen.',
                    ]}
                  >
                    <div><dt>Alternative</dt><dd>Faster booking, with return rules shown later.</dd></div>
                  </Decision>
                </li>
              </ol>
              <Caveat tag="Proposed rule">
                Fixed return hubs are a rule I proposed for the concept. Whether riders accept them is untested.
              </Caveat>
              <Caveat tag="Unresolved">
                {unresolved[0][1]}
              </Caveat>
            </section>

            {/* Question 3: checks before paying */}
            <section id="check" className="dv-sec" aria-labelledby="check-title" tabIndex={-1}>
              <Head id="check" kicker="Question 3" title="What should I check before paying?">
                <p>
                  The order is find, check, then pay. Paying at booking would save steps, but a rider who finds a
                  problem at pickup would then wait for a refund.
                </p>
              </Head>
              <ol className="dv-steps wv-steps">
                <li className="wv-step">
                  <div className="wv-step__trio">
                    <Phone slug="scan" open={open} pins={[{ n: 1, top: 95 }]} />
                    <Phone slug="checks" open={open} pins={[{ n: 2, top: 34 }]} />
                    <Phone slug="checks-done" open={open} pins={[{ n: 3, top: 70 }]} />
                  </div>
                  <Decision
                    title="Check the scooty before paying"
                    confusion="Pay first, find a problem at pickup, then wait for a refund."
                    response="Goes find → check → pay → unlock."
                    reason="Nothing is charged until the rider has checked the scooty they’re about to ride."
                    notes={[
                      'Type in the code if the QR sticker won’t scan.',
                      'Checks in two groups: the scooty, and helmet and readiness.',
                      '“Report a problem” stays separate from the ticks.',
                    ]}
                  />
                </li>
              </ol>
              <figure className="wv-rec">
                <h3 className="wv-rec__title">If the scooty isn’t safe</h3>
                <ol className="wv-rec__row">
                  <li><Phone slug="unsafe-report" open={open} /><span className="wv-rec__label">Report: small damage or safety</span></li>
                  <li><Phone slug="unsafe-confirm" open={open} /><span className="wv-rec__label">Confirm: booking ends, no charge</span></li>
                  <li><Phone slug="unsafe-ended" open={open} /><span className="wv-rec__label">Ended, another scooty suggested</span></li>
                </ol>
                <figcaption className="dv-cap">
                  Small damage and safety problems are separate. A safety problem ends the booking for free, and
                  another scooty is suggested, <mark>not booked for you</mark>.
                </figcaption>
              </figure>
              <Caveat tag="Simulated">
                Scanning, the checks and payment are simulated. A checklist can’t prove a scooty is safe; real
                maintenance happens outside the app.
              </Caveat>
            </section>

            {/* Question 4: the end of the rental */}
            <section id="end" className="dv-sec" aria-labelledby="end-title" tabIndex={-1}>
              <Head id="end" kicker="Question 4" title="How do I know the rental has really ended?">
                <p>Asking to end a rental and the scooty actually locking are two different moments.</p>
              </Head>
              <Pair
                a={['Return requested', 'You’ve asked to end the rental at the hub. Billing stops here, but the scooty may not be locked yet.']}
                b={['Lock confirmed', 'The scooty is locked. Only now is the rental complete, and the deposit release can start.']}
              />
              <ol className="dv-steps wv-steps">
                <li className="wv-step">
                  <div className="wv-step__trio">
                    <Phone slug="end-request" open={open} pins={[{ n: 1, top: 62 }]} />
                    <Phone slug="lock-failed" open={open} pins={[{ n: 2, top: 44 }]} />
                    <Phone slug="summary" open={open} pins={[{ n: 3, top: 20 }]} />
                  </div>
                  <Decision
                    title="Don’t show “done” until it’s done"
                    confusion="“Return requested” can look like locked."
                    response="Gives each state its own screen and next step."
                    reason="A rider needs to know if they can leave, and what’s still open."
                    notes={[
                      'Before you request, the screen says what happens next.',
                      'If the lock doesn’t engage, it says “Not yet confirmed” and what to do.',
                      'Only a confirmed lock says “Scooty locked · return confirmed”.',
                    ]}
                  >
                    <div><dt>Depends on</dt><dd>Reliable times, signals from the lock and a real support team. The concept has none of these.</dd></div>
                  </Decision>
                </li>
              </ol>
              <More title="If the lock still won’t confirm">
                <figure className="wv-rec">
                  <ol className="wv-rec__row">
                    <li><Phone slug="lock-failed" open={open} /><span className="wv-rec__label">Lock failed: return asked, not confirmed</span></li>
                    <li><Phone slug="lock-assist" open={open} /><span className="wv-rec__label">Close with help, lock not confirmed</span></li>
                    <li><Phone slug="pending-summary" open={open} /><span className="wv-rec__label">Summary: billing stopped, check pending</span></li>
                  </ol>
                  <figcaption className="dv-cap">
                    None of these shows a successful lock. You can close with help, the summary says{' '}
                    <mark>“scooty check pending”</mark>, and the deposit stays held until then.
                  </figcaption>
                </figure>
              </More>
              <Caveat tag="Proposed rule">
                Billing stopping at the return request is a rule I proposed, not one an operator has agreed to.
              </Caveat>
              <Caveat tag="Simulated">The lock and its signals are simulated.</Caveat>
              <Caveat tag="Unresolved">
                {unresolved[2][1]}
              </Caveat>
            </section>

            {/* Visual iteration */}
            <section id="iteration" className="dv-sec" aria-labelledby="iteration-title" tabIndex={-1}>
              <Head id="iteration" kicker="Before and after" title="Less on screen, without hiding cost or safety.">
                <p>
                  The earlier setup screen showed everything at once: a big heading, long text, plans, a distance field
                  and a busy footer. When I reviewed it myself, it felt crowded.
                </p>
              </Head>
              <div className="wv-iter">
                <figure className="wv-iter__side">
                  <p className="wv-iter__when">Before</p>
                  <Phone slug="before-setup" open={open} />
                  <figcaption className="dv-cap">Everything at once, with a two-part footer.</figcaption>
                </figure>
                <figure className="wv-iter__side is-after">
                  <p className="wv-iter__when">After</p>
                  <Phone slug="plan" open={open} />
                  <figcaption className="dv-cap">Short labels, grouped steps, extra detail under “How range works”, one button.</figcaption>
                </figure>
              </div>
              <More title="What changed across screens">
                <ul className="wv-changes">
                  {changes.map(([before, after]) => (
                    <li key={before}>
                      <span className="wv-changes__before">{before}</span>
                      <span className="wv-changes__after">{after}</span>
                    </li>
                  ))}
                </ul>
              </More>
              <More title="The visual style">
                <div className="wv-system">
                  <div className="wv-system__block">
                    <p className="dv-diagram-label">Colour</p>
                    <ul className="wv-swatches">
                      <li><span style={{ background: '#f6f9f6' }} /> Background</li>
                      <li><span style={{ background: '#e3f6e8' }} /> Mint</li>
                      <li><span style={{ background: '#2cc65e' }} /> Action green</li>
                      <li><span style={{ background: '#0f7a38' }} /> Green text</li>
                      <li><span style={{ background: '#141a17' }} /> Ink</li>
                    </ul>
                  </div>
                  <div className="wv-system__block">
                    <p className="dv-diagram-label">Type</p>
                    <p className="wv-type"><span className="wv-type__display">Bricolage Grotesque</span> for headings</p>
                    <p className="wv-type"><span className="wv-type__ui">Inter</span> for reading: 16 px text, 14 px labels, 22–24 px headings</p>
                  </div>
                  <div className="wv-system__block">
                    <p className="dv-diagram-label">States and actions</p>
                    <div className="wv-chips">
                      <span className="wv-chip wv-chip--ok">Scooty locked · return confirmed</span>
                      <span className="wv-chip wv-chip--pending">Billing closed · scooty check pending</span>
                      <span className="wv-chip wv-chip--block">Don’t ride WV-0874</span>
                      <span className="wv-chip wv-chip--tag">Illustrative prices</span>
                    </div>
                    <div className="wv-btns" aria-hidden="true">
                      <span className="wv-btn">Pay with UPI</span>
                      <span className="wv-btn wv-btn--quiet">Keep trying</span>
                      <span className="wv-btn wv-btn--danger">Report and end booking</span>
                    </div>
                  </div>
                </div>
                <p className="dv-cap">
                  Shared buttons and spacing keep the screens consistent. The first Figma copy lost detail, so I matched
                  it back to the app.
                </p>
              </More>
              <p className="dv-note">
                These are <mark>design-led iterations</mark>. Prices, rules and logic stayed the same. I checked the
                layouts in a browser at 320, 360, 390 and 430 px wide, not with users.
              </p>
            </section>


            {/* Outcome, planned testing and reflection */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Outcome" title="A working concept. Nothing tested with riders yet.">
                <p>No proof of demand, no drop in support calls, no conversion measured.</p>
              </Head>
              <div className="cp-outcome">
                <div>
                  <h3 className="dv-h3">What exists</h3>
                  <ul className="ticks">
                    <li>A working rental app concept, with sample data.</li>
                    <li>Editable Figma screens for the main journey.</li>
                    <li>Flows for an unsafe scooty, a pending payment and a lock that won’t confirm.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="dv-h3">Not tested or settled yet</h3>
                  <ul className="ticks">
                    <li>Whether riders understand the costs, checks and return states.</li>
                    <li>The three unresolved rules: detour billing, the deposit by payment method and assisted returns.</li>
                    <li>Accessibility beyond contrast and proper controls: keyboard, screen readers and zoom.</li>
                  </ul>
                </div>
              </div>
              <h3 className="dv-h3 cp-gap">Planned testing <span className="dv-tag">Planned</span></h3>
              <p className="cp-reflect">
                3–5 people, 35–45 minutes each, on a phone-sized screen, with sample data only. No real payments,
                licences or IDs. No sessions have run, so there are no findings, quotes or success rates. Results will
                be shared as counts, like “3 of 5”.
              </p>
              <ol className="wv-questions wv-themes">
                {themes.map(([name, ids, check]) => (
                  <li key={name}>
                    <h3>{name}</h3>
                    <p className="wv-themes__ids">{ids}</p>
                    <p>{check}</p>
                  </li>
                ))}
              </ol>
              <More title="Full task plan, T1–T8">
                <ol className="wv-tasks">
                  {tasks.map(([id, name, check]) => (
                    <li key={id}>
                      <span className="wv-tasks__id">{id}</span>
                      <h3>{name}</h3>
                      <p>{check}</p>
                    </li>
                  ))}
                </ol>
              </More>
              <h3 className="dv-h3 cp-gap">Reflection: clear screens need clear service rules</h3>
              <p className="cp-reflect">
                A return button can’t fix a missing hub rule, and a deposit label can’t replace a payment agreement.
                Next, I need rider feedback and business decisions, not just visual polish.
              </p>
            </section>
          </div>
        </div>
      </div>

      {lightbox}
      <NextProject slug="wavo" withPrevious />
    </article>
  )
}
