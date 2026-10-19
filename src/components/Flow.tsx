import type { ReactNode } from 'react'
import loadAhead from './loadAhead'

export interface Screen { src: string; alt: string; caption: string; w?: number; h?: number }

interface Props {
  title: string
  step?: number
  children: ReactNode
  screens: Screen[]
}

/** A walkthrough row: short explanation on the left, real screens on the right. */
export default function Flow({ title, step, children, screens }: Props) {
  return (
    <section className="flow">
      <div className="flow__text">
        {step !== undefined && <p className="flow__step">Step {step}</p>}
        <h3 className="flow__title">{title}</h3>
        <div className="flow__body">{children}</div>
      </div>
      <ul className={`flow__screens flow__screens--${screens.length}`}>
        {screens.map((s) => (
          <li key={s.src}>
            <img className="shot" src={s.src} alt={s.alt} width={s.w ?? 780} height={s.h ?? 1688} loading="lazy" ref={loadAhead} decoding="async" />
            <p className="flow__caption">{s.caption}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
