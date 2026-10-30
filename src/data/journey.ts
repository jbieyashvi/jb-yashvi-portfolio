/*
 * My journey: the Experience section of the latest résumé (public/resume/Jb-Yashvi-Product-Designer-Resume.pdf),
 * in the résumé's own order. Company names, roles, dates and bullet text are copied from it word
 * for word; nothing here is added. The first bullet is the entry's summary, the rest are its
 * details. Some roles overlap, so My journey lists every role with its own dates rather than as
 * a strict sequence.
 */

export interface Role {
  company: string
  role: string
  /** as written on the résumé: a year, or a month and year */
  from: string
  /** as written on the résumé, or 'Present' */
  to: string
  summary: string
  details: string[]
  current?: boolean
}

export const roles: Role[] = [
  {
    company: 'Heizen (Gamma Opengig Work Pvt Ltd)',
    role: 'Product Designer → Senior Product Designer',
    from: 'May 2025',
    to: 'Oct 2026',
    summary:
      'Research and adoption: Centralized Google Forms, Excel and WhatsApp hiring workflows in one actively used platform. Interviewed stakeholders and designed round-wise pipelines, candidate tables with contextual detail drawers, assignments, interview feedback and AI-assisted candidate search.',
    details: [
      'Enterprise mobile design: Enabled employees to track shipments and manage courier assignments without a laptop through Shipway by Unicommerce’s launched mobile app; prioritized essential tracking, returns, KYC and invoicing workflows.',
      'Workflow simplification: Made hidden ingredient-mapping options visible in Compass Group’s tool and replaced double-click interactions with a single-step flow, clarifying available actions; redesign launched.',
      'Product ownership: Led design for launched Nutrio and Step Up products. Owned Nutrio’s subscription flows across customer, admin, kitchen and delivery-partner interfaces as the sole designer; structured Step Up’s trainer, trainee and society management, bookings, payments and society-ledger workflows.',
      'AI product experiences: Redesigned Gema’s patient app and Vela’s task-management tool around AI assistants; both products launched. Created light and dark themes for Vela.',
      'Platform consolidation: Designed Super Fine’s initial unified platform concept, bringing order, automation, operations, recipe and accounting workflows from five separate tools into one experience.',
      'Engineering collaboration: Used AI-assisted prototypes to redesign Red Sox’s dashboard, chatbot and PDF creation/editing modules with developers; changes implemented.',
      'Brand and website design: Designed Heizen’s website theme, hero and selected sections, integrating Shark Tank India recognition; created Nutrio’s logo and packaging and Moss’s initial live landing page.',
    ],
  },
  {
    company: 'Sneaco',
    role: 'Founding Product Designer · Part-time',
    from: 'Oct 2024',
    to: 'Mar 2025',
    summary:
      'Interviewed hostel students and adults about laundry routines, spending and service needs to inform a one-day laundry and ironing service.',
    details: [
      'Defined the initial visual language and reusable UI patterns; collaborated with founders and developers on interactive prototypes and implementation-ready designs.',
    ],
  },
  {
    company: 'Urban Culture',
    role: 'UI/UX Design Intern',
    from: 'May 2024',
    to: 'Jul 2024',
    summary: 'Refined admin-panel experiences with a focus on usability, information hierarchy and visual consistency.',
    details: [],
  },
  {
    company: 'POLO',
    role: 'Product Design Intern',
    from: 'Oct 2023',
    to: 'Dec 2023',
    summary: 'Supported the Senior Product Designer with high-fidelity UI screens and interactive prototypes.',
    details: [],
  },
]

const THIS_YEAR = new Date().getFullYear()

/** the year in a résumé date ("2022", "May 2024", or 'Present' for this year) */
const yearOf = (s: string) => (s === 'Present' ? THIS_YEAR : Number(s.split(' ').at(-1)))

/** the years on the strip: the earliest start through the current year */
export const mapYears = (() => {
  const first = Math.min(...roles.map((r) => yearOf(r.from)))
  return Array.from({ length: THIS_YEAR - first + 1 }, (_, i) => first + i)
})()

/** the years a role covers on the year strip: years only, as the strip shows no months */
export function roleYears(r: Role): number[] {
  return mapYears.filter((y) => y >= yearOf(r.from) && y <= yearOf(r.to))
}
