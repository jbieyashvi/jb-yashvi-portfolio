import '../case-rv.css'
import DeviceMockup from '../components/DeviceMockup'
import External from '../components/External'
import NextProject from '../components/NextProject'
import ProjectHeader from '../components/ProjectHeader'
import useTitle from '../components/useTitle'
import { getProject } from '../data/projects'

const LIVE = 'https://jbieyashvi.github.io/RFQ-to-PO-Platform/dashboard'

/** The RFQ-to-PO process, in the order the interface walks a deal through it */
const stages = [
  {
    title: 'Inquiries arrive in one inbox',
    body: 'Customer RFQs land in a global inbox, so every new inquiry starts from the same place before it becomes a quotation.',
  },
  {
    title: 'Master data feeds every quote',
    body: 'Products and commercial terms are kept as master data, so a quotation draws on the same reference records each time.',
  },
  {
    title: 'Quotations are created and revised',
    body: 'Quotes are built from the inquiry and the master data. Revisions are kept as a separate area rather than overwriting the original.',
  },
  {
    title: 'The customer’s PO is checked against the quote',
    body: 'When a purchase order comes back, it is verified against the quotation it answers before anything moves forward.',
  },
  {
    title: 'Sales orders and ERP handoff',
    body: 'A verified PO becomes a sales order, followed by a handoff screen for the ERP.',
  },
]

const workflows = [
  {
    src: '/work/flowtech/quotation.webp',
    title: 'Tracking every quotation',
    body: 'The quotation list tags each quote to a sales office and shows its status, stage and value, with filters by customer, stage and office.',
    alt: 'Flowtech List of Quotations: filters for quotation number, customer, status, stage and sales office above a table of quotations with status and stage dropdowns, values and dates.',
  },
  {
    src: '/work/flowtech/verification.webp',
    title: 'Verifying a PO against its quotation',
    body: 'The customer’s PO email sits beside a field-by-field comparison with the accepted quotation. Mismatches are flagged, and sales-order generation stays locked until they are resolved.',
    alt: 'Flowtech PO vs Quote verification: the customer’s purchase-order email on the left, and on the right a table comparing the accepted quotation with the customer PO, with quantity, payment terms, delivery terms and total value marked as mismatches.',
  },
  {
    src: '/work/flowtech/sales-order.webp',
    title: 'Handing sales orders to the ERP',
    body: 'Approved sales orders are listed with their customer PO, source and value. Each shows an ERP status, and pending orders have a Submit to ERP action.',
    alt: 'Flowtech ERP Handoff: a table of sales orders with customer, customer PO, source, sales office, owner, order value and ERP status, some marked Submitted and two Pending with a Submit to ERP button.',
  },
]

export default function Flowtech() {
  useTitle('Flowtech, RFQ-to-PO web platform | Jb Yashvi')
  return (
    <article className="rv-case">
      <ProjectHeader
        name="Flowtech"
        type="RFQ-to-PO web platform"
        intro={
          <>
            <p className="lede">
              Flowtech is a web platform that takes a deal from a customer’s RFQ to a sales order, connecting inquiries,
              quotations, purchase-order verification and sales-order workflows.
            </p>
            <p>
              I designed the platform’s interface fully using AI. What’s shown here is a frontend prototype of that
              design.
            </p>
          </>
        }
        meta={[
          { label: 'Product', value: 'RFQ-to-PO web platform' },
          { label: 'Shown here', value: 'Frontend prototype' },
          { label: 'Use of AI', value: 'Designed fully using AI' },
        ]}
        actions={<External href={LIVE}>View interactive prototype</External>}
      />

      <section className="wrap showcase" aria-label="Dashboard preview">
        <DeviceMockup mockup={getProject('flowtech').mockup!} tone="paper" eager className="mock--hero" />
      </section>

      <section className="wrap split" aria-labelledby="process-title">
        <div className="split__text">
          <h2 id="process-title" className="section-title">How the interface organizes RFQ to PO</h2>
          <p>
            The operations dashboard sits above the whole process. It shows the conversion pipeline from inquiry to
            order, along with overdue tasks and the actions that need attention.
          </p>
        </div>
        <ol className="split__media stages">
          {stages.map((s) => (
            <li key={s.title} className="stage">
              <h3 className="stage__title">{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="wrap highlights" aria-labelledby="wf-title">
        <h2 id="wf-title" className="section-title">Representative workflows</h2>
        <div className="highlights__list">
          {workflows.map((w) => (
            <figure key={w.title} className="highlight">
              <img src={w.src} alt={w.alt} width={1512} height={801} loading="lazy" decoding="async" />
              <figcaption>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="end-cta">
          <External href={LIVE}>View interactive prototype</External>
        </div>
      </section>

      <NextProject slug="flowtech" />
    </article>
  )
}
