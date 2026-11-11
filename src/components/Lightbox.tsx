import { useEffect, useRef, useState } from 'react'
import type { ImageItem } from '../data/images'

/**
 * Enlarged view for Ideas in motion and Gallery images. A native modal dialog, so focus is trapped and Esc
 * closes it; left and right arrows step through the set. Focus returns to the image
 * that opened it.
 */
export function useLightbox(items: ImageItem[]) {
  const [index, setIndex] = useState<number | null>(null)
  const opener = useRef<HTMLElement | null>(null)

  const open = (i: number) => {
    opener.current = document.activeElement as HTMLElement
    setIndex(i)
  }
  const close = () => {
    setIndex(null)
    opener.current?.focus()
  }

  return {
    open,
    lightbox: <Lightbox items={items} index={index} onIndex={setIndex} onClose={close} />,
  }
}

interface Props {
  items: ImageItem[]
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
}

function Lightbox({ items, index, onIndex, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const isOpen = index !== null

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (!isOpen) {
      if (d.open) d.close()
      return
    }
    if (!d.open) d.showModal()
    d.querySelector<HTMLButtonElement>('.lightbox__close')?.focus()
    document.documentElement.classList.add('no-scroll')
    return () => document.documentElement.classList.remove('no-scroll')
  }, [isOpen])

  if (index === null) return <dialog ref={ref} className="lightbox" aria-label="Enlarged image" />

  const item = items[index]
  const n = items.length
  const step = (d: number) => onIndex((index + d + n) % n)

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-labelledby="lightbox-cap"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
      onClick={(e) => {
        // a click on the backdrop area, not on the image or controls
        if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('lightbox__stage')) onClose()
      }}
    >
      <div className="lightbox__bar">
        <p className="lightbox__count" aria-live="polite">
          {index + 1} / {n}
        </p>
        <button type="button" className="lightbox__close" onClick={onClose}>
          Close <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="lightbox__stage">
        <img
          key={item.slug}
          src={`${item.src}-1800.webp`}
          width={item.w}
          height={item.h}
          alt={item.alt}
        />
      </div>

      <div className="lightbox__foot">
        <div id="lightbox-cap" className="lightbox__cap">
          <p className="lightbox__title">{item.caption}</p>
          <p className="lightbox__source">{item.label}</p>
        </div>
        {n > 1 && (
          <div className="lightbox__nav">
            <button type="button" onClick={() => step(-1)} aria-label="Previous image">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next image">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
    </dialog>
  )
}
