import { Link } from 'react-router-dom'
import CaseSidebar from '../components/CaseSidebar'
import NextProject from '../components/NextProject'
import { useLightbox } from '../components/Lightbox'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import type { ImageItem } from '../data/images'

const DIR = '/work/tan90'

/** Where each screen comes from. Every screen is taken from my TAN90 case study. */
const ADMIN = 'Admin portal. From my TAN90 case study.'
const STATION = 'Warehouse (freezing station) manager portal. From my TAN90 case study.'
const CUSTOMER = 'Customer portal. From my TAN90 case study.'

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'The problem' },
  { id: 'system', label: 'How it fits together' },
  { id: 'decisions', label: 'Three key design decisions' },
  { id: 'pod', label: 'POD approval' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'reflection', label: 'Reflection' },
]

const WIDE = { w: 1800, small: 800 }

/** Every screen the enlarged view steps through, in reading order */
const shots = {
  'admin-dashboard': {
    ...WIDE,
    h: 1172,
    caption: 'Admin dashboard',
    label: `${ADMIN} Customer and user names blurred.`,
    alt: 'Tan90 Thermal Portal admin dashboard. Filters for actual figures, all customers, all freezing stations and a date range. Four stat cards: fill rate 56.62%, return rate 0.00%, orders processed 568, awaiting return 00. A Revenue Trends line chart of actual against projected revenue, a Supply vs Demand Overview bar chart by week, and an Upcoming Orders table with customer (blurred here), warehouse, status, delivery date and quantity.',
  },
  ecosystem: {
    ...WIDE,
    h: 1242,
    caption: 'The four portals around one platform',
    label: 'Diagram from my TAN90 case study.',
    alt: 'Diagram with the Tan90 platform at the centre. Admin Panel above it, for control and monitoring, sends oversight and control. Warehouse Manager on the left, the operations layer, receives assigned orders and returns fulfilment. Delivery Execution on the right, the execution layer, receives assigned deliveries and returns status updates. Customer below, the experience layer, places orders and receives tracking updates. Dispatch, delivery and feedback with real-time tracking loop back along the bottom.',
  },
  'inventory-requests': {
    ...WIDE,
    h: 1196,
    caption: 'Inventory Requests: one row per request, decided from the row',
    label: ADMIN,
    alt: 'Inventory Requests table in the admin portal, under Inventory Management. Filters for all assets, all stations and all statuses, and a search field. Columns: request ID, type (NEW_INVENTORY), freezing station such as FS-TN/HYD or FS-SM/KOL, total quantity, status pill (Approved, Pending or Rejected), requested date and an actions menu on every row.',
  },
  'quick-actions': {
    w: 733,
    h: 736,
    small: 733,
    caption: 'The row menu: View Details, Approve, Reject',
    label: ADMIN,
    alt: 'Close-up of a row’s actions menu open on the Inventory Requests table, with three options: View Details with an eye icon, Approve with a green tick and Reject with a red cross.',
  },
  'station-orders': {
    ...WIDE,
    h: 880,
    caption: 'Freezing Station Orders, with unassigned drivers flagged in red',
    label: `${STATION} Driver names, vehicle numbers and the user’s name blurred.`,
    alt: 'Freezing Station Orders for one station: view and manage all orders assigned to this freezing station. Filters for status and a date range. Columns: order ID, status (Driver assigned or Confirmed), warehouse such as Z_BLR-7, business type (CPC, Hyperpure, F&V, Fresh), driver, total assets and delivery date with a morning or evening slot. Two confirmed orders show a red Not Assigned flag in the driver column; the others show the driver’s name and vehicle number, both blurred here.',
  },
  'admin-orders': {
    ...WIDE,
    h: 1178,
    caption: 'Admin Orders: every order across stations, with status pills',
    label: `${ADMIN} Customer and user names blurred.`,
    alt: 'Admin Orders table with totals at the top: 16,433 total orders, 255 delivered, and revenue. Columns include order ID, customer (blurred here), freezing station, status, and actual against projected revenue, with an export button. Status pills in different colours read POD_UPLOADED, DRIVER_ASSIGNED, WAREHOUSE_APPROVAL_PENDING and IN_TRANSIT.',
  },
  'pod-requests': {
    ...WIDE,
    h: 883,
    caption: 'POD Requests, with the View POD, Approve and Reject menu open',
    label: STATION,
    alt: 'POD Requests in the warehouse manager portal: view and manage Proof of Delivery requests for this warehouse. Columns: order ID, total quantity, status (all Pending), requested at, delivery date, handled by (N/A) and actions. One row’s menu is open with View POD, Approve and Reject.',
  },
  'driver-requests': {
    ...WIDE,
    h: 875,
    caption: 'Driver End Trip Requests: the same queue pattern',
    label: `${STATION} Driver and user names blurred.`,
    alt: 'Driver End Trip Requests for one freezing station: approve or reject requests as needed. Columns: order ID, driver name (blurred here), destination warehouse such as Z_BLR-7, status (all Approved), requested at and an actions menu on each row.',
  },
  'asset-inventory': {
    ...WIDE,
    h: 1178,
    caption: 'Asset Inventory',
    label: ADMIN,
    alt: 'Asset Inventory in the admin portal, with Assets and Inventory tabs and an Add Asset button. A table of Tan90 thermal panels by name, category (Frozen or Chiller) and colour, with in stock, in transit, reusable and total stock counts and edit and delete actions.',
  },
  'warehouse-managers': {
    ...WIDE,
    h: 887,
    caption: 'Warehouse Managers',
    label: `${STATION} Emails and phone numbers blurred.`,
    alt: 'Warehouse Managers list with an Add New Manager button. Columns: name with initials avatar, email and phone (both blurred here), status (Active, Inactive or Pending), last updated and edit and delete actions.',
  },
  'customer-warehouses': {
    ...WIDE,
    h: 929,
    caption: 'Customer portal: the customer’s warehouse locations',
    label: `${CUSTOMER} Addresses and names blurred.`,
    alt: 'Warehouses page in the customer portal, with an Add Warehouse button. Six cards, Z_AMD-2, Z_BLR-5, Z_BLR-7, Z_CHN-2, Z_DEL-3 and Z_GGN-2, each with an address (blurred here), business type tags CPC and Hyperpure, a manager name (blurred) and edit and delete icons.',
  },
} satisfies Record<string, { w: number; h: number; small: number; caption: string; label: string; alt: string }>

type Shot = keyof typeof shots
const order = Object.keys(shots) as Shot[]
const items: ImageItem[] = order.map((slug) => ({ slug, src: `${DIR}/${slug}`, ...shots[slug] }))

const DESK_SIZES = '(max-width: 760px) 100vw, 900px'
const ZOOM_SIZES = '(max-width: 760px) 70vw, 260px'
const GRID_SIZES = '(max-width: 760px) 100vw, 440px'

/** A screen that opens the enlarged view */
function Screen({ slug, open, sizes = DESK_SIZES, eager }: {
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
          srcSet={shot.small < shot.w ? `${src}-800.webp ${shot.small}w, ${src}-1800.webp ${shot.w}w` : undefined}
          sizes={shot.small < shot.w ? sizes : undefined}
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

/** One full-width screen with an optional tag above and its caption below */
function Wide({ slug, tag, final, open, eager }: { slug: Shot; tag?: string; final?: boolean; open: (i: number) => void; eager?: boolean }) {
  return (
    <figure className="sw-baseline">
      {tag && <p className={`cp-pair__tag${final ? ' cp-pair__tag--final' : ''}`}>{tag}</p>}
      <Screen slug={slug} open={open} eager={eager} />
      <figcaption className="sw-phones__cap">{shots[slug].caption}</figcaption>
    </figure>
  )
}

/** A wide screen beside a close-up of part of it */
function WithZoom({ wide, zoom, open }: { wide: Shot; zoom: Shot; open: (i: number) => void }) {
  return (
    <div className="sw-pair__grid">
      <figure className="sw-pair__desk">
        <Screen slug={wide} open={open} />
        <figcaption className="sw-phones__cap">{shots[wide].caption}</figcaption>
      </figure>
      <figure className="sw-pair__phone">
        <Screen slug={zoom} open={open} sizes={ZOOM_SIZES} />
        <figcaption className="sw-phones__cap">{shots[zoom].caption}</figcaption>
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

/** The four portals, as the case study defines them */
const portals = [
  { name: 'Admin', role: 'Control and monitoring', body: 'Every order, inventory, freezing station, customer, device and user, with dashboards and billing.' },
  { name: 'Warehouse manager', role: 'Operations', body: 'Orders for their own freezing station, driver assignment, end-trip requests and POD approval.' },
  { name: 'Delivery', role: 'Execution', body: 'Pickups and deliveries, status updates, and uploading the Proof of Delivery (POD).' },
  { name: 'Customer', role: 'Experience', body: 'Placing orders, following deliveries, and managing their own warehouse locations.' },
] as const

/** One order, start to finish, as the case study lays it out */
const flow = [
  { who: 'Customer', name: 'Order', body: 'Placed in the customer portal' },
  { who: 'Platform', name: 'Warehouse', body: 'Assigned to a warehouse' },
  { who: 'Station manager', name: 'Driver', body: 'Driver assigned from the station’s list' },
  { who: 'Driver', name: 'Delivery', body: 'Delivered, POD uploaded' },
  { who: 'Check + manager', name: 'POD approval', body: 'Verified, then approved or rejected' },
  { who: 'Platform', name: 'Completed', body: 'The order closes' },
] as const

function Flow() {
  return (
    <figure className="cp-flow-wrap">
      <p id="flow-label" className="dv-diagram-label">How one order moves through the four portals</p>
      <ol className="cp-flow t9-flow" aria-labelledby="flow-label">
        {flow.map((s, i) => (
          <li key={s.name} className={`cp-flow__step ${s.name === 'POD approval' ? 'cp-flow__step--ack' : 'cp-flow__step--list'}`}>
            <span className="cp-flow__who">{s.who}</span>
            <strong className="cp-flow__name"><span className="cp-flow__num">{i + 1}</span> {s.name}</strong>
            <span className="cp-flow__body">{s.body}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

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

export default function Tan90() {
  useTitle('TAN90 — Moving a cold-chain operation from Excel to one platform | Jb Yashvi')
  const { open, lightbox } = useLightbox(items)

  return (
    <article className="dv">
      <header className="dv-top">
        <div className="dv-shell__inner">
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
          <p className="dv-top__type">TAN90 · Cold-chain logistics · Client project through Heizen</p>
          <h1 className="dv-top__title">Moving a cold-chain operation from Excel to one platform</h1>
          <p className="dv-top__lede">
            Tan90 moves temperature-sensitive goods between freezing stations, warehouses and customers, and it ran
            on spreadsheets. I designed the platform that replaced them: four role-based portals sharing one order
            flow, from placing an order to approving its Proof of Delivery.
          </p>
          <div className="dv-top__grid">
            <dl className="dv-top__meta">
              <div>
                <dt>Role</dt>
                <dd>Product design, UX/UI</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>6–8 weeks, 2025</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>Web application</dd>
              </div>
              <div>
                <dt>Scope</dt>
                <dd>Admin, warehouse manager, delivery and customer portals</dd>
              </div>
            </dl>
            <div className="dv-signal">
              <p className="dv-signal__kind">The rule it was built around</p>
              <p className="dv-signal__text">
                <mark>No order closes without an approved POD.</mark> An order is finished when its proof of delivery
                is checked and approved, not when the truck arrives.
              </p>
              <p className="dv-signal__note">
                Screens are from my TAN90 case study. Customer names, people’s names, contact details, addresses and vehicle numbers are blurred.
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
              <Head id="overview" kicker="Overview" title="Four portals, one order flow.">
                <p>
                  Cold-chain logistics has little room for delay: stock has to stay frozen or chilled, and every order
                  passes through several hands. Through Heizen, I designed TAN90’s platform across{' '}
                  <mark>admin, warehouse manager, delivery and customer portals</mark>, covering orders, inventory,
                  freezing stations, delivery coordination and POD approval, through design handoff.
                </p>
              </Head>
              <ul className="sw-stats" aria-label="The work in numbers">
                <li><strong>4</strong> role-based portals on one platform</li>
                <li><strong>8</strong> modules in the admin portal</li>
                <li><strong>3</strong> approval queues built on one pattern</li>
                <li><strong>1</strong> rule: an order closes only on an approved POD</li>
              </ul>
              <dl className="dv-facts" aria-label="Project at a glance">
                <div>
                  <dt>Client</dt>
                  <dd>TAN90, through Heizen</dd>
                </div>
                <div>
                  <dt>Starting point</dt>
                  <dd>Operations run in Excel</dd>
                </div>
                <div>
                  <dt>My part</dt>
                  <dd>Product design across all four portals</dd>
                </div>
                <div>
                  <dt>Timeline</dt>
                  <dd>6–8 weeks</dd>
                </div>
              </dl>
              <Wide slug="admin-dashboard" open={open} eager />
            </section>

            {/* The problem */}
            <section id="problem" className="dv-sec" aria-labelledby="problem-title" tabIndex={-1}>
              <Head id="problem" kicker="The problem" title="An operation spread across spreadsheets.">
                <p>
                  Before the platform, the client <mark>managed operations in Excel</mark>. Orders, stock, drivers and
                  approvals lived in separate places, so nobody had one view of where an order stood. I gathered the
                  requirements through client calls and discussions with the PM, and they pointed at the same few
                  breaks:
                </p>
              </Head>
              <ul className="ticks t9-problems">
                <li>Fragmented systems, with no single record of an order</li>
                <li>No real-time view of orders, stock or deliveries</li>
                <li>Approvals and dispatch held up waiting on people</li>
                <li>Heavy manual checking, above all of proof of delivery</li>
                <li>Loose coordination between warehouse, drivers and customers</li>
              </ul>
              <p className="t9-note">
                The project was a new platform, not a redesign: every role needed a place to work, and every order
                needed one shared state they could all read.
              </p>
            </section>

            {/* How it fits together */}
            <section id="system" className="dv-sec" aria-labelledby="system-title" tabIndex={-1}>
              <Head id="system" kicker="How it fits together" title="Each role gets its own portal, built around the same order.">
                <p>
                  I started by defining the roles, then mapped what each one does to an order and what it needs to
                  see. That gave four portals, with admin at the centre overseeing the rest.
                </p>
              </Head>
              <ul className="t9-portals" aria-label="The four portals">
                {portals.map((p) => (
                  <li key={p.name}>
                    <p className="t9-portals__role">{p.role}</p>
                    <h3 className="dv-h3">{p.name}</h3>
                    <p>{p.body}</p>
                  </li>
                ))}
              </ul>
              <Wide slug="ecosystem" open={open} />
              <Flow />
            </section>

            {/* Three key design decisions */}
            <section id="decisions" className="dv-sec" aria-labelledby="decisions-title" tabIndex={-1}>
              <Head id="decisions" kicker="Three key design decisions" title="Make the next action obvious to whoever holds the order.">
                <p>With four roles touching every order, most of the work was deciding what each one sees first.</p>
              </Head>
              <ol className="sw-decisions">
                <li className="sw-decision">
                  <h3 className="dv-h3"><span className="dv-num">A</span> Approvals as a queue, decided from the row</h3>
                  <WithZoom wide="inventory-requests" zoom="quick-actions" open={open} />
                  <Decision
                    need="Freezing stations raise inventory requests that admin has to approve or reject, alongside everything else admin oversees. Station managers have their own queues for drivers’ end-trip requests and PODs."
                    did="Each queue is one table: request ID, type, station, quantity, a status pill and the request date, with filters for asset, station and status. Every row ends in a menu with View Details, Approve and Reject. I used the same pattern for inventory requests, driver end-trip requests and POD approvals."
                    intent="To let people clear a queue without opening each request, and to learn the pattern once for all three queues."
                    tradeoff="Each decision sits one tap behind the row menu, and the screens don’t show a bulk approve."
                  />
                </li>
                <li className="sw-decision">
                  <h3 className="dv-h3"><span className="dv-num">B</span> A station-level order list that flags what’s missing</h3>
                  <Wide slug="station-orders" tag="Warehouse manager portal" final open={open} />
                  <Decision
                    need="Admin sees every order across every station. A station manager only needs their own station’s orders, and above all the ones still missing a driver."
                    did="A Freezing Station Orders list scoped to the manager’s station, with status and date filters. The driver column shows the assigned driver, or a red Not Assigned flag. Delivery dates carry the morning or evening slot."
                    intent="To make unassigned orders stand out in a list that is mostly assigned."
                    tradeoff="Managers see only their own station; anything across stations stays with admin."
                  />
                </li>
                <li className="sw-decision">
                  <h3 className="dv-h3"><span className="dv-num">C</span> One set of order statuses, shared by every portal</h3>
                  <Wide slug="admin-orders" tag="Admin portal" final open={open} />
                  <Decision
                    need="An order passes through the customer, admin, the station, a driver and an approval step. Each of them has to know where it is without asking anyone."
                    did="One sequence of order statuses, from Confirmed and Driver Assigned through In Transit and POD Uploaded to Warehouse Approval Pending, shown as colour-coded pills in the same status column on admin and station tables."
                    intent="So every role reads the same state for the same order, and a stuck order is visible from any portal."
                    tradeoff="The pills use the system’s own status names in capitals, which read less naturally than plain words."
                  />
                </li>
              </ol>
              <More title="Also designed: inventory, end-trip requests, managers and the customer portal">
                <h3 className="dv-h3">Asset inventory</h3>
                <p>Admin tracks reusable cold-chain assets by stock state and by category, frozen or chiller.</p>
                <Wide slug="asset-inventory" open={open} />
                <h3 className="dv-h3 cp-gap">Driver end-trip requests</h3>
                <p>The second queue that uses decision A’s pattern, for station managers closing out drivers’ trips.</p>
                <Wide slug="driver-requests" open={open} />
                <h3 className="dv-h3 cp-gap">Warehouse managers and the customer portal</h3>
                <p>
                  Managers are listed with their status and contact details. Customers see their own warehouse
                  locations, each tagged by business type and assigned a manager.
                </p>
                <div className="dv-compare t9-grid">
                  <figure className="dv-compare__col">
                    <Screen slug="warehouse-managers" open={open} sizes={GRID_SIZES} />
                    <figcaption className="sw-phones__cap">{shots['warehouse-managers'].caption}</figcaption>
                  </figure>
                  <figure className="dv-compare__col">
                    <Screen slug="customer-warehouses" open={open} sizes={GRID_SIZES} />
                    <figcaption className="sw-phones__cap">{shots['customer-warehouses'].caption}</figcaption>
                  </figure>
                </div>
              </More>
            </section>

            {/* POD approval */}
            <section id="pod" className="dv-sec" aria-labelledby="pod-title" tabIndex={-1}>
              <Head id="pod" kicker="POD approval" title="Delivered isn’t done until the proof is approved.">
                <p>
                  Proof of delivery took the most manual checking in the old process. In the platform,{' '}
                  <mark>an order closes only once its POD is approved</mark>. The product checks the delivery data
                  first, so the warehouse manager steps in only where a person is needed.
                </p>
              </Head>
              <ol className="t9-pod" aria-label="The POD checklist">
                <li><strong>Upload.</strong> The driver uploads the POD at delivery.</li>
                <li><strong>Check.</strong> An automated AI check validates the delivery data.</li>
                <li><strong>Verify.</strong> The warehouse manager reviews it where needed, from the POD queue.</li>
                <li><strong>Close.</strong> Once approved, the order is completed.</li>
              </ol>
              <Wide slug="pod-requests" tag="Warehouse manager portal" final open={open} />
              <p className="t9-note">
                The POD queue uses the same row menu as every other queue, with View POD in place of View Details. A
                rejected POD keeps the order open, so it can’t quietly count as delivered.
              </p>
            </section>

            {/* Delivery */}
            <section id="delivery" className="dv-sec" aria-labelledby="delivery-title" tabIndex={-1}>
              <Head id="delivery" kicker="Delivery" title="Designed across four portals, handed off to build." />
              <ol className="sw-outcomes">
                <li><strong>Designed</strong> the admin, warehouse manager, delivery and customer portals around one order flow.</li>
                <li><strong>Standardised</strong> one queue pattern and one set of statuses across the portals.</li>
                <li><strong>Handed off</strong> the designs for development.</li>
              </ol>
              <dl className="dv-results">
                <div>
                  <dt>Timeline</dt>
                  <dd>6–8 weeks, 2025</dd>
                </div>
                <div>
                  <dt>Built with</dt>
                  <dd>Next.js and Nest.js monorepo, MongoDB, Docker</dd>
                </div>
              </dl>
            </section>

            {/* Reflection */}
            <section id="reflection" className="dv-sec" aria-labelledby="reflection-title" tabIndex={-1}>
              <Head id="reflection" kicker="Reflection" title="Shared patterns did more than new screens.">
                <p>
                  With four roles and many screens, the useful work was <mark>repeating a few decisions
                  everywhere</mark>: one queue pattern, one set of statuses, one rule for when an order is done.
                  Someone who learns one portal can read the others.
                </p>
              </Head>
              <h3 className="dv-h3">What I’d test next</h3>
              <ul className="ticks">
                <li>Can station managers spot unassigned orders at a glance on a busy day?</li>
                <li>Do the status names read clearly to roles outside admin?</li>
                <li>At high volumes, is one tap behind a row menu enough, or do queues need bulk approve?</li>
                <li>When the AI check flags a POD, can the manager see why?</li>
              </ul>
              <h3 className="dv-h3 cp-gap">About the screens</h3>
              <ul className="sw-sources">
                <li>All screens are taken from my TAN90 case study.</li>
                <li>Customer company names, drivers’ and signed-in users’ names, email addresses, phone numbers, warehouse addresses and vehicle numbers are blurred.</li>
                <li>Delivery portal and customer ordering screens aren’t included here.</li>
                <li>The requirements came from client calls and the PM, not a formal user research study.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {lightbox}
      <NextProject slug="tan90" withPrevious />
    </article>
  )
}
