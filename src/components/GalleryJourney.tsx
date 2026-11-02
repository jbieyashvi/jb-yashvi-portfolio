import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { art, artKinds, type ArtItem, type ArtKind } from '../data/art'
import { useLightbox } from './Lightbox'
import { mid } from './srcset'

/** every piece in its original colour here, including the photos shown in grayscale elsewhere */
const pieces = art.map((i) => ({ ...i, mono: false }))
const bySlug = new Map(pieces.map((p) => [p.slug, p]))

/**
 * How each chapter is composed, as groups of slugs in page order. Art and Studio: the first
 * slug leads (large), the rest support it. Personal: a landscape on its own runs wide, two
 * portraits make a pair, a portrait on its own closes the sequence. Any piece of a chapter
 * left out here is still shown, appended to the end of its chapter on its own.
 */
const LAYOUT: Record<ArtKind, string[][]> = {
  art: [['earth', 'galaxy', 'faces'], ['portrait', 'skulls'], ['seated-figure', 'face-drawing'], ['bearded-figure', 'skull-pencil']],
  studio: [['studio-corner', 'red-wall'], ['study', 'rocket', 'toys']],
  personal: [['window'], ['roof', 'cliff'], ['sunset'], ['swing', 'shoreline'], ['water']],
}

type Piece = ArtItem & { mono: boolean }

const chapters = artKinds.map((k) => {
  const own = pieces.filter((p) => p.kind === k.kind)
  const used = new Set<string>()
  const placed = LAYOUT[k.kind]
    .map((g) =>
      g.flatMap((s) => {
        const p = bySlug.get(s)
        if (!p || p.kind !== k.kind || used.has(s)) return []
        used.add(s)
        return [p]
      }),
    )
    .filter((g) => g.length)
  const groups: Piece[][] = [...placed, ...own.filter((p) => !used.has(p.slug)).map((p) => [p])]
  return { ...k, groups, count: own.length }
})

/** the whole collection in page order: what the enlarged view steps through */
const ordered = chapters.flatMap((c) => c.groups.flat())
const indexOf = new Map(ordered.map((p, i) => [p.slug, i]))
const artScenes = chapters.find((c) => c.kind === 'art')?.groups ?? []
const artTotal = artScenes.flat().length
/** each art composition's place in the chapter, for the label: "1–3 of 9" */
const sceneStart = artScenes.map((_, g) => artScenes.slice(0, g).flat().length)

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
const WIDE_QUERY = '(min-width: 761px)'
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

/**
 * The scroll engine for the journey. One rAF-throttled pass per scroll frame:
 * - [data-speed] figures drift vertically around their resting place, by their distance from
 *   the middle of the viewport (faster speeds move further), so a composition parts gently;
 * - [data-zoom] figures get --z (1 below the middle of the viewport, 0 from the middle up),
 *   which settles the photo inside its frame from a slight zoom to its full, uncropped view;
 * - [data-stage] scenes get --p (0 to 1, eased) as they arrive, which slides their pieces
 *   into their aligned positions; on wide, tall screens the scene holds briefly (sticky) and
 *   the slide completes while it is held;
 * - it reports the art composition nearest the middle of the viewport and the current chapter.
 * Every resting state is the default in CSS, so if this never runs nothing is out of place.
 */
function useJourney(onArt: (i: number) => void, onChapter: (k: ArtKind | null) => void) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const motion = window.matchMedia(MOTION_QUERY)
    const wide = window.matchMedia(WIDE_QUERY)
    const drifting = [...el.querySelectorAll<HTMLElement>('[data-speed]')]
    const zooming = [...el.querySelectorAll<HTMLElement>('[data-zoom]')]
    const stages = [...el.querySelectorAll<HTMLElement>('[data-stage]')]
    const scenes = [...el.querySelectorAll<HTMLElement>('[data-scene]')]
    const chapterEls = [...el.querySelectorAll<HTMLElement>('[data-chapter]')]
    // the drift applied last frame, so each figure is measured at its resting place
    const drift = new Map<HTMLElement, number>()
    let raf = 0

    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const on = motion.matches
      const reach = wide.matches ? 56 : 18

      for (const f of drifting) {
        if (!on) {
          f.style.translate = ''
          drift.delete(f)
          continue
        }
        const r = f.getBoundingClientRect()
        const top = r.top - (drift.get(f) ?? 0)
        if (top > vh * 2 || top + r.height < -vh) continue
        const d = clamp((top + r.height / 2 - vh / 2) / vh, -1, 1)
        const y = Math.round(d * Number(f.dataset.speed) * reach * 10) / 10
        drift.set(f, y)
        f.style.translate = `0 ${y}px`
      }

      for (const f of zooming) {
        if (!on) {
          f.style.removeProperty('--z')
          continue
        }
        const r = f.getBoundingClientRect()
        const mid = r.top - (drift.get(f) ?? 0) + r.height / 2
        f.style.setProperty('--z', clamp((mid - vh / 2) / (vh * 0.55)).toFixed(3))
      }

      for (const s of stages) {
        if (!on) {
          s.style.removeProperty('--p')
          continue
        }
        const pin = s.firstElementChild as HTMLElement
        const held = s.offsetHeight - pin.offsetHeight
        const r = s.getBoundingClientRect()
        if (r.top > vh * 1.5 || r.bottom < -vh * 0.5) continue
        const pinTop = parseFloat(getComputedStyle(pin).top) || 0
        // held scenes finish sliding a little past halfway through the hold, leaving the
        // settled composition on screen for the rest of it
        const span = held > 1 ? vh - pinTop + held * 0.55 : vh * 0.6
        const t = clamp((vh - r.top) / span)
        s.style.setProperty('--p', (1 - (1 - t) ** 3).toFixed(3))
      }

      let best = 0
      let bestD = Infinity
      for (const sc of scenes) {
        const r = sc.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - vh / 2)
        if (d < bestD) {
          bestD = d
          best = Number(sc.dataset.scene)
        }
      }
      onArt(best)

      let current: ArtKind | null = null
      for (const c of chapterEls) if (c.getBoundingClientRect().top <= vh * 0.4) current = c.dataset.chapter as ArtKind
      onChapter(current)
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    const ro = new ResizeObserver(schedule)
    ro.observe(el)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    motion.addEventListener('change', schedule)
    wide.addEventListener('change', schedule)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      motion.removeEventListener('change', schedule)
      wide.removeEventListener('change', schedule)
    }
  }, [onArt, onChapter])

  return root
}

interface FigProps {
  item: Piece
  open: (i: number) => void
  className: string
  sizes: string
  speed?: number
  zoom?: boolean
  delay?: number
  onHot?: (slug: string | null) => void
}

/** one piece: the whole image in a frame of its own proportions, opening the enlarged view */
function Fig({ item, open, className, sizes, speed, zoom, delay = 0, onHot }: FigProps) {
  const hot = onHot && { onPointerEnter: () => onHot(item.slug), onPointerLeave: () => onHot(null), onFocus: () => onHot(item.slug), onBlur: () => onHot(null) }
  return (
    <figure
      className={`jr-fig ${className}`}
      data-reveal=""
      data-speed={speed}
      data-zoom={zoom ? '' : undefined}
      style={{ '--ar': item.w / item.h, '--delay': `${delay}s` } as CSSProperties}
    >
      <button
        {...hot}
        type="button"
        className="jr-btn"
        onClick={() => open(indexOf.get(item.slug)!)}
        aria-label={`Enlarge: ${item.caption}`}
      >
        <span className="jr-mask">
          <img
            src={`${item.src}-800.webp`}
            srcSet={`${item.src}-800.webp 800w, ${mid(item.src, item.w)}${item.src}-1800.webp ${item.w}w`}
            sizes={sizes}
            width={item.w}
            height={item.h}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </span>
      </button>
      <figcaption className="jr-cap">{item.caption}</figcaption>
    </figure>
  )
}

const LEAD_SIZES = '(max-width: 760px) 92vw, 52vw'
const SIDE_SIZES = '(max-width: 760px) 46vw, 24vw'

/**
 * The Gallery body: a continuous journey through the three chapters, after the opening.
 * Art is a sequence of compositions (a large lead and smaller supporting pieces, alternating
 * sides) beside a sticky label that names the piece in view. Studio holds each composition
 * briefly while its pieces slide into alignment around one larger anchor. Personal is a
 * cinematic run of wide landscapes and staggered portrait pairs that settle as they arrive.
 *
 * Pieces open through rectangular masks (the site's one-time [data-reveal] entrance) and
 * drift at different speeds with scrolling. Scrolling is never taken over: the held studio
 * scenes are sticky, so they release with the page. On small screens the compositions stack
 * simply and move less; with reduced motion everything is a still, readable layout.
 */
export default function GalleryJourney() {
  const [scene, setScene] = useState(0)
  const [hot, setHot] = useState<string | null>(null)
  const [chapter, setChapter] = useState<ArtKind | null>(null)
  const root = useJourney(setScene, setChapter)
  const { open, lightbox } = useLightbox(ordered)
  const now = artScenes[scene] ?? []

  return (
    <div ref={root} className="jr">
      <nav className="jr-bar" aria-label="Gallery chapters">
        <div className="wrap">
          <ul className="jr-bar__inner">
            {chapters.map((c) => (
              <li key={c.kind}>
                <a href={`#${c.kind}`} className="jr-bar__link" aria-current={chapter === c.kind ? 'location' : undefined}>
                  {c.label} <span className="jr-bar__n">{c.count}</span>
                </a>
              </li>
            ))}
            <li className="jr-bar__total">
              {ordered.length} {ordered.length === 1 ? 'piece' : 'pieces'}
            </li>
          </ul>
        </div>
      </nav>

      {chapters.map((c) => {
        if (c.kind === 'art')
          return (
            <section key={c.kind} id={c.kind} data-chapter={c.kind} className="wrap jr-chapter jr-art" aria-labelledby="ch-art">
              <div className="art-rail">
                <h2 id="ch-art" className="jr-title">
                  {c.label}
                </h2>
                <p className="jr-intro">{c.intro}</p>
                {now.length > 0 && (
                  <div className="art-rail__now" aria-hidden="true">
                    <ul key={scene} className="art-rail__caps">
                      {now.map((p) => (
                        <li key={p.slug} className={hot === p.slug ? 'is-hot' : undefined}>
                          {p.caption}
                        </li>
                      ))}
                    </ul>
                    <p className="art-rail__count">
                      {now.length > 1
                        ? `${sceneStart[scene] + 1}–${sceneStart[scene] + now.length}`
                        : sceneStart[scene] + 1}{' '}
                      of {artTotal}
                    </p>
                  </div>
                )}
              </div>
              <div className="art-scenes">
                {c.groups.map(([lead, ...side], g) => (
                  <div key={lead.slug} data-scene={g} className={`art-scene${g % 2 ? ' art-scene--flip' : ''}`}>
                    <Fig item={lead} open={open} className="jr-fig--lead" sizes={LEAD_SIZES} speed={0.45} onHot={setHot} />
                    {side.length > 0 && (
                      <div className={`art-scene__side art-scene__side--${side.length}`}>
                        {side.map((p, s) => (
                          <Fig
                            key={p.slug}
                            item={p}
                            open={open}
                            className="jr-fig--side"
                            sizes={SIDE_SIZES}
                            speed={1.05 + s * 0.35}
                            delay={0.12 + s * 0.1}
                            onHot={setHot}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )

        const head = (
          <header className="jr-head">
            <h2 id={`ch-${c.kind}`} className="jr-title">
              {c.label}
            </h2>
            <p className="jr-intro">{c.intro}</p>
          </header>
        )

        if (c.kind === 'studio')
          return (
            <section key={c.kind} id={c.kind} data-chapter={c.kind} className="jr-chapter jr-studio" aria-labelledby="ch-studio">
              <div className="wrap">{head}</div>
              {c.groups.map(([lead, ...side], g) => (
                <div key={lead.slug} className="jr-stage" data-stage="">
                  <div className="jr-stage__pin">
                    <div className={`wrap studio-comp${g % 2 ? ' studio-comp--flip' : ''}`}>
                      <Fig item={lead} open={open} className="jr-fig--anchor" sizes={LEAD_SIZES} />
                      {side.map((p, s) => (
                        <Fig
                          key={p.slug}
                          item={p}
                          open={open}
                          className={`jr-fig--support jr-fig--s${s + 1}`}
                          sizes={SIDE_SIZES}
                          delay={0.1 + s * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )

        let wides = 0
        let pairs = 0
        return (
          <section key={c.kind} id={c.kind} data-chapter={c.kind} className="wrap jr-chapter jr-personal" aria-labelledby="ch-personal">
            {head}
            {c.groups.map((g) => {
              if (g.length > 1)
                return (
                  <div key={g[0].slug} className={`reel reel--pair${pairs++ % 2 ? ' reel--pair-flip' : ''}`}>
                    {g.map((p, s) => (
                      <Fig key={p.slug} item={p} open={open} className="jr-fig--portrait" sizes={SIDE_SIZES} speed={0.5 + s * 0.7} delay={s * 0.12} />
                    ))}
                  </div>
                )
              const [p] = g
              const landscape = p.w > p.h
              return (
                <div key={p.slug} className={`reel ${landscape ? `reel--wide${wides++ % 2 ? ' reel--end' : ''}` : 'reel--single'}`}>
                  <Fig
                    item={p}
                    open={open}
                    className={landscape ? 'jr-fig--wide' : 'jr-fig--portrait'}
                    sizes={landscape ? '(max-width: 760px) 92vw, 70vw' : SIDE_SIZES}
                    speed={landscape ? 0.3 : 0.6}
                    zoom={landscape}
                  />
                </div>
              )
            })}
            <footer className="jr-end" data-reveal="">
              <p className="jr-end__line">A little more of me, beyond the screen.</p>
              <Link to="/#outside" className="gallery-page__back">
                <span aria-hidden="true">←</span> Back to home
              </Link>
            </footer>
          </section>
        )
      })}

      {lightbox}
    </div>
  )
}
