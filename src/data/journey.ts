/*
 * My journey: the Experience section of the latest résumé (public/resume/Jb-Yashvi-Resume.pdf),
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
      'Owned end-to-end web and mobile product design, translating business requirements into user flows, information architecture, high-fidelity UI and developer-ready designs.',
    details: [
      'Simplified a client workflow by reducing steps and clarifying information hierarchy; refined the design through internal team testing to make tasks easier to follow.',
      'Built reusable components and standardized tables, forms and status patterns to support consistent experiences and clearer design handoff.',
      'Guided client design reviews with alternative solutions and explicit trade-offs; incorporated feedback to align design decisions with business needs.',
      'Used AI-assisted tools to explore workflow edge cases and build interactive prototypes for client reviews and engineering discussions.',
      'Partnered with developers through handoff and implementation reviews to resolve usability issues and maintain design intent.',
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
