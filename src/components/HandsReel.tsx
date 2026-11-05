import { useEffect, useRef } from 'react'

const MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

/**
 * A short screen recording after My journey, centred: my photos moved around by hand, on camera,
 * in a small experiment made with Claude Code. It plays muted on a loop only while it is on
 * screen; with reduced motion it stays on its first frame and shows the player controls instead.
 */
export default function HandsReel() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const motion = window.matchMedia(MOTION_QUERY)
    let visible = false
    const sync = () => {
      video.controls = !motion.matches
      if (motion.matches && visible) video.play().catch(() => {})
      else if (motion.matches) video.pause()
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    }, { threshold: 0.25 })
    io.observe(video)
    motion.addEventListener('change', sync)
    sync()
    return () => {
      io.disconnect()
      motion.removeEventListener('change', sync)
    }
  }, [])

  return (
    <section id="hands" className="reel" aria-labelledby="hands-title" tabIndex={-1}>
      <div className="wrap">
        <header className="reel__head">
          <h2 id="hands-title" className="mod__title">Hands on</h2>
          <p className="mod__note">Moving my photos around with hand gestures, live on my webcam.</p>
          <p className="reel__made">Made with Claude Code</p>
        </header>
        <figure className="reel__frame" data-reveal="">
          <video
            ref={ref}
            className="reel__video"
            muted
            loop
            playsInline
            preload="metadata"
            poster="/reel/hands-poster.webp"
            width={1280}
            height={778}
            aria-label="Screen recording: photos and a poster floating over my webcam view, picked up and moved with my hands"
          >
            <source src="/reel/hands.webm" type="video/webm" />
            <source src="/reel/hands.mp4" type="video/mp4" />
          </video>
        </figure>
      </div>
    </section>
  )
}
