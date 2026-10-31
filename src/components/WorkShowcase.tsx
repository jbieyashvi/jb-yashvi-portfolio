import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router-dom'
import { clientProjects, contact, featuredProjects, listedPersonalProjects, type FeaturedProject, type PersonalProject, type Project } from '../data/projects'
import loadAhead from './loadAhead'

const pad = (v: number) => String(v).padStart(2, '0')
const PERSONAL = '/work/personal'
const FEATURED = '/work/featured'

const isFeatured = (slug: string) => featuredProjects.some((f) => f.slug === slug)
const otherClient = clientProjects.filter((p) => !isFeatured(p.slug))
const designed = otherClient.filter((p) => p.track !== 'ai')
const builtWithAI = otherClient.filter((p) => p.track === 'ai')
const otherPersonal = listedPersonalProjects.filter((p) => !isFeatured(p.slug))
const moreCount = designed.length + builtWithAI.length + otherPersonal.length

/**
 * Selected work: the three featured projects one per row, image and text alternating sides, so
 * they lead. The rest wait behind "See all projects" as a compact index: Client Projects (with
 * the AI-built ones in their own group below) and Personal Projects side by side (stacked,
 * client first, on phones). Every row is one link to the project's page: for a personal
 * project, a page showing its PDF; for a client project, its case study.
 */
export default function WorkShowcase() {
  const [more, setMore] = useState(false)
  const moreId = useId()
  return (
    <div className="wrap windex">
      <h2 id="work-title" className="windex__title" data-reveal>Selected Work</h2>

      <ul className="wfeat" aria-label="Featured projects" data-reveal>
        {featuredProjects.map((p, i) => <FeaturedCard key={p.slug} project={p} index={i} />)}
      </ul>

      <div className="windex__toggle">
        <button type="button" className="btn btn--ghost-dark" aria-expanded={more} aria-controls={moreId} onClick={() => setMore((m) => !m)}>
          {more ? 'Show fewer projects' : `See all projects (${moreCount})`}
          <span className="windex__chev" aria-hidden="true">↓</span>
        </button>
      </div>

      <div id={moreId} className="windex__more-work" hidden={!more}>
        <div className="windex__cols">
          <div className="windex__col">
            <Group id="client-title" title="Client Projects" count={designed.length}>
              {designed.map((p) => <ClientRow key={p.slug} project={p} />)}
            </Group>
            <Group id="ai-title" title="Built with AI" count={builtWithAI.length}>
              {builtWithAI.map((p) => <ClientRow key={p.slug} project={p} />)}
            </Group>
          </div>
          <div className="windex__col">
            <Group id="personal-title" title="Personal Projects" count={otherPersonal.length}>
              {otherPersonal.map((p) => <PersonalRow key={p.slug} project={p} />)}
            </Group>
          </div>
        </div>

        <a className="windex__more" href={contact.instagram} target="_blank" rel="noopener noreferrer">
          More prototype demos on Instagram <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  )
}

function FeaturedCard({ project: p, index }: { project: FeaturedProject; index: number }) {
  const cover = `${FEATURED}/${p.slug}`
  const video = useRef<HTMLVideoElement>(null)
  const play = () => { const v = video.current; if (v) v.play().catch(() => {}) }
  const stop = () => { const v = video.current; if (v) { v.pause(); v.currentTime = 0 } }
  // Touch screens have no hover, so the loop plays while the card is mostly in view instead
  useEffect(() => {
    const v = video.current
    if (!v || matchMedia('(hover: hover)').matches) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : stop()), { threshold: 0.6 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return (
    <li>
      <Link
        className={`wcard wcard--${p.slug}`}
        to={`/work/${p.slug}`}
        {...(p.loop && { onMouseEnter: play, onMouseLeave: stop, onFocus: play, onBlur: stop })}
      >
        <span className="wcard__media" aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`${cover}-640.avif 640w, ${cover}-1200.avif 1200w`} sizes="(max-width: 760px) 100vw, 50vw" />
            <img
              src={`${cover}-640.webp`}
              srcSet={`${cover}-640.webp 640w, ${cover}-1200.webp 1200w`}
              sizes="(max-width: 760px) 100vw, 50vw"
              alt=""
              width={1200}
              height={800}
              loading="lazy"
              ref={loadAhead}
              decoding="async"
            />
          </picture>
          {p.loop && <CardLoop src={`${cover}-loop`} ref={video} />}
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

/** The muted loop layered over a featured cover. It fades in only once frames are playing, so
 *  the cover shows while it loads, and it is left out entirely for reduced motion or Save-Data. */
function CardLoop({ src, ref }: { src: string; ref: Ref<HTMLVideoElement> }) {
  const skip =
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  if (skip) return null
  return (
    <video
      ref={ref}
      className="wcard__loop"
      muted
      loop
      playsInline
      preload="none"
      disablePictureInPicture
      onPlaying={(e) => e.currentTarget.classList.add('is-on')}
      onPause={(e) => e.currentTarget.classList.remove('is-on')}
    >
      <source src={`${src}.webm`} type="video/webm" />
      <source src={`${src}.mp4`} type="video/mp4" />
    </video>
  )
}

function Group({ id, title, count, children }: { id: string; title: string; count: number; children: ReactNode }) {
  return (
    <section className="windex__group" aria-labelledby={id}>
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
          <span className="wrow__meta">{p.tagline}</span>
        </span>
        <span className="wrow__arrow wrow__arrow--page" aria-hidden="true">→</span>
      </Link>
    </li>
  )
}
