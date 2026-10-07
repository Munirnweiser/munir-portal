/* munir-portal PWA service worker — offline play for the installable games.
   Scope: frontend/ root. All URLs are relative so it works on any host/path. */
const CACHE = 'munir-portal-games-v1';
const ASSETS = [
  './',
  'style.css',
  'app.js',
  'counter.js',
  'js/progress.js',
  'js/palette.js',
  'js/reveal.js',
  'apps/kill-nine.html',
  'apps/latency-racer.html',
  'apps/deploy-dash.html',
  'apps/manifest-kill-nine.json',
  'apps/manifest-latency-racer.json',
  'apps/manifest-deploy-dash.json',
  'apps/icons/kill-nine-180.png',
  'apps/icons/kill-nine-192.png',
  'apps/icons/kill-nine-512.png',
  'apps/icons/latency-racer-180.png',
  'apps/icons/latency-racer-192.png',
  'apps/icons/latency-racer-512.png',
  'apps/icons/deploy-dash-180.png',
  'apps/icons/deploy-dash-192.png',
  'apps/icons/deploy-dash-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // same-origin only
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(event.request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
