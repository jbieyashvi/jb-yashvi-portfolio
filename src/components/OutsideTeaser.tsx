import { useEffect, useRef, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { artKinds, artPreview } from '../data/art'
import { mid } from './srcset'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
const WIDE_QUERY = '(min-width: 761px)'
/** how far each piece drifts at most, in px, wide and small screens */
const REACH = { wide: 36, narrow: 10 }
/** drift per piece, so they move at slightly different speeds */
const SPEEDS = [0.35, 1, 0.7]

const CHAPTER = Object.fromEntries(artKinds.map((k) => [k.kind, k.label]))

/**
 * Outside the brief on the home page: a short preview of the Gallery. The heading and link
 * stay still beside three pieces, one from each chapter, which open through a mask on first
 * view (the site's [data-reveal]) and drift slightly at different speeds while the section
 * crosses the screen. Each piece links to its chapter on the Gallery page. Nothing is pinned;
 * with reduced motion, or without scripts, it is a still composition.
 */
export default function OutsideTeaser() {
  const root = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const motion = window.matchMedia(MOTION_QUERY)
    const wide = window.matchMedia(WIDE_QUERY)
    const figs = [...el.querySelectorAll<HTMLElement>('[data-speed]')]
    let raf = 0
    const update = () => {
      raf = 0
      if (!motion.matches) {
        figs.forEach((f) => f.style.removeProperty('translate'))
        return
      }
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom < -vh || r.top > 2 * vh) return
      // -1 as the composition enters at the bottom, 1 as it leaves at the top
      const d = Math.max(-1, Math.min(1, (vh / 2 - (r.top + r.height / 2)) / ((vh + r.height) / 2)))
      const reach = wide.matches ? REACH.wide : REACH.narrow
      figs.forEach((f) => (f.style.translate = `0 ${(-d * Number(f.dataset.speed) * reach).toFixed(1)}px`))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', schedule)
    wide.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', schedule)
      wide.removeEventListener('change', schedule)
    }
  }, [])

  return (
    <div className="wrap teaser">
      <div className="teaser__text">
        <h2 id="outside-title" className="mod__title outside__title">Outside the brief</h2>
        <p className="mod__note">Sketches, illustrations and little moments from my everyday.</p>
        <Link to="/gallery" className="mod__link teaser__link">
          Explore gallery <span aria-hidden="true" className="mod__arrow">↗</span>
        </Link>
      </div>

      <ul ref={root} className="teaser__pieces">
        {artPreview.map((item, i) => (
          <li
            key={item.slug}
            className={`teaser__fig teaser__fig--${i + 1}`}
            data-reveal=""
            data-speed={SPEEDS[i]}
            style={{ '--ar': item.w / item.h, '--delay': `${i * 0.12}s` } as CSSProperties}
          >
            <Link to={`/gallery#${item.kind}`} className="teaser__btn" aria-label={`${item.caption}: see ${CHAPTER[item.kind]} in the gallery`}>
              <span className="teaser__mask">
                <img
                  src={`${item.src}-800.webp`}
                  srcSet={`${item.src}-800.webp 800w, ${mid(item.src, item.w)}${item.src}-1800.webp ${item.w}w`}
                  sizes={i ? '(max-width: 760px) 44vw, 22vw' : '(max-width: 760px) 54vw, 32vw'}
                  width={item.w}
                  height={item.h}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
