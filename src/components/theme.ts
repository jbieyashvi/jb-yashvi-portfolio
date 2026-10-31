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

/** switch to a theme and remember the choice on this device */
export function setTheme(t: Theme) {
  if (t === read()) return
  try {
    localStorage.setItem(KEY, t)
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  // a short cross-fade where the browser supports it, and only with motion allowed
  if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.startViewTransition(() => apply(t))
  } else apply(t)
}
