import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { mapYears, roleYears, roles } from '../data/journey'
import { clientProjects, contact } from '../data/projects'

/** résumé text, with the names of projects that have a case study linked to it */
function withProjectLinks(text: string): ReactNode {
  const names = clientProjects.map((p) => p.name).join('|')
  return text.split(new RegExp(`\\b(${names})\\b`)).map((part, i) => {
    const p = clientProjects.find((x) => x.name === part)
    return p ? (
      <Link key={i} to={`/work/${p.slug}`}>
        {part}
      </Link>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  })
}

const dates = (r: (typeof roles)[number]) => `${r.from} – ${r.to}`
/** small squares under each year label: decoration only, all lit or all unlit */
const PER_YEAR = 4

/**
 * My journey, in connected grid cells like About: the heading and note across the top; every
 * role from the résumé in a third-width column (company, role and dates always shown) beside a
 * tinted panel with the chosen role's details; the full résumé link along the bottom. On phones
 * the cells stack, and the roles become a compact two-column grid of company and dates.
 *
 * Under the details, a strip of small squares grouped by year lights up the years that role
 * covers. The dates in text are the information; the strip only echoes them, by whole years,
 * so it never implies a month.
 *
 * The roles are a tab list: click or tap one, or use the arrow keys, Home and End. On wider
 * screens a blue mark slides to the chosen role, and the details share one cell, so the year
 * strip stays put while it recolours; on phones the details fit the chosen role.
 */
export default function Journey() {
  const [sel, setSel] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const list = useRef<HTMLDivElement>(null)
  const mark = useRef<HTMLSpanElement>(null)
  const lit = roleYears(roles[sel])

  // the selection mark follows the chosen role, and its size when the list reflows
  useLayoutEffect(() => {
    const place = () => {
      const t = tabs.current[sel]
      if (!t || !mark.current) return
      mark.current.style.transform = `translateY(${t.offsetTop}px)`
      mark.current.style.height = `${t.offsetHeight}px`
    }
    place()
    const ro = new ResizeObserver(place)
    if (list.current) ro.observe(list.current)
    return () => ro.disconnect()
  }, [sel])

  const select = (i: number, focus = false) => {
    const n = Math.max(0, Math.min(roles.length - 1, i))
    setSel(n)
    if (focus) tabs.current[n]?.focus()
  }

  const onKey = (e: KeyboardEvent) => {
    const to = { ArrowDown: sel + 1, ArrowRight: sel + 1, ArrowUp: sel - 1, ArrowLeft: sel - 1, Home: 0, End: roles.length - 1 }[e.key]
    if (to === undefined) return
    e.preventDefault()
    select(to, true)
  }

  return (
    <section id="journey" className="journey" aria-labelledby="journey-title" tabIndex={-1}>
      <div className="wrap">
        <div className="mod mod--journey" data-reveal>
          <div className="mod__cell journey__head">
            <h2 id="journey-title" className="journey__title">My journey</h2>
            <p className="journey__note">The roles and projects that have shaped how I design.</p>
          </div>

          <div className="mod__cell jlist" ref={list} role="tablist" aria-label="Roles" onKeyDown={onKey}>
            <span className="jlist__mark" ref={mark} aria-hidden="true" />
            {roles.map((r, i) => (
              <button
                key={r.company}
                ref={(el) => {
                  tabs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`jrole-${i}`}
                aria-selected={i === sel}
                aria-controls={`jdetail-${i}`}
                tabIndex={i === sel ? 0 : -1}
                className="jrole"
                onClick={() => select(i)}
              >
                <span className="jrole__company">{r.company}</span>
                <span className="jrole__meta">
                  <span>{r.role}</span>
                  <span className="jrole__dates">{dates(r)}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mod__cell jside">
            <div className="jdetails">
              {roles.map((r, i) => {
                const on = i === sel
                return (
                  <div
                    key={r.company}
                    id={`jdetail-${i}`}
                    role="tabpanel"
                    aria-labelledby={`jrole-${i}`}
                    className={`jdetail${on ? ' is-on' : ''}`}
                    inert={!on}
                  >
                    {r.current && <p className="jdetail__now">Currently</p>}
                    <h3 className="jdetail__company">{r.company}</h3>
                    <p className="jdetail__meta">
                      {r.role}
                      <span className="jdetail__dates">{dates(r)}</span>
                    </p>
                    <p className="jdetail__summary">{r.summary}</p>
                    {r.details.length > 0 && (
                      <ul className="jdetail__points">
                        {r.details.slice(0, 2).map((d) => (
                          <li key={d}>{withProjectLinks(d)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="jstrip" aria-hidden="true">
              {mapYears.map((y, yi) => {
                const on = lit.includes(y)
                return (
                  <div key={y} className={`jstrip__year${on ? ' is-on' : ''}`}>
                    <span className="jstrip__label">{y}</span>
                    <span className="jstrip__cells">
                      {Array.from({ length: PER_YEAR }, (_, k) => (
                        <span key={k} className="jstrip__cell" style={{ '--i': yi * PER_YEAR + k } as CSSProperties} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <a className="mod__cell journey__end" href={contact.resume} target="_blank" rel="noreferrer">
            View full résumé <span aria-hidden="true" className="journey__arrow">↗</span>
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
