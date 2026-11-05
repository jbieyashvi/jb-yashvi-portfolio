export type ImpactStat = { tone: 'sun' | 'sky' | 'rose' | 'lilac' | 'mint'; value: string; label: string }

/**
 * The Impact card that opens a case study: a black card, starred, with a few headline numbers or
 * states taken from the page itself, and a line on where they come from and what they don't show.
 */
export default function CaseImpact({ title, lede, stats, note }: {
  title: string
  lede: React.ReactNode
  stats: readonly ImpactStat[]
  note: React.ReactNode
}) {
  return (
    <section id="impact" className="dv-sec cp-impact" aria-labelledby="impact-title" tabIndex={-1}>
      <header className="dv-head">
        <p className="dv-kicker cp-impact__kicker">
          <svg className="cp-impact__star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 1.5l2.6 7.1 7.4.3-5.8 4.7 2 7.3L12 16.7l-6.2 4.2 2-7.3L2 8.9l7.4-.3z" />
          </svg>
          Impact
        </p>
        <h2 id="impact-title" className="dv-h2">{title}</h2>
        <p>{lede}</p>
      </header>
      <ul className="cp-glance cp-impact__stats">
        {stats.map((s) => (
          <li key={s.value + s.label} className={`cp-glance__card cp-tone--${s.tone}`}>
            <span className="cp-glance__value">{s.value}</span>
            <span className="cp-glance__label">{s.label}</span>
          </li>
        ))}
      </ul>
      <p className="cp-impact__note">{note}</p>
    </section>
  )
}
