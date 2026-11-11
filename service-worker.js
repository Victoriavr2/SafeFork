/* SafeFork PWA - cache atualizado para evitar servir HTML/JS antigos */
const CACHE_NAME = 'safefork-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Não intercepta Firebase, Google ou outras requisições externas.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // HTML e JavaScript sempre tentam a versão publicada; cache é fallback offline.
  const isAppCode = request.mode === 'navigate' || /\.(html|js|css)$/.test(url.pathname);
  if (isAppCode) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        if (fresh && fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (error) {
        return (await caches.match(request)) || Response.error();
      }
    })());
    return;
  }

  // Demais arquivos estáticos: cache primeiro, rede como alternativa.
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  })());
});
