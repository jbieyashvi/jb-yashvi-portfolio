import { useEffect, useLayoutEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Intro from './components/Intro'
import ProjectTransition from './components/ProjectTransition'
import RevealManager from './components/RevealManager'
import { revealAbove, revealThrough } from './components/reveal'
import Home from './pages/Home'
import CaseStudyPage from './pages/CaseStudyPage'
import Medurun from './pages/Medurun'
import Iica from './pages/Iica'
import Retina from './pages/Retina'
import Flowtech from './pages/Flowtech'
import Compass from './pages/Compass'
import Shipway from './pages/Shipway'
import Tan90 from './pages/Tan90'
import DriveSharing from './pages/DriveSharing'
import RiderPickupDelay from './pages/RiderPickupDelay'
import PersonalProject from './pages/PersonalProject'
import Gallery from './pages/Gallery'
import NotFound from './pages/NotFound'

const SAVED = 'jb-scroll'
/** how long a #hash jump keeps its target in place while the layout above it settles */
const HOLD_MS = 4000

function loadSaved(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(SAVED) || '{}')
  } catch {
    return {}
  }
}

/**
 * Route and #hash scrolling. Back/Forward (and a reload) return to where the reader was on
 * that history entry; positions are recorded per entry as the page scrolls. A hash jump first
 * reveals the target and everything above it (no blank, half-faded sections), waits briefly
 * for the web font so the layout is final, then scrolls: smoothly for an in-page link,
 * instantly otherwise. Once the scroll settles, the target is held at the header line for a
 * few seconds while anything above it is still changing size (a late web font, images, the
 * Selected Work section measuring its scroll length), unless the reader scrolls themselves.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation()
  const navType = useNavigationType()
  const lastPath = useRef<string | null>(null)
  const saved = useRef<Record<string, number>>(loadSaved())
  const entry = useRef(key)
  const firstRun = useRef(true)
  const fragmentAt = useRef(-Infinity)

  // switch entries before the new page can fire a scroll event, so it never overwrites the old one
  useLayoutEffect(() => {
    entry.current = key
  }, [key])

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    let raf = 0
    const save = () => {
      raf = 0
      saved.current[entry.current] = Math.round(window.scrollY)
      try {
        sessionStorage.setItem(SAVED, JSON.stringify(saved.current))
      } catch {
        // storage unavailable: positions are still kept for this page load
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(save)
    }
    // a plain href="#id" link is a browser fragment navigation, which the router reports as
    // POP, the same as Back; note those clicks so they jump to the section instead
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a')
      if (!a || !a.hash || (a.target && a.target !== '_self')) return
      if (a.origin === location.origin && a.pathname === location.pathname) fragmentAt.current = performance.now()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('click', onClick, true)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onClick, true)
    }
  }, [])

  useEffect(() => {
    const samePage = lastPath.current === pathname
    lastPath.current = pathname
    const id = hash ? decodeURIComponent(hash.slice(1)) : ''
    // a fresh visit starts clean (the first entry's key is reused across visits); a reload
    // or Back/Forward returns to the recorded position
    if (firstRun.current) {
      firstRun.current = false
      const nav = performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming | undefined
      if (nav?.type !== 'reload' && nav?.type !== 'back_forward') delete saved.current[key]
    }
    const fragment = performance.now() - fragmentAt.current < 1000
    fragmentAt.current = -Infinity
    const restoreTo = navType === 'POP' && !fragment ? saved.current[key] : undefined

    if (restoreTo === undefined && (!id || !document.getElementById(id))) {
      // instant, so a new page never smooth-scrolls up from the old page's position
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    let cancelled = false
    let timer = 0
    const stop = () => (cancelled = true)
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const
    inputs.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }))

    const fontsReady = document.fonts?.status === 'loading'
      ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 700))])
      : Promise.resolve()

    // re-align whenever the page above the target changes height, until it has been still a while
    let settled = false
    let hold = 0
    const ro = new ResizeObserver(() => {
      if (settled) align()
    })
    const settle = () => {
      if (cancelled || settled) return
      settled = true
      align()
      ro.observe(document.body)
      document.fonts?.ready.then(() => settled && align())
      hold = window.setTimeout(() => ro.disconnect(), HOLD_MS)
    }

    const cleanup = () => {
      cancelled = true
      settled = false
      clearTimeout(timer)
      clearTimeout(hold)
      ro.disconnect()
      window.removeEventListener('scrollend', settle)
      inputs.forEach((e) => window.removeEventListener(e, stop))
    }

    if (restoreTo !== undefined) {
      const go = () => {
        if (cancelled) return
        if (Math.abs(window.scrollY - restoreTo) > 2) window.scrollTo({ top: restoreTo, behavior: 'instant' })
        revealAbove(window.innerHeight, true)
      }
      go()
      fontsReady.then(() => {
        go()
        timer = window.setTimeout(go, 400)
      })
      return cleanup
    }

    const smooth = (navType === 'PUSH' || fragment) && samePage && !matchMedia('(prefers-reduced-motion: reduce)').matches
    const target = () => document.getElementById(id)

    function align() {
      const el = target()
      if (cancelled || !el) return
      revealThrough(el)
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      if (Math.abs(el.getBoundingClientRect().top - pad) > 2) el.scrollIntoView({ behavior: 'instant' })
    }

    // reveal now, so even the wait for the font never shows hidden content
    revealThrough(target()!)
    fontsReady.then(() => {
      const el = target()
      if (cancelled || !el) return
      revealThrough(el)
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' })
      if (smooth && 'onscrollend' in window) window.addEventListener('scrollend', settle, { once: true })
      if (!smooth) align()
      timer = window.setTimeout(settle, smooth ? 1600 : 400)
    })

    return cleanup
  }, [pathname, hash, key, navType])
  return null
}

export default function App() {
  return (
    <>
      <Intro />
      <ProjectTransition />
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <RevealManager />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/nutrio" element={<CaseStudyPage slug="nutrio" />} />
          <Route path="/work/tan90" element={<Tan90 />} />
          <Route path="/work/medurun" element={<Medurun />} />
          <Route path="/work/iica" element={<Iica />} />
          <Route path="/work/retina" element={<Retina />} />
          <Route path="/work/flowtech" element={<Flowtech />} />
          <Route path="/work/compass" element={<Compass />} />
          <Route path="/work/shipway" element={<Shipway />} />
          <Route path="/work/drive-sharing" element={<DriveSharing />} />
          <Route path="/work/rider-pickup-delay" element={<RiderPickupDelay />} />
          {(['gema', 'zensenta', 'relay'] as const).map((slug) => (
            <Route key={slug} path={`/work/${slug}`} element={<PersonalProject slug={slug} />} />
          ))}
          {/* the Playground page became the Ideas in motion section; old links land there */}
          <Route path="/playground" element={<Navigate to="/#ideas" replace />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
