import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { clientProjects, contact, personalProjects, type PersonalProject, type Project } from '../data/projects'
import loadAhead from './loadAhead'

const pad = (v: number) => String(v).padStart(2, '0')
const TAG = { designed: 'Designed by me', ai: 'Made with AI', system: 'Design system + AI build' } as const
const PERSONAL = '/work/personal'

/**
 * Selected work as a compact index: Client Projects and Personal Projects side by side (stacked,
 * client first, on phones). Every row is one link to the project's page: for a personal
 * project, a page showing its PDF; for a client project, its case study.
 */
export default function WorkShowcase() {
  return (
    <div className="wrap windex">
      <h2 id="work-title" className="windex__title" data-reveal>Selected Work</h2>

      <div className="windex__cols" data-reveal>
        <Column id="client-title" title="Client Projects" count={clientProjects.length}>
          {clientProjects.map((p) => <ClientRow key={p.slug} project={p} />)}
        </Column>
        <Column id="personal-title" title="Personal Projects" count={personalProjects.length}>
          {personalProjects.map((p) => <PersonalRow key={p.slug} project={p} />)}
        </Column>
      </div>

      <a className="windex__more" href={contact.instagram} target="_blank" rel="noopener noreferrer">
        More prototype demos on Instagram <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
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
