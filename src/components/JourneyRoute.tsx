import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'

type Tone = 'sun' | 'sky' | 'rose' | 'lilac' | 'mint'
type Pt = [number, number]

interface Stop {
  name: string
  /** role, dates and place, as on the résumé */
  when: string
  title: string
  body: string
  tone: Tone
  /** where the stop sits on the road, on the 1000-wide scene */
  at: Pt
  /** which side of the pin its label goes */
  label?: 'left' | 'right'
  /** the start of the name, which is all the pin shows on a small screen */
  short?: string
  /** how the road into this stop runs: along u, then v, then u again (or the other way round) */
  via?: 'uvu' | 'vuv'
  links?: { slug: string; name: string }[]
}

// every fact here is from the résumé (scripts/resume.py) and My journey (src/data/journey.ts);
// the places are as Yashvi gave them: MNIT, Urban Culture and Sneaco in Jaipur, POLO remote,
// Heizen in Hyderabad
const stops: Stop[] = [
  {
    name: 'MNIT Jaipur',
    when: 'B.Arch · Graduated 2025 · Jaipur',
    title: 'It started with architecture.',
    body: 'I studied architecture (B.Arch) at Malaviya National Institute of Technology Jaipur, and moved into product design along the way.',
    tone: 'sun',
    at: [120, 560],
  },
  {
    name: 'POLO',
    when: 'Product Design Intern · Remote · Oct – Dec 2023',
    title: 'My first product design role.',
    body: 'Supported the Senior Product Designer with high-fidelity UI screens and interactive prototypes.',
    tone: 'sky',
    at: [280, 330],
  },
  {
    name: 'Urban Culture',
    when: 'UI/UX Design Intern · May – Jul 2024 · Jaipur',
    title: 'Admin panels, made easier to use.',
    body: 'Refined admin-panel experiences with a focus on usability, information hierarchy and visual consistency.',
    tone: 'rose',
    at: [450, 560],
    via: 'vuv',
  },
  {
    name: 'Sneaco',
    when: 'Founding Product Designer · Part-time · Oct 2024 – Mar 2025 · Jaipur',
    title: 'Designing from the very start.',
    body: 'Interviewed hostel students and adults about laundry routines, spending and service needs to inform a one-day laundry and ironing service, then defined the first visual language and UI patterns.',
    tone: 'lilac',
    at: [585, 330],
  },
  {
    name: 'Heizen',
    when: 'Product Designer · From May 2025 · Hyderabad',
    title: 'Client products, end to end.',
    body: 'Owned web and mobile product design for clients, from business requirements and user flows to high-fidelity UI and developer-ready designs.',
    tone: 'mint',
    at: [780, 560],
    via: 'vuv',
    links: [
      { slug: 'compass', name: 'Compass Group' },
      { slug: 'shipway', name: 'Shipway' },
      { slug: 'nutrio', name: 'Nutrio' },
    ],
  },
  {
    name: 'Senior at Heizen',
    short: 'Senior',
    when: 'Senior Product Designer · May 2026 – Oct 2026 · Hyderabad',
    title: 'Promoted to Senior Product Designer.',
    body: 'Promoted in May 2026. Guided client design reviews with alternatives and trade-offs, and used AI-assisted prototypes in client reviews and engineering discussions.',
    tone: 'sun',
    at: [905, 320],
    label: 'left',
  },
]

const N = stops.length

/* ---------- the isometric drawing ----------
   A point (x, y, z) in a building's own space lands on the scene at o + x·U + y·V, lifted by z.
   U runs down to the right and V down to the left, so each box shows its top, its right face
   (x at its largest) and its left face (y at its largest). */
const C = Math.cos(Math.PI / 6)
const U: Pt = [C, 0.5]
const V: Pt = [-C, 0.5]
type P3 = [number, number, number]
type Shape = { cls: string; d: string }

const f1 = (n: number) => +n.toFixed(1)
const along = (p: Pt, d: Pt, k: number): Pt => [p[0] + d[0] * k, p[1] + d[1] * k]

/** a small kit for drawing one building, with its front-bottom corner just above `door` */
function kit(door: Pt, w: number, d: number) {
  const o: Pt = [door[0] - C * (w - d), door[1] - (w + d) / 2 - 14]
  const at = ([x, y, z]: P3): Pt => [f1(o[0] + x * U[0] + y * V[0]), f1(o[1] + x * U[1] + y * V[1] - z)]
  const out: Shape[] = []
  const poly = (cls: string, pts: P3[]) => out.push({ cls, d: 'M' + pts.map((p) => at(p).join(' ')).join(' L') + 'Z' })
  const line = (cls: string, pts: P3[]) => out.push({ cls, d: 'M' + pts.map((p) => at(p).join(' ')).join(' L') })
  const box = (x: number, y: number, z: number, bw: number, bd: number, h: number, top = 'roof') => {
    const [X, Y, Z] = [x + bw, y + bd, z + h]
    poly('wall', [[x, Y, z], [X, Y, z], [X, Y, Z], [x, Y, Z]])
    poly('wall wall--r', [[X, y, z], [X, Y, z], [X, Y, Z], [X, y, Z]])
    poly(top, [[x, y, Z], [X, y, Z], [X, Y, Z], [x, Y, Z]])
  }
  /** a window on the right face (x = X), from y to y + ww and z to z + hh */
  const winR = (X: number, y: number, z: number, ww: number, hh: number, cls = 'win') =>
    poly(cls, [[X, y, z], [X, y + ww, z], [X, y + ww, z + hh], [X, y, z + hh]])
  /** a window on the left face (y = Y) */
  const winL = (Y: number, x: number, z: number, ww: number, hh: number, cls = 'win') =>
    poly(cls, [[x, Y, z], [x + ww, Y, z], [x + ww, Y, z + hh], [x, Y, z + hh]])
  /** a round window on the right face */
  const ringR = (X: number, y: number, z: number, r: number, cls: string) =>
    poly(cls, Array.from({ length: 16 }, (_, k): P3 => [X, y + r * Math.cos((k / 16) * Math.PI * 2), z + r * Math.sin((k / 16) * Math.PI * 2)]))
  return { out, at, poly, line, box, winR, winL, ringR }
}

/** MNIT: a long school block with arched windows, a pediment and a clock tower */
function school(door: Pt) {
  const k = kit(door, 56, 120)
  k.box(0, 0, 0, 56, 120, 40)
  for (let j = 0; j < 7; j++) k.winR(56, 8 + j * 15.5, 10, 8, 18)
  k.winL(120, 8, 10, 8, 18)
  k.winL(120, 40, 10, 8, 18)
  k.winL(120, 22, 0, 12, 22, 'win win--door')
  k.poly('accent', [[4, 120, 40], [52, 120, 40], [28, 120, 56]])
  k.box(18, 46, 40, 20, 24, 30)
  k.winR(38, 52, 52, 12, 12, 'win win--clock')
  k.poly('roof', [[18, 70, 70], [38, 70, 70], [28, 58, 90]])
  k.poly('accent', [[38, 46, 70], [38, 70, 70], [28, 58, 90]])
  return k.out
}

/** POLO: a small house, the desk at home, with wifi waves over the roof */
function home(door: Pt) {
  const k = kit(door, 50, 46)
  k.box(0, 0, 0, 50, 46, 32)
  k.poly('roof', [[0, 0, 32], [0, 46, 32], [25, 46, 54], [25, 0, 54]])
  k.poly('wall', [[0, 46, 32], [50, 46, 32], [25, 46, 54]])
  k.poly('accent', [[50, 0, 32], [50, 46, 32], [25, 46, 54], [25, 0, 54]])
  k.winL(46, 18, 0, 12, 20, 'win win--door')
  k.winR(50, 12, 12, 14, 12)
  k.winR(50, 30, 12, 8, 12)
  const [x, y] = k.at([25, 23, 66])
  k.out.push({ cls: 'wave', d: `M${x - 6} ${y} q6 -6 12 0 M${x - 12} ${y - 5} q12 -11 24 0 M${x - 18} ${y - 10} q18 -16 36 0` })
  return k.out
}

/** Urban Culture: a two-storey shop with a striped awning */
function shop(door: Pt) {
  const k = kit(door, 60, 78)
  k.box(0, 0, 0, 60, 78, 58)
  for (const y of [10, 32, 54]) k.winR(60, y, 36, 13, 14)
  for (const x of [10, 36]) k.winL(78, x, 36, 13, 14)
  k.winR(60, 8, 4, 62, 20)
  k.winL(78, 22, 0, 14, 24, 'win win--door')
  k.poly('accent', [[60, 4, 30], [60, 74, 30], [72, 74, 22], [72, 4, 22]])
  for (let y = 14; y < 74; y += 10) k.line('stripe', [[60, y, 30], [72, y, 22]])
  return k.out
}

/** Sneaco: a laundry with round machine windows and a washing line */
function laundry(door: Pt) {
  const k = kit(door, 60, 64)
  k.box(0, 0, 0, 60, 64, 40)
  for (const y of [14, 32, 50]) {
    k.ringR(60, y, 17, 7.5, 'win')
    k.ringR(60, y, 17, 4, 'accent')
  }
  k.winL(64, 20, 0, 14, 24, 'win win--door')
  k.poly('accent', [[10, 64, 44], [50, 64, 44], [50, 64, 54], [10, 64, 54]])
  k.line('pole', [[86, 6, 0], [86, 6, 34]])
  k.line('pole', [[86, 60, 0], [86, 60, 34]])
  const [a, b] = [k.at([86, 6, 34]), k.at([86, 60, 34])]
  k.out.push({ cls: 'pole', d: `M${a[0]} ${a[1]} Q${f1((a[0] + b[0]) / 2)} ${f1((a[1] + b[1]) / 2 + 8)} ${b[0]} ${b[1]}` })
  for (const [y, cls] of [[18, 'accent'], [33, 'cloth'], [47, 'accent']] as const) {
    const s = y > 25 && y < 40 ? 3 : 2
    k.poly(cls, [[86, y - 5, 32 - s], [86, y + 5, 32 - s], [86, y + 4, 22 - s], [86, y - 4, 22 - s]])
  }
  return k.out
}

/** Heizen: an office block with a grid of windows */
function office(door: Pt) {
  const k = kit(door, 66, 66)
  k.box(0, 0, 0, 66, 66, 84)
  for (const z of [24, 42, 60]) {
    for (const y of [8, 23, 38, 53]) k.winR(66, y, z, 8, 10, 'win win--lit')
    for (const x of [8, 23, 38, 53]) k.winL(66, x, z, 8, 10, 'win win--lit')
  }
  k.winL(66, 24, 0, 16, 16, 'win win--door')
  k.winR(66, 10, 4, 46, 12)
  k.box(12, 12, 84, 18, 14, 8)
  return k.out
}

/** Senior at Heizen: a taller tower with a flag on top */
function tower(door: Pt) {
  const k = kit(door, 46, 46)
  k.box(0, 0, 0, 46, 46, 150)
  for (let z = 22; z < 140; z += 16) {
    for (const y of [8, 20, 32]) k.winR(46, y, z, 6, 9, 'win win--lit')
    for (const x of [8, 20, 32]) k.winL(46, x, z, 6, 9, 'win win--lit')
  }
  k.winL(46, 16, 0, 14, 16, 'win win--door')
  k.line('pole', [[23, 23, 150], [23, 23, 182]])
  k.poly('accent flag', [[23, 23, 182], [44, 23, 175], [23, 23, 168]])
  return k.out
}

const builders = [school, home, shop, laundry, office, tower]
const buildings = stops.map((s, k) => builders[k](s.at))

/** the road from one stop to the next: three straight runs along the iso axes, with round corners */
function segment(a: Pt, b: Pt, via: 'uvu' | 'vuv' = 'uvu') {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]]
  const ku = dy + dx / (2 * C)
  const kv = dy - dx / (2 * C)
  const legs: [Pt, number][] = via === 'uvu' ? [[U, ku / 2], [V, kv], [U, ku / 2]] : [[V, kv / 2], [U, ku], [V, kv / 2]]
  let p = a
  const pts: Pt[] = [a]
  for (const [d, k] of legs) pts.push((p = along(p, d, k)))
  let path = `M${a[0]} ${a[1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [prev, c, next] = [pts[i - 1], pts[i], pts[i + 1]]
    const lin = Math.hypot(c[0] - prev[0], c[1] - prev[1])
    const lout = Math.hypot(next[0] - c[0], next[1] - c[1])
    const r = Math.min(22, lin / 2, lout / 2)
    const p1 = along(c, [(prev[0] - c[0]) / lin, (prev[1] - c[1]) / lin], r)
    const p2 = along(c, [(next[0] - c[0]) / lout, (next[1] - c[1]) / lout], r)
    path += ` L${f1(p1[0])} ${f1(p1[1])} Q${f1(c[0])} ${f1(c[1])} ${f1(p2[0])} ${f1(p2[1])}`
  }
  return path + ` L${b[0]} ${b[1]}`
}
const segments = stops.slice(1).map((s, i) => segment(stops[i].at, s.at, s.via))

// a few trees and people around the scene, just for life
const trees: Pt[] = [[60, 450], [300, 612], [350, 280], [395, 470], [520, 290], [640, 612], [700, 430], [960, 610], [975, 420], [180, 250]]
const walkers: { at: Pt; to: Pt; t: number }[] = [
  { at: [250, 470], to: along([0, 0], U, 40), t: 7 },
  { at: [520, 470], to: along([0, 0], V, 36), t: 6 },
  { at: [690, 380], to: along([0, 0], U, 30), t: 8 },
  { at: [880, 500], to: along([0, 0], V, 40), t: 7.5 },
  { at: [140, 380], to: along([0, 0], U, 28), t: 6.5 },
]

const ease = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The route: where I started and every stop since, as a little isometric town drawn in ink.
 * Each stop is a building (the school, a home desk, a shop, a laundry, an office, a tower) and
 * a red road runs between them. The section holds still while it is scrolled through; the road
 * draws itself from stop to stop, a marker travels along it, each building inks itself in as it
 * is reached, and the card beside the scene shows that stop. The scroll position drives
 * everything through one function per frame, which writes styles directly; React only
 * re-renders when the stop changes. Each stop is also a button, so the card can be chosen
 * without scrolling. With reduced motion the whole town is drawn and every card is listed.
 */
export default function JourneyRoute() {
  const ref = useRef<HTMLElement>(null)
  const roads = useRef<(SVGGElement | null)[]>([])
  const marker = useRef<SVGGElement>(null)
  const [still] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [active, setActive] = useState(still ? N - 1 : 0)

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
  }, [still])

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
    <section ref={ref} id="route" className={`route${still ? ' route--still' : ''}`} aria-labelledby="route-title">
      <div className="route__pin">
        <div className="wrap route__inner">
          <header className="route__head">
            <p className="route__kicker">The route</p>
            <h2 id="route-title" className="route__title">From architecture school to product design.</h2>
          </header>

          <div className="route__body">
            <div className="route__cards" aria-live="polite">
              {stops.map((c, k) => (
                <article key={c.name} className={`rcard rcard--${c.tone}${k === active ? ' is-on' : ''}`} inert={!still && k !== active}>
                  <header className="rcard__top">
                    <span className="rcard__num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="rcard__name">{c.name}</span>
                      <span className="rcard__when">{c.when}</span>
                    </span>
                    <span className="rcard__count" aria-hidden="true">{k + 1} / {N}</span>
                  </header>
                  <h3 className="rcard__title">{c.title}</h3>
                  <p className="rcard__body">{c.body}</p>
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
                  <pattern id="route-iso" width={80 * C} height="40" patternUnits="userSpaceOnUse">
                    <path d={`M0 20 L${40 * C} 0 L${80 * C} 20 L${40 * C} 40 Z`} />
                  </pattern>
                  <pattern id="route-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
                    <path d="M0 0 V5" />
                  </pattern>
                  <radialGradient id="route-fade">
                    <stop offset="0.55" stopColor="#fff" />
                    <stop offset="1" stopColor="#000" />
                  </radialGradient>
                  <mask id="route-ground">
                    <rect x="-60" y="0" width="1120" height="640" fill="url(#route-fade)" />
                  </mask>
                </defs>

                {/* the ground: a faint isometric grid that fades out at the edges */}
                <rect className="route__ground" x="-60" y="0" width="1120" height="640" mask="url(#route-ground)" />

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
                  <g key={k} className={`rbuild rbuild--${stops[k].tone}${k <= active ? ' is-past' : ''}`}>
                    {buildings[k].map((sh, j) => <path key={j} className={sh.cls} d={sh.d} />)}
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
                      <text className="rpin__year" x={lx} dy="17" textAnchor={anchor}>{c.when.split(' · ').find((w) => /\d{4}/.test(w))}</text>
                    </g>
                  )
                })}

                <g ref={marker} className="route__marker" transform={`translate(${stops[0].at[0]} ${stops[0].at[1]})`}>
                  <circle r="8" />
                </g>
              </svg>
            </div>
          </div>

          <nav className="route__steps" aria-label="Stops on the route">
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
