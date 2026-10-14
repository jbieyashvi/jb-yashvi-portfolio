import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { contact, projects, type Project } from '../data/projects'

/** where the pinned, sideways version runs; everywhere else the projects are a plain list */
const PIN_QUERY = '(min-width: 761px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)'
/** extra vertical scroll, as a share of the stage height, with the last card fully in view */
const HOLD = 0.3

const pad = (v: number) => String(v).padStart(2, '0')
const TAG = { designed: 'Designed by me', ai: 'Made with AI', system: 'Design system + AI build' } as const

/**
 * Selected work as one sideways track. On wide screens the stage sticks under the nav and
 * the page's own vertical scroll position drives the track: the section is made exactly as
 * tall as the stage plus the track's horizontal travel (track width minus visible width),
 * plus a short hold at the end, so the sticky stage releases into the next section once the
 * last card has been fully visible for a moment. Scrolling itself is never intercepted.
 *
 * The pinned layout only applies once this script adds .is-pinned, so if it never runs (or
 * the screen is small, or reduced motion is on) the projects are an ordinary vertical list.
 */
export default function WorkShowcase() {
  const outer = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [index, setIndex] = useState(0)

  useLayoutEffect(() => {
    const o = outer.current
    const s = stage.current
    const t = track.current
    const b = bar.current
    if (!o || !s || !t || !b) return
    const mq = window.matchMedia(PIN_QUERY)
    const cards = () => [...t.children] as HTMLElement[]
    let travel = 0
    let stuckAt = 0
    let raf = 0

    // offsetLeft ignores transforms, so card positions are read from the resting layout
    const update = () => {
      raf = 0
      const x = Math.min(Math.max(stuckAt - o.getBoundingClientRect().top, 0), travel)
      t.style.transform = `translate3d(${-x}px, 0, 0)`
      b.style.transform = `scaleX(${travel ? x / travel : 0})`
      const items = cards()
      const base = items[0].offsetLeft
      let best = 0
      items.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - base - x) < Math.abs(items[best].offsetLeft - base - x)) best = i
      })
      setIndex(x >= travel - 2 ? items.length - 1 : best)
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    const measure = () => {
      if (!o.classList.contains('is-pinned')) return
      const items = cards()
      const last = items[items.length - 1]
      const padEnd = parseFloat(getComputedStyle(t).paddingRight) || 0
      travel = Math.max(0, Math.round(last.offsetLeft + last.offsetWidth + padEnd - s.clientWidth))
      stuckAt = parseFloat(getComputedStyle(s).top) || 0
      o.style.height = `${s.offsetHeight + travel + Math.round(s.offsetHeight * HOLD)}px`
      update()
    }

    // keyboard: bring a focused card into view by scrolling the page to the matching point
    const onFocus = (e: FocusEvent) => {
      // mouse and touch clicks focus links too; only keyboard focus should move the page
      if (!o.classList.contains('is-pinned') || !(e.target as Element).matches(':focus-visible')) return
      const card = (e.target as Element).closest('.hs-card') as HTMLElement | null
      if (!card) return
      const r = card.getBoundingClientRect()
      const sr = s.getBoundingClientRect()
      if (r.left >= sr.left && r.right <= sr.right) return
      const x = Math.min(Math.max(card.offsetLeft - cards()[0].offsetLeft, 0), travel)
      const top = window.scrollY + o.getBoundingClientRect().top - stuckAt + x
      window.scrollTo({ top, behavior: 'instant' })
    }

    const ro = new ResizeObserver(measure)
    const apply = () => {
      if (mq.matches) {
        o.classList.add('is-pinned')
        ro.observe(s)
        ro.observe(t)
        window.addEventListener('scroll', schedule, { passive: true })
        measure()
      } else {
        o.classList.remove('is-pinned')
        ro.disconnect()
        window.removeEventListener('scroll', schedule)
        o.style.height = ''
        t.style.transform = ''
        b.style.transform = ''
        setIndex(0)
      }
    }

    apply()
    mq.addEventListener('change', apply)
    t.addEventListener('focusin', onFocus)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mq.removeEventListener('change', apply)
      window.removeEventListener('scroll', schedule)
      t.removeEventListener('focusin', onFocus)
    }
  }, [])

  return (
    <div ref={outer} className="hs">
      <div ref={stage} className="hs__stage">
        <div className="wrap hs__head" data-reveal>
          <h2 id="work-title" className="hs__title">Selected work</h2>
          <p className="hs__note">
            Seven products: one where I created the design system and built the platform with AI, two I designed end to end by hand, and four where I used AI to design and build what’s shown here.
          </p>
        </div>

        <ol ref={track} className="hs__track">
          {projects.map((p, i) => (
            <Card key={p.slug} project={p} n={i + 1} />
          ))}
        </ol>

        <div className="wrap hs__foot">
          <p className="hs__count" aria-hidden="true">
            {pad(index + 1)} <span>/ {pad(projects.length)}</span>
          </p>
          <div className="hs__progress" aria-hidden="true">
            <span ref={bar} />
          </div>
          <a className="hs__more" href={contact.instagram} target="_blank" rel="noopener noreferrer">
            More prototype demos on Instagram <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </div>
  )
}

/** cards are full width on phones and at most 35rem (--card-w) wide otherwise */
const COVER_SIZES = '(max-width: 760px) 100vw, 35rem'

function Card({ project: p, n }: { project: Project; n: number }) {
  const to = `/work/${p.slug}`
  const [w, h] = p.coverSize ?? [1600, 1000]
  // the large file is 1200px wide, or the master's own width if that is smaller
  const set = (ext: string) => `${p.cover}-640.${ext} 640w, ${p.cover}-1200.${ext} ${Math.min(w, 1200)}w`
  return (
    <li className={`hs-card hs-card--${p.slug}`}>
      <article className="hs-card__inner">
        {/* the visible text link is the keyboard target; the preview is a larger mouse/touch target */}
        <Link to={to} className="hs-card__media" tabIndex={-1} aria-hidden="true" draggable={false}>
          <picture>
            <source type="image/avif" srcSet={set('avif')} sizes={COVER_SIZES} />
            <img
              className="hs-card__cover"
              src={`${p.cover}-1200.webp`}
              srcSet={set('webp')}
              sizes={COVER_SIZES}
              alt=""
              width={w}
              height={h}
              loading={n <= 2 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
            />
          </picture>
        </Link>
        <div className="hs-card__body">
          <p className="hs-card__meta">
            <span className="hs-card__num" aria-hidden="true">{pad(n)}</span>
            <span className={`hs-card__tag hs-card__tag--${p.track}`}>{TAG[p.track]}</span>
          </p>
          <h3 className="hs-card__title">{p.name}</h3>
          <p className="hs-card__type">{p.type}</p>
          <p className="hs-card__summary">{p.summary}</p>
          <Link to={to} className="hs-card__link">
            View project<span className="sr-only">: {p.name}</span> <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </article>
    </li>
  )
}
