import { useEffect, useRef, useState } from 'react'

const W = 360
const H = 300
const FLOOR = 22
const BASE = 150
const KEY = 'jb-tower-best'
const TONES = ['#c9b8ff', '#ffd98a', '#a9d8ff', '#ffbfb3', '#b8e6c4']

type Block = { x: number; w: number }

const readBest = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 0
  } catch {
    return 0
  }
}

/**
 * Stack a building: a floor slides back and forth over the last one; drop it (tap, click, or
 * Space/Enter) and whatever hangs over the edge is cut off, so the next floor is narrower. Miss
 * completely and the building is done. The canvas only animates while a round is on.
 */
export default function RvGame() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const game = useRef({ stack: [] as Block[], cur: { x: 0, w: BASE }, dir: 1, speed: 2.2, cut: null as null | { x: number; w: number; y: number; t: number } })
  const [state, setState] = useState<'idle' | 'play' | 'over'>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(readBest)

  const draw = () => {
    const c = canvas.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    const g = game.current
    const dark = document.documentElement.dataset.theme === 'dark'
    const ink = dark ? '#f2f2f3' : '#17171a'
    ctx.clearRect(0, 0, W, H)
    // the camera rises with the building, keeping the moving floor near the top third
    const lift = Math.max(0, g.stack.length * FLOOR - (H - 120))
    const yOf = (i: number) => H - 24 - (i + 1) * FLOOR + lift
    ctx.strokeStyle = ink
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, H - 24 + lift)
    ctx.lineTo(W, H - 24 + lift)
    ctx.stroke()
    const floor = (b: Block, y: number, i: number) => {
      ctx.fillStyle = TONES[i % TONES.length]
      ctx.fillRect(b.x, y, b.w, FLOOR)
      ctx.strokeRect(b.x + 0.5, y + 0.5, b.w - 1, FLOOR - 1)
      ctx.fillStyle = ink
      for (let wx = b.x + 8; wx < b.x + b.w - 10; wx += 16) ctx.fillRect(wx, y + 7, 6, 8)
    }
    g.stack.forEach((b, i) => floor(b, yOf(i), i))
    if (state === 'play') floor(g.cur, yOf(g.stack.length), g.stack.length)
    if (g.cut) {
      ctx.globalAlpha = Math.max(0, 1 - g.cut.t / 30)
      ctx.fillStyle = TONES[g.stack.length % TONES.length]
      ctx.fillRect(g.cut.x, g.cut.y + g.cut.t * g.cut.t * 0.08 + lift, g.cut.w, FLOOR)
      ctx.globalAlpha = 1
    }
  }

  useEffect(() => {
    const c = canvas.current
    if (!c) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = W * dpr
    c.height = H * dpr
    c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0)
    draw()
    // redraw on a theme change so the lines follow it
    const mo = new MutationObserver(() => draw())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (state !== 'play') {
      draw()
      return
    }
    let raf = 0
    const tick = () => {
      const g = game.current
      g.cur.x += g.dir * g.speed
      if (g.cur.x <= 0 || g.cur.x + g.cur.w >= W) g.dir *= -1
      if (g.cut) g.cut.t += 1
      draw()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const start = () => {
    game.current = { stack: [{ x: (W - BASE) / 2, w: BASE }], cur: { x: 0, w: BASE }, dir: 1, speed: 2.2, cut: null }
    setScore(0)
    setState('play')
  }

  const drop = () => {
    if (state !== 'play') return start()
    const g = game.current
    const top = g.stack[g.stack.length - 1]
    const left = Math.max(top.x, g.cur.x)
    const right = Math.min(top.x + top.w, g.cur.x + g.cur.w)
    const y = H - 24 - (g.stack.length + 1) * FLOOR
    if (right - left <= 2) {
      g.cut = null
      setState('over')
      const n = g.stack.length - 1
      if (n > best) {
        setBest(n)
        try {
          localStorage.setItem(KEY, String(n))
        } catch {
          // storage unavailable: the best score lasts for this visit
        }
      }
      return
    }
    const hang = g.cur.x < left ? { x: g.cur.x, w: left - g.cur.x } : { x: right, w: g.cur.x + g.cur.w - right }
    g.cut = hang.w > 0 ? { ...hang, y, t: 0 } : null
    g.stack.push({ x: left, w: right - left })
    g.cur = { x: g.dir > 0 ? 0 : W - (right - left), w: right - left }
    g.speed = Math.min(5.5, g.speed + 0.18)
    setScore(g.stack.length - 1)
  }

  return (
    <div className="rv-game">
      <canvas
        ref={canvas}
        className="rv-game__canvas"
        style={{ aspectRatio: `${W} / ${H}` }}
        tabIndex={0}
        role="img"
        aria-label={state === 'play' ? `Building, ${score} floors. Press Space to drop the next floor.` : 'A small building game. Press Space to start.'}
        onPointerDown={drop}
        onKeyDown={(e) => {
          if (e.key !== ' ' && e.key !== 'Enter') return
          e.preventDefault()
          drop()
        }}
      />
      <div className="rv-game__bar">
        <p aria-live="polite">
          <strong>{score}</strong> {score === 1 ? 'floor' : 'floors'}
          <span className="rv-game__best">Best {best}</span>
        </p>
        <button type="button" className="rv-pill rv-pill--sm" onClick={drop}>
          {state === 'play' ? 'Drop' : state === 'over' ? 'Build again' : 'Start building'}
        </button>
      </div>
      {state === 'over' && <p className="rv-game__over">Topped out at {score} {score === 1 ? 'floor' : 'floors'}.</p>}
    </div>
  )
}
