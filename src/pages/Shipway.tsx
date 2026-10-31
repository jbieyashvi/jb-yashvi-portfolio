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

/** Where each screen comes from. All are exported from my Figma files, with demo data. */
const INITIAL = 'Initial mobile design. Exported from my Figma files.'
const FINAL = 'Final design. Exported from my Figma files, demo data.'
const REVISION = 'Post-launch card revision. Exported from my Figma files, demo data.'
const DESKTOP = 'Existing desktop platform, not my design. From the client’s requirements document.'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'context', label: 'Context & challenge' },
  { id: 'scope', label: 'Understanding the scope' },
  { id: 'workflow', label: 'The mobile workflow' },
  { id: 'decisions', label: 'Key design decisions' },
  { id: 'iteration', label: 'Post-launch card revision' },
  { id: 'outcome', label: 'Delivery & outcome' },
  { id: 'reflection', label: 'Reflection' },
]

const PHONE = { w: 780, h: 1688, small: 520 }

/** Every screen the enlarged view steps through, in reading order */
const shots = {
  orders: {
    ...PHONE,
    caption: 'Orders, New tab: orders waiting for a courier',
    label: REVISION,
    alt: 'Shipway Orders screen. Tabs New (3), Process (2), Pickup (2) and All. Three order cards, each with order ID #ORD001 and a Shopify icon, date Jan 15, 2025, customer Rahul Sharma, Bangalore 560001, ₹2,499 with a COD or Prepaid tag, 5000 gm and an Assign Courier button. A blue add button and a bottom bar: Home, Orders, Track, More.',
  },
  assign: {
    ...PHONE,
    caption: 'Assign Courier: comparing courier options',
    label: FINAL,
    alt: 'Assign Courier screen with the pickup address at the top and All, Air and Surface filters with Sort. Courier cards for AirSwift Logistics, Next Day Air, rated 4.5: charged weight 1 KG, ₹150, expected pickup 5:00 PM today and expected delivery 10:00 AM tomorrow, one tagged Cheapest. An Assigned Shipment button at the bottom.',
  },
  'bulk-manifest': {
    ...PHONE,
    caption: 'Process tab: selecting orders to move to a manifest',
    label: FINAL,
    alt: 'Orders screen in selection mode: “2 Selected” and a Manifest button in the header, a Select All checkbox, and Process tab cards. Two checked cards for #ORD001, In transit and Delivered, show the customer, location, ₹2,499, COD or Prepaid, Pickup by today, courier name and AWB number.',
  },
  pickup: {
    ...PHONE,
    caption: 'Pickup tab: one card per manifest',
    label: REVISION,
    alt: 'Orders screen on the Pickup tab. Four manifest cards, each for Manifest ID 1342344, with a pickup status: Picked, Pickup Failed, Pickup by Today and Partial Picked. Each shows order count 03, Delhivery Surface Express Cargo, Warehouse Name and a Dispatched or New tag.',
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
    caption: 'Desktop New Orders: a table row per order, filters on the right',
    label: DESKTOP,
    alt: 'Desktop Shipway Orders page on the New Orders tab, with Sync Orders, Add order, Assign courier, Bulk Actions and Download buttons. A table with columns Order ID, Customer Info, Order Info, Channel, Dim. & Wt., Channel Date and Courier Price holds one test order. A Filter panel on the right has filter type, period, date range, order ID, product SKU and channel.',
  },
  'desk-assign': {
    w: 1378,
    h: 651,
    small: 800,
    caption: 'Desktop Quick Courier Assign: eight couriers in a grid',
    label: DESKTOP,
    alt: 'Desktop Quick Courier Assign dialog with a pickup address dropdown, a Shipway Protect checkbox, All, Surface and Air filters and Sort By Cheapest. Eight courier cards in two rows of four, each with a rating, charged weight, price, expected pickup and estimated delivery. The first is tagged Cheapest and selected. Assign Shipment and Cancel buttons.',
  },
  'desk-process': {
    w: 1895,
    h: 670,
    small: 800,
    caption: 'Desktop Process Orders: nine columns per order',
    label: `${DESKTOP} Customer phone numbers blurred.`,
    alt: 'Desktop Process Orders tab with Print, Manifest, Bulk Actions and Download buttons. A table with columns Order ID, Customer Info, Product name, Order Info, Tracking Info, Pickup By, Dim. & Wt., Channel Date and Action, with four orders marked Processing, three of them Picked. Each row has label and invoice icons. Customer phone numbers are blurred. A Filter panel on the right.',
  },
  'desk-manifest': {
    w: 1899,
    h: 430,
    small: 800,
    caption: 'Desktop Manifests: one row per manifest',
    label: DESKTOP,
    alt: 'Desktop Manifests page on the Pickup & Manifests tab. A Pickup By filter shows Today’s, Shipway Bluedart (0.5kg). A table with columns Manifest ID, Manifest Info, Courier, Pickup By, Warehouse Name, Manifest and Label/INV holds one manifest with status New, one pre-paid order, pickup Today, and view, PDF, print and download icons.',
  },
  'desk-lookup': {
    w: 1460,
    h: 866,
    small: 800,
    caption: 'Desktop order lookup: progress beside the order details',
    label: DESKTOP,
    alt: 'Desktop order lookup page with a dark red Delivered header, Bluedart and the AWB number, and a stepper from Order Booked through In-transit and Out for Delivery to Delivered, with a delivery event below. Beside it, Order details (order ID, date, COD payment, total and an Invoice download) and Order Items.',
  },
  'card-new': {
    w: 764,
    h: 370,
    small: 640,
    caption: 'New: what’s needed to assign a courier',
    label: REVISION,
    alt: 'New order card: #ORD001 with a Shopify icon, Jan 15, 2025, Rahul Sharma, Bangalore 560001, ₹2,499 with a COD tag, 5000 gm, and an Assign Courier button.',
  },
  'card-process': {
    w: 764,
    h: 638,
    small: 640,
    caption: 'Processing: the courier, AWB and shipment status',
    label: REVISION,
    alt: 'Two processing order cards: order ID and date, Rahul Sharma, Bangalore 560001, Delhivery Surface Express Cargo, an AWB number, and an In transit tag. The first card shows how a long order ID fits on one line.',
  },
  'card-track': {
    w: 764,
    h: 422,
    small: 640,
    caption: 'Tracking: the same facts, with Track Order',
    label: REVISION,
    alt: 'Track order card: order ID and date, Rahul Sharma, Bangalore 560001, Delhivery Surface Express Cargo, an AWB number, an In transit tag and a Track Order button.',
  },
  'card-manifest': {
    w: 764,
    h: 1242,
    small: 640,
    caption: 'Manifest: pickup status for a group of orders',
    label: REVISION,
    alt: 'Four manifest cards for Manifest ID 1342344 with pickup statuses Picked in green, Pickup Failed in red, Pickup by Today in blue and Partial Picked in yellow. Each shows order count 03, Delhivery Surface Express Cargo, Warehouse Name and a Dispatched or New tag.',
  },
  'onb-kyc': {
    w: 780,
    h: 1689,
    small: 520,
    caption: 'Onboarding step 2 of 4: KYC verification',
    label: INITIAL,
    alt: 'KYC Verification screen, Step 2 of 4, 50% complete, with a Skip link. Upload your business documents: Company Type set to Individual, an Upload PAN Card drop zone, a GST Number field and an Upload Bank Statement drop zone, each with Choose File. The Next button is disabled. No documents are uploaded.',
  },
  'onb-warehouse': {
    w: 780,
    h: 1689,
    small: 520,
    caption: 'Onboarding step 3 of 4: warehouse setup',
    label: INITIAL,
    alt: 'Warehouse Setup screen, Step 3 of 4, 75% complete, with a Skip link. Configure your pickup location: empty fields for warehouse title, contact person name, company name, email address, phone number with +91, GST number and warehouse address.',
  },
  'onb-channel': {
    w: 780,
    h: 1689,
    small: 520,
    caption: 'Onboarding step 4 of 4: channel integration',
    label: INITIAL,
    alt: 'Channel Integration screen, Step 4 of 4, 100% complete. Connect your selling platforms, with a search field and View All. Shopify is marked Connected; Amazon, Flipkart, WooCommerce and Myntra have Connect buttons. A Done button at the bottom.',
  },
  'home-setup': {
    ...PHONE,
    caption: 'Home: setup left to do, as a checklist',
    label: REVISION,
    alt: 'Home screen for TechMart Pvt. Ltd. with a ₹2,200 wallet balance and a search field for order ID, AWB or phone. Getting Started: Complete KYC and Add your pickup address done, Recharge your wallet and Ship your first order pending. Setup Business Profile: Add profile details done, Add channel and Add bank details pending. Action Items Needing Attention: 12 new orders to process, 04 NDR actions pending, 02 weight discrepancies pending, low wallet balance ₹200 marked urgent.',
  },
  'order-detail': {
    ...PHONE,
    caption: 'Order detail: the full record, one tap from the card',
    label: FINAL,
    alt: 'Order detail screen for #ORD001: ₹12,000 Prepaid, order status New, channel Shopify. Customer Details: name, email, phone shown masked as +91 98*** **210 with an eye icon to reveal it, company, shipping and billing address. Product Details: product name, HSN code, SKU, quantity and subtotal. Package Details: weight 0.1 KG and dimensions 15 × 10 × 5 cm. An Assign Courier button fixed at the bottom.',
  },
  'card-initial': {
    w: 1130,
    h: 776,
    small: 640,
    caption: 'Initial mobile design: the New order card',
    label: `${INITIAL} Phone number blurred.`,
    alt: 'Initial New order card: #ORD001 with a New badge. Left column: Rahul Sharma with a phone number (blurred here), Bangalore 302018, Order info ₹2499 (COD). Right column: Channel Information, 2024-01-15 at 21:50 with a Shopify icon, Wireless Headphones, 25×15×10 cm, 500 gm. An Assign Courier button.',
  },
} satisfies Record<string, { w: number; h: number; small: number; caption: string; label: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]
const items: ImageItem[] = order.map((slug) => ({ slug, src: `${DIR}/${slug}`, ...shots[slug] }))

const PHONE_SIZES = '(max-width: 760px) 50vw, 300px'
const CARD_SIZES = '(max-width: 760px) 100vw, 440px'
const DESK_SIZES = '(max-width: 760px) 100vw, 640px'

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

/** The scope as the client requested it, beside what my design files show for each part */
const scope = [
  {
    group: 'Account setup & onboarding',
    asked: 'Log in, sign up, verify mobile and email, then four onboarding steps: profile, KYC, warehouse and channel integration.',
    shown: 'The four onboarding steps, an OTP screen, and a Getting Started checklist on Home.',
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
    shown: 'Wallet balance in the header and on Home, a Recharge quick action, and Wallet, COD remittance and Invoices in More. Not shown on this page.',
  },
  {
    group: 'Shipment exceptions, notifications & support',
    asked: 'NDR queues (action pending, action taken, delivered/RTO, all), push notifications (P0), in-app notifications (P1), chat support and support tickets.',
    shown: 'NDR and Contact Support in More, NDR counts on Home and a notification bell in the header. The detailed NDR flow isn’t shown here.',
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

/** Each stage on the existing desktop platform beside my mobile screen for it */
const pairs = [
  {
    stage: 'New orders',
    desk: 'desk-new',
    phone: 'orders',
    note: 'On desktop, each order is a table row with seven columns and filters always open on the right. On mobile, each order is a card, and filters sit behind an icon in the header.',
  },
  {
    stage: 'Assign courier',
    desk: 'desk-assign',
    phone: 'assign',
    note: 'The desktop dialog lays eight couriers out in a grid. On mobile it’s a full screen with one courier per row. It keeps the All, Surface and Air filter, sorting, the Cheapest tag, charged weight, price, pickup and delivery.',
  },
  {
    stage: 'Processing',
    desk: 'desk-process',
    phone: 'bulk-manifest',
    note: 'The desktop table has nine columns, with label and invoice icons on every row. On mobile, the card keeps the courier, AWB and status. Selecting orders brings up a Manifest action in the header, and labels and invoices sit in each order’s action menu.',
  },
  {
    stage: 'Pickup & manifest',
    desk: 'desk-manifest',
    phone: 'pickup',
    note: 'On desktop, each manifest is a row with view, print and download icons. On mobile, each is a card that puts the pickup status first, in colour.',
  },
  {
    stage: 'Tracking',
    desk: 'desk-lookup',
    phone: 'track',
    note: 'The desktop lookup puts shipment progress beside the order details. On mobile they stack: progress first, then items, then order details.',
  },
] as const

function Pairs({ open }: { open: (i: number) => void }) {
  return (
    <ol className="sw-pairs">
      {pairs.map((p, i) => (
        <li key={p.stage} className="sw-pair">
          <h3 className="dv-h3"><span className="dv-num">{i + 1}</span> {p.stage}</h3>
          <div className="sw-pair__grid">
            <figure className="sw-pair__desk">
              <p className="cp-pair__tag">Existing desktop platform</p>
              <Screen slug={p.desk} open={open} sizes={DESK_SIZES} />
            </figure>
            <figure className="sw-pair__phone">
              <p className="cp-pair__tag cp-pair__tag--final">My mobile design</p>
              <Screen slug={p.phone} open={open} sizes="(max-width: 760px) 60vw, 220px" />
            </figure>
          </div>
          <p className="sw-pair__note">{p.note}</p>
        </li>
      ))}
    </ol>
  )
}

function Flow() {
  return (
    <figure className="cp-flow-wrap">
      <p id="flow-label" className="dv-diagram-label">How an order moves through the app</p>
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

/** The four decisions, each with the screens that show it */
const decisions = [
  {
    title: 'A card for each stage of an order',
    shots: ['card-new', 'card-process', 'card-track', 'card-manifest'],
    cards: true,
    need: 'An order needs different things at each stage. Before a courier is assigned, it’s the amount, payment type and weight. After, it’s the courier, AWB and status.',
    did: 'One card per stage. New cards end in Assign Courier, processing cards show the courier and AWB, tracking cards add Track Order, and manifest cards group orders under a manifest ID with a pickup status.',
    why: 'Each card leads with what the seller has to check or do next at that stage, so the list reads as a to-do list.',
    open: 'Manifest cards show two states: pickup status (like Pickup Failed) and a Dispatched or New tag. I haven’t tested whether sellers can tell them apart.',
  },
  {
    title: 'Onboarding as four short steps',
    shots: ['onb-kyc', 'onb-warehouse', 'onb-channel', 'home-setup'],
    need: 'Before shipping, a new seller has to add a business profile, KYC documents, a warehouse and a sales channel. That’s a lot of form on a phone.',
    did: 'Four steps with one topic each, a progress bar (“Step 2 of 4, 50% Complete”) and Skip. Home then shows what’s left as a Getting Started checklist.',
    why: 'Each screen stays short, the seller always knows how far along they are, and a skipped step isn’t lost.',
    open: 'Skipping KYC or the warehouse may block shipping later. The checklist is meant to catch that, but it hasn’t been tested.',
  },
  {
    title: 'The list for deciding, the detail for checking',
    shots: ['order-detail'],
    need: 'An order has a lot of fields: customer, address, product, HSN, SKU, package size. A phone screen can’t show them all for every order in a list.',
    did: 'The card keeps what’s needed to act. The order detail screen has the full record, grouped into customer, product and package details, with Assign Courier fixed at the bottom. The customer’s phone number is masked until revealed.',
    why: 'Sellers can scan many orders quickly and open one only when they need to check something.',
    open: 'Checking a detail takes one more tap. Whether every field is still easy to find hasn’t been tested.',
  },
  {
    title: 'Four tabs for the daily loop, More for the rest',
    shots: ['orders'],
    need: 'The platform covers orders, tracking, wallet, NDR, dashboards, KYC, invoices and support. A phone has room for a few tabs.',
    did: 'Bottom navigation with Home, Orders, Track and More. Orders splits into New, Process, Pickup and All, with counts. Wallet, Dashboards, KYC, Pickup Addresses, COD Remittance, NDR, Invoices and Contact Support sit in More. An add button starts a new order.',
    why: 'Moving orders forward and tracking them is one tap away. Everything else is still in the app, a level down.',
    open: 'NDR sits in More, which may be too deep for sellers with many failed deliveries. Home’s action items show the NDR count as a partial answer.',
  },
] as const

function Decision({ need, did, why, open }: { need: string; did: string; why: string; open: string }) {
  return (
    <dl className="dv-why sw-why">
      <div><dt>The need</dt><dd>{need}</dd></div>
      <div><dt>What I designed</dt><dd>{did}</dd></div>
      <div><dt>Why it helps</dt><dd>{why}</dd></div>
      <div><dt>Trade-off or open question</dt><dd>{open}</dd></div>
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
            Adapting a desktop shipping platform into a mobile experience for managing orders, assigning couriers
            and tracking shipments.
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
                <dd>Launched on Android</dd>
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
              <Head id="overview" kicker="Overview" title="Shipping, from the phone.">
                <p>
                  Shipway helps online sellers ship orders through many courier partners. It already had a desktop
                  platform. Through Heizen, I designed its <mark>Android app</mark>: onboarding, orders, courier
                  assignment, pickup and tracking. After launch, I also redesigned the order cards.
                </p>
              </Head>
              <Phones slugs={['orders', 'assign', 'track']} open={open} eager />
              <p className="sw-src">
                Final designs from my Figma files. <a className="dv-top__try" href={PLAY} target="_blank" rel="noopener noreferrer">
                  View Android app <span aria-hidden="true">↗</span><span className="sr-only"> (opens Google Play in a new tab)</span>
                </a>
              </p>
            </section>

            {/* Context and design challenge */}
            <section id="context" className="dv-sec" aria-labelledby="context-title" tabIndex={-1}>
              <Head id="context" kicker="Context & challenge" title="A full platform, not a lite version.">
                <p>
                  Shipway covers what happens after a sale: getting orders in, choosing a courier, printing labels,
                  handing parcels over for pickup and following them to delivery. The desktop platform already did all
                  of this.
                </p>
                <p>
                  The brief wasn’t to cut it down. Most features had to come across. The challenge was presenting
                  them so that <mark>the next thing to do is clear on a small screen</mark>.
                </p>
              </Head>
              <dl className="dv-facts" aria-label="Project context">
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
                  <dd>Mobile product design, then the post-launch card revision</dd>
                </div>
                <div>
                  <dt>Brief</dt>
                  <dd>A module list from the client</dd>
                </div>
              </dl>
              <p className="dv-diagram-label">Workflow framing</p>
              <p className="dv-statement">
                As a seller managing shipments, I need to find orders needing action, assign a courier and follow
                their progress from my phone.
              </p>
              <p className="sw-src">A statement of the workflow I designed for. It isn’t a quote from a user.</p>
            </section>

            {/* Understanding the scope */}
            <section id="scope" className="dv-sec" aria-labelledby="scope-title" tabIndex={-1}>
              <Head id="scope" kicker="Understanding the scope" title="Five groups of work from the client’s module list.">
                <p>
                  This is the scope as the client requested it. A line in the brief isn’t proof that a feature
                  shipped, so the last column says only what my design files show.
                </p>
              </Head>
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
            </section>

            {/* Organising the mobile workflow */}
            <section id="workflow" className="dv-sec" aria-labelledby="workflow-title" tabIndex={-1}>
              <Head id="workflow" kicker="The mobile workflow" title="One order, five stops.">
                <p>
                  On desktop, these are tabs over wide tables with a filter panel beside them. On mobile, I organised
                  them around the order’s journey. The Orders tab holds the first stages, in order, and Track picks up
                  from there. All lists every order whatever its stage.
                </p>
              </Head>
              <Flow />
              <h3 className="dv-h3 cp-gap">Each stage, desktop and mobile</h3>
              <p className="sw-src">
                Desktop screens are the client’s, from the requirements document they shared. They show test data,
                and I blurred customer phone numbers.
              </p>
              <Pairs open={open} />
            </section>

            {/* Key design decisions */}
            <section id="decisions" className="dv-sec" aria-labelledby="decisions-title" tabIndex={-1}>
              <Head id="decisions" kicker="Key design decisions" title="Four decisions in the app.">
                <p>The trade-offs are my own judgement. None of this was usability tested.</p>
              </Head>
              <ol className="sw-decisions">
                {decisions.map((d, i) => (
                  <li key={d.title} className="sw-decision">
                    <h3 className="dv-h3"><span className="dv-num">{String.fromCharCode(65 + i)}</span> {d.title}</h3>
                    {'cards' in d ? (
                      <ol className="sw-cards">
                        {d.shots.map((slug) => (
                          <li key={slug}>
                            <Screen slug={slug} open={open} sizes={CARD_SIZES} />
                            <p className="sw-phones__cap">{shots[slug].caption}</p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <Phones slugs={d.shots} open={open} />
                    )}
                    <Decision {...d} />
                    {i === 1 && (
                      <p className="sw-src">
                        The onboarding steps are from the initial design file. Home is from the post-launch revision.
                      </p>
                    )}
                    {i === 2 && (
                      <p className="sw-src">
                        On desktop, the Process Orders table shows product, SKU, dimensions and the customer’s phone on
                        every row (see stage 3 under The mobile workflow). On mobile, those details are on this screen.
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </section>

            {/* Initial design → post-launch card iteration */}
            <section id="iteration" className="dv-sec" aria-labelledby="iteration-title" tabIndex={-1}>
              <Head id="iteration" kicker="Post-launch card revision" title="A shorter order card.">
                <p>
                  After the app launched, <mark>I simplified the order-list card to foreground the information and
                  action needed at that stage.</mark> The New order card shows it most clearly.
                </p>
              </Head>
              <div className="dv-compare sw-compare">
                <figure className="dv-compare__col">
                  <p className="cp-pair__tag">Initial mobile design</p>
                  <Screen slug="card-initial" open={open} sizes={CARD_SIZES} />
                  <figcaption className="dv-cap">Phone number blurred for this page.</figcaption>
                </figure>
                <figure className="dv-compare__col">
                  <p className="cp-pair__tag cp-pair__tag--final">Post-launch card revision</p>
                  <Screen slug="card-new" open={open} sizes={CARD_SIZES} />
                  <figcaption className="dv-cap">The same order at the New stage.</figcaption>
                </figure>
              </div>
              <dl className="dv-results sw-diff">
                <div>
                  <dt>Kept on the card</dt>
                  <dd>Order ID, date, customer name, location, amount and payment type, weight, and Assign Courier.</dd>
                </div>
                <div>
                  <dt>Taken off the card</dt>
                  <dd>The customer’s phone number, product name, package dimensions, the New badge and the Channel Information label. The channel is now an icon next to the order ID.</dd>
                </div>
              </dl>
              <p className="dv-note">
                <strong>What I can’t say here.</strong> I’m not stating what prompted the revision. In the Figma design,
                the order detail screen lists customer, product and package details, but I haven’t confirmed that
                every field taken off the card appears there in the live app. The live app may also differ from these
                files in ways that aren’t my work.
              </p>
            </section>

            {/* Delivery and outcome */}
            <section id="outcome" className="dv-sec" aria-labelledby="outcome-title" tabIndex={-1}>
              <Head id="outcome" kicker="Delivery & outcome" title="Launched, but not measured.">
                <p>The app is out. Its effect on sellers wasn’t measured, so there are no numbers here.</p>
              </Head>
              <dl className="dv-results">
                <div>
                  <dt>Delivered</dt>
                  <dd>
                    Mobile designs for onboarding, orders, courier assignment, processing, pickup and manifest,
                    tracking, Home and More, then the post-launch order card revision.
                  </dd>
                </div>
                <div>
                  <dt>Verified release evidence</dt>
                  <dd>
                    The app has a public{' '}
                    <a href={PLAY} target="_blank" rel="noopener noreferrer">
                      Google Play listing<span className="sr-only"> (opens in a new tab)</span>
                    </a>. I haven’t compared the live app screen by screen with my Figma files.
                  </dd>
                </div>
                <div>
                  <dt>Intended benefit</dt>
                  <dd>Sellers can see which orders need action and move them forward from a phone.</dd>
                </div>
                <div>
                  <dt>Not measured</dt>
                  <dd>Task time, scanning speed, error rate and business impact.</dd>
                </div>
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Adapting is not shrinking.">
                <p>
                  Bringing a desktop platform to mobile wasn’t about making the screens smaller. It meant{' '}
                  <mark>rethinking the hierarchy</mark>: what an order card is for at each stage, and what can wait
                  one tap. The post-launch revision pushed that further.
                </p>
              </Head>
              <h3 className="dv-h3">Questions I’d test next</h3>
              <ul className="ticks">
                <li>Can sellers identify the next action from an order card?</li>
                <li>Are the details still discoverable once they’re off the card?</li>
                <li>Can users tell shipment state apart from pickup and manifest state?</li>
                <li>Do bulk actions stay understandable on mobile?</li>
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
