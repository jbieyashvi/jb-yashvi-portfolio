import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import ShipwayStory from '../components/ShipwayStory'
import External from '../components/External'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import type { ImageItem } from '../data/images'
import { mid } from '../components/srcset'
import CaseImpact from '../components/CaseImpact'
import { MarkedTitle, Pin, Tape, type TitleMark } from '../components/CaseFlair'
import useCaseReveal from '../components/useCaseReveal'

const PLAY = 'https://play.google.com/store/apps/details?id=com.shipway.app&hl=en_IN'
const DIR = '/work/shipway'

/** Where each screen comes from. Mobile screens are exported from my Figma files, with demo data. */
const INITIAL = 'Initial mobile design. Exported from my Figma files.'
const FINAL = 'Final design. Exported from my Figma files, demo data.'
const REVISION = 'Post-launch card revision. Exported from my Figma files, demo data.'
const DESKTOP = 'Existing desktop platform, not my design. From the client’s requirements document.'

const sections = [
  { id: 'impact', label: 'Impact' },
  { id: 'problem', label: 'The problem' },
  { id: 'cards', label: '1 · Tables to cards' },
  { id: 'couriers', label: '2 · Comparing couriers' },
  { id: 'setup', label: '3 · Setup as a checklist' },
  { id: 'after', label: 'After launch' },
  { id: 'details', label: 'Other parts' },
  { id: 'outcome', label: 'Outcome' },
]

const PHONE = { w: 780, h: 1688, small: 520 }

/** Every screen the enlarged view steps through, in reading order */
const shots = {
  'home-setup': {
    ...PHONE,
    caption: 'Home: setup left to do, and items needing attention',
    label: REVISION,
    alt: 'Home screen for TechMart Pvt. Ltd. with a ₹2,200 wallet balance and a search field for order ID, AWB or phone. Getting Started: Complete KYC and Add your pickup address done, Recharge your wallet and Ship your first order pending. Setup Business Profile: Add profile details done, Add channel and Add bank details pending. Action Items Needing Attention: 12 new orders to process, 04 NDR actions pending, 02 weight discrepancies pending, low wallet balance ₹200 marked urgent.',
  },
  track: {
    ...PHONE,
    caption: 'Track Order: shipment progress for one order',
    label: REVISION,
    alt: 'Track Order screen. Arriving by Nov 25, 2025, tagged Out for delivery, Shipway Bluedart Express (0.5kg), AWB 65445656565. A stepper: Order Booked, In-transit and Out for Delivery done, Delivered next. Order Items: wireless Bluetooth headphones, phone case and USB-C cable with quantities. Order Details: order ID #ORD001, date, COD payment, total ₹2499.',
  },
  'desk-new': {
    w: 1919,
    h: 640,
    small: 800,
    caption: 'Desktop New Orders: a table row per order, filters always open on the right',
    label: DESKTOP,
    alt: 'Desktop Shipway Orders page on the New Orders tab, with Sync Orders, Add order, Assign courier, Bulk Actions and Download buttons. A table with columns Order ID, Customer Info, Order Info, Channel, Dim. & Wt., Channel Date and Courier Price holds one test order. A Filter panel on the right has filter type, period, date range, order ID, product SKU and channel.',
  },
  'desk-process-crop': {
    w: 1575,
    h: 462,
    small: 800,
    caption: 'Desktop Process Orders: nine columns on every row',
    label: `${DESKTOP} Customer phone numbers blurred.`,
    alt: 'Desktop Process Orders table with columns Order ID, Customer Info, Product name, Order Info, Tracking Info, Pickup By, Dim. & Wt., Channel Date and Action. Four test orders marked Processing, three of them Picked, each with product name, quantity and SKU, value and payment type, AWB and courier, dimensions and weight, and label and invoice icons. Customer phone numbers are blurred.',
  },
  'bulk-manifest': {
    ...PHONE,
    caption: 'Process tab: one card per order, with orders selected for a manifest',
    label: FINAL,
    alt: 'Orders screen in selection mode: “2 Selected” and a Manifest button in the header, a Select All checkbox, and Process tab cards. Two checked cards for #ORD001, In transit and Delivered, show the customer, location, ₹2,499, COD or Prepaid, Pickup by today, courier name and AWB number.',
  },
  'desk-assign': {
    w: 1378,
    h: 651,
    small: 800,
    caption: 'Desktop Quick Courier Assign: eight couriers in a grid',
    label: DESKTOP,
    alt: 'Desktop Quick Courier Assign dialog with a pickup address dropdown, a Shipway Protect checkbox, All, Surface and Air filters and Sort By Cheapest. Eight courier cards in two rows of four, each with a rating, charged weight, price, expected pickup and estimated delivery. The first is tagged Cheapest and selected. Assign Shipment and Cancel buttons.',
  },
  assign: {
    ...PHONE,
    caption: 'Assign Courier: one courier per row',
    label: FINAL,
    alt: 'Assign Courier screen with the pickup address at the top and All, Air and Surface filters with Sort. Courier cards for AirSwift Logistics, Next Day Air, rated 4.5: charged weight 1 KG, ₹150, expected pickup 5:00 PM today and expected delivery 10:00 AM tomorrow, one tagged Cheapest. An Assigned Shipment button at the bottom.',
  },
  orders: {
    ...PHONE,
    caption: 'Orders list, New tab',
    label: REVISION,
    alt: 'Shipway Orders screen. Tabs New (3), Process (2), Pickup (2) and All. Three order cards, each with order ID #ORD001 and a Shopify icon, date Jan 15, 2025, customer Rahul Sharma, Bangalore 560001, ₹2,499 with a COD or Prepaid tag, 5000 gm and an Assign Courier button. A blue add button and a bottom bar: Home, Orders, Track, More.',
  },
  'order-detail': {
    ...PHONE,
    caption: 'Order details: customer, product and package',
    label: FINAL,
    alt: 'Order detail screen for #ORD001: ₹12,000 Prepaid, order status New, channel Shopify. Customer Details: name, email, phone shown masked as +91 98*** **210 with an eye icon to reveal it, company, shipping and billing address. Product Details: product name, HSN code, SKU, quantity and subtotal. Package Details: weight 0.1 KG and dimensions 15 × 10 × 5 cm. An Assign Courier button fixed at the bottom.',
  },
  'onb-login': {
    ...PHONE,
    caption: 'Log in or register with a phone number',
    label: FINAL,
    alt: 'Log in or Register screen with the Shipway logo: a +91 phone number field, a Sign in button, a ticked Terms & Conditions and Privacy Policy checkbox, and email, Google and Apple sign-in options.',
  },
  'onb-otp': {
    ...PHONE,
    caption: 'Verify OTP',
    label: `${FINAL} Phone number blurred.`,
    alt: 'Verify OTP screen: “Enter the OTP sent to” a phone number (blurred here) with a Change link, four OTP digits, Resend OTP and a Verify & Continue button above the keyboard.',
  },
  'onb-account': {
    ...PHONE,
    caption: 'Choose an account linked to the number',
    label: `${FINAL} Phone number blurred.`,
    alt: 'Choose Your Account screen: multiple accounts are linked to a phone number (blurred here). Four account cards with john.doe@company.com, two of them for Logistics Corp, each marked Business Account.',
  },
  'onb-signup': {
    ...PHONE,
    caption: 'New sellers: create an account',
    label: FINAL,
    alt: 'Create your account screen: empty fields for name, company name and email, a monthly order volume dropdown, a disabled Sign up button and a Log in link for existing accounts.',
  },
  'onb-profile': {
    ...PHONE,
    caption: 'Profile setup: the business address',
    label: FINAL,
    alt: 'Profile Setup screen, “Tell us about your business”: empty fields for address, ZIP code and city, state and country dropdowns, and a disabled Complete button.',
  },
  'desk-manifest': {
    w: 1899,
    h: 430,
    small: 800,
    caption: 'Desktop Manifests: one row per manifest',
    label: DESKTOP,
    alt: 'Desktop Manifests page on the Pickup & Manifests tab. A Pickup By filter shows Today’s, Shipway Bluedart (0.5kg). A table with columns Manifest ID, Manifest Info, Courier, Pickup By, Warehouse Name, Manifest and Label/INV holds one manifest with status New, one pre-paid order, pickup Today, and view, PDF, print and download icons.',
  },
  pickup: {
    ...PHONE,
    caption: 'Pickup tab: one card per manifest, pickup status first',
    label: REVISION,
    alt: 'Orders screen on the Pickup tab. Four manifest cards, each for Manifest ID 1342344, with a pickup status: Picked, Pickup Failed, Pickup by Today and Partial Picked. Each shows order count 03, Delhivery Surface Express Cargo, Warehouse Name and a Dispatched or New tag.',
  },
  'onb-kyc': {
    ...PHONE,
    h: 1689,
    caption: 'Initial: step 2 of 4, KYC documents',
    label: INITIAL,
    alt: 'KYC Verification screen, Step 2 of 4, 50% complete, with a Skip link. Upload your business documents: Company Type set to Individual, an Upload PAN Card drop zone, a GST Number field and an Upload Bank Statement drop zone, each with Choose File. The Next button is disabled. No documents are uploaded.',
  },
  'onb-warehouse': {
    ...PHONE,
    h: 1689,
    caption: 'Initial: step 3 of 4, warehouse setup',
    label: INITIAL,
    alt: 'Warehouse Setup screen, Step 3 of 4, 75% complete, with a Skip link. Configure your pickup location: empty fields for warehouse title, contact person name, company name, email address, phone number with +91, GST number and warehouse address.',
  },
  'onb-channel': {
    ...PHONE,
    h: 1689,
    caption: 'Initial: step 4 of 4, channel integration',
    label: INITIAL,
    alt: 'Channel Integration screen, Step 4 of 4, 100% complete. Connect your selling platforms, with a search field and View All. Shopify is marked Connected; Amazon, Flipkart, WooCommerce and Myntra have Connect buttons. A Done button at the bottom.',
  },
  'card-initial': {
    w: 1130,
    h: 776,
    small: 640,
    caption: 'Initial New order card',
    label: `${INITIAL} Phone number blurred.`,
    alt: 'Initial New order card: #ORD001 with a New badge. Left column: Rahul Sharma with a phone number (blurred here), Bangalore 302018, Order info ₹2499 (COD). Right column: Channel Information, 2024-01-15 at 21:50 with a Shopify icon, Wireless Headphones, 25×15×10 cm, 500 gm. An Assign Courier button.',
  },
  'card-new': {
    w: 764,
    h: 370,
    small: 640,
    caption: 'Revised New order card',
    label: REVISION,
    alt: 'Revised New order card: #ORD001 with a Shopify icon, Jan 15, 2025, Rahul Sharma, Bangalore 560001, ₹2,499 with a COD tag, 5000 gm, and an Assign Courier button.',
  },
  'card-process': {
    w: 764,
    h: 638,
    small: 640,
    caption: 'Revised Process card: the courier, AWB and shipment status',
    label: REVISION,
    alt: 'Two processing order cards: order ID and date, Rahul Sharma, Bangalore 560001, Delhivery Surface Express Cargo, an AWB number, and an In transit tag. The first card shows how a long order ID fits on one line.',
  },
  'card-track': {
    w: 764,
    h: 422,
    small: 640,
    caption: 'Revised Track card: the same facts, with Track Order',
    label: REVISION,
    alt: 'Track order card: order ID and date, Rahul Sharma, Bangalore 560001, Delhivery Surface Express Cargo, an AWB number, an In transit tag and a Track Order button.',
  },
  'card-manifest': {
    w: 764,
    h: 1242,
    small: 640,
    caption: 'Revised Pickup cards: pickup status for a group of orders',
    label: REVISION,
    alt: 'Four manifest cards for Manifest ID 1342344 with pickup statuses Picked in green, Pickup Failed in red, Pickup by Today in blue and Partial Picked in yellow. Each shows order count 03, Delhivery Surface Express Cargo, Warehouse Name and a Dispatched or New tag.',
  },
} satisfies Record<string, { w: number; h: number; small: number; caption: string; label: string; alt: string }>

type Shot = keyof typeof shots
/** the enlarged view steps through the screens in page order */
const order: Shot[] = [
  'desk-new',
  'desk-process-crop', 'bulk-manifest', 'orders', 'order-detail',
  'desk-assign', 'assign',
  'onb-kyc', 'onb-warehouse', 'onb-channel', 'onb-signup', 'onb-profile', 'home-setup',
  'card-initial', 'card-new', 'card-process', 'card-track', 'card-manifest',
  'onb-login', 'onb-otp', 'onb-account', 'desk-manifest', 'pickup', 'track',
]
const items: ImageItem[] = order.map((slug) => ({ slug, src: `${DIR}/${slug}`, ...shots[slug] }))

const PHONE_SIZES = '(max-width: 760px) 50vw, 300px'
const PAIR_PHONE_SIZES = '(max-width: 760px) 70vw, 260px'
const CARD_SIZES = '(max-width: 760px) 100vw, 440px'
const DESK_SIZES = '(max-width: 760px) 100vw, 700px'

/** A screen that opens the enlarged view */
function Screen({ slug, open, sizes = PHONE_SIZES, eager }: {
  slug: Shot
  open: (i: number) => void
  sizes?: string
  eager?: boolean
}) {
  const shot = shots[slug]
  const src = `${DIR}/${slug}`
  return (
    <div className="dv-screen">
      <button type="button" className="dv-screen__zoom sw-zoom" onClick={() => open(order.indexOf(slug))} aria-label={`Enlarge: ${shot.caption}`}>
        <img
          src={`${src}-1800.webp`}
          srcSet={`${src}-800.webp ${shot.small}w, ${mid(src, shot.w)}${src}-1800.webp ${shot.w}w`}
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

const PIN_TILTS = [-2, 1.5, -1] as const
const PIN_TAPES = ['sun', 'rose', 'lilac'] as const

/** A row of phone screens, each with its caption; `pinned` tapes them up at a slight tilt */
function Phones({ slugs, open, eager, pinned }: { slugs: readonly Shot[]; open: (i: number) => void; eager?: boolean; pinned?: boolean }) {
  return (
    <ol className={`sw-phones sw-phones--${slugs.length}`}>
      {slugs.map((slug, i) => (
        <li key={slug}>
          {pinned ? (
            <Pin tone={PIN_TAPES[i % 3]} r={PIN_TILTS[i % 3]}>
              <Screen slug={slug} open={open} eager={eager} />
            </Pin>
          ) : (
            <Screen slug={slug} open={open} eager={eager} />
          )}
          <p className="sw-phones__cap">{shots[slug].caption}</p>
        </li>
      ))}
    </ol>
  )
}

/** A desktop screen shown wide on top, then the mobile screen beside what the section says about it */
function Shift({ desk, phone, open, children }: { desk: Shot; phone: Shot; open: (i: number) => void; children: React.ReactNode }) {
  return (
    <div className="sw-shift" data-reveal>
      <figure className="sw-shift__desk">
        <p className="cp-pair__tag">Existing desktop platform</p>
        <Screen slug={desk} open={open} sizes={DESK_SIZES} />
        <figcaption className="sw-phones__cap">{shots[desk].caption}</figcaption>
      </figure>
      <div className="sw-shift__row">
        <figure className="sw-shift__phone">
          <p className="cp-pair__tag cp-pair__tag--final">My mobile design</p>
          <Pin tone="sky" r={-2}>
            <Screen slug={phone} open={open} sizes={PAIR_PHONE_SIZES} />
          </Pin>
          <figcaption className="sw-phones__cap">{shots[phone].caption}</figcaption>
        </figure>
        <div className="sw-shift__text">{children}</div>
      </div>
    </div>
  )
}

/** What stays on a mobile screen, and what moves a tap away */
function Keep({ stays, moves, staysLabel = 'Stays on the card', movesLabel = 'Moves to order details' }: {
  stays: readonly string[]
  moves: readonly string[]
  staysLabel?: string
  movesLabel?: string
}) {
  return (
    <dl className="sw-diff sw-keep">
      <div className="sw-diff__item">
        <dt>{staysLabel}</dt>
        <dd><ul>{stays.map((t) => <li key={t}>{t}</li>)}</ul></dd>
      </div>
      <div className="sw-diff__item sw-diff__item--moved">
        <dt>{movesLabel}</dt>
        <dd><ul>{moves.map((t) => <li key={t}>{t}</li>)}</ul></dd>
      </div>
    </dl>
  )
}

function Why({ hard, did, why, cost }: { hard: string; did: string; why: string; cost: string }) {
  return (
    <dl className="dv-why cp-why cp-why--grid" data-reveal>
      <div><dt>The difficulty</dt><dd>{hard}</dd></div>
      <div><dt>What I designed</dt><dd>{did}</dd></div>
      <div><dt>Why</dt><dd>{why}</dd></div>
      <div><dt>Trade-off</dt><dd>{cost}</dd></div>
    </dl>
  )
}

function More({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="dv-more">
      <summary>{title}</summary>
      <div className="dv-more__body">{children}</div>
    </details>
  )
}

/** The scope as the client requested it, beside what my design files show for each part */
const scope = [
  {
    group: 'Account setup & onboarding',
    asked: 'Log in, sign up, verify mobile and email, then four onboarding steps: profile, KYC, warehouse and channel integration.',
    shown: 'Phone login with OTP, account selection, sign-up and profile setup. KYC, pickup address and channel sit in a Getting Started checklist on Home.',
  },
  {
    group: 'Order processing & courier assignment',
    asked: 'New orders from manual entry, CSV upload or channel sync. Assign couriers one at a time or in bulk, manually or from a priority list.',
    shown: 'The New tab, filters, Add Order, the Assign Courier screen and bulk selection. CSV upload and priority-list assignment aren’t in the screens on this page.',
  },
  {
    group: 'Processing, pickup/manifest & tracking',
    asked: 'Labels and invoices, moving orders to a manifest, pickup and manifest printing, a Track page, AWB lookup and All Orders.',
    shown: 'Process tab with label and invoice downloads, bulk move to manifest, Pickup tab of manifests, Track Order, the All tab and search by order ID or AWB.',
  },
  {
    group: 'Wallet & finance',
    asked: 'Wallet recharge, transactions, recharge history and invoices.',
    shown: 'Wallet balance in the header and on Home, a Recharge quick action, and Wallet, COD remittance and Invoices in More.',
  },
  {
    group: 'Shipment exceptions, notifications & support',
    asked: 'NDR queues (action pending, action taken, delivered/RTO, all), push notifications (P0), in-app notifications (P1), chat support and support tickets.',
    shown: 'NDR and Contact Support in More, NDR counts on Home and a notification bell in the header.',
  },
] as const

/** The daily loop, as the final screens lay it out */
const flow = [
  { where: 'Orders › New', name: 'New orders', body: 'Waiting for a courier' },
  { where: 'Assign Courier', name: 'Assign', body: 'One order or many' },
  { where: 'Orders › Process', name: 'Processing', body: 'Labels, invoices, manifest' },
  { where: 'Orders › Pickup', name: 'Pickup', body: 'Manifests and pickup status' },
  { where: 'Track', name: 'Tracking', body: 'Shipment progress' },
] as const

function Flow() {
  return (
    <figure className="cp-flow-wrap">
      <p id="flow-label" className="dv-diagram-label">How an order moves through the mobile app</p>
      <ol className="cp-flow sw-flow" aria-labelledby="flow-label">
        {flow.map((s, i) => (
          <li key={s.name} className="cp-flow__step cp-flow__step--list">
            <span className="cp-flow__who">{s.where}</span>
            <strong className="cp-flow__name"><span className="cp-flow__num">{i + 1}</span> {s.name}</strong>
            <span className="cp-flow__body">{s.body}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

/** The headline numbers, from the brief, the screens and the Google Play listing */
const glance = [
  { tone: 'sky', value: '9 → 1', label: 'Desktop columns reworked into one order card' },
  { tone: 'rose', value: '8 couriers', label: 'Compared in a list instead of a grid' },
  { tone: 'mint', value: '5 stages', label: 'Of an order’s journey brought to the phone' },
  { tone: 'sun', value: '10K+', label: 'Google Play downloads for the whole app, October 2026' },
] as const

/** My part; each card points to where it is shown */
const role = [
  { title: 'Order cards', body: 'Wide desktop rows turned into one card per order, showing what its stage needs.', href: '#cards', link: 'Decision 1' },
  { title: 'Courier list', body: 'The eight-courier comparison grid, read top to bottom.', href: '#couriers', link: 'Decision 2' },
  { title: 'Setup checklist', body: 'A four-step setup cut to a short sign-up and a checklist on Home.', href: '#setup', link: 'Decision 3' },
  { title: 'After launch', body: 'The order cards reviewed and simplified at every stage.', href: '#after', link: 'After launch' },
] as const

function Head({ id, kicker, title, mark, children }: { id: string; kicker: string; title: string; mark?: TitleMark; children?: React.ReactNode }) {
  return (
    <header className="dv-head" data-reveal>
      <p className={mark ? `dv-kicker cs-kicker cs-kicker--${mark.tone}` : 'dv-kicker'}>{kicker}</p>
      <h2 id={`${id}-title`} className="dv-h2"><MarkedTitle title={title} mark={mark} /></h2>
      {children}
    </header>
  )
}

/** Impact: from the shipped design and the Google Play listing */
const impact = [
  { tone: 'sun', value: '10K+', label: 'Google Play downloads for the whole app, October 2026' },
  { tone: 'mint', value: '12K', label: 'Orders handled through the mobile app' },
  { tone: 'sky', value: '9 → 1', label: 'Desktop columns turned into one order card' },
  { tone: 'rose', value: 'More orders', label: 'Visible at once after the post-launch card revision' },
] as const

export default function Shipway() {
  useTitle('Shipway — Bringing Shipway’s shipping workflows to mobile | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)
  useCaseReveal()

  return (
    <article className="dv">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type">Shipway by Unicommerce · Client project through Heizen</p>
          <h1 className="dv-top__title">Bringing Shipway’s shipping workflows to mobile</h1>
          <p className="dv-top__lede">
            Online sellers use Shipway to send their orders through courier companies. It ran on a desktop website
            built on wide tables. I designed the Android app that brings{' '}
            <mark>the same work to a phone</mark>: orders, couriers, pickups and tracking.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>Client</dt>
                <dd>Shipway by Unicommerce, through Heizen</dd>
              </div>
              <div>
                <dt>Time</dt>
                <dd>Approximately 4–6 weeks, then card changes after launch</dd>
              </div>
              <div>
                <dt>My part</dt>
                <dd>Mobile product design, in Figma</dd>
              </div>
              <div>
                <dt>Not mine</dt>
                <dd>The desktop platform the app started from</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Live on Google Play</dd>
              </div>
              <div>
                <dt>Link</dt>
                <dd>
                  <a className="dv-top__try" href={PLAY} target="_blank" rel="noopener noreferrer">
                    View Android app <span aria-hidden="true">↗</span><span className="sr-only"> (opens Google Play in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
            <div className="dv-signal cs-note">
              <Tape tone="sun" />
              <p className="dv-signal__kind">
                <img className="cs-note__me" src="/story/me-128.webp" width={128} height={128} alt="" decoding="async" />
                The idea that shaped it
              </p>
              <p className="dv-signal__text">
                <mark>Keep the features, change what comes first.</mark> Almost everything on desktop came across.
                The work was deciding what each small screen shows first.
              </p>
              <p className="dv-signal__note">
                Mobile screens are exported from my Figma files, with demo data. The live app matches these final
                designs. Desktop screens are the client’s existing platform.
              </p>
            </div>
          </div>
          <ul className="cp-glance" aria-label="At a glance">
            {glance.map((g) => (
              <li key={g.value} className={`cp-glance__card cp-tone--${g.tone}`}>
                <span className="cp-glance__value">{g.value}</span>
                <span className="cp-glance__label">{g.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <ShipwayStory />

      <div className="dv-shell">
        <div className="dv-shell__inner dv-shell__grid">
          <CaseSidebar sections={sections} />

          <div className="dv-main">
            <CaseImpact
              title="A desktop platform, now in sellers’ pockets."
              lede="The Android app is live, and 12K orders have gone through it. Sellers can run the whole shipping job from a phone: orders, couriers, pickups and tracking. After launch, slimmer cards let them see more orders on one screen."
              stats={impact}
              note="The download count is from the Google Play listing; both numbers cover the whole app, not only my design. The designs weren’t usability tested."
            />

            {/* The problem */}
            <section id="problem" className="dv-sec dv-sec--first" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="A full desktop platform, not a lite version." mark={{ text: 'not a lite version.', tone: 'sun', doodle: 'under' }}>
                <p>
                  Sellers already ran every step after a sale on Shipway’s desktop website: wide tables, with a filter
                  panel always open. The brief wasn’t to cut features. Almost all of it had to work on a phone.
                </p>
                <p>
                  So the hard part was not fitting things in. It was <mark>deciding what each screen shows first</mark>,
                  and what can wait one tap. I followed the five stages an order goes through and designed a screen
                  for each.
                </p>
              </Head>
              <dl className="dv-terms" aria-label="Words used on this page">
                <div>
                  <dt>Courier</dt>
                  <dd>The delivery company that carries a parcel. Shipway lets a seller choose between many.</dd>
                </div>
                <div>
                  <dt>AWB</dt>
                  <dd>The tracking number a courier gives a shipment.</dd>
                </div>
                <div>
                  <dt>Manifest</dt>
                  <dd>A list of orders handed to one courier at pickup.</dd>
                </div>
                <div>
                  <dt>COD and Prepaid</dt>
                  <dd>Whether the buyer pays cash on delivery, or has already paid.</dd>
                </div>
                <div>
                  <dt>KYC</dt>
                  <dd>Business documents a seller uploads to be verified, like a PAN card or GST number.</dd>
                </div>
                <div>
                  <dt>NDR</dt>
                  <dd>A failed delivery that needs the seller to decide what happens next.</dd>
                </div>
              </dl>
              <figure className="sw-baseline">
                <p className="cp-pair__tag">Existing desktop platform</p>
                <Screen slug="desk-new" open={open} sizes={DESK_SIZES} eager />
                <figcaption className="sw-phones__cap">{shots['desk-new'].caption}</figcaption>
              </figure>
              <Flow />
              <h3 className="dv-h3 cp-gap">What I did</h3>
              <ol className="cp-role">
                {role.map((r, i) => (
                  <li key={r.title} className="cp-role__card">
                    <span className="cp-role__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{r.title}</h3>
                    <p>{r.body}</p>
                    <a className="cp-role__link" href={r.href}>
                      {r.link} <span aria-hidden="true">→</span>
                    </a>
                  </li>
                ))}
              </ol>
              <p className="cp-role__not">
                <strong>Not mine:</strong> the desktop platform, which I started from. The mobile screens on this page
                are my Figma designs; the live app matches them.
              </p>
            </section>

            {/* Decision 1: tables to cards */}
            <section id="cards" className="dv-sec" aria-labelledby="cards-title" tabIndex={-1}>
              <Head id="cards" kicker="Decision 1" title="Wide tables become one card per order." mark={{ text: 'one card per order.', tone: 'sky', doodle: 'double' }}>
                <p>Desktop shows every field for every order in one row. A phone can show a few.</p>
              </Head>
              <Shift desk="desk-process-crop" phone="bulk-manifest" open={open}>
                <p>
                  On the Process tab, each card keeps what a seller checks at this stage. The rest is one tap away in
                  order details.
                </p>
                <Keep
                  stays={['Order ID and date', 'Customer name and location', 'Amount, and COD or Prepaid', 'Courier, AWB and status']}
                  moves={['Product name and SKU', 'Package size and weight', 'Customer phone number', 'Billing address']}
                />
                <p className="sw-src">
                  Ticking cards brings up Manifest in the header, so several orders move to pickup at once.
                </p>
              </Shift>
              <Why
                hard="Nine columns of detail per order, and almost none of it could be dropped from the app."
                did="A card per order that shows what its stage needs, and an order details screen that groups the full record into customer, product and package, with Assign Courier fixed at the bottom. The phone number is masked until revealed."
                why="The list stays short enough to scan many orders per screen, and nothing is lost: it is one tap away."
                cost="Fields that sit side by side on desktop now take a tap to reach."
              />
              <More title="The list and the full record, side by side">
                <Phones slugs={['orders', 'order-detail']} open={open} />
              </More>
            </section>

            {/* Decision 2: comparing couriers */}
            <section id="couriers" className="dv-sec" aria-labelledby="couriers-title" tabIndex={-1}>
              <Head id="couriers" kicker="Decision 2" title="Comparing couriers in a list, not a grid." mark={{ text: 'in a list,', tone: 'rose', doodle: 'under' }}>
                <p>Choosing a courier is a comparison: price against speed. Desktop does it in a four-column grid.</p>
              </Head>
              <Shift desk="desk-assign" phone="assign" open={open}>
                <p>Each courier is one row, read top to bottom. Every row keeps the same comparison points as desktop.</p>
                <Keep
                  staysLabel="Kept on every row"
                  movesLabel="Kept at the top"
                  stays={['Price', 'Charged weight', 'Expected pickup and delivery', 'Rating, and the Cheapest tag']}
                  moves={['Pickup address', 'All, Air and Surface filters', 'Sort']}
                />
              </Shift>
              <Why
                hard="Eight couriers side by side don’t fit a phone, but the seller still has to compare them."
                did="A full screen with one courier per row, the same facts on every row, and the filters and sort above the list."
                why="When every row has the same facts in the same place, couriers can be compared by reading down."
                cost="Fewer couriers are visible at once, so comparing more of them means scrolling."
              />
            </section>

            {/* Decision 3: setup as a checklist */}
            <section id="setup" className="dv-sec" aria-labelledby="setup-title" tabIndex={-1}>
              <Head id="setup" kicker="Decision 3" title="Setup steps become a checklist on Home." mark={{ text: 'a checklist', tone: 'lilac', doodle: 'under' }}>
                <p>
                  My first design asked for everything at sign-up. I changed it before launch.
                </p>
              </Head>
              <div className="sw-rounds" data-reveal>
                <figure>
                  <p className="cp-pair__tag">My first design: setup inside sign-up</p>
                  <Phones slugs={['onb-kyc', 'onb-warehouse', 'onb-channel']} open={open} />
                </figure>
                <figure>
                  <p className="cp-pair__tag cp-pair__tag--final">Final design: sign-up, then a checklist</p>
                  <Phones slugs={['onb-signup', 'onb-profile', 'home-setup']} open={open} pinned />
                </figure>
              </div>
              <Why
                hard="The first flow had four steps, each with a progress bar and Skip: profile, KYC documents, a warehouse and a sales channel. That’s a PAN card, a GST number and a bank statement before a seller has seen the app."
                did="Sign-up now stops at the account and the business address. KYC, the pickup address, a channel and bank details became a Getting Started checklist on Home."
                why="The setup tasks sit next to the orders they unlock, and a seller can do them when they’re ready."
                cost="Setup isn’t forced any more, so the checklist has to stay on Home until it’s done."
              />
            </section>

            {/* After launch */}
            <section id="after" className="dv-sec" aria-labelledby="after-title" tabIndex={-1}>
              <Head id="after" kicker="After launch" title="The order cards, simplified." mark={{ text: 'simplified.', tone: 'sun', doodle: 'double' }}>
                <p>
                  With the app live, the order cards took up too much space, so only a few fit on the screen at once.
                  Sellers needed to see more orders at a time. So I reviewed every card against the one decision its
                  stage asks for. On the New tab, that decision is which courier to assign. The card was carrying the
                  product name, package size and the customer’s phone, and none of them change it.
                </p>
              </Head>
              <div className="dv-compare sw-compare" data-reveal>
                <figure className="dv-compare__col">
                  <p className="cp-pair__tag">Before: my first mobile design</p>
                  <Screen slug="card-initial" open={open} sizes={CARD_SIZES} />
                </figure>
                <figure className="dv-compare__col">
                  <p className="cp-pair__tag cp-pair__tag--final">After: the revision</p>
                  <Pin tone="rose" r={-1.5}>
                    <Screen slug="card-new" open={open} sizes={CARD_SIZES} />
                  </Pin>
                </figure>
              </div>
              <p className="sw-src">Both are New-tab cards from my Figma files, with different sample data. The phone number is blurred in the first.</p>
              <dl className="sw-diff">
                <div className="sw-diff__item sw-diff__item--out">
                  <dt>Removed from the card</dt>
                  <dd>
                    <ul>
                      <li>Customer phone number</li>
                      <li>Product name</li>
                      <li>Package dimensions</li>
                      <li>Repeated labels: the New badge, Channel Information, Order info</li>
                    </ul>
                  </dd>
                </div>
                <div className="sw-diff__item">
                  <dt>Kept</dt>
                  <dd>
                    <ul>
                      <li>Order ID and date</li>
                      <li>Customer name and location</li>
                      <li>Amount and payment type</li>
                      <li>Weight</li>
                      <li>Assign Courier</li>
                    </ul>
                  </dd>
                </div>
                <div className="sw-diff__item">
                  <dt>Changed</dt>
                  <dd>
                    <ul>
                      <li>Two labelled columns became three rows</li>
                      <li>The channel is an icon beside the order ID</li>
                    </ul>
                  </dd>
                </div>
              </dl>
              <p className="sw-hierarchy">
                The removed details weren’t lost. They are in order details, one tap away (Decision 1).
              </p>
              <More title="The same change on the other stages">
                <p>Each stage’s card leads with what that stage needs next: the courier and AWB, a Track Order button, or a manifest’s pickup status.</p>
                <ol className="sw-phones sw-phones--3 sw-cards">
                  {(['card-process', 'card-track', 'card-manifest'] as const).map((slug) => (
                    <li key={slug}>
                      <Screen slug={slug} open={open} sizes={CARD_SIZES} />
                      <p className="sw-phones__cap">{shots[slug].caption}</p>
                    </li>
                  ))}
                </ol>
              </More>
            </section>

            {/* Other parts */}
            <section id="details" className="dv-sec" aria-labelledby="details-title" tabIndex={-1}>
              <Head id="details" kicker="Other parts" title="Also designed." mark={{ text: 'Also designed.', tone: 'lilac', doodle: 'stars' }}>
                <p>Shorter notes on the rest of the app. Open any to see the screens.</p>
              </Head>
              <More title="Logging in: phone, OTP and choosing an account">
                <p>
                  A phone number and an OTP, then a step to choose between accounts linked to the same number. New
                  sellers go on to sign-up and the business address.
                </p>
                <Phones slugs={['onb-login', 'onb-otp', 'onb-account']} open={open} />
              </More>
              <More title="Manifests and pickup">
                <p>
                  On desktop, each manifest is a table row with view, print and download icons. On mobile, each is a
                  card that puts the pickup status first, in colour.
                </p>
                <figure className="sw-baseline">
                  <p className="cp-pair__tag">Existing desktop platform</p>
                  <Screen slug="desk-manifest" open={open} sizes={DESK_SIZES} />
                  <figcaption className="sw-phones__cap">{shots['desk-manifest'].caption}</figcaption>
                </figure>
                <Phones slugs={['pickup', 'track']} open={open} />
              </More>
              <More title="Navigation">
                <p>
                  A bottom bar with Home, Orders, Track and More. Orders splits into New, Process, Pickup and All, with
                  counts. Wallet, Dashboards, KYC, Pickup Addresses, COD Remittance, NDR, Invoices and Contact Support
                  sit in More.
                </p>
              </More>
              <More title="The full scope, against my design files">
                <div className="dv-matrix cp-matrix sw-matrix">
                  <table>
                    <caption className="sr-only">Requested scope, and what the design files show for each group</caption>
                    <thead>
                      <tr>
                        <th scope="col">Group</th>
                        <th scope="col">Requested in the brief</th>
                        <th scope="col">In my design files</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scope.map((s) => (
                        <tr key={s.group}>
                          <th scope="row">{s.group}</th>
                          <td data-label="Requested in the brief">{s.asked}</td>
                          <td data-label="In my design files">{s.shown}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="dv-matrix__note">
                    The brief gave priorities only for notifications: push P0, in-app P1. It also listed dashboards,
                    reports and integration settings.
                  </p>
                </div>
              </More>
            </section>


            {/* Outcome */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Outcome" title="What was delivered, and what’s still untested." mark={{ text: 'still untested.', tone: 'sky', doodle: 'under' }}>
                <p>
                  The app is live on Google Play. The designs weren’t usability tested, so I make no claims about speed
                  or ease of use.
                </p>
              </Head>
              <div className="cp-outcome">
                <div>
                  <h3 className="dv-h3">Delivered</h3>
                  <ul className="ticks">
                    <li>The mobile design for Shipway’s shipping work, from sign-up to tracking.</li>
                    <li>Shipway’s Android app is live on Google Play.</li>
                    <li>After launch, simpler order cards at every stage.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="dv-h3">What I’d test next</h3>
                  <ul className="ticks">
                    <li>Can sellers tell the next action from an order card?</li>
                    <li>Are the details still easy to find once they’re off the card?</li>
                    <li>Can sellers tell shipment status apart from pickup status?</li>
                    <li>Do bulk actions stay clear on a phone?</li>
                  </ul>
                </div>
              </div>
              <a className="cp-inuse sw-live" href={PLAY} target="_blank" rel="noopener noreferrer">
                <span className="cp-inuse__dot" aria-hidden="true" /> Live on Google Play · 10K+ downloads, as of October 2026
                <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span>
              </a>
              <p className="sw-src">
                The download count is from the Google Play listing. It covers the whole app, not just my design, and is
                not a measure of it.
              </p>
              <h3 className="dv-h3 cp-gap">Reflection: adapting is not shrinking</h3>
              <p className="cp-reflect">
                Bringing a desktop platform to a phone wasn’t about making screens smaller. It meant{' '}
                <mark>deciding what each screen is for</mark>. Both of my changes, the setup checklist and the
                simpler cards, came down to the same move: taking things off the screen until the next step was clear.
              </p>
              <h3 className="dv-h3 cp-gap">About the screens</h3>
              <ul className="sw-sources">
                <li>Mobile screens are exported from my Figma files and use demo data. The live app matches these final designs.</li>
                <li>Desktop screens are the client’s existing platform, from the requirements document they shared.</li>
                <li>Customer phone numbers are blurred or masked.</li>
                <li>The designs weren’t usability tested.</li>
              </ul>
              <div className="dv-end cp-end">
                <External href={PLAY}>View Android app</External>
              </div>
            </section>
          </div>
        </div>
      </div>

      {lightbox}
      <NextProject slug="shipway" withPrevious />
    </article>
  )
}
