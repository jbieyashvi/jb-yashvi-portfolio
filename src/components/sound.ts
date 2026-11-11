import { useSyncExternalStore } from 'react'

/**
 * The site's sound, made in the browser with Web Audio (no audio files): a soft wooden tap on
 * every link and button, and a quiet background of a warm held chord with the odd music-box
 * note on top, always from the same few notes so it stays recognisable.
 *
 * Sound is on unless the visitor turns it off; the choice is remembered on this device. Browsers
 * allow audio only after a tap or key press, so nothing plays until the first one, and the
 * background then fades in. It pauses while the tab is hidden.
 */

const KEY = 'jb-sound'
const listeners = new Set<() => void>()

let on = (() => {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
})()

let ctx: AudioContext | null = null
let master: GainNode | null = null
let bed: GainNode | null = null
let bellTimer = 0

/** C major pentatonic, high and soft: the notes every sound here is drawn from */
const BELLS = [523.25, 587.33, 659.25, 783.99, 880, 1046.5]
/** the held chord under them: C, G, E and D, low and wide */
const PAD = [130.81, 196, 329.63, 293.66]

function audio() {
  if (ctx) return ctx
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)
  return ctx
}

/** one short note: a sine with a soft overtone, struck and left to ring out */
function strike(freq: number, at: number, gain: number, ring: number, out: AudioNode) {
  const c = ctx!
  const env = c.createGain()
  env.gain.setValueAtTime(0, at)
  env.gain.linearRampToValueAtTime(gain, at + 0.006)
  env.gain.exponentialRampToValueAtTime(0.0001, at + ring)
  env.connect(out)
  for (const [mult, level] of [[1, 1], [2.76, 0.18]] as const) {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = freq * mult
    g.gain.value = level
    o.connect(g).connect(env)
    o.start(at)
    o.stop(at + ring + 0.05)
  }
}

/** the tap on a link, and a two-note chime on a button */
function tap(kind: 'link' | 'button') {
  const c = audio()
  if (!c || !master) return
  if (c.state === 'suspended') void c.resume()
  const t = c.currentTime + 0.005
  if (kind === 'link') strike(659.25, t, 0.16, 0.22, master)
  else {
    strike(783.99, t, 0.13, 0.3, master)
    strike(1046.5, t + 0.07, 0.1, 0.45, master)
  }
}

function startBed() {
  const c = audio()
  if (!c || !master) return
  if (c.state === 'suspended') void c.resume()
  if (bed) return
  bed = c.createGain()
  bed.gain.setValueAtTime(0, c.currentTime)
  bed.gain.linearRampToValueAtTime(1, c.currentTime + 4)
  bed.connect(master)

  // the chord: two slightly detuned triangles per note through a slowly breathing low-pass
  const filter = c.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 700
  filter.Q.value = 0.4
  const lfo = c.createOscillator()
  const depth = c.createGain()
  lfo.frequency.value = 0.05
  depth.gain.value = 260
  lfo.connect(depth).connect(filter.frequency)
  lfo.start()
  const pad = c.createGain()
  pad.gain.value = 0.022
  filter.connect(pad).connect(bed)
  for (const f of PAD) {
    for (const detune of [-6, 6]) {
      const o = c.createOscillator()
      o.type = 'triangle'
      o.frequency.value = f
      o.detune.value = detune
      o.connect(filter)
      o.start()
    }
  }

  // a music-box note every few seconds, softly, from the same scale
  const ring = () => {
    if (!ctx || !bed) return
    strike(BELLS[Math.floor(Math.random() * BELLS.length)], ctx.currentTime, 0.035, 2.4, bed)
    bellTimer = window.setTimeout(ring, 2600 + Math.random() * 4200)
  }
  bellTimer = window.setTimeout(ring, 1800)
}

function stopBed() {
  window.clearTimeout(bellTimer)
  if (!ctx || !bed) return
  const b = bed
  bed = null
  b.gain.cancelScheduledValues(ctx.currentTime)
  b.gain.setValueAtTime(b.gain.value, ctx.currentTime)
  b.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6)
  window.setTimeout(() => b.disconnect(), 700)
}

const subscribe = (fn: () => void) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export const useSound = () => useSyncExternalStore(subscribe, () => on)

/** turn sound on or off, from the header switch */
export function setSound(next: boolean) {
  on = next
  try {
    localStorage.setItem(KEY, next ? 'on' : 'off')
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  listeners.forEach((fn) => fn())
  if (next) {
    startBed()
    tap('button')
  } else stopBed()
}

/** listen once, for the whole page: the first tap or key press wakes the audio, and clicks play the tap */
let wired = false
export function wireSound() {
  if (wired) return
  wired = true
  // browsers count only some events as a gesture that may start audio (a touch's pointerdown
  // isn't one, a click or key press is), so keep listening until the audio is actually running
  const gestures = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'] as const
  const wake = () => {
    if (!on) return
    startBed()
    if (ctx?.state === 'running') gestures.forEach((g) => document.removeEventListener(g, wake, true))
    else void ctx?.resume()
  }
  gestures.forEach((g) => document.addEventListener(g, wake, true))
  document.addEventListener(
    'click',
    (e) => {
      if (!on) return
      const el = (e.target as Element | null)?.closest('a, button, [role="button"], summary, [data-tap]')
      // the sound switch plays its own chime
      if (!el || el.closest('[data-sound-switch]')) return
      tap(el.tagName === 'A' ? 'link' : 'button')
    },
    true,
  )
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) void ctx.suspend()
    else if (on) void ctx.resume()
  })
}
