// Minimal service worker. It doesn't need to do any real caching work -
// its mere presence is what tells Chrome this can be installed as a real
// standalone app instead of a plain bookmark shortcut.
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  // Pass every request straight through to the network as normal.
});
