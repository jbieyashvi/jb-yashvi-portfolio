import { useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { art } from '../../data/art'
import { roles } from '../../data/journey'
import { contact } from '../../data/projects'
import RvGame from './RvGame'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

/** Profile: photo, hello, and the résumé's roles on a timeline; each switch opens its summary */
function Profile() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="rv-cell rv-prof">
      <div className="rv-mat">
        <img className="rv-prof__photo" src="/about/portrait-purple-sari-700.webp" width={700} height={875} alt="Jb Yashvi in a purple sari, smiling in a sunlit room" loading="lazy" decoding="async" />
      </div>
      <h3 className="rv-cell__title">Hey, I’m Jb.</h3>
      <p className="rv-prof__line">A senior product designer at Heizen, designing web and mobile experiences across SaaS, <span className="keep">e-commerce</span>, logistics and operations.</p>
      <p className="rv-label rv-prof__label">Experience</p>
      <ol className="rv-roles">
        {roles.map((r, k) => {
          const co = r.company.replace(/ \(.*\)$/, '')
          return (
            <li key={r.company} className="rv-role" data-open={open === k || undefined}>
              <span className="rv-role__logo" aria-hidden="true">{co[0]}</span>
              <div className="rv-role__main">
                <span className="rv-role__co">{co}</span>
                <span className="rv-role__title">{r.role}</span>
                <span className="rv-role__when">{r.from} – {r.to}</span>
              </div>
              <button type="button" className="rv-switch" aria-expanded={open === k} aria-label={`${co}: what I did`} onClick={() => setOpen(open === k ? null : k)} />
              <div className="rv-role__body">
                <p>{r.summary}</p>
              </div>
            </li>
          )
        })}
        <li className="rv-role rv-role--edu">
          <span className="rv-role__logo" aria-hidden="true">M</span>
          <div className="rv-role__main">
            <span className="rv-role__co">MNIT Jaipur</span>
            <span className="rv-role__title">B.Arch</span>
            <span className="rv-role__when">2025</span>
          </div>
        </li>
      </ol>
    </div>
  )
}

/* How I got here, split into three stops; the words are the story's own */
const STEPS = [
  { tag: 'Architecture', text: 'I studied architecture, where I learned how people move through spaces', img: '/story/mnit-thesis-460.webp', cap: 'B.Arch · MNIT Jaipur' },
  { tag: 'Small changes', text: 'and how small design changes shape what they feel.', img: '/about/assembling-a-model-700.webp', cap: 'Assembling a model' },
  { tag: 'Product design', text: 'Now I bring that to product design: making complex work clear, so it has a real impact.', img: '/about/desk-warm-light.webp', cap: 'My desk' },
]

/** How I got into design: the whole story at once; a stop on the line lights up its part */
function Story() {
  const [at, setAt] = useState(0)
  const s = STEPS[at]
  return (
    <div className="rv-cell rv-story">
      <figure className="rv-story__fig" key={s.img}>
        <span className="rv-paper">
          <img src={s.img} alt="" loading="lazy" decoding="async" />
          <figcaption>{s.cap}</figcaption>
        </span>
      </figure>
      <h3 className="rv-cell__title">How I got into design</h3>
      <p className="rv-story__text">
        {STEPS.map((x, k) => (
          <span key={x.tag} data-on={k === at || undefined}>{x.text} </span>
        ))}
      </p>
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

/** My reel, playing on a TV: the video sits behind the set's cut-out screen, muted, in a loop */
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
      <div className="rv-mat rv-tv__set" data-on={on || undefined}>
        <div className="rv-tv__pic">
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
            <button type="button" className="rv-tv__play" aria-pressed={on} onClick={toggle}>
              <span aria-hidden="true">{on ? '❚❚' : '▶'}</span> {on ? 'Pause' : 'Play my reel'}
            </button>
          </div>
          <img className="rv-tv__photo" src="/reel/tv-yellow.webp" width={576} height={512} alt="" loading="lazy" decoding="async" />
        </div>
      </div>
      <p className="rv-note">
        Moving my photos around with hand gestures, live on my webcam. Made with Claude Code.
      </p>
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
      <h3 className="rv-cell__title">My camera roll</h3>
      <div className="rv-roll__stack">
        <div className="rv-roll__deck">
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
          <button type="button" className="rv-shutter" onClick={next} aria-label={`Next photo (now: ${top.caption})`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 8h3l1.6-2.4h6.8L17 8h3v11H4z" />
              <circle cx="12" cy="13.2" r="3.4" />
            </svg>
          </button>
        </div>
        <p className="rv-note rv-roll__cap">A few photos from my camera roll. Tap the camera for the next one.</p>
      </div>
      <Link to="/gallery" className="rv-pill rv-pill--ghost rv-pill--sm rv-roll__all">See the whole gallery <span aria-hidden="true">→</span></Link>
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
