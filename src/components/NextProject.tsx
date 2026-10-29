import { Link } from 'react-router-dom'
import { nextProject, previousProject } from '../data/projects'

/** `withPrevious` swaps the All work link for the previous project, for pages read in sequence */
export default function NextProject({ slug, withPrevious }: { slug: string; withPrevious?: boolean }) {
  const next = nextProject(slug)
  const prev = previousProject(slug)
  return (
    <nav className="next" aria-label="More work">
      <div className="wrap next__inner">
        {withPrevious ? (
          <Link to={`/work/${prev.slug}`} className="next__link next__link--prev">
            <span className="next__label">Previous project</span>
            <span className="next__name next__name--prev"><span aria-hidden="true">←</span> {prev.name}</span>
          </Link>
        ) : (
          <Link to="/#work" className="back">
            <span aria-hidden="true">←</span> All work
          </Link>
        )}
        <Link to={`/work/${next.slug}`} className="next__link">
          <span className="next__label">Next project</span>
          <span className="next__name">{next.name} <span aria-hidden="true">→</span></span>
        </Link>
      </div>
    </nav>
  )
}
