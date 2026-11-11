import { useEffect, useRef, type CSSProperties } from 'react'
import { COVER_V } from '../data/projects'
import { DOODLES } from './doodles'

type Tone = 'sun' | 'sky' | 'rose' | 'lilac'
type Doodle = 'me' | 'circle' | 'under' | 'stars' | 'double'
type Piece = string | { text: string; tone: Tone; doodle: Doodle }

// Jb's own words about how architecture shaped the way they design
const story: Piece[] = [
  'I studied',
  { text: 'architecture', tone: 'sun', doodle: 'me' },
  ', where I learned how people',
  { text: 'move through spaces', tone: 'sky', doodle: 'under' },
  'and how',
  { text: 'small design changes', tone: 'rose', doodle: 'circle' },
  'shape what they feel. Now I bring that to',
  { text: 'product design:', tone: 'lilac', doodle: 'stars' },
  'making complex work clear, so it has',
  { text: 'a real impact.', tone: 'sun', doodle: 'double' },
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
const at = (d: Doodle, later = 0) => ({ '--s': startOf(d) + later }) as CSSProperties

// architecture gets a small 3D avatar instead of a drawn doodle (see Me); the rest are in DOODLES

/** a small 3D avatar of me that pops up once its phrase is read, then sways gently */
function Me({ e }: { e: number }) {
  return (
    <span className="story__me" style={{ '--e': e } as CSSProperties}>
      <img src="/story/me-128.webp" srcSet="/story/me-128.webp 128w, /story/me-256.webp 256w" sizes="64px" width={128} height={128} alt="" decoding="async" />
    </span>
  )
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
                    {r.mark && k === r.words.length - 1 && r.mark.doodle === 'me' && <Me e={r.mark.start + r.mark.len} />}
                    {r.mark && k === r.words.length - 1 && r.mark.doodle !== 'me' && (
                      <svg className={`story__doodle story__doodle--${r.mark.doodle}`} style={{ '--e': r.mark.start + r.mark.len } as CSSProperties} viewBox={DOODLES[r.mark.doodle].box} preserveAspectRatio={r.mark.doodle === 'circle' || r.mark.doodle === 'under' || r.mark.doodle === 'double' ? 'none' : undefined}>
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
          <figure className="scard scard--mnit" style={at('me')}>
            <span className="scard__tape scard__tape--sun" />
            {/* holding up the thesis on campus; the roll number on its cover is blurred */}
            <img src="/story/mnit-thesis-460.webp" srcSet="/story/mnit-thesis-460.webp 460w, /story/mnit-thesis-920.webp 920w" sizes="230px" width={460} height={575} alt="" loading="lazy" decoding="async" />
            <figcaption>B.Arch · MNIT Jaipur · 2025</figcaption>
          </figure>
          {/* product design: two of the products, pinned up one after the other */}
          <figure className="scard scard--compass" style={at('stars')}>
            <span className="scard__tape scard__tape--sky" />
            <img src={`/work/featured/compass-640.webp${COVER_V}`} width={640} height={427} alt="" loading="lazy" decoding="async" />
            <figcaption>Compass Group, CMP Autobot<span className="scard__impact">30+ users · 7+ sites</span></figcaption>
          </figure>
          <figure className="scard scard--shipway" style={at('stars', 3)}>
            <span className="scard__tape scard__tape--rose" />
            <img src={`/work/featured/shipway-640.webp${COVER_V}`} width={640} height={427} alt="" loading="lazy" decoding="async" />
            <figcaption>Shipway at Heizen<span className="scard__impact">Live · 10K+ downloads</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
