// Quartet Loki Service Worker - Offline support
const CACHE_NAME = 'quartet-loki-v3000.1';
const ASSETS = [
  '/quartet-loki/',
  '/quartet-loki/index.html'
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

// Fetch: ohita kaikki API-kutsut – ne menevät aina verkon kautta
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Ohita kaikki ulkoiset API-kutsut suoraan verkolle
  if (url.includes('opendata.fmi.fi') ||
      url.includes('firebase') ||
      url.includes('googleapis') ||
      url.includes('open-meteo') ||
      url.includes('windy.com') ||
      url.includes('nominatim') ||
      url.includes('api.')) {
    return; // ei respondWith = selain hoitaa normaalisti
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
