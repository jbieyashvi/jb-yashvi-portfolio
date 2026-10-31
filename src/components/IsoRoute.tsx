import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { C, f1, segment, type Pt, type Shape } from './iso'

export type Tone = 'sun' | 'sky' | 'rose' | 'lilac' | 'mint'

export interface RouteStop {
  name: string
  /** the start of the name, which is all the pin shows on a small screen */
  short?: string
  /** the small line under the pin's name */
  sub: string
  /** the line under the name on the card */
  meta: string
  title: string
  body: string
  tone: Tone
  /** where the stop sits on the road, on the 1000-wide scene */
  at: Pt
  /** which side of the pin its label goes */
  label?: 'left' | 'right'
  /** how the road into this stop runs: along u, then v, then u again (or the other way round) */
  via?: 'uvu' | 'vuv'
  /** the building drawn at this stop */
  shapes: Shape[]
  links?: { slug: string; name: string }[]
  /** short value and label pairs, shown as small cards */
  facts?: readonly { value: string; label: string }[]
}

interface Props {
  id: string
  kicker: string
  title: string
  /** the name of the row of step buttons, for screen readers */
  stepsLabel: string
  stops: RouteStop[]
  /** a few trees and people around the scene, just for life */
  trees: Pt[]
  walkers: { at: Pt; to: Pt; t: number }[]
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp = (v: number) => Math.min(1, Math.max(0, v))

/**
 * A route through a little isometric town drawn in ink. Each stop is a building and a red road
 * runs between them. The section holds still while it is scrolled through; the road draws itself
 * from stop to stop, a marker travels along it, each building inks itself in as it is reached,
 * and the card beside the scene shows that stop. The scroll position drives everything through
 * one function per frame, which writes styles directly; React only re-renders when the stop
 * changes. Each stop is also a button, so the card can be chosen without scrolling. With reduced
 * motion the whole town is drawn and every card is listed.
 */
export default function IsoRoute({ id, kicker, title, stepsLabel, stops, trees, walkers }: Props) {
  const N = stops.length
  const ref = useRef<HTMLElement>(null)
  const roads = useRef<(SVGGElement | null)[]>([])
  const marker = useRef<SVGGElement>(null)
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [active, setActive] = useState(still ? N - 1 : 0)
  const segments = stops.slice(1).map((s, i) => segment(stops[i].at, s.at, s.via))

  useEffect(() => {
    const el = ref.current
    if (!el || still) return
    const lens = roads.current.map((g) => (g?.firstElementChild as SVGPathElement | null)?.getTotalLength() ?? 0)
    roads.current.forEach((g, i) => g?.style.setProperty('--len', `${lens[i]}`))
    let frame = 0
    let last = -1
    const update = () => {
      frame = 0
      const pin = el.firstElementChild as HTMLElement
      const top = parseFloat(getComputedStyle(pin).top) || 0
      const run = el.offsetHeight - pin.offsetHeight
      const p = run > 0 ? clamp((top - el.getBoundingClientRect().top) / run) : 1
      // a short pause at the first stop and the last, then travel and a pause at each stop
      const u = clamp(p * 1.12 - 0.04) * (N - 1)
      const i = Math.min(N - 2, Math.floor(u))
      const g = ease(clamp((u - i) / 0.7))
      roads.current.forEach((road, k) => road?.style.setProperty('--off', `${lens[k] * (k < i ? 0 : k > i ? 1 : 1 - g)}`))
      const path = roads.current[i]?.firstElementChild as SVGPathElement | null
      if (path && marker.current) {
        const pt = path.getPointAtLength(lens[i] * g)
        marker.current.setAttribute('transform', `translate(${pt.x} ${pt.y})`)
      }
      const next = g > 0.85 ? i + 1 : i
      if (next !== last) {
        last = next
        setActive(next)
      }
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [still, N])

  /** scroll to the point where the marker rests at stop k */
  const goTo = (k: number) => {
    const el = ref.current
    if (!el || still) return setActive(k)
    const pin = el.firstElementChild as HTMLElement
    const top = parseFloat(getComputedStyle(pin).top) || 0
    const run = el.offsetHeight - pin.offsetHeight
    // the inverse of the mapping above, landing just after the marker arrives
    const u = k === 0 ? 0 : k - 1 + 0.8
    const p = (u / (N - 1) + 0.04) / 1.12
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - top + run * Math.min(1, p), behavior: 'smooth' })
  }

  const s = stops[active]
  // draw the town back to front, so nearer buildings sit over farther ones
  const order = stops.map((_, k) => k).sort((a, b) => stops[a].at[1] - stops[b].at[1])

  return (
    <section ref={ref} id={id} className={`route${still ? ' route--still' : ''}`} aria-labelledby={`${id}-title`}>
      <div className="route__pin">
        <div className="wrap route__inner">
          <header className="route__head">
            <p className="route__kicker">{kicker}</p>
            <h2 id={`${id}-title`} className="route__title">{title}</h2>
          </header>

          <div className="route__body">
            <div className="route__cards" aria-live="polite">
              {stops.map((c, k) => (
                <article key={c.name} className={`rcard rcard--${c.tone}${k === active ? ' is-on' : ''}`} inert={!still && k !== active}>
                  <header className="rcard__top">
                    <span className="rcard__num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="rcard__name">{c.name}</span>
                      <span className="rcard__when">{c.meta}</span>
                    </span>
                    <span className="rcard__count" aria-hidden="true">{k + 1} / {N}</span>
                  </header>
                  <h3 className="rcard__title">{c.title}</h3>
                  <p className="rcard__body">{c.body}</p>
                  {c.facts && (
                    <ul className="rcard__facts">
                      {c.facts.map((f) => (
                        <li key={f.value}>
                          <span className="rcard__value">{f.value}</span>
                          <span className="rcard__label">{f.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.links && (
                    <p className="rcard__links">
                      <span>Case studies:</span>
                      {c.links.map((l) => (
                        <Link key={l.slug} to={`/work/${l.slug}`}>{l.name} <span aria-hidden="true">→</span></Link>
                      ))}
                    </p>
                  )}
                </article>
              ))}
            </div>

            <div className="route__map" aria-hidden="true">
              <svg viewBox="0 60 1000 570" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <pattern id={`${id}-iso`} width={80 * C} height="40" patternUnits="userSpaceOnUse">
                    <path d={`M0 20 L${40 * C} 0 L${80 * C} 20 L${40 * C} 40 Z`} />
                  </pattern>
                  <pattern id={`${id}-hatch`} className="route__hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
                    <path d="M0 0 V5" />
                  </pattern>
                  <radialGradient id={`${id}-fade`}>
                    <stop offset="0.55" stopColor="#fff" />
                    <stop offset="1" stopColor="#000" />
                  </radialGradient>
                  <mask id={`${id}-ground`}>
                    <rect x="-60" y="0" width="1120" height="640" fill={`url(#${id}-fade)`} />
                  </mask>
                </defs>

                {/* the ground: a faint isometric grid that fades out at the edges */}
                <rect className="route__ground" x="-60" y="0" width="1120" height="640" fill={`url(#${id}-iso)`} mask={`url(#${id}-ground)`} />

                {/* the whole road, faint, then the part travelled so far drawn over it in red */}
                <g className="route__track">
                  {segments.map((d, k) => (
                    <g key={k}>
                      <path d={d} className="road road--out" />
                      <path d={d} className="road road--gap" />
                      <path d={d} className="road road--mid" />
                    </g>
                  ))}
                </g>
                <g className="route__line">
                  {segments.map((d, k) => (
                    <g key={k} ref={(g) => { roads.current[k] = g }}>
                      <path d={d} className="road road--out" />
                      <path d={d} className="road road--gap" />
                      <path d={d} className="road road--mid" />
                    </g>
                  ))}
                </g>

                {trees.map(([x, y], k) => (
                  <g key={k} className="rtree" transform={`translate(${x} ${y})`}>
                    <g style={{ '--d': `${(k % 5) * -0.7}s` } as CSSProperties}>
                      <path d="M0 0 V-14" />
                      <circle cy="-22" r="10" />
                      <circle cx="5" cy="-27" r="6" />
                    </g>
                  </g>
                ))}

                {walkers.map((w, k) => (
                  <g key={k} transform={`translate(${w.at[0]} ${w.at[1]})`}>
                    <g className="rwalker" style={{ '--dx': `${f1(w.to[0])}px`, '--dy': `${f1(w.to[1])}px`, '--t': `${w.t}s` } as CSSProperties}>
                      <path d="M0 0 V-8 M-2.5 -4 H2.5" />
                      <circle cy="-11" r="2.4" />
                    </g>
                  </g>
                ))}

                {order.map((k) => (
                  <g key={k} className={`rbuild rbuild--${stops[k].tone}${k <= active ? ' is-past' : ''}`} style={{ '--hatch': `url(#${id}-hatch)` } as CSSProperties}>
                    {stops[k].shapes.map((sh, j) => <path key={j} className={sh.cls} d={sh.d} />)}
                  </g>
                ))}

                {stops.map((c, k) => {
                  const [x, y] = c.at
                  const left = c.label === 'left'
                  const lx = left ? -26 : 26
                  const anchor = left ? 'end' : 'start'
                  return (
                    <g key={c.name} className={`rpin rpin--${c.tone}${k <= active ? ' is-past' : ''}${k === active ? ' is-on' : ''}`} transform={`translate(${x} ${y})`}>
                      <circle className="rpin__halo" r="24" />
                      <circle className="rpin__dot" r="14" />
                      <text className="rpin__num" dy="5" textAnchor="middle">{k + 1}</text>
                      <text className="rpin__label" x={lx} dy="-2" textAnchor={anchor}>
                        {c.short ?? c.name}
                        {c.short && <tspan className="rpin__more">{c.name.slice(c.short.length)}</tspan>}
                      </text>
                      <text className="rpin__year" x={lx} dy="17" textAnchor={anchor}>{c.sub}</text>
                    </g>
                  )
                })}

                <g ref={marker} className="route__marker" transform={`translate(${stops[0].at[0]} ${stops[0].at[1]})`}>
                  <circle r="8" />
                </g>
              </svg>
            </div>
          </div>

          <nav className="route__steps" aria-label={stepsLabel}>
            <ol>
              {stops.map((c, k) => (
                <li key={c.name}>
                  <button
                    type="button"
                    className={`rstep rstep--${c.tone}${k <= active ? ' is-past' : ''}`}
                    aria-current={k === active ? 'step' : undefined}
                    aria-label={`${k + 1}. ${c.name}`}
                    onClick={() => goTo(k)}
                    style={{ '--k': k } as CSSProperties}
                  />
                </li>
              ))}
            </ol>
            <span className="route__where">{s.name}</span>
          </nav>
        </div>
      </div>
    </section>
  )
}
