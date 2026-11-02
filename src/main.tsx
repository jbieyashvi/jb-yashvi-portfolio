import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { preloadPages, preloadRoute } from './components/lazyPage'
import './index.css'

// render once the opening page's code is in, so it mounts whole (a #hash or a saved scroll
// position finds its section), then fetch the other pages in the background
preloadRoute(location.pathname).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
  const later = () => ('requestIdleCallback' in window ? requestIdleCallback(() => preloadPages()) : setTimeout(preloadPages, 1500))
  if (document.readyState === 'complete') later()
  else addEventListener('load', later, { once: true })
})
