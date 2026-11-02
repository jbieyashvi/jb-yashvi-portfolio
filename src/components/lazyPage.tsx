import { use, type ComponentType } from 'react'

/**
 * A page whose code loads on its own, so a first visit downloads only the shell and the page
 * it opens on. Unlike React.lazy, once the code is in it renders straight away with no
 * suspended pass, so the scroll manager finds the page's sections the moment the route
 * changes. Everything is fetched in the background soon after the first page (preloadPages),
 * and a page opened before then shows nothing for the moment its code takes to arrive.
 */
const all: { paths: string[]; preload: () => Promise<unknown> }[] = []

/** `paths`: the routes it renders, so preloadRoute can fetch it before showing them ('*' for the fallback) */
export function lazyPage<P extends object>(paths: string[], load: () => Promise<{ default: ComponentType<P> }>) {
  let Loaded: ComponentType<P> | null = null
  let pending: Promise<unknown> | null = null
  const preload = () => (pending ??= load().then((m) => { Loaded = m.default }))
  all.push({ paths, preload })
  function Page(props: P) {
    if (!Loaded) use(preload())
    const C = Loaded!
    return <C {...props} />
  }
  Page.preload = preload
  return Page
}

/** fetch every page's code, one at a time so the open page's images keep the bandwidth */
export async function preloadPages() {
  for (const p of all) await p.preload().catch(() => {})
}

/** fetch the code for the page at `pathname`; resolves at once for the homepage and pages already in */
export function preloadRoute(pathname: string): Promise<unknown> {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === '/' || path === '/playground') return Promise.resolve()
  const page = all.find((p) => p.paths.includes(path)) ?? all.find((p) => p.paths.includes('*'))
  return page ? page.preload().catch(() => {}) : Promise.resolve()
}
