import { useEffect, useState, type ReactNode } from 'react'
import { contact } from '../data/projects'

const ICONS: Record<string, ReactNode> = {
  top: <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" />,
  work: <path d="M4 8h16v11H4zM9 8V5.5h6V8M4 13h16" />,
  about: <path d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" />,
  valley: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
  contact: <path d="M4 6h16v12H4zM4.5 6.5 12 13l7.5-6.5" />,
}

/** home page sections the dock jumps to, in page order */
const STOPS: [id: string, label: string][] = [
  ['top', 'Home'],
  ['work', 'Work'],
  ['about', 'About'],
  ['valley', 'Valley'],
  ['contact', 'Contact'],
]

const Icon = ({ d }: { d: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" focusable="false">
    {d}
  </svg>
)

/**
 * A floating dock of icons on the right edge of wide screens: one per home section, the one being
 * read lit, its name showing on hover. Hidden on phones and tablets, where the header menu does
 * this job.
 */
export default function SideDock() {
  const [active, setActive] = useState('top')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      // a section counts once its top passes the middle of the screen
      const line = window.innerHeight / 2
      let next = 'top'
      for (const [id] of STOPS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) next = id
      }
      const doc = document.documentElement
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) next = 'contact'
      setActive(next)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <nav className="dock" aria-label="Sections on this page">
      <ol className="dock__list">
        {STOPS.map(([id, label]) => (
          <li key={id}>
            <a className="dock__stop" href={id === 'top' ? '#main' : `#${id}`} aria-current={active === id ? 'location' : undefined} aria-label={label}>
              <Icon d={ICONS[id]} />
              <span className="dock__label" aria-hidden="true">{label}</span>
            </a>
          </li>
        ))}
        <li className="dock__sep" aria-hidden="true" />
        <li>
          <a className="dock__stop" href={contact.resume} target="_blank" rel="noreferrer" aria-label="Résumé (opens in a new tab)">
            <Icon d={<path d="M7 3.5h7l4 4V20.5H7zM14 3.5V8h4M10 12h5M10 15.5h5" />} />
            <span className="dock__label" aria-hidden="true">Résumé</span>
          </a>
        </li>
      </ol>
    </nav>
  )
}
