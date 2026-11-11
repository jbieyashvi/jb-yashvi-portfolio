import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { COVER_V, featuredProjects, moreProjects } from '../../data/projects'

const GROUP = { client: 'Client', ai: 'Built with AI', personal: 'Personal' }

/**
 * Selected work as tabs, 01 to 03: one featured project at a time in a bordered box, its cover
 * filling the left and what it is in a ruled column on the right, the link pinned to its foot. The tabs advance on their own (a bar fills under the current one)
 * until a visitor picks one; hovering or focusing the section holds them. Arrow keys move
 * between tabs. Under the tabs, the rest of the projects as a row of small cards.
 */
export default function RvWork() {
  const [at, setAt] = useState(0)
  const [auto, setAuto] = useState(() => window.matchMedia('(prefers-reduced-motion: no-preference)').matches)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const p = featuredProjects[at]

  const pick = (k: number, focus = false) => {
    setAuto(false)
    setAt(k)
    if (focus) tabs.current[k]?.focus()
  }
  const onKey = (e: KeyboardEvent) => {
    const n = featuredProjects.length
    if (e.key === 'ArrowRight') pick((at + 1) % n, true)
    else if (e.key === 'ArrowLeft') pick((at - 1 + n) % n, true)
    else if (e.key === 'Home') pick(0, true)
    else if (e.key === 'End') pick(n - 1, true)
    else return
    e.preventDefault()
  }

  return (
    <div className="wrap rv-work" data-auto={auto || undefined}>
      <header className="rv-head">
        <p className="rv-eyebrow">Selected work</p>
        <h2 id="work-title" className="rv-title">
          Products I <em>designed</em>
        </h2>
      </header>

      <div className="rv-tabs" role="tablist" aria-label="Featured projects" onKeyDown={onKey}>
        {featuredProjects.map((f, k) => (
          <button
            key={f.slug}
            ref={(el) => { tabs.current[k] = el }}
            type="button"
            role="tab"
            id={`rv-tab-${f.slug}`}
            aria-selected={k === at}
            aria-controls="rv-panel"
            tabIndex={k === at ? 0 : -1}
            className="rv-tab"
            onClick={() => pick(k)}
          >
            <span className="rv-tab__n">{String(k + 1).padStart(2, '0')}</span>
            <span className="rv-tab__label">[{f.name.split(' — ')[0]}]</span>
            {k === at && <span key={at} className="rv-tab__bar" onAnimationEnd={() => setAt((at + 1) % featuredProjects.length)} />}
          </button>
        ))}
      </div>

      <div id="rv-panel" role="tabpanel" aria-labelledby={`rv-tab-${p.slug}`} className="rv-panel" key={p.slug}>
        <Link to={`/work/${p.slug}`} className="rv-panel__media" tabIndex={-1} aria-hidden="true">
          <picture>
            <source type="image/avif" srcSet={`/work/featured/${p.slug}-640.avif${COVER_V} 640w, /work/featured/${p.slug}-1200.avif${COVER_V} 1200w`} sizes="(max-width: 860px) 92vw, 56vw" />
            <img src={`/work/featured/${p.slug}-1200.webp${COVER_V}`} srcSet={`/work/featured/${p.slug}-640.webp${COVER_V} 640w, /work/featured/${p.slug}-1200.webp${COVER_V} 1200w`} sizes="(max-width: 860px) 92vw, 56vw" width={1200} height={800} alt="" decoding="async" />
          </picture>
        </Link>
        <div className="rv-panel__text">
          <p className="rv-panel__kind">{p.name}</p>
          <h3 className="rv-panel__sum">{p.summary}</h3>
          <p className="rv-panel__name">{p.kind}</p>
          {p.highlight && (
            <p className="rv-panel__stat">
              <strong>{p.highlight.value}</strong> {p.highlight.label}
            </p>
          )}
          <ul className="rv-chips" aria-label="What the work involved">
            {p.tags.map((t, k) => <li key={t} style={{ '--k': k } as CSSProperties}>{t}</li>)}
          </ul>
          <div className="rv-panel__actions">
            <Link to={`/work/${p.slug}`} className="rv-pill">
              Explore the work <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="rv-more">
        <p className="rv-more__head">More projects</p>
        <ul className="rv-more__row">
          {moreProjects.map((m) => (
            <li key={m.slug}>
              <Link to={`/work/${m.slug}`} className="rv-mcard">
                <span className="rv-mcard__img">
                  <img src={`${m.cover}-640.webp${COVER_V}`} width={640} height={427} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="rv-mcard__group">{GROUP[m.group]}</span>
                <span className="rv-mcard__name">{m.name}</span>
                <span className="rv-mcard__meta">{m.badge ?? m.meta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
