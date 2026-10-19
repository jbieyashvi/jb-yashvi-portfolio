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
    company: 'Heizen',
    role: 'Senior Product Designer',
    from: 'May 2025',
    to: 'Present',
    current: true,
    summary:
      'Designed web and mobile experiences across multiple client projects in supply chain, logistics, procurement and operations, translating complex workflows into user flows, interfaces and interactive prototypes.',
    details: [
      'TAN90: Designed a cold-chain logistics platform to bring Excel-based and manual workflows into a shared digital workspace, covering orders, inventory and delivery coordination across four role-based portals through design handoff.',
      'CMP Autobot for Compass Group India: Created the design system for an ingredient-to-article mapping workspace and built its interface using AI tools, supporting human review of suggested matches.',
      'NUTRIO: Designed a healthy-meal ordering and subscription product for gym-goers and mothers planning children’s lunches, covering the customer app, delivery partner app, kitchen panel and admin dashboard through design handoff.',
    ],
  },
  {
    company: 'Freelance',
    role: 'Graphic & Product Designer',
    from: '2020',
    to: '2025',
    summary:
      'Delivered graphic design work from 2020 and product design engagements from 2023, translating client requirements into brand identities, user flows, web and mobile interfaces, and reusable design systems.',
    details: [],
  },
  {
    company: 'Sneaco',
    role: 'Product Designer · Part-time',
    from: 'Oct 2023',
    to: 'Oct 2024',
    summary:
      'Designed end-to-end product interfaces, using competitive research to inform features; built and maintained a design system to support consistency and developer handoff.',
    details: [],
  },
  {
    company: 'Urban Culture',
    role: 'UI/UX Design Intern',
    from: 'May 2024',
    to: 'Jul 2024',
    summary: 'Designed an admin panel for operational workflows and created social media content aligned with the brand identity.',
    details: [],
  },
  {
    company: 'Polo',
    role: 'Design Intern',
    from: 'Oct 2023',
    to: 'Dec 2023',
    summary:
      'Contributed to digital product design and created high-fidelity interactive prototypes aligned with business requirements and user needs.',
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
