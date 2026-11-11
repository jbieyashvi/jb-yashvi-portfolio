import { useLayoutEffect, useState, type CSSProperties } from 'react'

const COLS = 5
/** ms from the first paint the sheet stays up: long enough for its lines and count to finish */
const HOLD = 1600

/**
 * Opening panel, drawn as a drafting sheet: "Jb Yashvi" rises into view over a faint grid, a
 * dimension line draws out beneath it and a title block counts to 100%; then the black panel
 * lifts away in a few slightly staggered columns to reveal the hero. index.html decides whether it plays
 * (html.has-intro) and holds the name, which shows from the first paint while the code
 * downloads; this lifts the panel once the app is up, giving the name its moment only if the
 * code was quicker than that. The motion is CSS only and the panel never takes pointer
 * events, so it cannot block the page; intro-done removes it after the last column or a timeout.
 */
export default function Intro() {
  const [on, setOn] = useState(() => {
    const c = document.documentElement.classList
    return c.contains('has-intro') && !c.contains('intro-done')
  })

  const finish = () => {
    const move = (window as { __introMove?: (e: PointerEvent) => void }).__introMove
    if (move) removeEventListener('pointermove', move)
    document.documentElement.classList.add('intro-done')
    setOn(false)
  }

  // the app loaded after the page's failsafe fired: show the hero without the intro's delay
  useLayoutEffect(() => {
    const c = document.documentElement.classList
    if (c.contains('intro-done')) c.remove('has-intro')
  }, [])

  useLayoutEffect(() => {
    if (!on) return
    // the app is up, so the page's own failsafe is no longer needed; this one replaces it
    clearTimeout((window as { __introFailsafe?: number }).__introFailsafe)
    // the sheet draws itself from the first paint and holds 1.6s, less whatever the code took
    const paint = performance.getEntriesByName('first-paint')[0]?.startTime ?? 0
    const wait = Math.max(0, HOLD - (performance.now() - paint)) / 1000
    const root = document.documentElement
    root.style.setProperty('--wait', `${wait}s`)
    root.style.setProperty('--in', `${wait + 0.2}s`) // the hero's entrance follows the panel
    root.classList.add('intro-go')
    const t = window.setTimeout(finish, wait * 1000 + 1600)
    return () => clearTimeout(t)
  }, [on])

  if (!on) return null
  return (
    <div className="intro" aria-hidden="true">
      {Array.from({ length: COLS }, (_, i) => (
        <span
          key={i}
          className="intro__col"
          style={{ '--i': i } as CSSProperties}
          onAnimationEnd={i === COLS - 1 ? finish : undefined}
        />
      ))}
    </div>
  )
}
