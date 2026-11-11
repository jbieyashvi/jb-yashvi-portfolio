import { useEffect, useRef, useState, type CSSProperties } from 'react'

const NAME = 'Jb Yashvi'

/* a compact keyboard, each row 15 units wide; [label, width] */
type Key = [label: string, width: number]
const ones = (keys: string): Key[] => [...keys].map((k) => [k, 1])
const ROWS: Key[][] = [
  [...ones('`1234567890-='), ['⌫', 2]],
  [['Tab', 1.5], ...ones('QWERTYUIOP[]'), ['\\', 1.5]],
  [['Caps', 1.75], ...ones("ASDFGHJKL;'"), ['Enter', 2.25]],
  [['Shift', 2.25], ...ones('ZXCVBNM,./'), ['Shift', 2.75]],
  [['fn', 1.25], ['ctrl', 1.25], ['alt', 1.25], ['cmd', 1.5], ['', 5.25], ['cmd', 1.5], ['alt', 1.25], ['ctrl', 1.25]],
]
const LIT = new Set(NAME.replace(' ', '').toUpperCase())

// plays exactly when the opening sheet does (index.html: the home page, first time this session,
// no #section, motion allowed), and sits over it, so a first visit gets one intro, not two
const firstVisit = () => {
  const c = document.documentElement.classList
  return c.contains('has-intro') && !c.contains('intro-done')
}

/**
 * The first thing on a first visit: a line-drawn keyboard with the letters of my name lit.
 * Hovering it (or a tap, a key press, or a few seconds' wait) sends each lit letter flying up
 * into the name, then the keyboard fades and the hero shows. It takes the opening sheet's turn
 * (see firstVisit), so it is skipped with reduced motion, on a return visit or a section link.
 */
export default function KeyIntro() {
  const [on, setOn] = useState(firstVisit)
  const [phase, setPhase] = useState<'wait' | 'fly' | 'out'>('wait')
  const root = useRef<HTMLDivElement>(null)

  const go = () => setPhase((p) => (p === 'wait' ? 'fly' : p))
  const skip = () => setPhase('out')

  useEffect(() => {
    if (!on) return
    const html = document.documentElement
    html.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => (e.key === 'Escape' ? skip() : go())
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(go, 5000)
    return () => {
      html.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [on])

  // fly: each lit key's letter travels to its place in the name above the keyboard
  useEffect(() => {
    if (phase !== 'fly') return
    const el = root.current!
    const slots = [...el.querySelectorAll<HTMLElement>('.rv-intro__slot')]
    slots.forEach((slot) => {
      const ch = slot.dataset.ch!
      const key = el.querySelector<HTMLElement>(`.rv-key[data-ch="${CSS.escape(ch)}"] .rv-key__ch`)
      if (!key) return
      const a = key.getBoundingClientRect()
      const b = slot.getBoundingClientRect()
      slot.style.setProperty('--dx', `${a.left + a.width / 2 - (b.left + b.width / 2)}px`)
      slot.style.setProperty('--dy', `${a.top + a.height / 2 - (b.top + b.height / 2)}px`)
      slot.style.setProperty('--s', (a.height / b.height).toFixed(3))
    })
    el.dataset.phase = 'aim'
    // the letters sit on their keys for one frame, then fly
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => (el.dataset.phase = 'fly')))
    const t = window.setTimeout(() => setPhase('out'), 1900)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [phase])

  if (!on) return null

  return (
    <div
      ref={root}
      className="rv-intro"
      data-phase={phase === 'out' ? 'out' : undefined}
      onTransitionEnd={(e) => {
        if (phase === 'out' && e.target === root.current) setOn(false)
      }}
    >
      <p className="rv-intro__name" aria-hidden="true">
        {[...NAME].map((ch, k) =>
          ch === ' ' ? <span key={k} className="rv-intro__gap" /> : (
            <span key={k} className="rv-intro__slot" data-ch={ch.toUpperCase()} style={{ '--k': k } as CSSProperties}>
              {ch}
            </span>
          ),
        )}
      </p>

      <div className="rv-board" onPointerEnter={(e) => e.pointerType === 'mouse' && go()} onClick={go} aria-hidden="true">
        <div className="rv-board__keys">
          {ROWS.map((row, r) => (
            <div key={r} className="rv-board__row">
              {row.map(([k, w], c) => (
                <span key={c} className="rv-key" data-lit={(k.length === 1 && LIT.has(k)) || undefined} data-ch={k} style={{ flexGrow: w }}>
                  <span className="rv-key__ch">{k}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="rv-board__side">
          <span className="rv-board__knob" />
          <span className="rv-board__knob rv-board__knob--sm" />
          <span className="rv-board__meter"><span /></span>
        </div>
      </div>

      <p className="rv-intro__hint">
        <span className="rv-intro__hint-hover">Hover to bring the letters together</span>
        <span className="rv-intro__hint-tap">Tap to bring the letters together</span>
      </p>
      <button type="button" className="rv-intro__skip" onClick={skip}>
        Skip intro
      </button>
    </div>
  )
}
