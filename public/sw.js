/**
 * MIDEEYE SERVICE WORKER
 * Caching strategy:
 *   - App shell (HTML/CSS/JS) → Cache First
 *   - API/Supabase requests   → Network First with fallback
 *   - Images                  → Stale While Revalidate
 *   - Fonts                   → Cache First (long TTL)
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `mideeye-shell-${CACHE_VERSION}`;
const IMAGE_CACHE   = `mideeye-images-${CACHE_VERSION}`;
const FONT_CACHE    = `mideeye-fonts-${CACHE_VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.svg',
];

// ── Install: pre-cache shell ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: prune old caches ────────────────────────────
self.addEventListener('activate', (event) => {
  const allowed = [SHELL_CACHE, IMAGE_CACHE, FONT_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !allowed.includes(k)).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: routing strategy ───────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and browser extension requests
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Supabase API → Network First
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
    return;
  }

  // Google Fonts → Cache First
  if (url.hostname.includes('fonts.gstatic.com') || url.hostname.includes('fonts.googleapis.com')) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Images → Stale While Revalidate
  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    return;
  }

  // Navigation requests → Network First with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline') || caches.match('/'))
    );
    return;
  }

  // Everything else → Cache First
  event.respondWith(cacheFirst(request, SHELL_CACHE));
});

// ── Push notifications ────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title   = data.title   ?? 'MIDEEYE';
  const options = {
    body:    data.body    ?? 'Waxaad haysataa ogeysiis cusub.',
    icon:    '/icons/icon-192x192.png',
    badge:   '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data:    { url: data.url ?? '/' },
    actions: [
      { action: 'open',    title: 'Fur' },
      { action: 'dismiss', title: 'Xir' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const target = event.notification.data?.url ?? '/';
  event.waitUntil(clients.openWindow(target));
});

// ── Helpers ───────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match(request);
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  return cached ?? networkFetch;
}
