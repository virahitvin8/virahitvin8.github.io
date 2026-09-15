import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/*
 * Offline + repeat-visit speed. Registered after paint so the first render is
 * never delayed, and skipped in dev because a cache in front of the Vite dev
 * server makes hot reload confusing.
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* unsupported or blocked — the site works fine without it */
    })
  })
}
