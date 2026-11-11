import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'jb-theme'
const META = { light: '#ffffff', dark: '#111113' }

/** the theme on the page: index.html set it before first paint (light unless chosen) */
const read = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function apply(t: Theme) {
  document.documentElement.dataset.theme = t
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META[t])
}

/**
 * Every theme switch reads the page's theme attribute, so they always agree. A choice made in
 * another tab follows here too.
 */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) apply(e.newValue === 'dark' ? 'dark' : 'light')
  }
  window.addEventListener('storage', onStorage)
  return () => {
    mo.disconnect()
    window.removeEventListener('storage', onStorage)
  }
}

export const useTheme = () => useSyncExternalStore(subscribe, read)

/**
 * switch to a theme and remember the choice on this device. Given a point on screen (`from`),
 * the new theme spreads out from it in a circle instead of cross-fading.
 */
export function setTheme(t: Theme, from?: { x: number; y: number }) {
  if (t === read()) return
  try {
    localStorage.setItem(KEY, t)
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  // a short cross-fade where the browser supports it, and only with motion allowed
  if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return apply(t)
  const html = document.documentElement
  if (from) html.classList.add('vt-spread')
  const vt = document.startViewTransition(() => apply(t))
  if (!from) return
  vt.ready.then(() => {
    const r = Math.hypot(Math.max(from.x, innerWidth - from.x), Math.max(from.y, innerHeight - from.y))
    html.animate(
      { clipPath: [`circle(0px at ${from.x}px ${from.y}px)`, `circle(${r}px at ${from.x}px ${from.y}px)`] },
      { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  }, () => {})
  vt.finished.finally(() => html.classList.remove('vt-spread'))
}
