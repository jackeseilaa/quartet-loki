// Quartet Loki Service Worker - Offline support
const CACHE_NAME = 'quartet-loki-v2038.67';
const ASSETS = [
  '/',
  '/index.html'
];

// Asenna: välimuistita app
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivoi: poista vanhat välimuistit
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: palvele välimuistista, päivitä taustalla
self.addEventListener('fetch', event => {
  // Ohita Firebase ja muut API-kutsut
  if (event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis') ||
      event.request.url.includes('open-meteo') ||
      event.request.url.includes('nominatim')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
