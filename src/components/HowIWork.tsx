import type { CSSProperties } from 'react'

const steps = [
  { title: 'Understand', text: 'Start from client calls, the brief and the product as it is. On my own projects, interviews and walkthroughs.' },
  { title: 'Map', text: 'Map the workflow end to end: who does each step, and where it breaks.' },
  { title: 'Make', text: 'Design the screens and the design system, and build working prototypes with Figma, Claude and Codex.' },
  { title: 'Refine', text: 'Review with the client and team, test where I can, and keep improving after launch.' },
]

const pad = (v: number) => String(v).padStart(2, '0')

/**
 * How I work: four steps in one connected row on wide screens, stacked on phones. The steps
 * open one after another as the row enters the viewport (the site's one-time [data-reveal]).
 * Each step can take keyboard focus, so the blue highlight shown on hover is reachable
 * without a mouse.
 */
export default function HowIWork() {
  return (
    <section id="process" className="process" aria-labelledby="process-title" tabIndex={-1}>
      <div className="wrap">
        <h2 id="process-title" className="process__title" data-reveal>
          How I work
        </h2>
        <ol className="process__steps" data-reveal>
          {steps.map((s, i) => (
            <li key={s.title} className="process__step" tabIndex={0} style={{ '--i': i } as CSSProperties}>
              <span className="process__num" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <h3 className="process__name">{s.title}</h3>
              <p className="process__text">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
