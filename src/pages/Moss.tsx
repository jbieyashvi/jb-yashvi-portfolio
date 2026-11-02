import DeviceMockup from '../components/DeviceMockup'
import NextProject from '../components/NextProject'
import ProjectHeader from '../components/ProjectHeader'
import useTitle from '../components/useTitle'
import loadAhead from '../components/loadAhead'
import { mid } from '../components/srcset'
import { getProject } from '../data/projects'

// the full landing page, cut into four parts so each loads as the reader reaches it
const PARTS = [
  { h: 2400, alt: 'Part 1 of the landing page: the hero, then Why Moss: model-agnostic, zero-hop latency, zero infra overhead, and offline-first, cloud-smart.' },
  { h: 2400, alt: 'Part 2 of the landing page: Who is it for, with cards for copilot and AI agent builders, docs and knowledge, mobile and desktop developers, and dev tool makers.' },
  { h: 2400, alt: 'Part 3 of the landing page: infra and platform leads, Common use cases, How we deliver, and the start of Our mission.' },
  { h: 2368, alt: 'Part 4 of the landing page: Our mission, edge-native performance figures, the closing Get Early Access call to action, and the footer, with the street address and phone number blurred.' },
]

export default function Moss() {
  useTitle('Moss, landing page design | Jb Yashvi')
  return (
    <article>
      <ProjectHeader
        name="Moss"
        type="Landing page design"
        intro={
          <>
            <p className="yc-badge">
              <span className="yc-badge__mark" aria-hidden="true">Y</span>
              Backed by Y Combinator · 2025
            </p>
            <p className="lede">
              Moss, by InferEdge, is an on-device search engine for AI apps and agents: search runs on the device itself,
              then syncs to the cloud.
            </p>
            <p>
              I designed its landing page in Figma, before the company was backed by Y Combinator in 2025. This page shows
              that design; it is not the live site.
            </p>
          </>
        }
        meta={[
          { label: 'Company', value: 'InferEdge' },
          { label: 'Product', value: 'Moss, on-device AI search' },
          { label: 'My role', value: 'Landing page design' },
          { label: 'Year', value: '2025' },
          { label: 'Shown here', value: 'Figma design' },
        ]}
      />

      <section className="wrap showcase" aria-label="Landing page preview">
        <DeviceMockup mockup={getProject('moss').mockup!} tone="paper" eager className="mock--hero" />
      </section>

      <section className="wrap walkthrough" aria-labelledby="lp-title">
        <h2 id="lp-title" className="section-title">The landing page</h2>
        <p className="lp-note">
          The full page, top to bottom: the hero, Why Moss, Who is it for, common use cases, How we deliver, the mission,
          performance and a closing call to action. The company’s street address and phone number in the footer are
          blurred.
        </p>
        <div className="lp-frame">
          <div className="lp-frame__bar" aria-hidden="true">
            <i /><i /><i />
          </div>
          {PARTS.map((p, i) => {
            const base = `/work/moss/page-${i + 1}`
            return (
              <img
                key={base}
                src={`${base}-1800.webp`}
                srcSet={`${base}-800.webp 800w, ${mid(base, 1800)}${base}-1800.webp 1800w`}
                sizes="(max-width: 760px) 100vw, 1000px"
                width={1800}
                height={p.h}
                alt={p.alt}
                loading="lazy"
                ref={loadAhead}
                decoding="async"
              />
            )
          })}
        </div>
      </section>

      <NextProject slug="moss" />
    </article>
  )
}
