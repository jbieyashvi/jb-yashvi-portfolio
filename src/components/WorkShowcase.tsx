import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { clientProjects, contact, featuredProjects, personalProjects, type FeaturedProject, type PersonalProject, type Project } from '../data/projects'
import loadAhead from './loadAhead'

const pad = (v: number) => String(v).padStart(2, '0')
const TAG = { designed: 'Designed by me', ai: 'Made with AI', system: 'Design system + AI build' } as const
const PERSONAL = '/work/personal'
const FEATURED = '/work/featured'

const isFeatured = (slug: string) => featuredProjects.some((f) => f.slug === slug)
const otherClient = clientProjects.filter((p) => !isFeatured(p.slug))
const otherPersonal = personalProjects.filter((p) => !isFeatured(p.slug))

/**
 * Selected work: three featured projects as large cards, then the rest as a compact index:
 * Client Projects and Personal Projects side by side (stacked,
 * client first, on phones). Every row is one link to the project's page: for a personal
 * project, a page showing its PDF; for a client project, its case study.
 */
export default function WorkShowcase() {
  return (
    <div className="wrap windex">
      <h2 id="work-title" className="windex__title" data-reveal>Selected Work</h2>

      <ul className="wfeat" aria-label="Featured projects" data-reveal>
        {featuredProjects.map((p) => <FeaturedCard key={p.slug} project={p} />)}
      </ul>

      <div className="windex__cols" data-reveal>
        <Column id="client-title" title="Client Projects" count={otherClient.length}>
          {otherClient.map((p) => <ClientRow key={p.slug} project={p} />)}
        </Column>
        <Column id="personal-title" title="Personal Projects" count={otherPersonal.length}>
          {otherPersonal.map((p) => <PersonalRow key={p.slug} project={p} />)}
        </Column>
      </div>

      <a className="windex__more" href={contact.instagram} target="_blank" rel="noopener noreferrer">
        More prototype demos on Instagram <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

function FeaturedCard({ project: p }: { project: FeaturedProject }) {
  const cover = `${FEATURED}/${p.slug}`
  return (
    <li>
      <Link className={`wcard wcard--${p.slug}`} to={`/work/${p.slug}`}>
        <span className="wcard__media" aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`${cover}-640.avif 640w, ${cover}-1200.avif 1200w`} sizes="(max-width: 760px) 100vw, 33vw" />
            <img
              src={`${cover}-640.webp`}
              srcSet={`${cover}-640.webp 640w, ${cover}-1200.webp 1200w`}
              sizes="(max-width: 760px) 100vw, 33vw"
              alt=""
              width={1200}
              height={800}
              loading="lazy"
              ref={loadAhead}
              decoding="async"
            />
          </picture>
        </span>
        <span className="wcard__kind">{p.kind}</span>
        <span className="wcard__name">
          {p.name} <span className="wrow__arrow wrow__arrow--page" aria-hidden="true">→</span>
        </span>
        <span className="wcard__summary">{p.summary}</span>
      </Link>
    </li>
  )
}

function Column({ id, title, count, children }: { id: string; title: string; count: number; children: ReactNode }) {
  return (
    <section className="windex__col" aria-labelledby={id}>
      <header className="windex__head">
        <h3 id={id} className="windex__label">{title}</h3>
        <span className="windex__count" aria-hidden="true">{pad(count)}</span>
      </header>
      <ul className="windex__list">{children}</ul>
    </section>
  )
}

function PersonalRow({ project: p }: { project: PersonalProject }) {
  const thumb = `${PERSONAL}/${p.slug}-thumb`
  return (
    <li>
      <Link className="wrow" to={`/work/${p.slug}`}>
        <span className="wrow__thumb" aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`${thumb}.avif`} />
            <img src={`${thumb}.webp`} alt="" width={400} height={300} loading="lazy" ref={loadAhead} decoding="async" />
          </picture>
        </span>
        <span className="wrow__text">
          <span className="wrow__name">{p.name}</span>
          <span className="wrow__meta">{p.subtitle}</span>
        </span>
        <span className="wrow__arrow wrow__arrow--page" aria-hidden="true">→</span>
      </Link>
    </li>
  )
}

function ClientRow({ project: p }: { project: Project }) {
  const [w, h] = p.coverSize ?? [1600, 1000]
  return (
    <li>
      <Link className={`wrow wrow--${p.slug}`} to={`/work/${p.slug}`}>
        <span className="wrow__thumb" aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`${p.cover}-640.avif`} />
            <img src={`${p.cover}-640.webp`} alt="" width={w} height={h} loading="lazy" ref={loadAhead} decoding="async" />
          </picture>
        </span>
        <span className="wrow__text">
          <span className="wrow__name">{p.name}</span>
          <span className="wrow__meta">{TAG[p.track]}</span>
        </span>
        <span className="wrow__arrow wrow__arrow--page" aria-hidden="true">→</span>
      </Link>
    </li>
  )
}
