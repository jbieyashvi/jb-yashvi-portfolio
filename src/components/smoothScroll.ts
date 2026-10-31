import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/**
 * A light glide on mouse-wheel and trackpad scrolling. Touch keeps the phone's own scrolling,
 * Lenis turns itself off for reduced motion, and a scrollable panel inside the page (the case
 * study reader, the project strip) still scrolls on its own. While an overlay locks the page
 * (html.no-scroll) the glide stops too, so the page never moves behind it.
 */
export const lenis = new Lenis({ lerp: 0.12, autoRaf: true, allowNestedScroll: true, stopInertiaOnNavigate: true })

const html = document.documentElement
new MutationObserver(() => {
  if (html.classList.contains('no-scroll')) lenis.stop()
  else lenis.start()
}).observe(html, { attributes: true, attributeFilter: ['class'] })
