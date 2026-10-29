/** Context before the TAN90 PDF. The portal roles and the order flow come from the TAN90 case
 *  study PDF; the Excel starting point and how requirements were gathered are confirmed by me. */
const portals = [
  { name: 'Admin', body: 'Oversight of orders, inventory and operations, including the freezing stations.' },
  { name: 'Warehouse manager', body: 'Orders at station level, delivery coordination and approval tasks, including POD approval.' },
  { name: 'Delivery', body: 'Carrying out deliveries, updating status and submitting the Proof of Delivery (POD).' },
  { name: 'Customer', body: 'Placing orders and following their deliveries.' },
]

export default function Tan90Story() {
  return (
    <>
      <section id="start" className="wrap split t90" aria-labelledby="start-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="start-title" className="section-title">Starting with Excel</h2>
        </div>
        <div className="split__media t90__copy">
          <p>
            Before TAN90 had a dedicated platform, the client <mark>managed operations in Excel</mark>. The project was to
            design a <mark>new platform</mark> connecting admin, warehouse, delivery and customer workflows.
          </p>
        </div>
      </section>

      <section id="requirements" className="wrap split t90" aria-labelledby="requirements-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="requirements-title" className="section-title">How I gathered requirements</h2>
        </div>
        <div className="split__media t90__copy">
          <p>
            I gathered requirements through <mark>client calls and discussions with the PM</mark>. This was stakeholder-led
            requirements gathering rather than a formal user research study.
          </p>
          <p>
            The design scope covered orders, inventory, freezing stations, delivery coordination and POD approval across
            four portals.
          </p>
        </div>
      </section>

      <section id="platform" className="wrap split t90" aria-labelledby="platform-title" tabIndex={-1}>
        <div className="split__text">
          <h2 id="platform-title" className="section-title">How the platform fits together</h2>
          <p>Four role-based portals share <mark>one order flow</mark>.</p>
        </div>
        <div className="split__media">
          <ul className="surfaces">
            {portals.map((p) => (
              <li key={p.name}>
                <h3>{p.name}</h3>
                <p>{p.body}</p>
              </li>
            ))}
          </ul>
          <h3 className="t90__flow-title">From order to closure</h3>
          <ol className="steps">
            <li><strong>Order.</strong> The customer places an order.</li>
            <li><strong>Assignment.</strong> The order is assigned to a warehouse, where the manager sees it at station level.</li>
            <li><strong>Delivery.</strong> The warehouse manager coordinates the delivery. The driver delivers and uploads the POD.</li>
            <li><strong>POD approval.</strong> AI-powered verification checks the delivery data, and the warehouse manager approves or rejects the POD.</li>
            <li><strong>Closure.</strong> The order closes <mark>only once its POD is approved</mark>, not when the goods arrive.</li>
          </ol>
        </div>
      </section>
    </>
  )
}
