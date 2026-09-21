// Caches the app shell so it keeps working even if something (like an
// accidental pull-to-refresh) forces a reload while completely offline.
const CACHE_NAME = 'field-tool-v1.00017';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Plain cache.addAll() can silently serve stale copies straight from
      // Chrome's own HTTP cache instead of truly fresh bytes from GitHub.
      // Forcing {cache:'reload'} on each fetch guarantees a real network
      // round-trip every time, so an "update ready" actually IS the update.
      await Promise.all(ASSETS.map(async (url) => {
        const response = await fetch(url, { cache: 'reload' });
        await cache.put(url, response);
      }));
    })
  );
});

self.addEventListener('activate', (e) => {
  self.clients.claim();
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});
