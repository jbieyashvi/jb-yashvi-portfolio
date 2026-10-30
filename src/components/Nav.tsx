import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { contact } from '../data/projects'
import ThemeToggle from './ThemeToggle'

type Area = 'work' | 'gallery' | 'about' | 'contact'

/** below this width the links fold into the menu (matches the CSS) */
const MENU = '(max-width: 760px)'

/** home page sections, in page order, and the header link each belongs to (none for the rest) */
const SECTIONS: [string, Area | null][] = [
  ['work', 'work'],
  ['process', 'work'],
  ['about', 'about'],
  ['journey', 'about'],
  ['outside', 'gallery'],
  ['ideas', null],
  ['contact', 'contact'],
]

/** on the home page, the link for the section under the header; null over the hero */
function useSectionInView(on: boolean) {
  const [area, setArea] = useState<Area | null>(null)
  useEffect(() => {
    if (!on) return
    let frame = 0
    const update = () => {
      frame = 0
      // a section counts once its top passes a third of the way down the screen
      const line = window.innerHeight / 3
      let next: Area | null = null
      for (const [id, a] of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) next = a
      }
      // the last section may be too short to reach the line, so the page's end counts as it
      const doc = document.documentElement
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) next = 'contact'
      setArea(next)
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
  }, [on])
  return on ? area : null
}

/**
 * The header: name and role on the left; the links, theme switch and a Contact now button on
 * the right. On phones the bar keeps the name, a shorter Contact button, the theme switch and a
 * menu control; the links fold into a menu that opens below the bar.
 * The menu closes on a link, Escape, a tap outside it, or when the screen grows wide enough
 * to show the links again.
 */
export default function Nav() {
  const { pathname, hash } = useLocation()
  const onHome = pathname === '/'
  const inView = useSectionInView(onHome)
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLElement>(null)
  // On the home page the section links scroll in place; elsewhere they return home first.
  const to = (id: string) => (onHome ? `#${id}` : `/#${id}`)
  // the link for where the visitor is: a page (gallery, a case study) or a home section
  const active: Area | null = onHome ? inView : pathname === '/gallery' ? 'gallery' : pathname.startsWith('/work/') ? 'work' : null
  const current = (a: Area) => (a !== active ? undefined : onHome ? 'location' : 'page')
  const close = () => setOpen(false)

  // any navigation (a link, Back, Forward) closes the menu
  const [place, setPlace] = useState(pathname + hash)
  if (place !== pathname + hash) {
    setPlace(pathname + hash)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    // keyboard users land on the first link; Escape closes and returns them to the button
    menu.current?.querySelector('a')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    const wide = window.matchMedia(MENU)
    const onWide = () => {
      if (!wide.matches) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    wide.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', onWide)
    }
  }, [open])

  return (
    <header className="nav" data-open={open || undefined}>
      <div className="nav__inner wrap">
        <Link to="/" className="nav__brand" aria-label="Jb Yashvi, Product Designer, home">
          <span className="nav__name">Jb Yashvi</span>
          <span className="nav__role">Product Designer</span>
        </Link>
        <nav id="nav-menu" ref={menu} aria-label="Primary">
          <ul className="nav__links">
            <li><Link to={to('work')} aria-current={current('work')} onClick={close}>Work</Link></li>
            <li><Link to="/gallery" aria-current={current('gallery')} onClick={close}>Gallery</Link></li>
            <li><Link to={to('about')} aria-current={current('about')} onClick={close}>About</Link></li>
            <li>
              <a href={contact.resume} target="_blank" rel="noreferrer" onClick={close}>
                Résumé <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
          {/* beside the links on wider screens; on phones the bar's own switch takes over */}
          <div className="nav__theme">
            <ThemeToggle />
          </div>
        </nav>
        <Link to={to('contact')} className="nav__cta" onClick={close}>
          Contact<span className="nav__cta-long"> now</span>
          <span className="nav__cta-arrow" aria-hidden="true">↗</span>
        </Link>
        {/* phones only: the switch stays in the bar, between Contact and the menu */}
        <div className="nav__theme nav__theme--bar">
          <ThemeToggle />
        </div>
        <button
          ref={button}
          type="button"
          className="nav__menu-btn"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nav__menu-icon" aria-hidden="true" />
        </button>
      </div>
      {open && <div className="nav__scrim" aria-hidden="true" onClick={close} />}
    </header>
  )
}
