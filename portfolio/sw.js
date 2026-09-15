/* ═══════════════════════════════════════════════════════════════
   SERVICE WORKER — N. AKSHIT VINAY PORTFOLIO
   Strategy
     • Navigation (the HTML page)  → network-first, cache fallback
       (so you never see a stale portfolio after an edit + deploy)
     • Same-origin assets          → stale-while-revalidate
     • Fonts / CDN assets          → cache-first
     • Live APIs (GitHub, weather) → never cached, always live
═══════════════════════════════════════════════════════════════ */

/* Bump VERSION whenever a cached asset changes at the same URL — the profile
   photo and the icon set keep their filenames, so without a bump returning
   visitors would keep serving the old images from disk. */
const VERSION = "fx2080-v4"
const CORE_CACHE = VERSION + "-core"
const RUNTIME_CACHE = VERSION + "-runtime"

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./admin.css",
  "./futurist.css",
  "./script.js",
  "./admin.js",
  "./futurist.js",
  "./manifest.webmanifest",
  "./favicon.ico",
  "./assets/profile.png",
  "./assets/avatar.png",
  "./assets/icons/favicon-16.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE_CACHE)
      /* cache each asset independently so one 404 cannot abort the install */
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: "reload" }))
          } catch (e) {}
        }),
      )
      self.skipWaiting()
    })(),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys.map((k) => {
          if (k !== CORE_CACHE && k !== RUNTIME_CACHE) return caches.delete(k)
        }),
      )
      await self.clients.claim()
    })(),
  )
})

const NEVER_CACHE = ["api.github.com", "api.open-meteo.com", "bigdatacloud.net"]

function isLiveApi(url) {
  return NEVER_CACHE.some((host) => url.hostname.indexOf(host) !== -1)
}

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return

  const url = new URL(req.url)

  /* live telemetry must always be fresh */
  if (isLiveApi(url)) return

  /* the page itself: fresh first, cached as a safety net */
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req)
          const cache = await caches.open(CORE_CACHE)
          cache.put("./index.html", fresh.clone())
          return fresh
        } catch (e) {
          const cache = await caches.open(CORE_CACHE)
          return (
            (await cache.match("./index.html")) ||
            (await cache.match("./")) ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          )
        }
      })(),
    )
    return
  }

  const sameOrigin = url.origin === self.location.origin
  const cacheableType =
    ["style", "script", "image", "font", "manifest"].indexOf(
      req.destination,
    ) !== -1
  if (!sameOrigin && !cacheableType) return

  /* same-origin: serve from cache, refresh in the background */
  if (sameOrigin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CORE_CACHE)
        const cached = await cache.match(req)
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) cache.put(req, res.clone())
            return res
          })
          .catch(() => null)
        return cached || (await network) || new Response("", { status: 504 })
      })(),
    )
    return
  }

  /* cross-origin CDN assets: cache-first */
  event.respondWith(
    (async () => {
      const cache = await caches.open(RUNTIME_CACHE)
      const cached = await cache.match(req)
      if (cached) return cached
      try {
        const res = await fetch(req)
        if (res && (res.ok || res.type === "opaque"))
          cache.put(req, res.clone())
        return res
      } catch (e) {
        return new Response("", { status: 504 })
      }
    })(),
  )
})
