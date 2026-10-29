import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'

interface Section { id: string; label: string }

const GAP = 24

/**
 * Section links for a long case study, as a sticky left sidebar on wide screens and a sticky
 * "On this page" disclosure under the site header below 1100px. Both mark the section being
 * read. While mounted it sets the page's scroll-padding-top, so a #section jump lands below the
 * header (and the disclosure bar on narrow screens).
 */
export default function CaseSidebar({ sections }: { sections: Section[] }) {
  const bar = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const el = bar.current
    const header = document.querySelector<HTMLElement>('.nav')
    if (!el) return
    const root = document.documentElement
    const before = root.style.scrollPaddingTop
    const measure = () => {
      const top = header?.offsetHeight ?? 0
      root.style.setProperty('--case-top', `${top}px`)
      // the disclosure bar has no height when hidden on wide screens
      root.style.scrollPaddingTop = `${top + el.offsetHeight + GAP}px`
    }
    let frame = 0
    const update = () => {
      frame = 0
      const line = (parseFloat(root.style.scrollPaddingTop) || 0) + 8
      let next: string | null = null
      for (const s of sections) {
        const target = document.getElementById(s.id)
        if (target && target.getBoundingClientRect().top <= line) next = s.id
      }
      setActive(next)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const ro = new ResizeObserver(() => {
      measure()
      schedule()
    })
    ro.observe(el)
    if (header) ro.observe(header)
    measure()
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      ro.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      root.style.scrollPaddingTop = before
      root.style.removeProperty('--case-top')
    }
  }, [sections])

  const onKey = (e: KeyboardEvent<HTMLDetailsElement>) => {
    const details = e.currentTarget
    if (e.key === 'Escape' && details.open) {
      details.open = false
      details.querySelector('summary')?.focus()
    }
  }
  const close = (e: MouseEvent<HTMLAnchorElement>) => {
    const details = e.currentTarget.closest('details')
    if (details) details.open = false
  }

  const current = sections.find((s) => s.id === active) ?? sections[0]
  const links = (onPick?: (e: MouseEvent<HTMLAnchorElement>) => void) => (
    <ol className="cside__list">
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} aria-current={active === s.id ? 'location' : undefined} onClick={onPick}>
            {s.label}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <div ref={bar} className="cside-bar">
        <details className="cside-menu" onKeyDown={onKey}>
          <summary>
            <span className="cside-menu__label">On this page</span>
            <span className="cside-menu__current">{current.label}</span>
          </summary>
          <nav aria-label="On this page">{links(close)}</nav>
        </details>
      </div>
      <aside className="cside">
        <nav className="cside__nav" aria-label="On this page">
          <p className="cside__title" aria-hidden="true">On this page</p>
          {links()}
        </nav>
      </aside>
    </>
  )
}
