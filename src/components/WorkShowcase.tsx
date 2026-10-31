import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { contact, COVER_V, featuredProjects, moreProjects, type FeaturedProject } from '../data/projects'
import loadAhead from './loadAhead'

const pad = (v: number) => String(v).padStart(2, '0')
const FEATURED = '/work/featured'

type Group = (typeof moreProjects)[number]['group']
type Tile = (typeof moreProjects)[number] & { num: number }

// numbered on from the featured three
const tiles: Tile[] = moreProjects.map((t, i) => ({ ...t, num: featuredProjects.length + i + 1 }))

const FILTERS: { key: Group | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'client', label: 'Client' },
  { key: 'ai', label: 'Built with AI' },
  { key: 'personal', label: 'Personal' },
]

/**
 * Selected work: the three featured projects one per row, image and text alternating sides, so
 * they lead. The rest follow as one horizontal strip of tiles in mixed sizes, each a big number
 * with the name under it, a line above that tracks the scroll, and filters below. Every tile is
 * one link to the project's page: a case study, or for a personal project its PDF page.
 */
export default function WorkShowcase() {
  return (
    <div className="wrap windex">
      <h2 id="work-title" className="windex__title" data-reveal>Selected Work</h2>

      <ul className="wfeat" aria-label="Featured projects" data-reveal>
        {featuredProjects.map((p, i) => <FeaturedCard key={p.slug} project={p} index={i} />)}
      </ul>

      <MoreWork />
    </div>
  )
}

function MoreWork() {
  const [filter, setFilter] = useState<Group | 'all'>('all')
  const strip = useRef<HTMLUListElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const shown = filter === 'all' ? tiles : tiles.filter((t) => t.group === filter)

  // the dot rides the line as the strip scrolls; set directly so scrolling never re-renders
  const track = () => {
    const el = strip.current
    if (!el || !dot.current) return
    const max = el.scrollWidth - el.clientWidth
    dot.current.style.left = `${max > 0 ? (el.scrollLeft / max) * 100 : 0}%`
  }
  useEffect(() => {
    if (strip.current) strip.current.scrollLeft = 0
    track()
    window.addEventListener('resize', track)
    return () => window.removeEventListener('resize', track)
  }, [filter])

  const step = (dir: 1 | -1) => {
    const el = strip.current
    if (!el) return
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: smooth ? 'smooth' : 'auto' })
  }

  return (
    <section className="wmore" aria-labelledby="more-title">
      <header className="wmore__head">
        <h3 id="more-title" className="wmore__title">More projects</h3>
        <div className="wmore__nav">
          <button type="button" className="wmore__step" aria-label="Scroll projects back" onClick={() => step(-1)}>←</button>
          <button type="button" className="wmore__step" aria-label="Scroll projects forward" onClick={() => step(1)}>→</button>
        </div>
      </header>

      <div className="wmore__track" aria-hidden="true">
        <span>{pad(shown[0].num)}.</span>
        <span className="wmore__line"><span ref={dot} className="wmore__dot" /></span>
        <span>{pad(shown[shown.length - 1].num)}.</span>
      </div>

      <ul ref={strip} className="wmore__strip" onScroll={track}>
        {shown.map((t) => <TileCard key={t.slug} tile={t} />)}
      </ul>

      <footer className="wmore__foot">
        <div className="wmore__filters" role="group" aria-label="Show projects">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className="wmore__filter" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
        <a className="windex__more" href={contact.instagram} target="_blank" rel="noopener noreferrer">
          More prototype demos on Instagram <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </footer>
    </section>
  )
}

function TileCard({ tile: t }: { tile: Tile }) {
  return (
    <li>
      <Link className={`wtile wtile--${t.slug}`} to={`/work/${t.slug}`}>
        <span className="wtile__media" aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`${t.cover}-640.avif${COVER_V} 640w, ${t.cover}-1200.avif${COVER_V} 1200w`} sizes="(max-width: 760px) 80vw, 26rem" />
            <img
              src={`${t.cover}-640.webp${COVER_V}`}
              srcSet={`${t.cover}-640.webp${COVER_V} 640w, ${t.cover}-1200.webp${COVER_V} 1200w`}
              sizes="(max-width: 760px) 80vw, 26rem"
              alt=""
              loading="lazy"
              ref={loadAhead}
              decoding="async"
            />
          </picture>
        </span>
        <span className="wtile__cap">
          <span className="wtile__num">{pad(t.num)}.</span>
          <span className="wtile__text">
            <span className="wtile__name">{t.name}</span>
            <span className="wtile__meta">{t.meta}</span>
          </span>
        </span>
      </Link>
    </li>
  )
}

function FeaturedCard({ project: p, index }: { project: FeaturedProject; index: number }) {
  const cover = `${FEATURED}/${p.slug}`
  return (
    <li>
      <Link className={`wcard wcard--${p.slug}`} to={`/work/${p.slug}`}>
        <span className="wcard__media" aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`${cover}-640.avif${COVER_V} 640w, ${cover}-1200.avif${COVER_V} 1200w`} sizes="(max-width: 760px) 100vw, 50vw" />
            <img
              src={`${cover}-640.webp${COVER_V}`}
              srcSet={`${cover}-640.webp${COVER_V} 640w, ${cover}-1200.webp${COVER_V} 1200w`}
              sizes="(max-width: 760px) 100vw, 50vw"
              alt=""
              width={1200}
              height={800}
              loading="lazy"
              ref={loadAhead}
              decoding="async"
            />
          </picture>
        </span>
        <span className="wcard__text">
          <span className="wcard__num" aria-hidden="true">{pad(index + 1)}</span>
          <span className="wcard__kind">{p.kind}</span>
          <span className="wcard__name">{p.name}</span>
          <span className="wcard__summary">{p.summary}</span>
          <span className="wcard__stat">
            <span className="wcard__value">{p.highlight.value}</span>
            <span className="wcard__label">{p.highlight.label}</span>
          </span>
          <span className="wcard__cta" aria-hidden="true">
            Read case study <span className="wrow__arrow wrow__arrow--page">→</span>
          </span>
        </span>
      </Link>
    </li>
  )
}
