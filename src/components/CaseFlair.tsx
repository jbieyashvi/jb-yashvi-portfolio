import type { CSSProperties } from 'react'
import { DOODLES, type DoodleName } from './doodles'

export type FlairTone = 'sun' | 'sky' | 'rose' | 'lilac'
export type TitleMark = { text: string; tone: FlairTone; doodle: DoodleName }

/**
 * A section title with one phrase marked like the home story: a marker sweeps under it and a
 * doodle draws itself once the heading scrolls in (the site's one-time [data-reveal]). Without
 * the reveal (reduced motion, no script) both are simply there.
 */
export function MarkedTitle({ title, mark }: { title: string; mark?: TitleMark }) {
  const at = mark ? title.indexOf(mark.text) : -1
  if (!mark || at < 0) return <>{title}</>
  const { box, d } = DOODLES[mark.doodle]
  return (
    <>
      {title.slice(0, at)}
      <span className={`cs-mark cs-mark--${mark.tone} cs-mark--${mark.doodle}`}>
        {mark.text}
        <svg className={`cs-doodle cs-doodle--${mark.doodle}`} viewBox={box} preserveAspectRatio={mark.doodle === 'stars' ? undefined : 'none'} aria-hidden="true">
          <path d={d} pathLength={1} />
        </svg>
      </span>
      {title.slice(at + mark.text.length)}
    </>
  )
}

/** A strip of tape across the top of a pinned screen or note */
export function Tape({ tone }: { tone: FlairTone }) {
  return <span className={`cs-tape cs-tape--${tone}`} aria-hidden="true" />
}

/** A screen of my own final design, taped up at a slight tilt (`r`, in degrees) */
export function Pin({ tone, r, children }: { tone: FlairTone; r: number; children: React.ReactNode }) {
  return (
    <div className="cs-pin" style={{ '--r': `${r}deg` } as CSSProperties}>
      <Tape tone={tone} />
      {children}
    </div>
  )
}
