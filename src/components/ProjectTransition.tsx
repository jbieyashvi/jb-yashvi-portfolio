import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { personalProjects, projects } from '../data/projects'

const COLS = 5
/** the panel is fully over the screen; navigate underneath it */
const COVER_MS = 540
/** the panel has lifted off the new page */
const DONE_MS = 1250
/** whatever happens, the overlay is gone by now */
const FAILSAFE_MS = 2500

type Phase = 'idle' | 'cover' | 'reveal'

/**
 * Project transition, in the homepage intro's style: a black panel rises over the page with
 * the project's name, the route changes underneath, and the panel lifts to reveal the
 * project page. Only plain left-clicks (or Enter) on internal /work/{slug} links are taken
 * over; modified clicks, middle-clicks, new tabs and every other link behave normally.
 * The panel never takes pointer events, and it always clears.
 */
export default function ProjectTransition() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [phase, setPhase] = useState<Phase>('idle')
  const [name, setName] = useState('')
  const target = useRef<string | null>(null)
  const timers = useRef<number[]>([])

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms))
  const end = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    target.current = null
    setPhase('idle')
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const project = [...projects, ...personalProjects].find((p) => url.pathname === `/work/${p.slug}`)
      if (!project) return
      // a transition is already running: swallow repeat clicks instead of queuing another
      if (target.current) {
        e.preventDefault()
        return
      }
      if (url.pathname === window.location.pathname) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      e.preventDefault()
      target.current = url.pathname
      setName(project.name)
      setPhase('cover')
      later(() => {
        try {
          navigate(url.pathname + url.search + url.hash)
        } catch {
          // if navigation fails, the panel still lifts off whatever page is showing
        }
        setPhase('reveal')
        later(end, DONE_MS - COVER_MS)
      }, COVER_MS)
      later(end, FAILSAFE_MS)
    }
    // capture phase, so this runs before React Router's own link handler
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  // our own navigate() lands together with the switch to 'reveal', so a route change seen
  // while still covering came from elsewhere (Back/Forward, another link): stop covering
  // and lift the panel off the page that is actually showing
  useEffect(() => {
    if (phase !== 'cover') return
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('reveal')
    later(end, DONE_MS - COVER_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  if (phase === 'idle') return null
  // a long name like “Compass Group — CMP Autobot” shows as a title with a smaller subtitle
  const [title, subtitle] = name.split(' — ')
  return (
    <div className={`ptx ptx--${phase}`} aria-hidden="true">
      {Array.from({ length: COLS }, (_, i) => (
        <span key={i} className="ptx__col" style={{ '--i': i } as CSSProperties} />
      ))}
      <p className="ptx__name">
        <span>
          {title}
          {subtitle && <span className="ptx__sub">{subtitle}</span>}
        </span>
      </p>
    </div>
  )
}
