import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import External from '../components/External'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import type { ImageItem } from '../data/images'

const PLAY = 'https://play.google.com/store/apps/details?id=com.shipway.app&hl=en_IN'
const DIR = '/work/shipway'

/** Where each screen comes from. Mobile screens are exported from my Figma files, with demo data. */
const INITIAL = 'Initial mobile design. Exported from my Figma files.'
const FINAL = 'Final design. Exported from my Figma files, demo data.'
const REVISION = 'Post-launch card revision. Exported from my Figma files, demo data.'
const DESKTOP = 'Existing desktop platform, not my design. From the client’s requirements document.'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'challenge', label: 'Desktop-to-mobile challenge' },
  { id: 'decisions', label: 'Three key design decisions' },
  { id: 'iteration', label: 'Iteration' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'reflection', label: 'Reflection' },
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
} satisfies Record<string, { w: number; h: number; small: number; caption: string; label: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]
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
          srcSet={`${src}-800.webp ${shot.small}w, ${src}-1800.webp ${shot.w}w`}
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

/** A row of phone screens, each with its caption */
function Phones({ slugs, open, eager }: { slugs: readonly Shot[]; open: (i: number) => void; eager?: boolean }) {
  return (
    <ol className={`sw-phones sw-phones--${slugs.length}`}>
      {slugs.map((slug) => (
        <li key={slug}>
          <Screen slug={slug} open={open} eager={eager} />
          <p className="sw-phones__cap">{shots[slug].caption}</p>
        </li>
      ))}
    </ol>
  )
}

/** A wide screen beside a phone screen, each tagged, with the caption under each */
function Pair({ left, right, leftTag, rightTag, open }: {
  left: Shot
  right: Shot
  leftTag: string
  rightTag: string
  open: (i: number) => void
}) {
  const wide = shots[left].w > shots[left].h
  return (
    <div className={`sw-pair__grid${wide ? '' : ' sw-pair__grid--phones'}`}>
      <figure className="sw-pair__desk">
        <p className="cp-pair__tag">{leftTag}</p>
        <Screen slug={left} open={open} sizes={wide ? DESK_SIZES : PAIR_PHONE_SIZES} />
        <figcaption className="sw-phones__cap">{shots[left].caption}</figcaption>
      </figure>
      <figure className="sw-pair__phone">
        <p className="cp-pair__tag cp-pair__tag--final">{rightTag}</p>
        <Screen slug={right} open={open} sizes={PAIR_PHONE_SIZES} />
        <figcaption className="sw-phones__cap">{shots[right].caption}</figcaption>
      </figure>
    </div>
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

/** The three decisions, each built around one comparison */
const decisions = [
  {
    title: 'From a desktop table to a card for each stage',
    left: 'desk-process-crop',
    right: 'bulk-manifest',
    leftTag: 'Existing desktop platform',
    rightTag: 'My mobile design',
    need: 'Desktop shows every field for every order in one wide row: product, SKU, dimensions, the customer’s phone, tracking and actions.',
    did: 'A card per order that shows what that stage needs. On the Process tab: order ID and date, customer and location, amount and payment type, courier, AWB and status. Product, SKU, dimensions and the phone number move to order details. New cards end in Assign Courier, and selecting orders brings up Manifest in the header.',
    intent: 'To keep each card focused on the order’s current stage.',
    tradeoff: 'Fields that sit side by side on desktop now take a tap to reach.',
  },
  {
    title: 'From a courier grid to a courier list',
    left: 'desk-assign',
    right: 'assign',
    leftTag: 'Existing desktop platform',
    rightTag: 'My mobile design',
    need: 'The desktop dialog compares eight couriers in a four-column grid, which a phone screen can’t fit.',
    did: 'A full screen with one courier per row. Each row keeps price, charged weight, expected pickup and expected delivery, with the Cheapest tag. The All, Air and Surface filters and sorting stay at the top, under the pickup address.',
    intent: 'To keep the same comparison points as desktop, read top to bottom.',
    tradeoff: 'Fewer couriers are visible at once, so comparing more of them means scrolling.',
  },
  {
    title: 'Essentials in the list, the full record in details',
    left: 'orders',
    right: 'order-detail',
    leftTag: 'Orders list',
    rightTag: 'Order details',
    need: 'An order has more fields than a list card can hold: customer contact, billing address, HSN, SKU, quantity, package size.',
    did: 'I reduced the information shown in the list and grouped the fuller record into customer, product and package details, with Assign Courier fixed at the bottom. The phone number is masked until revealed.',
    intent: 'To let the list show more orders per screen, with details one tap away.',
    tradeoff: 'Less information on each card, and another step to inspect an order.',
  },
] as const

function Decision({ need, did, intent, tradeoff }: { need: string; did: string; intent: string; tradeoff: string }) {
  return (
    <dl className="dv-why sw-why">
      <div><dt>The need</dt><dd>{need}</dd></div>
      <div><dt>What I designed</dt><dd>{did}</dd></div>
      <div><dt>Intent</dt><dd>{intent}</dd></div>
      <div><dt>Trade-off</dt><dd>{tradeoff}</dd></div>
    </dl>
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

export default function Shipway() {
  useTitle('Shipway — Bringing Shipway’s shipping workflows to mobile | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)

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
            I took Shipway’s desktop shipping platform, with its nine-column tables and always-open filters, and
            designed the Android app that puts the same workflows on a phone: orders, couriers, pickups and tracking.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>Role</dt>
                <dd>Mobile product design</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>Approximately 4–6 weeks</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Live on Google Play, 10K+ downloads</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Desktop-to-mobile workflow adaptation and post-launch card iteration</dd>
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
            <div className="dv-signal">
              <p className="dv-signal__kind">What shaped it</p>
              <p className="dv-signal__text">
                <mark>Keep the platform, rethink what comes first.</mark> Most desktop features came across. The work
                was deciding what each screen shows first.
              </p>
              <p className="dv-signal__note">
                Mobile screens are exported from my Figma files, with demo data. Desktop screens are the client’s
                existing platform.
              </p>
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
              <Head id="overview" kicker="Overview" title="A whole shipping platform, redesigned for the phone.">
                <p>
                  Shipway helps online sellers ship through many courier partners. Its desktop platform already
                  covered every step after a sale. Through Heizen, I owned the mobile product design for its{' '}
                  <mark>Android app</mark>, from onboarding to delivery tracking, and after launch I led the revision
                  of its order cards.
                </p>
              </Head>
              <ul className="sw-stats" aria-label="The work in numbers">
                <li><strong>5</strong> order stages brought to mobile</li>
                <li><strong>9 → 1</strong> desktop columns reworked into a single order card</li>
                <li><strong>8</strong> courier options turned into one scannable list</li>
                <li><strong>10K+</strong> downloads of the app on Google Play</li>
              </ul>
              <dl className="dv-facts" aria-label="Project at a glance">
                <div>
                  <dt>Client</dt>
                  <dd>Shipway by Unicommerce, through Heizen</dd>
                </div>
                <div>
                  <dt>Starting point</dt>
                  <dd>An existing desktop platform</dd>
                </div>
                <div>
                  <dt>My part</dt>
                  <dd>Mobile product design, then the post-launch card revisions</dd>
                </div>
                <div>
                  <dt>Timeline</dt>
                  <dd>Approximately 4–6 weeks</dd>
                </div>
              </dl>
              <Phones slugs={['home-setup', 'track']} open={open} eager />
            </section>

            {/* Desktop-to-mobile challenge */}
            <section id="challenge" className="dv-sec" aria-labelledby="challenge-title" tabIndex={-1}>
              <Head id="challenge" kicker="Desktop-to-mobile challenge" title="A full platform, not a lite version.">
                <p>
                  The desktop platform runs everything after a sale on wide tables with a filter panel always open. The
                  brief wasn’t to cut features; almost all of it had to come across. So the real design problem was
                  hierarchy: <mark>deciding what each mobile screen shows first</mark>. I rebuilt the app around the
                  journey an order takes, stage by stage.
                </p>
              </Head>
              <figure className="sw-baseline">
                <p className="cp-pair__tag">Existing desktop platform</p>
                <Screen slug="desk-new" open={open} sizes={DESK_SIZES} />
                <figcaption className="sw-phones__cap">{shots['desk-new'].caption}</figcaption>
              </figure>
              <Flow />
              <More title="Full project scope">
                <p>
                  The scope as the client’s module list requested it, beside what my design files show for each
                  group.
                </p>
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

            {/* Three key design decisions */}
            <section id="decisions" className="dv-sec" aria-labelledby="decisions-title" tabIndex={-1}>
              <Head id="decisions" kicker="Three key design decisions" title="What stays in view, and what moves a tap away.">
                <p>Three calls shaped the app. Each one started from a desktop screen sellers already used.</p>
              </Head>
              <ol className="sw-decisions">
                {decisions.map((d, i) => (
                  <li key={d.title} className="sw-decision">
                    <h3 className="dv-h3"><span className="dv-num">{String.fromCharCode(65 + i)}</span> {d.title}</h3>
                    <Pair left={d.left} right={d.right} leftTag={d.leftTag} rightTag={d.rightTag} open={open} />
                    <Decision {...d} />
                  </li>
                ))}
              </ol>
              <More title="Also designed: onboarding, manifests and navigation">
                <h3 className="dv-h3">Onboarding</h3>
                <p>
                  The final flow: a phone number and an OTP, a step to choose between accounts linked to the same
                  number, then sign-up and the business address for new sellers. Why it ended up this short is under{' '}
                  <a href="#iteration">Iteration</a>.
                </p>
                <Phones slugs={['onb-login', 'onb-otp', 'onb-account', 'onb-signup', 'onb-profile']} open={open} />
                <h3 className="dv-h3 cp-gap">Manifests</h3>
                <p>
                  On desktop, each manifest is a table row with view, print and download icons. On mobile, each is a
                  card that puts the pickup status first, in colour.
                </p>
                <Pair
                  left="desk-manifest"
                  right="pickup"
                  leftTag="Existing desktop platform"
                  rightTag="My mobile design"
                  open={open}
                />
                <h3 className="dv-h3 cp-gap">Navigation</h3>
                <p>
                  A bottom bar with Home, Orders, Track and More (visible on the Orders list above). Orders splits into
                  New, Process, Pickup and All, with counts. Wallet, Dashboards, KYC, Pickup Addresses, COD
                  Remittance, NDR, Invoices and Contact Support sit in More.
                </p>
              </More>
            </section>

            {/* Post-launch iteration */}
            <section id="iteration" className="dv-sec" aria-labelledby="iteration-title" tabIndex={-1}>
              <Head id="iteration" kicker="Iteration" title="Two things I cut after the first version.">
                <p>
                  The first versions worked, but both asked too much of the seller at the wrong moment. I went back to
                  each with one question: <mark>what does the seller need right now, and what can wait?</mark>
                </p>
              </Head>
              <h3 className="dv-h3"><span className="dv-num">1</span> Onboarding: from a four-step setup to a short sign-up</h3>
              <p>
                My first design asked for everything up front: profile, then KYC documents, a warehouse and a sales
                channel, each a step with a progress bar and Skip. That’s a PAN card, a GST number and a bank
                statement before a seller has even seen the app. In the final design, sign-up stops at the account
                and the business address. KYC, the pickup address, a channel and bank details became a{' '}
                <mark>Getting Started checklist on Home</mark>, next to the orders they unlock.
              </p>
              <div className="sw-rounds">
                <figure>
                  <p className="cp-pair__tag">Initial design: setup inside sign-up</p>
                  <Phones slugs={['onb-kyc', 'onb-warehouse', 'onb-channel']} open={open} />
                </figure>
                <figure>
                  <p className="cp-pair__tag cp-pair__tag--final">Final design: sign-up, then a checklist</p>
                  <Phones slugs={['onb-signup', 'onb-profile', 'home-setup']} open={open} />
                </figure>
              </div>
              <h3 className="dv-h3 cp-gap"><span className="dv-num">2</span> After launch: the order card cut down</h3>
              <p>
                With the app live, I reviewed every order card against the one decision its stage asks for. On the
                New tab that decision is which courier to assign, and the card was carrying the product name,
                package dimensions and the customer’s phone, none of which change it. I{' '}
                <mark>revised the cards across every stage</mark> to keep only what the next action needs; the
                rest is one tap away in order details.
              </p>
              <div className="dv-compare sw-compare">
                <figure className="dv-compare__col">
                  <p className="cp-pair__tag">Initial mobile design</p>
                  <Screen slug="card-initial" open={open} sizes={CARD_SIZES} />
                </figure>
                <figure className="dv-compare__col">
                  <p className="cp-pair__tag cp-pair__tag--final">Post-launch revision</p>
                  <Screen slug="card-new" open={open} sizes={CARD_SIZES} />
                </figure>
              </div>
              <p className="sw-src">Same order stage, using different sample data. Phone number blurred in the initial card.</p>
              <p className="sw-hierarchy">
                The initial card split its details into two labelled columns. The revision reads in three rows: order
                and date, then customer and location, then amount, payment type and weight above Assign Courier.
              </p>
              <dl className="sw-diff">
                <div className="sw-diff__item sw-diff__item--out">
                  <dt>Removed from the list</dt>
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
                  <dt>Retained</dt>
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
                      <li>The channel is now an icon beside the order ID</li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </section>

            {/* Delivery */}
            <section id="delivery" className="dv-sec" aria-labelledby="delivery-title" tabIndex={-1}>
              <Head id="delivery" kicker="Delivery" title="Launched on Android, refined after release." />
              <ol className="sw-outcomes">
                <li><strong>Designed</strong> the mobile experience for Shipway’s existing shipping workflows, from onboarding to tracking.</li>
                <li><strong>Launched</strong> as Shipway’s Android app, live on Google Play with 10K+ downloads.</li>
                <li><strong>Refined</strong> after release: I revised the order cards across every stage.</li>
              </ol>
              <dl className="dv-results sw-delivery">
                <div>
                  <dt>Released app</dt>
                  <dd>
                    <a href={PLAY} target="_blank" rel="noopener noreferrer">
                      Shipway on Google Play<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>Downloads</dt>
                  <dd>10K+ on Google Play, as of October 2026</dd>
                </div>
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Adapting is not shrinking.">
                <p>
                  Bringing a desktop platform to mobile wasn’t about making screens smaller. It meant{' '}
                  <mark>rethinking the hierarchy</mark>: what an order card is for at each stage, and what can wait
                  one tap. Both rounds of iteration came down to the same move: taking things off the screen until only
                  the next step was left.
                </p>
              </Head>
              <h3 className="dv-h3">What I’d test next</h3>
              <ul className="ticks">
                <li>Can sellers identify the next action from an order card?</li>
                <li>Are the details still easy to find once they’re off the card?</li>
                <li>Can sellers tell shipment state apart from pickup and manifest state?</li>
                <li>Do bulk actions stay clear on mobile?</li>
              </ul>
              <h3 className="dv-h3 cp-gap">About the screens</h3>
              <ul className="sw-sources">
                <li>Mobile screens are exported from my Figma files and use demo data. The live app may differ from them.</li>
                <li>Desktop screens are the client’s existing platform, from the requirements document they shared.</li>
                <li>Customer phone numbers are blurred or masked.</li>
                <li>The download count is from the Google Play listing and covers the app as a whole.</li>
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
