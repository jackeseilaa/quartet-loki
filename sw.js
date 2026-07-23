// Quartet Loki Service Worker - Offline support
const CACHE_NAME = 'quartet-loki-v3000.22';
const ASSETS = [
  '/quartet-loki/',
  '/quartet-loki/index.html',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js'
];

// Asenna: välimuistita app. Yksittäiset epäonnistuneet haut (esim. veneen
// paikallisverkko, jossa ei ole reittiä gstatic.com:iin) eivät saa kaataa koko
// asennusta cache.addAll():n tapaan - muuten edes appin oma index.html ei
// päivity cacheen, vaikka se olisi ollut haettavissa.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('SW install: ohitettu', url, err))
      ))
    )
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

  // Firebase-SDK gstatic.com:sta cachetetaan appin rungon tapaan, jotta
  // kirjautuminen ja Firestore latautuvat myös täysin offline-tilassa.
  if (url.includes('gstatic.com/firebasejs')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const network = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Ohita kaikki muut ulkoiset API-kutsut suoraan verkolle (Firestore/Auth-data,
  // sää, geokoodaus jne. tarvitsevat aina tuoreen verkkovastauksen kun se on saatavilla)
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
