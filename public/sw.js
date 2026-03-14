// Playlio Service Worker — offline-first pentru mini-jocuri
// Versiune cache — incrementează la fiecare deploy

const CACHE_VERSION = 'playlio-v1'
const STATIC_CACHE = `${CACHE_VERSION}-static`
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`

// Resurse critice care se cacheaza la install
const STATIC_ASSETS = [
  '/',
  '/worlds',
  '/play/learning',
  '/play/adventure',
  '/play/builder',
  '/play/jump',
  '/manifest.json',
  '/icons/icon.svg',
]

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // Cache best-effort — nu blochează install dacă unele pagini fail
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(() => null)
        )
      )
    }).then(() => self.skipWaiting())
  )
})

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key.startsWith('playlio-') && key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

// ─── Fetch — Stale-While-Revalidate ──────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip: non-GET, cross-origin, Supabase API, auth routes
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase')
  ) {
    return
  }

  // HTML pages — Network first, fallback cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Assets statice (JS, CSS, fonts, images) — Cache first
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Revalidează în background
        fetch(request).then(response => {
          if (response.ok) {
            caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, response))
          }
        }).catch(() => null)
        return cached
      }

      return fetch(request).then(response => {
        if (response.ok && !url.pathname.includes('_next/data')) {
          const clone = response.clone()
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, clone))
        }
        return response
      }).catch(() => {
        // Offline fallback pentru pagini
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/worlds') || new Response('Offline — Playlio', { status: 503 })
        }
        return new Response('', { status: 503 })
      })
    })
  )
})

// ─── Background Sync (pentru pending Supabase records) ───────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-learning') {
    // Notifică clientul să facă sync
    self.clients.matchAll().then(clients => {
      clients.forEach(client => client.postMessage({ type: 'SYNC_LEARNING' }))
    })
  }
})
