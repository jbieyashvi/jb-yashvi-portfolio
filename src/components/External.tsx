import type { ReactNode } from 'react'

/** Button-styled external link that announces it opens a new tab. */
export default function External({ href, children, variant = 'solid' }: { href: string; children: ReactNode; variant?: 'solid' | 'ghost' }) {
  return (
    <a className={`btn btn--${variant}`} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true" className="btn__icon">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
