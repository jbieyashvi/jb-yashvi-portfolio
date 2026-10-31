import CaseNav from '../components/CaseNav'
import CaseStudyViewer from '../components/CaseStudyViewer'
import NextProject from '../components/NextProject'
import NutrioStory from '../components/NutrioStory'
import ProjectHeader from '../components/ProjectHeader'
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
} as const

export default function CaseStudyPage({ slug }: { slug: 'nutrio' }) {
  const c = content[slug]
  useTitle(`${c.name}, product design case study | Jb Yashvi`)
  return (
    <article>
      <ProjectHeader name={c.name} type={c.type} intro={c.intro} meta={[...c.meta]} actions={c.actions} />
      <CaseNav sections={nutrioSections} />
      <NutrioStory />
      <div id="full" tabIndex={-1}>
        <CaseStudyViewer id={slug} name={c.name} pdf={c.pdf} pdfSize={c.pdfSize} />
      </div>
      <NextProject slug={slug} />
    </article>
  )
}
