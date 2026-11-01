// Service worker : garde les fichiers de ZONGO VPN en mémoire pour l’ouvrir sans connexion.
const NOM = 'zongo-vpn-v1';   // après une modification des fichiers, change en 'zongo-vpn-v2' pour forcer la mise à jour
const FICHIERS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(NOM).then(function (cache) { return cache.addAll(FICHIERS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.filter(function (n) { return n !== NOM; }).map(function (n) { return caches.delete(n); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(caches.match(event.request).then(function (rep) { return rep || fetch(event.request); }));
});
