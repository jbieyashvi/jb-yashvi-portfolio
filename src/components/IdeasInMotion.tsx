import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { playgroundRows } from '../data/playground'
import { useLightbox } from './Lightbox'
import { mid } from './srcset'

/** pixels per second; both rows travel at the same speed */
const SPEED = 32
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
const items = playgroundRows.flat()
/** where each row's previews begin in the enlarged view's sequence */
const rowStart = playgroundRows.map((_, r) => playgroundRows.slice(0, r).flat().length)

const canMove = () =>
  typeof window !== 'undefined' && 'animate' in Element.prototype && window.matchMedia(MOTION_QUERY).matches

/**
 * Ideas in motion: the self-initiated interface and logo explorations as two rows drifting
 * slowly in opposite directions, independent of page scroll.
 *
 * Each row repeats its set of previews enough times to cover the screen plus one set, and a
 * Web Animation moves it by exactly one set's width (measured from the first preview of the
 * first copy to the first preview of the second), so the end frame matches the start frame
 * and the loop has no seam. Only the first copy is in the accessibility tree and tab order.
 *
 * The rows keep moving under the mouse (a preview can be clicked as it passes). Motion stops
 * on keyboard focus (the focused preview is brought fully into view), while the enlarged view
 * is open, when the section is off screen, and eases to a stop whenever the Pause button is on. With reduced motion, or without the Web Animations
 * API, the rows are a still, horizontally scrollable strip.
 */
export default function IdeasInMotion() {
  const root = useRef<HTMLElement>(null)
  const rowEls = useRef<(HTMLDivElement | null)[]>([])
  const trackEls = useRef<(HTMLUListElement | null)[]>([])
  const [moving, setMoving] = useState(canMove)
  const [reps, setReps] = useState<number[]>(() => playgroundRows.map(() => 3))
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)
  const { open, lightbox } = useLightbox(items)

  // follow the reduced-motion setting if it changes while the page is open
  useEffect(() => {
    const mq = window.matchMedia(MOTION_QUERY)
    const on = () => setMoving(canMove())
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useLayoutEffect(() => {
    const section = root.current
    if (!moving || !section) return
    const rows = rowEls.current
    const tracks = trackEls.current
    const anims: (Animation | null)[] = []
    const widths: number[] = []
    // where each row starts, as a share of one loop; the offset staggers the two rows
    const progress: number[] = playgroundRows.map((_, r) => (r === 0 ? 0 : 0.42))

    let focus = false
    let offscreen = false
    let rate = 1
    let raf = 0

    const target = () => (pausedRef.current || focus || offscreen ? 0 : 1)
    const apply = () => anims.forEach((a) => a && (a.playbackRate = rate))
    // ease the speed towards its target, so pausing never jerks the rows to a halt
    const tick = () => {
      const t = target()
      rate += (t - rate) * 0.12
      if (Math.abs(t - rate) < 0.01) rate = t
      apply()
      raf = rate === t ? 0 : requestAnimationFrame(tick)
    }
    const settle = (now = false) => {
      if (now) {
        cancelAnimationFrame(raf)
        raf = 0
        rate = target()
        apply()
      } else if (!raf) raf = requestAnimationFrame(tick)
    }

    const build = () => {
      let need = false
      const next = tracks.map((t, r) => {
        const row = rows[r]
        if (!t || !row) return reps[r]
        const n = playgroundRows[r].length
        // measured to the subpixel (offsetLeft rounds), so the loop lands exactly on the next copy
        const set = t.children[n].getBoundingClientRect().left - t.children[0].getBoundingClientRect().left
        const want = Math.max(2, Math.ceil(row.clientWidth / set) + 1)
        if (want > reps[r]) need = true
        if (set !== widths[r]) {
          const old = anims[r]
          if (old?.effect?.getComputedTiming().duration) {
            const d = old.effect.getComputedTiming().duration as number
            progress[r] = ((old.currentTime as number) % d) / d
          }
          old?.cancel()
          widths[r] = set
          const [from, to] = r % 2 === 0 ? [0, -set] : [-set, 0]
          const a = t.animate([{ transform: `translate3d(${from}px,0,0)` }, { transform: `translate3d(${to}px,0,0)` }], {
            duration: (set / SPEED) * 1000,
            iterations: Infinity,
            easing: 'linear',
          })
          a.currentTime = progress[r] * (set / SPEED) * 1000
          a.playbackRate = rate
          anims[r] = a
        }
        return want
      })
      if (need) setReps(next)
    }
    build()

    const ro = new ResizeObserver(build)
    rows.forEach((r) => r && ro.observe(r))
    // without an observer the rows simply keep moving while the page is open
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => {
          offscreen = !e.isIntersecting
          settle(true)
        })
      : null
    io?.observe(section)

    // keyboard focus on a preview: stop at once, and slide the row so it is fully visible (a tap
    // or click focuses the preview too, and the Pause button may hold focus while the rows play;
    // neither should hold the rows still)
    const onFocusIn = (e: FocusEvent) => {
      const el = e.target as Element
      focus = !!el.closest?.('dialog') || (!!el.closest?.('.ideas__tile') && el.matches(':focus-visible'))
      settle(focus)
      if (!focus) return
      const btn = el.closest?.('.ideas__tile') as HTMLElement | null
      const r = btn ? rows.findIndex((row) => row?.contains(btn)) : -1
      const a = anims[r]
      if (!btn || r < 0 || !a) return
      const box = rows[r]!.getBoundingClientRect()
      const b = btn.getBoundingClientRect()
      if (b.left >= box.left && b.right <= box.right) return
      const set = widths[r]
      const x = -(btn.parentElement as HTMLElement).offsetLeft // flush with the row's left edge
      const p = r % 2 === 0 ? -x / set : (x + set) / set
      // a full loop wraps back to the start, so stop just short of it
      a.currentTime = Math.min(Math.max(p, 0), 0.99999) * (set / SPEED) * 1000
    }
    const onFocusOut = (e: FocusEvent) => {
      if (section.contains(e.relatedTarget as Node | null)) return
      focus = false
      settle()
    }
    section.addEventListener('focusin', onFocusIn)
    section.addEventListener('focusout', onFocusOut)
    const onToggle = () => settle()
    section.addEventListener('ideas:toggle', onToggle)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io?.disconnect()
      anims.forEach((a) => a?.cancel())
      section.removeEventListener('focusin', onFocusIn)
      section.removeEventListener('focusout', onFocusOut)
      section.removeEventListener('ideas:toggle', onToggle)
    }
  }, [moving, reps])

  const toggle = () => {
    pausedRef.current = !paused
    setPaused(!paused)
    root.current?.dispatchEvent(new Event('ideas:toggle'))
  }

  return (
    <section
      ref={root}
      id="ideas"
      className={`ideas${moving ? ' is-moving' : ''}`}
      aria-labelledby="ideas-title"
      tabIndex={-1}
    >
      <div className="wrap ideas__head">
        <div className="ideas__intro">
          <h2 id="ideas-title" className="ideas__title">Ideas in motion</h2>
          <p className="ideas__note">A collection of interfaces, identities and experiments.</p>
        </div>
        {moving && (
          <button type="button" className="ideas__toggle" aria-pressed={paused} onClick={toggle}>
            <span aria-hidden="true" className={`ideas__icon ideas__icon--${paused ? 'play' : 'pause'}`} />
            {paused ? 'Play' : 'Pause'}
            <span className="sr-only"> the moving showcase</span>
          </button>
        )}
      </div>

      <div className="ideas__rows">
        {playgroundRows.map((row, r) => {
          const copies = moving ? reps[r] : 1
          return (
            <div key={r} ref={(el) => void (rowEls.current[r] = el)} className="ideas__row">
              <ul ref={(el) => void (trackEls.current[r] = el)} className="ideas__track">
                {Array.from({ length: copies }, (_, c) =>
                  row.map((item, i) => (
                    <li
                      key={`${c}-${item.slug}`}
                      className="ideas__item"
                      aria-hidden={c > 0 || undefined}
                      style={{ '--ar': item.preview ?? item.w / item.h } as CSSProperties}
                    >
                      <button
                        type="button"
                        className="ideas__tile"
                        tabIndex={c > 0 ? -1 : undefined}
                        aria-label={`Enlarge: ${item.caption}`}
                        onClick={() => open(rowStart[r] + i)}
                      >
                        <img
                          src={`${item.src}-800.webp`}
                          srcSet={`${item.src}-800.webp 800w, ${mid(item.src, item.w)}${item.src}-1800.webp ${item.w}w`}
                          sizes={`${Math.round((item.preview ?? item.w / item.h) * 266)}px`}
                          width={item.w}
                          height={item.h}
                          alt={c > 0 ? '' : item.alt}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className={item.preview ? 'is-top' : undefined}
                        />
                      </button>
                    </li>
                  )),
                )}
              </ul>
            </div>
          )
        })}
      </div>
      {lightbox}
    </section>
  )
}
