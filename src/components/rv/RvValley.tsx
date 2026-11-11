import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { art } from '../../data/art'
import { COVER_V, featuredProjects, getProject, moreProjects } from '../../data/projects'
import { playground } from '../../data/playground'
import { useLightbox } from '../Lightbox'

type Kind = 'product' | 'ui' | 'logo' | 'art' | 'studio' | 'personal'
type Tile = { key: string; kind: Kind; img: string; ratio: number; title: string; meta: string; to?: string; lb?: number }

const FILTERS: [Kind | 'all', string][] = [
  ['all', 'All'],
  ['product', 'Products'],
  ['ui', 'UI explorations'],
  ['logo', 'Logos'],
  ['art', 'Art'],
  ['studio', 'Studio'],
  ['personal', 'Places'],
]

const images = [...playground, ...art]
const tiles: Tile[] = [
  ...featuredProjects.map((f) => ({ key: f.slug, kind: 'product' as const, img: `/work/featured/${f.slug}-640.webp${COVER_V}`, ratio: 2 / 3, title: f.name.split(' — ')[0], meta: f.kind, to: `/work/${f.slug}` })),
  ...moreProjects.map((m) => {
    const size = m.group === 'personal' ? undefined : getProject(m.slug)?.coverSize
    return { key: m.slug, kind: 'product' as const, img: `${m.cover}-640.webp${COVER_V}`, ratio: size ? size[1] / size[0] : 2 / 3, title: m.name, meta: m.meta, to: `/work/${m.slug}` }
  }),
  ...playground.map((p, k) => ({ key: p.slug, kind: p.kind, img: `${p.src}-800.webp`, ratio: Math.min(1.25, p.h / p.w), title: p.caption, meta: p.label, lb: k })),
  ...art.map((a, k) => ({ key: a.slug, kind: a.kind, img: `${a.src}-800.webp`, ratio: a.h / a.w, title: a.caption, meta: a.label, lb: playground.length + k })),
]
// interleave the kinds so the board reads as a mix, not in blocks
const mixed = [...tiles].sort((a, b) => ((tiles.indexOf(a) * 7) % 11) - ((tiles.indexOf(b) * 7) % 11))

const COL = 230
const GAP = 16
const DRIFT = 14 // px per second

/**
 * The valley: every project, exploration and drawing on one board larger than the screen. Drag
 * it around with the mouse (or swipe sideways), or let it drift; filters lay the board out again
 * with only that kind. Products open their case study, everything else the enlarged view.
 * Keyboard focus pans the board to the focused tile.
 */
export default function RvValley() {
  const [filter, setFilter] = useState<Kind | 'all'>('all')
  const [paused, setPaused] = useState(() => !window.matchMedia('(prefers-reduced-motion: no-preference)').matches)
  const view = useRef<HTMLDivElement>(null)
  const board = useRef<HTMLDivElement>(null)
  const pan = useRef({ x: 0, y: 0, minX: 0, minY: 0, dir: -1 })
  const drag = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean; until: number } | null>(null)
  const hold = useRef(0)
  const [vw, setVw] = useState(1200)
  const { open, lightbox } = useLightbox(images)
  const navigate = useNavigate()

  const shown = useMemo(() => mixed.filter((t) => filter === 'all' || t.kind === filter), [filter])

  // masonry: enough columns to be wider than the view, each tile into the shortest column
  const layout = useMemo(() => {
    const cols = Math.max(2, Math.min(Math.ceil(shown.length / 2), Math.round((vw * 1.5) / (COL + GAP))))
    const heights = Array(cols).fill(0)
    const pos = new Map<string, { x: number; y: number; h: number }>()
    shown.forEach((t) => {
      const c = heights.indexOf(Math.min(...heights))
      const h = Math.round(COL * t.ratio) + 44
      pos.set(t.key, { x: c * (COL + GAP), y: heights[c], h })
      heights[c] += h + GAP
    })
    return { pos, w: cols * (COL + GAP) - GAP, h: Math.max(...heights) - GAP }
  }, [shown, vw])

  const apply = () => {
    const p = pan.current
    p.x = Math.min(0, Math.max(p.minX, p.x))
    p.y = Math.min(0, Math.max(p.minY, p.y))
    board.current?.style.setProperty('translate', `${p.x.toFixed(1)}px ${p.y.toFixed(1)}px`)
  }

  useLayoutEffect(() => {
    const v = view.current
    if (!v) return
    const p = pan.current
    p.minX = Math.min(0, v.clientWidth - layout.w - 48)
    p.minY = Math.min(0, v.clientHeight - layout.h - 48)
    p.x = p.minX / 2
    p.y = 0
    apply()
  }, [layout])

  useEffect(() => {
    const v = view.current
    if (!v) return
    const ro = new ResizeObserver(() => setVw(v.clientWidth))
    ro.observe(v)
    // a sideways trackpad swipe pans the board; up and down still scroll the page
    const wheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      pan.current.x -= e.deltaX
      hold.current = performance.now() + 3000
      apply()
    }
    v.addEventListener('wheel', wheel, { passive: false })
    return () => {
      ro.disconnect()
      v.removeEventListener('wheel', wheel)
    }
  }, [])

  // the drift: only while on screen and not paused or held
  useEffect(() => {
    if (paused) return
    let raf = 0
    let last = 0
    let visible = false
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) raf = requestAnimationFrame(step)
    })
    const step = (t: number) => {
      raf = 0
      if (!visible) return
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0
      last = t
      const p = pan.current
      if (!drag.current && t > hold.current) {
        p.x += p.dir * DRIFT * dt
        if (p.x <= p.minX || p.x >= 0) p.dir *= -1
        apply()
      }
      raf = requestAnimationFrame(step)
    }
    if (view.current) io.observe(view.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [paused])

  const down = (e: PointerEvent) => {
    if (e.button !== 0) return
    drag.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: pan.current.x, oy: pan.current.y, moved: false, until: 0 }
  }
  const move = (e: PointerEvent) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.sx
    const dy = e.pointerType === 'mouse' ? e.clientY - d.sy : 0
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true
      view.current?.setPointerCapture(e.pointerId)
      view.current?.setAttribute('data-drag', '')
    }
    if (!d.moved) return
    pan.current.x = d.ox + dx
    pan.current.y = d.oy + dy
    apply()
  }
  const up = () => {
    const d = drag.current
    view.current?.removeAttribute('data-drag')
    hold.current = performance.now() + 2500
    drag.current = null
    if (d?.moved) {
      // swallow the click that ends a drag
      const stop = (ev: Event) => {
        ev.stopPropagation()
        ev.preventDefault()
      }
      window.addEventListener('click', stop, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', stop, { capture: true }), 0)
    }
  }

  const reveal = (key: string) => {
    const v = view.current
    const at = layout.pos.get(key)
    if (!v || !at) return
    const p = pan.current
    if (at.x + p.x < 24 || at.x + COL + p.x > v.clientWidth - 24) p.x = v.clientWidth / 2 - at.x - COL / 2
    if (at.y + p.y < 24 || at.y + at.h + p.y > v.clientHeight - 24) p.y = v.clientHeight / 2 - at.y - at.h / 2
    hold.current = performance.now() + 4000
    apply()
  }

  const activate = (t: Tile) => (e: MouseEvent) => {
    e.preventDefault()
    if (t.to) navigate(t.to)
    else if (t.lb !== undefined) open(t.lb)
  }

  return (
    <section id="valley" className="rv-valley" aria-labelledby="valley-title" tabIndex={-1}>
      <div className="wrap">
        <header className="rv-head rv-head--row">
          <div>
            <p className="rv-eyebrow">Everything, in one place</p>
            <h2 id="valley-title" className="rv-title">
              The <em>design valley</em>
            </h2>
          </div>
          <p className="rv-head__note">Drag to wander. Products open their case study; everything else opens up close.</p>
        </header>
        <div className="rv-valley__bar">
          <div className="rv-filters" role="group" aria-label="Show">
            {FILTERS.map(([k, label]) => (
              <button key={k} type="button" className="rv-filter" aria-pressed={filter === k} onClick={() => setFilter(k)}>
                {label}
                <span className="rv-filter__n">{k === 'all' ? tiles.length : tiles.filter((t) => t.kind === k).length}</span>
              </button>
            ))}
          </div>
          <button type="button" className="rv-round" aria-pressed={paused} aria-label={paused ? 'Let the board drift' : 'Stop the drift'} onClick={() => setPaused((p) => !p)}>
            <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
          </button>
        </div>
      </div>
      <div ref={view} className="rv-valley__view" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <div ref={board} className="rv-valley__board" style={{ width: layout.w, height: layout.h }}>
          {shown.map((t) => {
            const at = layout.pos.get(t.key)!
            return (
              <a
                key={t.key}
                href={t.to ?? t.img}
                className="rv-tile"
                data-kind={t.kind}
                style={{ '--x': `${at.x}px`, '--y': `${at.y}px`, width: COL } as CSSProperties}
                onClick={activate(t)}
                onFocus={() => reveal(t.key)}
                draggable={false}
              >
                <span className="rv-tile__img" style={{ aspectRatio: `1 / ${t.ratio}` }}>
                  <img src={t.img} alt="" loading="lazy" decoding="async" draggable={false} />
                </span>
                <span className="rv-tile__title">{t.title}</span>
                <span className="rv-tile__meta">{t.meta}{t.to && <span aria-hidden="true"> →</span>}</span>
              </a>
            )
          })}
        </div>
      </div>
      {lightbox}
    </section>
  )
}
