/**
 * Starts a lazy image's download shortly before it scrolls into view. Native lazy loading waits
 * until an image is close to the viewport (in some browsers only a few hundred pixels), which
 * leaves blank boxes when someone scrolls through a long stack of images. One shared observer
 * watches up to three screens ahead (and one behind) and switches each image to eager there, once.
 * The image keeps its src, srcset and sizes, so the browser still picks one size and requests it
 * once. Look-ahead starts only after the page's high-priority image (if any) has loaded, so the
 * images below never compete with it for bandwidth. Usage: <img loading="lazy" ref={loadAhead} … />
 */
let io: IntersectionObserver | null = null

function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const img = e.target as HTMLImageElement
          img.loading = 'eager'
          io!.unobserve(img)
        }
      },
      { rootMargin: '100% 0px 300% 0px' },
    )
  }
  return io
}

export default function loadAhead(img: HTMLImageElement | null) {
  if (!img || img.loading !== 'lazy' || typeof IntersectionObserver === 'undefined') return
  const o = observer()
  const lead = document.querySelector<HTMLImageElement>('img[fetchpriority="high"]')
  if (!lead || lead.complete) {
    o.observe(img)
    return () => o.unobserve(img)
  }
  const start = () => o.observe(img)
  lead.addEventListener('load', start, { once: true })
  lead.addEventListener('error', start, { once: true })
  return () => {
    lead.removeEventListener('load', start)
    lead.removeEventListener('error', start)
    o.unobserve(img)
  }
}
