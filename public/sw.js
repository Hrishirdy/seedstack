// SEEDSTACK Service Worker for Offline Field Access
const CACHE_NAME = 'seedstack-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/explore',
  '/how-it-works',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') return;

  // Let API requests go to network with offline fallback
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ offline: true, message: 'You are currently offline in the field' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Stale-while-revalidate strategy for UI pages & assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
