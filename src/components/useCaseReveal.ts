import { useLayoutEffect } from 'react'

/**
 * Case-study pages load after the route changes, so their [data-reveal] pieces can mount after
 * RevealManager has looked for them. This watches the ones inside the page, with the same rules.
 */
export default function useCaseReveal() {
  useLayoutEffect(() => {
    if (!('IntersectionObserver' in window) || !document.documentElement.classList.contains('reveal-on')) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      window.matchMedia('(max-width: 760px)').matches
        ? { rootMargin: '0px 0px 12% 0px', threshold: 0 }
        : { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    document.querySelectorAll('.dv [data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}
