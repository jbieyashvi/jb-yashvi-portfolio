import { Link } from 'react-router-dom'
import slices from '../data/caseSlices.json'
import { personalProjects } from '../data/projects'
import NextProject from '../components/NextProject'
import useTitle from '../components/useTitle'

type Slug = 'gema' | 'roam' | 'zensenta' | 'influish' | 'relay'

/**
 * A personal project is its PDF: the page shows only the name and every page of the original
 * PDF, in order, as stacked image slices (scripts/slice-pdfs.mjs) at up to its native width.
 * Slices below the first load as they near the screen. Then All work and the next personal project.
 */
export default function PersonalProject({ slug }: { slug: Slug }) {
  const { name } = personalProjects.find((p) => p.slug === slug)!
  const parts = slices[slug]
  useTitle(`${name} | Jb Yashvi`)

  return (
    <article>
      <header className="phead">
        <div className="wrap">
          <Link to="/#work" className="back"><span aria-hidden="true">←</span> Back to work</Link>
          <h1 className="phead__title">{name}</h1>
        </div>
      </header>

      <figure className="pdoc cs__doc" aria-label={`${name}, original PDF shown as images`}>
        {parts.map((p, i) => (
          <div key={p.src} className="pdoc__part" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
            <img
              src={`${p.src}-1000.webp`}
              srcSet={`${p.src}-1000.webp 1000w, ${p.src}-2000.webp 2000w`}
              sizes="(min-width: 1328px) 1280px, 100vw"
              width={p.w}
              height={p.h}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        ))}
        <figcaption className="sr-only">
          <a href={`/work/personal/${slug}.pdf`}>Open the {name} PDF</a> for the accessible text version.
        </figcaption>
      </figure>

      <NextProject slug={slug} />
    </article>
  )
}
