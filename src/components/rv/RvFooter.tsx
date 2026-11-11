import { useEffect, useRef } from 'react'
import { contact } from '../../data/projects'
import { useTheme } from '../theme'
import SceneVideo from './SceneVideo'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'
// light dots over both films: warm whites by day over the poppies, cool ones under the stars
const NIGHT = ['#ffffff', '#fff3c4', '#e7dcff', '#d6ecff']
const DAY = ['#ffffff', '#fff7d6', '#ffe0e6', '#fffbe8']

type Dot = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; r: number; c: number }

/**
 * The name in dots over the field at the end of the page. The dots are sampled from the name set
 * in the serif; the pointer pushes them away and they spring back home. It only animates while
 * on screen, and is drawn once and left still with reduced motion.
 */
function DotName() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    let dots: Dot[] = []
    let raf = 0
    let visible = false
    let alive = true
    const mouse = { x: -999, y: -999 }
    const motion = window.matchMedia(MOTION_QUERY).matches

    const build = () => {
      const w = c.clientWidth
      const h = c.clientHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d')!
      const size = Math.min(h * 0.86, w / 4.6)
      o.font = `italic ${size}px "Instrument Serif", Georgia, serif`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillText('Jb Yashvi', w / 2, h / 2)
      const data = o.getImageData(0, 0, w, h).data
      const step = w < 600 ? 4 : 6
      dots = []
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step)
          if (data[(y * w + x) * 4 + 3] > 128) {
            const k = dots.length
            dots.push({ hx: x, hy: y, x: motion ? x + (Math.random() - 0.5) * 300 : x, y: motion ? y + Math.random() * 200 : y, vx: 0, vy: 0, r: step * 0.42, c: k % NIGHT.length })
          }
    }

    const draw = () => {
      ctx.clearRect(0, 0, c.clientWidth, c.clientHeight)
      const tones = document.documentElement.dataset.theme === 'dark' ? NIGHT : DAY
      for (const d of dots) {
        ctx.fillStyle = tones[d.c]
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const tick = () => {
      raf = 0
      if (!visible) return
      for (const d of dots) {
        const dx = d.x - mouse.x
        const dy = d.y - mouse.y
        const dist = Math.hypot(dx, dy)
        if (dist < 70 && dist > 0) {
          const f = (70 - dist) / 70
          d.vx += (dx / dist) * f * 3
          d.vy += (dy / dist) * f * 3
        }
        d.vx += (d.hx - d.x) * 0.045
        d.vy += (d.hy - d.y) * 0.045
        d.vx *= 0.82
        d.vy *= 0.82
        d.x += d.vx
        d.y += d.vy
      }
      draw()
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (motion && visible && !raf) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      start()
    })
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -999
    }
    const ro = new ResizeObserver(() => {
      build()
      draw()
    })
    // a theme switch recolours the dots even when they are standing still
    const mo = new MutationObserver(draw)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    document.fonts.load('italic 100px "Instrument Serif"').finally(() => {
      if (!alive) return
      build()
      draw()
      ro.observe(c)
      io.observe(c)
    })
    c.addEventListener('pointermove', onMove)
    c.addEventListener('pointerleave', onLeave)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      c.removeEventListener('pointermove', onMove)
      c.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="rv-dots" aria-hidden="true" />
}

const LINKS: [label: string, href: string][] = [
  ['LinkedIn', contact.linkedin],
  ['Instagram', contact.instagram],
  ['Résumé', contact.resume],
  ['Book a call', contact.calendly],
]

/* the stock clips on the page, with the people who filmed them (Pexels licence) */
const CREDITS: [what: string, who: string, href: string][] = [
  ['Lupin meadow', 'Yogendra Singh', 'https://www.pexels.com/video/39727545/'],
  ['Night meadow', 'Luz Calor Som', 'https://www.pexels.com/video/12628818/'],
  ['Poppy field', 'Yakup Tuğ', 'https://www.pexels.com/video/38752672/'],
  ['Milky Way', 'Dmitry Varennikov', 'https://www.pexels.com/video/5170522/'],
]

/** Contact, at the end of the page: the links, then a poppy field by day or the Milky Way by night with the name in dots */
export default function RvFooter() {
  const night = useTheme() === 'dark'
  return (
    <section id="contact" className="rv-end" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="wrap rv-end__top">
        <p className="rv-eyebrow">Contact</p>
        <h2 id="contact-title" className="rv-title">
          Let’s make something <em>useful.</em>
        </h2>
        <p className="rv-end__lead">Have a project in mind? Let’s talk.</p>
        <a className="rv-end__mail" href={`mailto:${contact.email}`}>{contact.email}</a>
        <ul className="rv-end__links">
          {LINKS.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                {label} <span aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="rv-end__land">
        <SceneVideo name="poppies" on={!night} className="rv-end__clip" />
        <SceneVideo name="milkyway" on={night} className="rv-end__clip" />
        <DotName />
        <p className="rv-end__credit">
          Footage from Pexels:{' '}
          {CREDITS.map(([what, who, href], k) => (
            <span key={href}>
              {k > 0 && ' · '}
              <a href={href} target="_blank" rel="noreferrer">
                {what}, {who}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
