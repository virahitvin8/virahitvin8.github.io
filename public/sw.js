/* ═══════════════════════════════════════════════════════════════════════
   SERVICE WORKER — N. AKSHIT VINAY PORTFOLIO (React build)
   Strategy
     • Navigations        → network-first, cached shell as fallback
                            (a deploy is visible immediately, and a visitor
                            who goes offline still gets the app)
     • /assets/*          → cache-first. Vite fingerprints these filenames,
                            so a given URL is immutable and can never go stale.
     • Icons / manifest   → cache-first (stable, rarely change)
     • Live APIs          → never cached, always live
   Bump VERSION after replacing any non-fingerprinted file (an icon, the
   manifest, og-card) — its URL stays the same, so returning visitors would
   otherwise keep the old one from disk.
═══════════════════════════════════════════════════════════════════════ */

const VERSION = 'fx-react-v2';
const CORE = VERSION + '-core';
const ASSETS = VERSION + '-assets';

const CORE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icons/favicon-16.png',
  '/icons/favicon-32.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/profile.png',
  '/avatar.png',
  '/og-card.png',
];

const NEVER_CACHE = ['api.github.com', 'api.open-meteo.com', 'bigdatacloud.net'];

function isLiveApi(url) {
  return NEVER_CACHE.some((host) => url.hostname.indexOf(host) !== -1);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE);
      // Cache each entry independently so one 404 can't abort the install.
      await Promise.all(
        CORE_ASSETS.map(async (url) => {
          try {
            await cache.add(new Request(url, { cache: 'reload' }));
          } catch (e) {
            /* non-fatal */
          }
        }),
      );
      self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k === CORE || k === ASSETS ? undefined : caches.delete(k))),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Live data must never be served from cache.
  if (isLiveApi(url)) return;

  // Cross-origin (fonts, CDN): let the browser handle it normally.
  if (url.origin !== self.location.origin) return;

  // Navigations: fresh HTML when online, cached shell when not.
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res && res.ok) {
            const cache = await caches.open(CORE);
            cache.put('/', res.clone());
          }
          return res;
        } catch {
          const cache = await caches.open(CORE);
          return (await cache.match('/')) || Response.error();
        }
      })(),
    );
    return;
  }

  // Fingerprinted build output — immutable, so serve from cache first.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSETS);
        const hit = await cache.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          return (await cache.match(req)) || Response.error();
        }
      })(),
    );
    return;
  }

  // Everything else same-origin: cache-first, refreshed in the background.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CORE);
      const hit = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      return hit || (await network) || Response.error();
    })(),
  );
});
