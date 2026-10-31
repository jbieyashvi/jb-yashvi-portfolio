import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'

/** small outline icons (24px grid, stroked in currentColor); all decorative */
const ICONS = {
  pointer: <path d="M6 3.5v15.2l4.1-3.9 2.8 6.2 2.5-1.1-2.8-6.1h5.7z" strokeLinejoin="round" />,
  frame: <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />,
  rect: <rect x="4.5" y="6.5" width="15" height="11" />,
  pen: (
    <>
      <path d="M12 3.5 18.5 14 12 20.5 5.5 14z" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="1.6" />
      <path d="M12 3.5v7.9" />
    </>
  ),
  text: <path d="M5 6.5V5h14v1.5M12 5v14M9 19h6" />,
  component: (
    <path
      d="m12 2.8 2.7 2.7L12 8.2 9.3 5.5zM12 15.8l2.7 2.7-2.7 2.7-2.7-2.7zM5.5 9.3l2.7 2.7-2.7 2.7L2.8 12zM18.5 9.3l2.7 2.7-2.7 2.7-2.7-2.7z"
      strokeLinejoin="round"
    />
  ),
  // What I do
  layers: <path d="m12 4 8.5 4.5L12 13 3.5 8.5zM3.5 12.5 12 17l8.5-4.5M3.5 16.5 12 21l8.5-4.5" strokeLinejoin="round" />,
  layout: <path d="M3.5 4.5h17v15h-17zM3.5 9h17M9.5 9v10.5" />,
  spark: <path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7zM18.5 15.5c.3 1.8 1 2.5 2.7 2.7-1.8.3-2.4 1-2.7 2.8-.3-1.8-1-2.5-2.7-2.8 1.8-.2 2.4-.9 2.7-2.7z" strokeLinejoin="round" />,
}
type IconName = keyof typeof ICONS

const Icon = ({ name }: { name: IconName }) => (
  <svg className="hero__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
    {ICONS[name]}
  </svg>
)

// each skill's icon sits on its own colour, the same markers the story section uses
const SKILLS: [string, IconName, string][] = [
  ['Product Design', 'layers', 'sky'],
  ['UI/UX', 'layout', 'rose'],
  ['AI Prototyping', 'spark', 'lilac'],
]
const MADE_WITH = ['Figma', 'Claude', 'Codex']

/** frame proportions the Frame tool steps through; the first hugs the headline */
const FRAMES = [
  { name: 'fits the text', ratio: 0 },
  { name: '16:9', ratio: 16 / 9 },
  { name: '4:3', ratio: 4 / 3 },
  { name: '1:1', ratio: 1 },
]

/** the Text tool's fonts, after Archivo (the original); regular or medium only */
const FONTS = [
  { id: '', name: 'Archivo' },
  { id: 'serif', name: 'Instrument Serif', family: 'Instrument Serif', weight: 400 },
  { id: 'mono', name: 'IBM Plex Mono', family: 'IBM Plex Mono', weight: 500 },
  { id: 'round', name: 'Nunito', family: 'Nunito', weight: 500 },
]
/* only the letters of the headline, so the three fonts together weigh a few kilobytes */
const FONT_CSS =
  'https://fonts.googleapis.com/css2?family=Instrument+Serif&family=IBM+Plex+Mono:wght@500&family=Nunito:wght@500' +
  '&display=swap&text=' + encodeURIComponent('ProductDesignerPRODUCTDESIGNER ')

let fontsReady: Promise<unknown> | null = null
/** fetched the first time the visitor reaches for the toolbar, not with the page */
function loadFonts() {
  if (!fontsReady) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_CSS
    fontsReady = new Promise<void>((done) => {
      link.onload = () => {
        const all = FONTS.filter((f) => f.family).map((f) => document.fonts.load(`${f.weight} 1em "${f.family}"`, 'PRODUCT'))
        Promise.allSettled(all).then(() => done())
      }
      link.onerror = () => done()
    })
    document.head.append(link)
  }
  return fontsReady
}

type Tool = 'pointer' | 'frame' | 'rect' | 'pen' | 'text' | 'component'

interface Art {
  tool: Tool // the tool in use, highlighted like Figma's
  frame: number // index into FRAMES
  rect: boolean
  pen: boolean
  font: number // index into FONTS
  inline: boolean // the one-line composition
}
const ORIGINAL: Art = { tool: 'pointer', frame: 0, rect: false, pen: false, font: 0, inline: false }

const TOOLS: { id: Tool; icon: IconName; tip: string }[] = [
  { id: 'pointer', icon: 'pointer', tip: 'Select headline' },
  { id: 'frame', icon: 'frame', tip: 'Change frame proportion' },
  { id: 'rect', icon: 'rect', tip: 'Rectangle behind headline' },
  { id: 'pen', icon: 'pen', tip: 'Draw underline' },
  { id: 'text', icon: 'text', tip: 'Change font' },
  { id: 'component', icon: 'component', tip: 'Swap headline composition' },
]

/**
 * Fits the artwork to the selection: the frame takes the chosen proportion inside the
 * selection's box, and the headline scales to sit inside the frame. The box itself is sized by
 * a hidden copy of the original headline, so nothing around the artwork ever moves.
 */
function useFit(art: Art) {
  const sel = useRef<HTMLDivElement>(null)
  const sizer = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const { frame } = art
  useLayoutEffect(() => {
    const box = sel.current
    const orig = sizer.current
    const h1 = title.current
    if (!box || !orig || !h1) return
    const fit = () => {
      const w = box.clientWidth
      const h = box.clientHeight
      const r = FRAMES[frame].ratio
      const fw = r ? Math.min(w, h * r) : w
      const fh = r ? fw / r : h
      // the original headline's room, shrunk with the frame
      const k = Math.min(fw / w, fh / h)
      const s = Math.min(1, (orig.offsetWidth * k) / h1.offsetWidth, (orig.offsetHeight * k) / h1.offsetHeight)
      box.style.setProperty('--fw', `${fw}px`)
      box.style.setProperty('--fh', `${fh}px`)
      box.style.setProperty('--s', `${s}`)
    }
    fit()
    // a resize, or a font arriving, changes the sizes
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    ro.observe(h1)
    return () => ro.disconnect()
  }, [frame])
  return { sel, sizer, title }
}

/**
 * The hero as a design canvas: a small introduction, then the headline inside a tilted
 * selection frame with eight handles and a component label, two small labels hanging off its
 * corners, and a design-tool toolbar beneath it. The labels are decoration; the toolbar works:
 * each tool changes the headline artwork (select, frame proportion, a rectangle behind it, a
 * pen underline, the font, the composition), and Reset brings back the original, which is
 * also how every visit starts. Changes stay inside the selection's box, so the page around it
 * never moves. Explore my work stays the one call to action.
 */
export default function HeroCanvas() {
  const [art, setArt] = useState(ORIGINAL)
  const [status, setStatus] = useState('Try the tools')
  // counts presses of the pointer, so its handles pop in again each time
  const [pops, setPops] = useState(0)
  const { sel, sizer, title } = useFit(art)
  // the latest artwork, for a press that had to wait for the fonts
  const latest = useRef(art)
  useEffect(() => {
    latest.current = art
  }, [art])
  const pristine = JSON.stringify(art) === JSON.stringify(ORIGINAL)

  const use = async (tool: Tool) => {
    if (tool === 'text') {
      // wait briefly for the fonts, so the headline doesn't flash a fallback
      await Promise.race([loadFonts(), new Promise((r) => setTimeout(r, 1200))])
    }
    const now = latest.current
    const next = { ...now, tool }
    let note: string
    if (tool === 'pointer') {
      setPops((n) => n + 1)
      note = 'Headline selected'
    } else if (tool === 'frame') {
      next.frame = (now.frame + 1) % FRAMES.length
      note = `Frame ${FRAMES[next.frame].name}`
    } else if (tool === 'rect') {
      next.rect = !now.rect
      note = next.rect ? 'Rectangle added' : 'Rectangle removed'
    } else if (tool === 'pen') {
      next.pen = !now.pen
      note = next.pen ? 'Underline drawn' : 'Underline removed'
    } else if (tool === 'text') {
      next.font = (now.font + 1) % FONTS.length
      note = `Font: ${FONTS[next.font].name}${next.font ? '' : ' (original)'}`
    } else {
      next.inline = !now.inline
      note = next.inline ? 'Composition: one line' : 'Composition: stacked'
    }
    latest.current = next
    setArt(next)
    setStatus(note)
  }

  const reset = () => {
    if (pristine) return
    setArt(ORIGINAL)
    setStatus('Back to the original')
  }

  /** what each tool has changed, for its pressed state and the dot under it */
  const changed: Record<Tool, boolean> = {
    pointer: false,
    frame: art.frame > 0,
    rect: art.rect,
    pen: art.pen,
    text: art.font > 0,
    component: art.inline,
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__canvas">
        <div className="hero__group">
          <p className="hero__hello">
            <img src="/about/cafe-avatar.webp" width={240} height={240} alt="" decoding="async" />
            Hi, I’m Jb Yashvi
          </p>
          <div className="hero__stage">
            <div className="hero__sel" ref={sel}>
              {/* sizes the selection: the original headline, invisible */}
              <div className="hero__sizer" ref={sizer} aria-hidden="true">
                <span>Product</span>
                <span>Designer</span>
              </div>
              <div className="hero__frame" aria-hidden="true" data-idle={art.tool !== 'pointer' || undefined}>
                <span className="hero__label">
                  <Icon name="component" />
                  Product designer
                </span>
                <span key={pops} className={`hero__handles${pops ? ' hero__handles--pop' : ''}`}>
                  <i /><i /><i /><i /><i /><i /><i /><i />
                </span>
              </div>
              <h1
                id="hero-title"
                ref={title}
                className="hero__title"
                data-font={FONTS[art.font].id || undefined}
                data-inline={art.inline || undefined}
                data-rect={art.rect || undefined}
              >
                <span className="hero__line"><span>Product</span></span>{' '}
                <span className="hero__line"><span>Designer</span></span>
                {art.pen && (
                  <svg className="hero__pen" viewBox="0 0 400 24" aria-hidden="true" focusable="false">
                    <path pathLength={1} d="M4 15c40-5 82-8 128-6s84 6 130 3c46-3 90-7 134-4" />
                  </svg>
                )}
              </h1>
            </div>
            <div className="hero__tag hero__tag--skills">
              <p className="hero__tag-head">What I do</p>
              <ul>
                {SKILLS.map(([label, icon, tone]) => (
                  <li key={label}>
                    <span className={`hero__chip hero__chip--${tone}`}><Icon name={icon} /></span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <p className="hero__tag hero__tag--tools">
              <span className="sr-only">Tools: </span>
              {MADE_WITH.map((t, i) => (
                <span key={t} className={`hero__tool-chip hero__tool-chip--${t.toLowerCase()}`}>{t}{i < MADE_WITH.length - 1 && <span className="sr-only">, </span>}</span>
              ))}
            </p>
          </div>
          <div className="hero__play" onPointerEnter={loadFonts} onFocus={loadFonts}>
            <p className="hero__hint" aria-live="polite">{status}</p>
            <div className="hero__bar" role="group" aria-label="Design tools for the headline">
              {TOOLS.map((t) => (
                <Fragment key={t.id}>
                  {t.id === 'component' && <span className="hero__bar-rule" />}
                  <button
                    type="button"
                    className={`hero__tool${art.tool === t.id ? ' is-on' : ''}`}
                    aria-label={t.tip}
                    aria-pressed={t.id === 'pointer' ? art.tool === 'pointer' : t.id === 'rect' || t.id === 'pen' ? changed[t.id] : undefined}
                    data-tip={t.tip}
                    data-changed={changed[t.id] || undefined}
                    onClick={() => use(t.id)}
                  >
                    <Icon name={t.icon} />
                  </button>
                </Fragment>
              ))}
            </div>
            <button type="button" className="hero__reset" aria-disabled={pristine} onClick={reset}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" focusable="false">
                <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4h4" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div className="hero__foot">
          <p className="hero__lede">I design clear, intuitive web and mobile experiences across SaaS, <span className="keep">e-commerce</span>, logistics and operations, using <span className="keep">AI-assisted</span> prototyping to bring ideas to life.</p>
          <a href="#work" className="btn btn--solid hero__cta">
            Explore my work <span aria-hidden="true" className="btn__icon">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
