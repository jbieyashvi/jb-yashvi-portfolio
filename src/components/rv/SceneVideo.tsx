import { useEffect, useRef } from 'react'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

/**
 * A looping stock clip from /scene (a small one on phones, a large one elsewhere), shown while
 * `on`. It only plays while on screen and showing; with reduced motion it stays as its still.
 */
export default function SceneVideo({ name, on, className }: { name: string; on: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = ref.current
    if (!v || !window.matchMedia(MOTION_QUERY).matches) return
    let visible = false
    const sync = () => {
      if (visible && on) v.play().catch(() => {})
      else v.pause()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      sync()
    })
    io.observe(v)
    return () => io.disconnect()
  }, [on])

  return (
    <video ref={ref} className={className} data-on={on || undefined} poster={`/scene/${name}.webp`} muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1}>
      <source media="(max-width: 900px)" src={`/scene/${name}-900.mp4`} type="video/mp4" />
      <source src={`/scene/${name}-1600.mp4`} type="video/mp4" />
    </video>
  )
}
