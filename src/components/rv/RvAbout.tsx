import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { art } from '../../data/art'
import { roles } from '../../data/journey'
import { contact } from '../../data/projects'
import RvGame from './RvGame'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

/** Profile: photo, hello, and the résumé's roles as rows that open to their summary */
function Profile() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="rv-cell rv-prof">
      <div className="rv-prof__top">
        <img className="rv-prof__photo" src="/about/portrait-purple-sari-700.webp" width={700} height={875} alt="Jb Yashvi in a purple sari, smiling in a sunlit room" loading="lazy" decoding="async" />
        <div>
          <h3 className="rv-prof__hey">Hey, I’m Jb</h3>
          <p className="rv-prof__line">A senior product designer at Heizen, designing web and mobile experiences across SaaS, <span className="keep">e-commerce</span>, logistics and operations.</p>
        </div>
      </div>
      <p className="rv-label">Experience</p>
      <ol className="rv-roles">
        {roles.map((r, k) => (
          <li key={r.company} className="rv-role" data-open={open === k || undefined}>
            <button type="button" className="rv-role__btn" aria-expanded={open === k} onClick={() => setOpen(open === k ? null : k)}>
              <span className="rv-role__logo" aria-hidden="true">{r.company[0]}</span>
              <span className="rv-role__main">
                <span className="rv-role__co">{r.company.replace(/ \(.*\)$/, '')}</span>
                <span className="rv-role__title">{r.role}</span>
              </span>
              <span className="rv-role__when">{r.from.split(' ').at(-1)}{r.from.split(' ').at(-1) !== r.to.split(' ').at(-1) ? `–${r.to.split(' ').at(-1)}` : ''}</span>
              <span className="rv-role__toggle" aria-hidden="true" />
            </button>
            <div className="rv-role__body">
              <p>{r.from} – {r.to}. {r.summary}</p>
            </div>
          </li>
        ))}
        <li className="rv-role rv-role--edu">
          <span className="rv-role__btn">
            <span className="rv-role__logo" aria-hidden="true">M</span>
            <span className="rv-role__main">
              <span className="rv-role__co">MNIT Jaipur</span>
              <span className="rv-role__title">B.Arch</span>
            </span>
            <span className="rv-role__when">2025</span>
          </span>
        </li>
      </ol>
    </div>
  )
}

/* How I got here, split into three stops; the words are the story's own */
const STEPS = [
  { tag: 'Architecture', text: 'I studied architecture, where I learned how people move through spaces', img: '/story/mnit-thesis-460.webp', cap: 'B.Arch · MNIT Jaipur · 2025' },
  { tag: 'Small changes', text: 'and how small design changes shape what they feel.', img: '/about/assembling-a-model-700.webp', cap: 'Assembling a model' },
  { tag: 'Product design', text: 'Now I bring that to product design: making complex work clear, so it has a real impact.', img: '/about/desk-warm-light.webp', cap: 'My desk' },
]
const HOLD_MS = 900

/** How I got into design: hold the button to move to the next stop (or tap a stop on the line) */
function Story() {
  const [at, setAt] = useState(0)
  const [fill, setFill] = useState(0)
  const raf = useRef(0)
  const stop = () => {
    cancelAnimationFrame(raf.current)
    setFill(0)
  }
  const hold = () => {
    const t0 = performance.now()
    const step = (t: number) => {
      const f = Math.min(1, (t - t0) / HOLD_MS)
      setFill(f)
      if (f < 1) raf.current = requestAnimationFrame(step)
      else {
        setAt((a) => (a + 1) % STEPS.length)
        setFill(0)
      }
    }
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(step)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  const s = STEPS[at]
  return (
    <div className="rv-cell rv-story">
      <p className="rv-label">How I got into design</p>
      <div className="rv-story__body">
        <figure className="rv-story__fig" key={s.img}>
          <span className="rv-paper">
            <img src={s.img} alt="" loading="lazy" decoding="async" />
            <figcaption>{s.cap}</figcaption>
          </span>
        </figure>
        <div>
          <p className="rv-story__text" key={at} aria-live="polite">{s.text}</p>
          <button
            type="button"
            className="rv-hold"
            style={{ '--f': fill } as CSSProperties}
            onPointerDown={hold}
            onPointerUp={stop}
            onPointerLeave={stop}
            onPointerCancel={stop}
            onKeyDown={(e) => {
              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                e.preventDefault()
                hold()
              }
            }}
            onKeyUp={stop}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span className="rv-hold__ring" aria-hidden="true" />
            {at === STEPS.length - 1 ? 'Hold to start over' : 'Tap and hold'}
          </button>
        </div>
      </div>
      <ol className="rv-steps">
        {STEPS.map((x, k) => (
          <li key={x.tag} data-past={k < at || undefined}>
            <button type="button" aria-current={k === at ? 'step' : undefined} onClick={() => setAt(k)}>
              <span className="rv-steps__dot" aria-hidden="true" />
              {x.tag}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Hands on, inside a little TV: plays when switched on, muted, in a loop */
function Tv() {
  const ref = useRef<HTMLVideoElement>(null)
  const [on, setOn] = useState(false)
  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().then(() => setOn(true)).catch(() => {})
    else {
      v.pause()
      setOn(false)
    }
  }
  return (
    <div className="rv-cell rv-tv">
      <p className="rv-label">Hands on</p>
      <div className="rv-tv__set" data-on={on || undefined}>
        <span className="rv-tv__ant" aria-hidden="true" />
        <div className="rv-tv__screen">
          <video
            ref={ref}
            muted
            loop
            playsInline
            preload="none"
            poster="/reel/hands-poster.webp"
            width={1280}
            height={778}
            aria-label="Screen recording: photos and a poster floating over my webcam view, picked up and moved with my hands"
          >
            <source src="/reel/hands.webm" type="video/webm" />
            <source src="/reel/hands.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="rv-tv__panel" aria-hidden="true"><i /><i /></div>
      </div>
      <button type="button" className="rv-pill rv-pill--sm" aria-pressed={on} onClick={toggle}>
        {on ? 'Pause the reel' : 'Play my reel'} <span aria-hidden="true">{on ? '❚❚' : '▶'}</span>
      </button>
      <p className="rv-note">Moving my photos around with hand gestures, live on my webcam. Made with Claude Code.</p>
    </div>
  )
}

const ROLL = art.filter((a) => a.kind !== 'art').slice(0, 8)

/** My camera roll: a stack of deckle-edged prints; the camera button sends the top one to the back */
function Roll() {
  const [order, setOrder] = useState(() => ROLL.map((_, k) => k))
  const [leaving, setLeaving] = useState(false)
  const next = () => {
    if (leaving) return
    if (!window.matchMedia(MOTION_QUERY).matches) return setOrder((o) => [...o.slice(1), o[0]])
    setLeaving(true)
    setTimeout(() => {
      setOrder((o) => [...o.slice(1), o[0]])
      setLeaving(false)
    }, 380)
  }
  const top = ROLL[order[0]]
  return (
    <div className="rv-cell rv-roll">
      <p className="rv-label">My camera roll</p>
      <div className="rv-roll__stack">
        {order.slice(0, 4).reverse().map((k) => {
          const depth = order.indexOf(k)
          const a = ROLL[k]
          return (
            <figure key={a.slug} className="rv-print" data-depth={depth} data-leaving={(depth === 0 && leaving) || undefined} style={{ '--r': `${(((k * 37) % 7) - 3) * 0.8}deg`, '--z': 4 - depth } as CSSProperties}>
              <span className="rv-paper">
                <img src={`${a.src}-800.webp`} width={a.w} height={a.h} alt={depth === 0 ? a.alt : ''} loading="lazy" decoding="async" />
                <figcaption>{a.caption}</figcaption>
              </span>
            </figure>
          )
        })}
      </div>
      <div className="rv-roll__bar">
        <button type="button" className="rv-shutter" onClick={next} aria-label={`Next photo (now: ${top.caption})`}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z" />
            <circle cx="12" cy="13.2" r="3.4" />
          </svg>
        </button>
        <Link to="/gallery" className="rv-pill rv-pill--ghost rv-pill--sm">See the whole gallery <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  )
}

/* drafts a visitor can start from; the mail opens in their own app, nothing is sent from here */
const DRAFTS = [
  { label: 'A role on your team', subject: 'A product design role', body: 'Hi Jb,\n\nWe’re hiring for a product design role and would love to talk. Here’s a little about the team:\n\n' },
  { label: 'A project to work on', subject: 'A design project', body: 'Hi Jb,\n\nI have a project I’d like your help with. Here’s what it is:\n\n' },
  { label: 'A question about your work', subject: 'A question about your work', body: 'Hi Jb,\n\nI was reading one of your case studies and wanted to ask:\n\n' },
  { label: 'Just saying hello', subject: 'Hello from your portfolio', body: 'Hi Jb,\n\nJust stopping by to say hello.\n\n' },
]

/** Say hello: pick an envelope, read the draft, open it in your mail app */
function Hello() {
  const [at, setAt] = useState(0)
  const [copied, setCopied] = useState(false)
  const d = DRAFTS[at]
  const href = `mailto:${contact.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }
  return (
    <div className="rv-cell rv-cell--ink rv-hello">
      <p className="rv-label">Say hello</p>
      <p className="rv-hello__ask">What brings you here?</p>
      <div className="rv-envs" role="group" aria-label="Pick a draft">
        {DRAFTS.map((x, k) => (
          <button key={x.label} type="button" className="rv-env" aria-pressed={k === at} aria-label={x.label} onClick={() => setAt(k)}>
            <svg viewBox="0 0 64 44" aria-hidden="true" focusable="false">
              <rect x="1.5" y="1.5" width="61" height="41" rx="4" />
              <path className="rv-env__flap" d="M2 4l30 22L62 4" />
            </svg>
            <span className="rv-env__n" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
      <div className="rv-draft" key={at}>
        <p className="rv-draft__meta">
          <span>{d.label}</span>
          <span>{String(at + 1).padStart(2, '0')}/{String(DRAFTS.length).padStart(2, '0')}</span>
        </p>
        <p className="rv-draft__sub">Subject: {d.subject}</p>
        <p className="rv-draft__body">{d.body.trim()}</p>
      </div>
      <div className="rv-hello__actions">
        <a className="rv-pill rv-pill--light" href={href}>
          Open in mail <span aria-hidden="true">↗</span>
        </a>
        <button type="button" className="rv-hello__copy" onClick={copy}>
          {copied ? 'Copied ✓' : contact.email}
          <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
        </button>
      </div>
    </div>
  )
}

/** Toolkit: what I do, the tools, and the résumé */
function Kit() {
  return (
    <div className="rv-cell rv-kit">
      <p className="rv-label">Currently</p>
      <p className="rv-kit__now">Senior product designer at Heizen</p>
      <p className="rv-label">Skills</p>
      <ul className="rv-chips rv-chips--plain">
        {['Product Design', 'User Research', 'UI Design', 'AI Prototyping'].map((s) => <li key={s}>{s}</li>)}
      </ul>
      <p className="rv-label">Tools</p>
      <ul className="rv-chips rv-chips--plain">
        {['Figma', 'Claude', 'Codex'].map((s) => <li key={s}>{s}</li>)}
      </ul>
      <a className="rv-pill rv-pill--ghost rv-pill--sm" href={contact.resume} target="_blank" rel="noreferrer">
        View résumé <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

/**
 * A little more about me, as a bento of small things to play with: the profile and the roles,
 * the story behind the switch from architecture, the Hands on reel, a camera roll, a mail
 * drafter and a building game.
 */
export default function RvAbout() {
  return (
    <section id="about" className="rv-about" aria-labelledby="about-title" tabIndex={-1}>
      <div className="wrap">
        <header className="rv-head">
          <p className="rv-eyebrow">About</p>
          <h2 id="about-title" className="rv-title">
            A little more <em>about me.</em>
          </h2>
        </header>
        <div className="rv-bento">
          <Profile />
          <Story />
          <Tv />
          <Roll />
          <Hello />
          <div className="rv-cell rv-play">
            <p className="rv-label">Stack a building</p>
            <p className="rv-note">Architect by training, so here’s a small one. Drop each floor on the last; what hangs over gets cut.</p>
            <RvGame />
          </div>
          <Kit />
        </div>
      </div>
    </section>
  )
}
