import { useEffect, useRef, useState } from 'react'
import slices from '../data/caseSlices.json'
import loadAhead from './loadAhead'

interface Props {
  id: 'nutrio'
  name: string
  pdf: string
  pdfSize: string
  /** the study is the page's first image: its first slice loads at once, at high priority */
  lead?: boolean
}

/**
 * Shows the original single-page case-study PDF as stacked image slices at its native
 * width (1280px), so the layout and wording stay untouched. Any slice opens a zoomed
 * reader that keeps the whole study in one scroll.
 */
export default function CaseStudyViewer({ id, name, pdf, pdfSize, lead = false }: Props) {
  const parts = slices[id]
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    if (open === null) {
      if (d.open) d.close()
      return
    }
    if (!d.open) d.showModal()
    // showModal focuses the first link; start on Close instead
    d.querySelector<HTMLButtonElement>('.reader__close')?.focus()
    document.documentElement.classList.add('no-scroll')
    const target = d.querySelector<HTMLElement>(`[data-part="${open}"]`)
    target?.scrollIntoView({ block: 'start' })
    return () => document.documentElement.classList.remove('no-scroll')
  }, [open])

  const img = (p: (typeof parts)[number], sizes: string, eager = false, high = false) => (
    <img
      src={`${p.src}-1000.webp`}
      srcSet={`${p.src}-1000.webp 1000w, ${p.src}-2000.webp 2000w`}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={high ? 'high' : undefined}
      ref={eager ? undefined : loadAhead}
      decoding="async"
    />
  )

  return (
    <section className="cs" aria-labelledby={`${id}-cs-title`}>
      <div className="wrap cs__head">
        <div>
          <h2 id={`${id}-cs-title`} className="section-title">The case study</h2>
          <p className="cs__note">
            The complete original {name} case study, unedited. Select any part to read it larger.
          </p>
        </div>
        <div className="cs__actions">
          <button type="button" className="btn btn--solid" onClick={() => setOpen(0)}>
            Read full screen
          </button>
          <a className="btn btn--ghost" href={pdf} target="_blank" rel="noreferrer">
            Open PDF <span className="cs__size">{pdfSize}</span>
            <span aria-hidden="true" className="btn__icon">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>

      <figure className="cs__doc" aria-label={`${name} case study, original PDF shown as images`}>
        {parts.map((p, i) => (
          <button
            key={p.src}
            type="button"
            className="cs__part"
            onClick={() => setOpen(i)}
            aria-label={`Read part ${i + 1} of ${parts.length} larger`}
            style={{ aspectRatio: `${p.w} / ${p.h}` }}
          >
            {img(p, '(min-width: 1328px) 1280px, 100vw', lead && i === 0, lead && i === 0)}
          </button>
        ))}
        <figcaption className="sr-only">
          For the accessible text version, open the PDF.
        </figcaption>
      </figure>

      <dialog
        ref={dialogRef}
        className="reader"
        aria-label={`${name} case study, zoomed`}
        onClose={() => setOpen(null)}
        onCancel={() => setOpen(null)}
      >
        <div className="reader__bar">
          <span>{name} case study</span>
          <div className="reader__bar-actions">
            <a href={pdf} target="_blank" rel="noreferrer">PDF<span className="sr-only"> (opens in a new tab)</span></a>
            <button type="button" className="reader__close" onClick={() => setOpen(null)}>
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>
        <div className="reader__scroll">
          <div className="reader__doc">
            {open !== null &&
              parts.map((p, i) => (
                <div key={p.src} data-part={i} style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                  {img(p, '(max-width: 700px) 1000px, 2000px', Math.abs(i - open) < 2)}
                </div>
              ))}
          </div>
        </div>
      </dialog>
    </section>
  )
}
