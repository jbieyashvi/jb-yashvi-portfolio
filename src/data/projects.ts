export type Track = 'designed' | 'ai' | 'system'

export interface Project {
  slug: string
  name: string
  track: Track
  type: string
  summary: string
  contribution: string
  /** Base path; files exist as `${cover}-640` and `${cover}-1200` in .avif and .webp
   *  (made by scripts/optimize-images.mjs from the master `${cover}.png`) */
  cover: string
  coverAlt: string
  /** Intrinsic cover size, used to reserve space before the image loads */
  coverSize?: [number, number]
  /** Device mockup used as the project-page hero */
  mockup?: Mockup
  /** false: the page and next-project links stay, but it is not listed in Selected Work */
  showcased?: boolean
}

/** A real screenshot at its natural pixel size */
export interface Screen { src: string; alt: string; w: number; h: number }

export type Mockup =
  | { device: 'laptop' | 'monitor'; screens: [Screen] }
  | { device: 'phones'; screens: Screen[] }

export const projects: Project[] = [
  {
    slug: 'compass',
    name: 'Compass Group — CMP Autobot',
    track: 'system',
    type: 'Design system & AI-assisted platform',
    summary:
      'A workspace where Compass Group India teams review AI-suggested ingredient-to-article matches, deciding each with Confirm, Reject or Link APL. I created its design system and built it using AI.',
    contribution: 'Created the design system and built the platform using AI.',
    cover: '/work/covers/home/compass',
    coverAlt:
      'The CMP Autobot dashboard in a browser window, beside a card of design tokens: the amber brand colour, Inter, four queue status pills and Confirm and Reject buttons.',
    coverSize: [1600, 1000],
    mockup: {
      device: 'monitor',
      screens: [
        {
          src: '/work/compass/home.webp',
          alt: 'CMP Autobot Current Status dashboard on a desktop monitor: a Today’s Progress gauge with a Continue mapping button, Needs Attention and Needs Transition banners, a row of stat cards, and Work progress cards for the Matches, Likely Matches, No Match and Retired queues.',
          w: 2016,
          h: 1200,
        },
      ],
    },
  },
  {
    slug: 'nutrio',
    name: 'NUTRIO',
    track: 'designed',
    type: 'End-to-end product design',
    summary:
      'A healthy-food ordering and subscription product: customer app, delivery partner app, kitchen panel and admin dashboard.',
    contribution: 'User research and end-to-end UX/UI design, through design handoff. No AI used.',
    cover: '/work/covers/home/nutrio',
    coverAlt: 'A phone on concrete steps showing the Nutrio welcome screen with a yellow Get Started button, beside the NutriO logo.',
    coverSize: [1160, 773],
  },
  {
    slug: 'tan90',
    name: 'TAN90',
    track: 'designed',
    type: 'Multi-portal product design',
    summary:
      'A cold-chain logistics platform, from orders and inventory to delivery. I designed its four portals: admin, warehouse, delivery and customer.',
    contribution: 'Product design across all four portals, from order management to POD approval, through design handoff.',
    cover: '/work/covers/home/tan90',
    coverAlt: 'A tablet with a keyboard showing the Tan90 admin dashboard.',
    coverSize: [1279, 853],
  },
  {
    slug: 'medurun',
    name: 'Medurun',
    track: 'ai',
    type: 'Ambulance-booking platform landing page',
    summary: 'The public landing page for an ambulance-booking and emergency healthcare-mobility platform.',
    contribution: 'Built the landing page fully with AI. Live on the web.',
    cover: '/work/covers/home/medurun',
    coverAlt: 'A laptop showing the Medurun landing page with an ambulance on a city street.',
    coverSize: [1121, 1403],
    mockup: {
      device: 'laptop',
      screens: [
        {
          src: '/work/medurun/hero.webp',
          alt: 'The live Medurun landing page on a laptop: an ambulance on a night city street under the headline “Emergency support, delivered faster than ever.”',
          w: 2000,
          h: 1250,
        },
      ],
    },
  },
  {
    slug: 'iica',
    name: 'IICA',
    track: 'ai',
    type: 'Creator collaboration mobile app',
    summary: 'A mobile app for creators, artists and influencers: discovery, profiles, collaboration, events, classes and shopping.',
    contribution: 'Built the app’s interactive prototype fully with AI.',
    cover: '/work/covers/home/iica',
    coverAlt: 'A phone held in a hand showing the IICA home screen.',
    coverSize: [1449, 1085],
    mockup: {
      device: 'phones',
      screens: [
        { src: '/work/iica/home.webp', alt: 'IICA home screen with a creator banner, artist spotlight and quick actions.', w: 780, h: 1688 },
        { src: '/work/iica/profile.webp', alt: 'Artist profile for Ananya Rao with a Request Collaboration button.', w: 780, h: 1688 },
        { src: '/work/iica/matches.webp', alt: 'Swipeable match card for a dancer, marked 92% match.', w: 780, h: 1688 },
      ],
    },
  },
  {
    slug: 'retina',
    showcased: false,
    name: 'Retina.ai',
    track: 'ai',
    type: 'Store staff mobile app',
    summary: 'A store staff app for finding assigned articles, scanning barcodes and capturing product images.',
    contribution: 'Built the interactive prototype of this store staff app, one app within the larger Retina.ai project, fully with AI.',
    cover: '/work/covers/home/retina',
    coverAlt: 'An upright phone showing the Retina.ai My Articles screen.',
    coverSize: [1457, 1080],
    mockup: {
      device: 'phones',
      screens: [
        { src: '/work/retina/articles.webp', alt: 'My Articles list with To scan, Mapped and Loose Items tabs, and a failed upload flagged at the top.', w: 680, h: 1400 },
        { src: '/work/retina/capture.webp', alt: 'Capture screen with Front, Back and Barcode steps.', w: 680, h: 1400 },
      ],
    },
  },
  {
    slug: 'flowtech',
    showcased: false,
    name: 'Flowtech',
    track: 'ai',
    type: 'RFQ-to-PO web platform',
    summary:
      'An RFQ-to-PO platform that takes a deal from inquiry and quotation to PO verification and sales order. I designed its interface fully using AI.',
    contribution: 'Designed the platform’s interface fully using AI, shown here as a frontend prototype.',
    cover: '/work/covers/home/flowtech',
    coverAlt: 'A laptop showing the Flowtech RFQ and PO inbox.',
    coverSize: [1254, 1254],
    mockup: {
      device: 'monitor',
      screens: [
        {
          src: '/work/flowtech/dashboard.webp',
          alt: 'Flowtech Operations Dashboard on a desktop monitor: a conversion pipeline from total inquiries received through quotes sent, follow-up, budgetary, negotiation and finalise stages to sales orders sent, above an Overdue Tasks table and an Action Required list.',
          w: 1512,
          h: 801,
        },
      ],
    },
  },

]

/** A personal project: its page at /work/{slug} shows the PDF itself. Files live in
 *  public/work/personal/: `${slug}.pdf`, its page slices in `${slug}/` (scripts/slice-pdfs.mjs)
 *  and a thumbnail cut from it, `${slug}-thumb.avif` / `.webp` (scripts/pdf-thumbs.mjs). */
export interface PersonalProject { slug: string; name: string; subtitle: string }

export const personalProjects: PersonalProject[] = [
  { slug: 'drive-sharing', name: 'Google Drive access', subtitle: 'Keep a few files private' },
  { slug: 'gema', name: 'GEMA', subtitle: 'Care between appointments' },
  { slug: 'roam', name: 'Roam', subtitle: 'AI travel planner' },
  { slug: 'zensenta', name: 'Zensenta', subtitle: 'Clinical workspace' },
  { slug: 'influish', name: 'Influish', subtitle: 'Creator redesign' },
  { slug: 'relay', name: 'Relay', subtitle: 'Clearer handoff from Sales to CS' },
]

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)!

/** Shown first in Selected Work as large cards, and left out of the index below them. Covers
 *  live in public/work/featured/ as `${slug}-640` / `-1200`, .avif and .webp (scripts/featured-covers.mjs). */
export interface FeaturedProject { slug: string; name: string; kind: string; summary: string }

export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'drive-sharing',
    name: 'Google Drive access',
    kind: 'Personal project · Product study',
    summary: 'A guided way to restrict a selected file, preserve team access, and review the consequences.',
  },
  {
    slug: 'tan90',
    name: 'TAN90',
    kind: 'Client project · Designed by me',
    summary: 'A cold-chain logistics platform. I designed its four portals: admin, warehouse, delivery and customer.',
  },
  {
    slug: 'gema',
    name: 'GEMA',
    kind: 'Personal project · Mobile app concept',
    summary: 'A mobile app concept that keeps everyday care tasks together, including reminders and visit notes.',
  },
]

/** The client projects visitors are shown, in order: Selected Work, résumé links and the
 *  next-project sequence all follow this list. Unlisted pages (showcased: false) keep their
 *  routes but are never linked to. */
export const clientProjects = projects.filter((p) => p.showcased !== false)

/** Every project visitors are shown, as one Next-project loop: the client projects, then the
 *  personal ones, then back to the first client project. */
export const projectSequence: { slug: string; name: string }[] = [...clientProjects, ...personalProjects]

/** The project after `slug` in projectSequence, wrapping to the start. An unlisted client page
 *  (showcased: false) leads to the next listed client project after it. */
export const nextProject = (slug: string): { slug: string; name: string } => {
  const i = projectSequence.findIndex((p) => p.slug === slug)
  if (i !== -1) return projectSequence[(i + 1) % projectSequence.length]
  const j = projects.findIndex((p) => p.slug === slug)
  return projects.slice(j + 1).find((p) => p.showcased !== false) ?? projectSequence[0]
}

/** The project before `slug` in projectSequence, wrapping to the end */
export const previousProject = (slug: string): { slug: string; name: string } => {
  const i = projectSequence.findIndex((p) => p.slug === slug)
  return projectSequence[(Math.max(i, 0) - 1 + projectSequence.length) % projectSequence.length]
}

export const contact = {
  email: 'jbieyashvi011@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jb-yashvi/',
  /** 30-minute call booking, opened in a new tab */
  calendly: 'https://calendly.com/jbieyashvi011/30min',
  /** Prototype demos */
  instagram: 'https://www.instagram.com/jbie_uiux/',
  /** Résumé PDF in public/resume, opened in a new tab (not a forced download). BASE_URL keeps
   *  it working if the site is ever served from a subpath, and from any route. */
  resume: `${import.meta.env.BASE_URL}resume/Jb-Yashvi-Resume.pdf`,
}
