import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { preloadPages, preloadRoute } from './components/lazyPage'
import './index.css'

// my own visits stay out of the visitor count: open the site once with ?notrack=1 in a
// browser to stop counting there, ?notrack=0 to start again
const NO_TRACK = 'jb-no-track'
try {
  const flag = new URLSearchParams(location.search).get('notrack')
  if (flag === '1') localStorage.setItem(NO_TRACK, '1')
  if (flag === '0') localStorage.removeItem(NO_TRACK)
} catch { /* storage blocked: count as usual */ }
const skipMine = <T,>(event: T) => {
  try { return localStorage.getItem(NO_TRACK) ? null : event } catch { return event }
}

// render once the opening page's code is in, so it mounts whole (a #hash or a saved scroll
// position finds its section), then fetch the other pages in the background
preloadRoute(location.pathname).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      <Analytics beforeSend={skipMine} />
    </StrictMode>,
  )
  const later = () => ('requestIdleCallback' in window ? requestIdleCallback(() => preloadPages()) : setTimeout(preloadPages, 1500))
  if (document.readyState === 'complete') later()
  else addEventListener('load', later, { once: true })
})
