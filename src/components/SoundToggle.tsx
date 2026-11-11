import { useEffect } from 'react'
import { setSound, useSound, wireSound } from './sound'

/**
 * Speaker switch in the header, beside the theme switch: sound waves while the site's sound is
 * on, a cross when it is off. Its label names what a press does.
 */
export default function SoundToggle() {
  const on = useSound()
  useEffect(wireSound, [])
  return (
    <button
      type="button"
      className="theme-toggle sound-toggle"
      data-sound-switch=""
      data-on={on || undefined}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
      onClick={() => setSound(!on)}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path className="sound-toggle__body" d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
        <path className="sound-toggle__waves" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
        <path className="sound-toggle__off" d="M16 9.5l5 5M21 9.5l-5 5" />
      </svg>
    </button>
  )
}
