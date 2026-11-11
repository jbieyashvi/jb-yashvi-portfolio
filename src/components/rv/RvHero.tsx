import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { contact } from '../../data/projects'
import KeyIntro from './KeyIntro'
import SceneVideo from './SceneVideo'
import { setTheme, useTheme } from '../theme'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

/* every answer is copied from words already on the site (About, the hero, How I got here);
   {braces} mark a name shown as a chip inside the answer */
const QA: { q: string; a: string; from: [label: string, href: string][] }[] = [
  {
    q: 'Who are you?',
    a: 'I’m Jb Yashvi, a senior product designer at {Heizen}, designing web and mobile experiences across SaaS, e-commerce, logistics and operations.',
    from: [['About me', '#about'], ['Résumé', contact.resume]],
  },
  {
    q: 'What do you design?',
    a: 'I design clear, intuitive web and mobile experiences across SaaS, e-commerce, logistics and operations, using AI-assisted prototyping to bring ideas to life.',
    from: [['Selected work', '#work']],
  },
  {
    q: 'How do you start?',
    a: 'It starts with asking the right questions. I tend to notice the small things and ask questions to understand what people need. Those conversations often shape where I start.',
    from: [['About me', '#about']],
  },
  {
    q: 'Why architecture?',
    a: 'I studied architecture at {MNIT Jaipur}. It taught me how people move through spaces, and how small design tweaks change the way they feel. Now I use that in product design, to make complex things clear and useful.',
    from: [['My story', '#about'], ['B.Arch · MNIT Jaipur', '#about']],
  },
]

/** the answer as runs of plain text and {chips}, and its plain text for copying */
const parts = (a: string) => a.split(/(\{[^}]+\})/).filter(Boolean).map((t) => (t.startsWith('{') ? { chip: true, t: t.slice(1, -1) } : { chip: false, t }))
const plain = (a: string) => a.replace(/[{}]/g, '')

/** an answer that types itself in, a few characters a frame; whole at once with reduced motion.
 *  `run` restarts it (Regenerate). */
function useTyped(text: string, run: number) {
  const key = `${run}:${text}`
  const [typed, setTyped] = useState({ key, n: 0 })
  // a new answer starts again from nothing
  if (typed.key !== key) setTyped({ key, n: 0 })
  const still = !window.matchMedia(MOTION_QUERY).matches
  useEffect(() => {
    if (still) return
    let raf = 0
    let last = 0
    const step = (t: number) => {
      if (t - last > 16) {
        last = t
        setTyped((v) => (v.key === key ? { key, n: Math.min(text.length, v.n + 2) } : v))
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [key, text, still])
  return still ? text.length : typed.key === key ? typed.n : 0
}

const ACT = {
  copy: <path d="M9 9h10v10H9zM5 15V5h10" />,
  again: <path d="M19 12a7 7 0 1 1-2.05-4.95M19 4.5V8h-3.5" />,
  up: <path d="M7 11v8H4.5v-8zM7 11l3.5-6.5c1.4 0 2.2.9 2 2.3L12 10h5.6a1.6 1.6 0 0 1 1.6 1.9l-1.3 6a1.6 1.6 0 0 1-1.6 1.1H7" />,
  down: <path d="M7 13V5H4.5v8zM7 13l3.5 6.5c1.4 0 2.2-.9 2-2.3L12 14h5.6a1.6 1.6 0 0 0 1.6-1.9l-1.3-6A1.6 1.6 0 0 0 16.3 5H7" />,
}
const ActIcon = ({ d }: { d: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {d}
  </svg>
)

/**
 * Ask me, set like a chat reply: the question, an answer that types itself in (names as chips),
 * a row of actions (copy, regenerate, a thumbs up or down that stays on this page) with its
 * sources, and the other questions as follow-ups.
 */
function Ask() {
  const [i, setI] = useState(0)
  const [run, setRun] = useState(0)
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [copied, setCopied] = useState(false)
  const item = QA[i]
  const text = plain(item.a)
  const n = useTyped(text, run)
  const done = n === text.length

  const ask = (k: number) => {
    setI(k)
    setVote(null)
    setCopied(false)
  }
  const copy = () => {
    navigator.clipboard?.writeText(text).then(() => setCopied(true), () => {})
  }

  // show each run up to the typed count; a chip appears whole once the typing reaches it
  const runs = parts(item.a)
  const starts = runs.map((_, k) => runs.slice(0, k).reduce((sum, r) => sum + r.t.length, 0))
  const shown = runs.map((r, k) => {
    const vis = Math.max(0, Math.min(r.t.length, n - starts[k]))
    if (!vis) return null
    return r.chip ? <span key={k} className="rv-ask__chip"><span aria-hidden="true">{r.t[0]}</span>{r.t}</span> : <span key={k}>{r.t.slice(0, vis)}</span>
  })

  return (
    <div className="rv-ask" aria-labelledby="rv-ask-q">
      <p id="rv-ask-q" className="rv-ask__you">
        <span className="sr-only">Question: </span>
        {item.q}
      </p>
      <p className="rv-ask__a" aria-live="polite">
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {shown}
          {!done && <span className="rv-ask__caret" />}
        </span>
      </p>
      <div className="rv-ask__bar" data-done={done || undefined}>
        <div className="rv-ask__acts">
          <button type="button" className="rv-ask__act" onClick={copy} aria-label={copied ? 'Copied' : 'Copy answer'} title={copied ? 'Copied' : 'Copy'}>
            <ActIcon d={copied ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : ACT.copy} />
          </button>
          <button type="button" className="rv-ask__act" onClick={() => setRun(run + 1)} aria-label="Type the answer again" title="Regenerate">
            <ActIcon d={ACT.again} />
          </button>
          <button type="button" className="rv-ask__act" aria-pressed={vote === 'up'} onClick={() => setVote(vote === 'up' ? null : 'up')} aria-label="Good answer" title="Good answer">
            <ActIcon d={ACT.up} />
          </button>
          <button type="button" className="rv-ask__act" aria-pressed={vote === 'down'} onClick={() => setVote(vote === 'down' ? null : 'down')} aria-label="Not helpful" title="Not helpful">
            <ActIcon d={ACT.down} />
          </button>
        </div>
        <span className="rv-ask__from">
          {item.from.map(([label, href]) => (
            <a key={label} href={href} title={label} {...(href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}>
              <span aria-hidden="true">{label[0]}</span>
              <span className="sr-only">{label}</span>
            </a>
          ))}
          {item.from.length} {item.from.length === 1 ? 'source' : 'sources'}
        </span>
      </div>
      <div className="rv-ask__fu">
        <p className="rv-ask__fu-head">Follow-ups</p>
        <ul>
          {QA.map((x, k) =>
            k === i ? null : (
              <li key={x.q}>
                <button type="button" onClick={() => ask(k)}>
                  <span aria-hidden="true">↩</span>
                  {x.q}
                </button>
              </li>
            ),
          )}
          <li>
            <a href="#valley">
              <span aria-hidden="true">↩</span>
              Wander the valley
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

/* ---- the valley under the hero: real meadows filmed by others (credited in the footer) ---- */

// fireflies over the night meadow, spread by a golden-angle step so they never bunch up
const FLIES = Array.from({ length: 14 }, (_, k) => ({ x: (k * 61.8) % 100, y: 55 + ((k * 37) % 35) }))

/**
 * The valley under the hero: a lupin meadow under the mountains by day and the Milky Way over a
 * meadow by night, crossfading with the site's theme. The sun (or moon) in the sky is the theme
 * switch: rings spread from it and the new theme spreads with them. A press anywhere on the valley
 * works too (the orb stays the keyboard's way in). The view leans with the
 * pointer, fireflies come out at night, and the clips stay still with reduced motion.
 */
function Scene() {
  const theme = useTheme()
  const night = theme === 'dark'
  const ref = useRef<HTMLDivElement>(null)
  const [hi, setHi] = useState(false)
  // rings spread from the sun or moon, and the new theme spreads with them
  const [rings, setRings] = useState(0)
  const flip = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setRings((n) => n + 1)
    setTheme(night ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }
  // a press anywhere else on the valley does the same, spreading the new theme from that point
  const flipHere = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('.rv-me, .rv-orb')) return
    setRings((n) => n + 1)
    setTheme(night ? 'light' : 'dark', { x: e.clientX, y: e.clientY })
  }

  const lean = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const el = ref.current!
    el.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3))
    el.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3))
  }
  const rest = () => {
    ref.current?.style.setProperty('--px', '0')
    ref.current?.style.setProperty('--py', '0')
  }

  return (
    <div ref={ref} className="rv-scene" data-tap="" onClick={flipHere} onPointerMove={lean} onPointerLeave={rest}>
      <div className="rv-scene__view">
        <SceneVideo name="meadow-day" on={!night} className="rv-scene__clip" />
        <SceneVideo name="meadow-night" on={night} className="rv-scene__clip" />
      </div>
      <div className="rv-scene__flies" aria-hidden="true">
        {FLIES.map(({ x, y }, k) => <span key={k} style={{ left: `${x}%`, top: `${y}%`, '--k': k } as CSSProperties} />)}
      </div>
      <button type="button" className="rv-me" data-on={hi || undefined} onPointerEnter={() => setHi(true)} onPointerLeave={() => setHi(false)} onClick={() => setHi((v) => !v)}>
        <img src="/about/jb-face-96.webp" srcSet="/about/jb-face-96.webp 96w, /about/jb-face-192.webp 192w" sizes="56px" width={96} height={96} alt="" decoding="async" />
        <span className="rv-me__say">Hi, I’m Jb!</span>
      </button>
      <div className="rv-scene__grain" aria-hidden="true" />
      <button type="button" className="rv-orb" onClick={flip} aria-label={`Switch the site to ${night ? 'day' : 'night'}`}>
        <span className="rv-orb__sun" aria-hidden="true" />
        <span className="rv-orb__moon" aria-hidden="true" />
        <span className="rv-orb__tip" aria-hidden="true">{night ? 'Bring the day' : 'Bring the night'}</span>
        {rings > 0 && (
          <span key={rings} className="rv-orb__rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
      </button>
    </div>
  )
}

/**
 * The opening: a handwritten hello, the name large in a serif
 * italic, the line the site is built on, and Ask me, answering in my own words. Under it, the
 * valley (Scene). On a first visit a keyboard spells the name before the hero shows (KeyIntro).
 */
export default function RvHero() {
  return (
    <section className="rv-hero" aria-labelledby="hero-title">
      <KeyIntro />
      <div className="wrap">
        <div className="rv-frame">
          <div className="rv-hero__grid">
            <div className="rv-hero__copy">
              <p className="rv-hero__hello">Hello, I’m</p>
              <h1 id="hero-title" className="rv-hero__name">
                Jb Yashvi
                <span className="rv-hero__badge" aria-hidden="true">
                  <img src="/about/jb-face-96.webp" srcSet="/about/jb-face-96.webp 96w, /about/jb-face-192.webp 192w" sizes="44px" width={96} height={96} alt="" decoding="async" />
                  Product designer
                </span>
              </h1>
              <p className="rv-hero__tag">A little structure. A lot of impact.</p>
              <a href="#work" className="rv-pill">
                Explore my work <span aria-hidden="true">↓</span>
              </a>
            </div>
            <Ask />
          </div>
          <Scene />
        </div>
      </div>
    </section>
  )
}
