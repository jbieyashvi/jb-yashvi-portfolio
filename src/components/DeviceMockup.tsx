import type { CSSProperties } from 'react'
import type { Mockup } from '../data/projects'
import loadAhead from './loadAhead'

const BEZEL = 0.032

interface Props {
  mockup: Mockup
  /** 'night' on the dark home band, 'paper' on the light project pages */
  tone: 'night' | 'paper'
  /** decorative copies (the home card preview) get empty alt text */
  decorative?: boolean
  eager?: boolean
  className?: string
}

/**
 * Real screenshots inside plain CSS device frames. Each screen keeps its own aspect ratio,
 * so nothing is stretched or cropped; the frame is sized around the screenshot. Device sizes
 * use container units, so the whole composition always fits inside its stage.
 */
export default function DeviceMockup({ mockup, tone, decorative, eager, className = '' }: Props) {
  const imgs = mockup.screens.map((s, i) => (
    <img
      key={s.src}
      src={s.src}
      alt={decorative ? '' : s.alt}
      width={s.w}
      height={s.h}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager && i === 0 ? 'high' : undefined}
      ref={eager ? undefined : loadAhead}
      decoding="async"
      draggable={false}
      style={{ aspectRatio: `${s.w} / ${s.h}` }}
    />
  ))

  return (
    <div className={`mock mock--${tone} mock--${mockup.device} mock--n${mockup.screens.length} ${className}`}>
      {mockup.device === 'phones' ? (
        <div className="mock__phones">
          {imgs.map((img, i) => {
            const { w, h } = mockup.screens[i]
            // phone height / width, including the bezel (3.2% of the width on each side)
            const k = (h / w) * (1 - 2 * BEZEL) + 2 * BEZEL
            return (
              <div key={img.key} className="dev-phone" style={{ '--k': k.toFixed(3) } as CSSProperties}>
                {img}
              </div>
            )
          })}
        </div>
      ) : mockup.device === 'laptop' ? (
        <div className="dev-laptop">
          <div className="dev-laptop__lid">{imgs}</div>
          <div className="dev-laptop__base" aria-hidden="true" />
        </div>
      ) : (
        <div className="dev-monitor">
          <div className="dev-monitor__screen">{imgs}</div>
          <div className="dev-monitor__neck" aria-hidden="true" />
          <div className="dev-monitor__foot" aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
