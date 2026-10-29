import CaseNav from '../components/CaseNav'
import CaseStudyViewer from '../components/CaseStudyViewer'
import NextProject from '../components/NextProject'
import NutrioStory from '../components/NutrioStory'
import ProjectHeader from '../components/ProjectHeader'
import Tan90Story from '../components/Tan90Story'
import useTitle from '../components/useTitle'

const nutrioSections = [
  { id: 'glance', label: 'At a glance' },
  { id: 'problem', label: 'User & problem' },
  { id: 'flow', label: 'Workflow' },
  { id: 'decisions', label: 'Decisions' },
  { id: 'contrib', label: 'My role' },
  { id: 'outcome', label: 'Outcome' },
  { id: 'full', label: 'Full case study' },
]

const content = {
  nutrio: {
    name: 'NUTRIO',
    type: 'End-to-end product design',
    pdf: '/case-studies/nutrio-case-study.pdf',
    pdfSize: '13 MB',
    intro: (
      <>
        <p className="lede">
          Nutrio is a healthy-food ordering and subscription product. People can order a meal now or subscribe to scheduled
          meal plans, so eating well stops depending on daily planning.
        </p>
        <p>
          I handled the user research and the end-to-end UX/UI design across four connected products: the customer app,
          the delivery partner app, the kitchen panel and the admin dashboard, through design handoff. AI was not used in this work.
        </p>
      </>
    ),
    meta: [
      { label: 'My role', value: 'User research, end-to-end UX/UI design' },
      { label: 'Scope', value: 'Customer app, delivery partner app, kitchen panel, admin dashboard' },
      { label: 'Year', value: '2025' },
      { label: 'AI use', value: 'None' },
    ],
    actions: null,
  },
  tan90: {
    name: 'TAN90',
    type: 'Multi-portal product design',
    pdf: '/case-studies/tan90-case-study.pdf',
    pdfSize: '8 MB',
    intro: (
      <>
        <p className="lede">
          Tan90 is a cold-chain logistics platform. It connects admin, warehouse managers, delivery operations and customers
          in one system, <mark>from placing an order to approving its Proof of Delivery</mark>.
        </p>
        <p>
          I designed the platform across <mark>its four portals</mark>, covering order management, inventory, freezing stations, delivery
          coordination and POD approval, through design handoff.
        </p>
        <p className="aside-note">
          The design includes an AI-powered POD verification feature for the product’s users; the design itself is my own
          work, not generated with AI.
        </p>
      </>
    ),
    meta: [
      { label: 'My role', value: 'Product design' },
      { label: 'Portals', value: 'Admin, warehouse manager, delivery, customer' },
      { label: 'Key workflows', value: 'Orders, inventory, freezing stations, delivery coordination, POD approval' },
      { label: 'Year', value: '2025' },
    ],
    actions: null,
  },
} as const

export default function CaseStudyPage({ slug }: { slug: 'nutrio' | 'tan90' }) {
  const c = content[slug]
  useTitle(`${c.name}, product design case study | Jb Yashvi`)
  return (
    <article className={slug === 'tan90' ? 't90-page' : undefined}>
      <ProjectHeader name={c.name} type={c.type} intro={c.intro} meta={[...c.meta]} actions={c.actions} />
      {slug === 'nutrio' && (
        <>
          <CaseNav sections={nutrioSections} />
          <NutrioStory />
        </>
      )}
      {slug === 'tan90' && <Tan90Story />}
      <div id="full" tabIndex={-1}>
        <CaseStudyViewer id={slug} name={c.name} pdf={c.pdf} pdfSize={c.pdfSize} lead={slug === 'tan90'} />
      </div>
      <NextProject slug={slug} />
    </article>
  )
}
