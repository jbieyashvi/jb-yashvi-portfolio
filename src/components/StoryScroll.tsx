import { useEffect, useRef, type CSSProperties } from 'react'
import { COVER_V } from '../data/projects'

type Tone = 'sun' | 'sky' | 'rose' | 'lilac'
type Doodle = 'house' | 'circle' | 'under' | 'stars'
type Piece = string | { text: string; tone: Tone; doodle: Doodle }

// every fact here is from the résumé and the journey data
const story: Piece[] = [
  'I studied',
  { text: 'architecture', tone: 'sun', doodle: 'house' },
  'at MNIT Jaipur, then moved into',
  { text: 'product design.', tone: 'sky', doodle: 'circle' },
  'Now I’m a',
  { text: 'product designer', tone: 'rose', doodle: 'under' },
  'at Heizen, prototyping with',
  { text: 'Figma, Claude and Codex.', tone: 'lilac', doodle: 'stars' },
]

const plain = story.map((p) => (typeof p === 'string' ? p : p.text)).join(' ').replace(/ ,/g, ',')

// the words in reading order, numbered, so each one knows when it lights up
type Word = { text: string; i: number; glue: boolean }
type Run = { words: Word[]; mark?: { tone: Tone; doodle: Doodle; start: number; len: number } }
let count = 0
const runs: Run[] = story.map((p) => {
  const text = typeof p === 'string' ? p : p.text
  const words = text.split(' ').map((w, k) => ({ text: w, i: count++, glue: k === 0 && /^[,.]/.test(w) }))
  return typeof p === 'string' ? { words } : { words, mark: { tone: p.tone, doodle: p.doodle, start: words[0].i, len: words.length } }
})
const TOTAL = count
const startOf = (d: Doodle) => runs.find((r) => r.mark?.doodle === d)?.mark?.start ?? 0
const at = (d: Doodle) => ({ '--s': startOf(d) }) as CSSProperties

const DOODLES: Record<Doodle, { box: string; d: string }> = {
  house: { box: '0 0 30 26', d: 'M3 24 V11 L15 2.5 L27 11 V24 Z M11 24 V16 H19 V24 M3 24 H27' },
  circle: { box: '0 0 100 40', d: 'M54 4 C82 3 98 11 97 21 C96 33 72 38 47 37 C20 36 3 30 4 19 C5 9 25 4 60 6' },
  under: { box: '0 0 100 12', d: 'M2 8 C14 2 24 11 37 6 S61 2 74 7 S91 10 98 4' },
  stars: { box: '0 0 40 30', d: 'M12 3 L14 11 L22 13 L14 15 L12 23 L10 15 L2 13 L10 11 Z M31 1 L32.2 5.8 L37 7 L32.2 8.2 L31 13 L29.8 8.2 L25 7 L29.8 5.8 Z' },
}

/**
 * How I got here: a short story that is read in by scrolling. The section holds still while
 * each word turns from grey to ink in turn, the key phrases get a marker highlight, and a small
 * doodle draws itself beside each one. All of it runs off one number (--k, the words read so
 * far) set on the section, so a scroll frame is a single style write. With reduced motion the
 * story is shown whole and nothing holds.
 */
export default function StoryScroll() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--k', String(TOTAL + 4))
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const pin = el.firstElementChild as HTMLElement
      const top = parseFloat(getComputedStyle(pin).top) || 0
      const rect = el.getBoundingClientRect()
      // the next section slides up over the held story; that last stretch is not for reading
      const next = el.nextElementSibling as HTMLElement | null
      const cover = next ? Math.max(0, -parseFloat(getComputedStyle(next).marginTop)) : 0
      const run = el.offsetHeight - pin.offsetHeight - cover
      const p = run > 0 ? Math.min(1, Math.max(0, (top - rect.top) / run)) : 1
      el.style.setProperty('--cover', (cover > 0 ? Math.min(1, Math.max(0, (top - rect.top - run) / cover)) : 0).toFixed(3))
      // before it holds, the story rises at half speed and fades in, so it lands in the middle
      const lead = Math.max(0, rect.top - top)
      el.style.setProperty('--lead', lead.toFixed(1))
      el.style.setProperty('--fade', Math.max(0, 1 - lead / (window.innerHeight * 0.7)).toFixed(3))
      // read in over the first 80%, then hold the finished story for a beat
      el.style.setProperty('--k', (Math.min(1, p / 0.8) * (TOTAL + 3)).toFixed(2))
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
  }, [])

  return (
    <section ref={ref} id="story" className="story" aria-labelledby="story-title">
      <div className="story__pin">
        <div className="wrap">
          <h2 id="story-title" className="story__kicker">How I got here</h2>
          <p className="sr-only">{plain}</p>
          <p className="story__text" aria-hidden="true">
            {runs.map((r, n) => {
              const words = r.words.map((w, k) => (
                <span key={w.i}>
                  {k > 0 || (n > 0 && !r.mark && !w.glue) ? ' ' : ''}
                  <span className="story__w" style={{ '--i': w.i } as CSSProperties}>
                    {w.text}
                    {r.mark && k === r.words.length - 1 && (
                      <svg className={`story__doodle story__doodle--${r.mark.doodle}`} style={{ '--e': r.mark.start + r.mark.len } as CSSProperties} viewBox={DOODLES[r.mark.doodle].box} preserveAspectRatio={r.mark.doodle === 'circle' || r.mark.doodle === 'under' ? 'none' : undefined}>
                        <path d={DOODLES[r.mark.doodle].d} pathLength={1} />
                      </svg>
                    )}
                  </span>
                </span>
              ))
              if (!r.mark) return <span key={n}>{words}</span>
              return (
                <span key={n}>
                  {' '}
                  <span className={`story__mark story__mark--${r.mark.tone}`} style={{ '--s': r.mark.start, '--len': r.mark.len } as CSSProperties}>
                    {words}
                  </span>
                </span>
              )
            })}
          </p>
        </div>

        {/* the side cards: each one is pinned up as its phrase is read */}
        <div className="story__cards" aria-hidden="true">
          <figure className="scard scard--plan" style={at('house')}>
            <span className="scard__tape scard__tape--sun" />
            <svg className="scard__plan" viewBox="0 0 200 130">
              <path pathLength={1} d="M10 10 H190 V120 H10 Z M82 10 V58 M82 78 V120 M10 66 H58 M106 66 H190 M142 66 V120 M58 66 A24 24 0 0 1 82 90" />
            </svg>
            <figcaption>B.Arch · MNIT Jaipur · 2025</figcaption>
          </figure>
          <figure className="scard scard--compass" style={at('circle')}>
            <span className="scard__tape scard__tape--sky" />
            <img src={`/work/featured/compass-640.webp${COVER_V}`} width={640} height={427} alt="" loading="lazy" decoding="async" />
            <figcaption>Compass Group, CMP Autobot</figcaption>
          </figure>
          <figure className="scard scard--shipway" style={at('under')}>
            <span className="scard__tape scard__tape--rose" />
            <img src={`/work/featured/shipway-640.webp${COVER_V}`} width={640} height={427} alt="" loading="lazy" decoding="async" />
            <figcaption>Shipway at Heizen</figcaption>
          </figure>
          <ul className="scard scard--tools" style={at('stars')}>
            <li className="stool stool--figma">Figma</li>
            <li className="stool stool--claude">Claude</li>
            <li className="stool stool--codex">Codex</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
