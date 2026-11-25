
/*
 * SafeFork PWA - Service Worker v4
 * Suporte ao SafeFork IA
 * Hugging Face + WebGPU
 */

const CACHE_NAME = 'safefork-v4';

// Arquivos principais do aplicativo
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/chatbot.js',
  '/data/base-alimentar.json',
  '/manifest.json'
];

// =============================================
// INSTALAÇÃO DO SERVICE WORKER
// =============================================

self.addEventListener('install', event => {

  event.waitUntil(

    caches.open(CACHE_NAME).then(cache => {

      return cache.addAll(ASSETS_TO_CACHE);

    })

  );

  self.skipWaiting();

});

// =============================================
// ATIVAÇÃO E LIMPEZA DE CACHES ANTIGOS
// =============================================

self.addEventListener('activate', event => {

  event.waitUntil((async () => {

    const keys = await caches.keys();

    await Promise.all(

      keys
        .filter(key =>
          key.startsWith('safefork-') &&
          key !== CACHE_NAME
        )
        .map(key => caches.delete(key))

    );

    await self.clients.claim();

  })());

});

// =============================================
// GERENCIAMENTO DAS REQUISIÇÕES
// =============================================

self.addEventListener('fetch', event => {

  const request = event.request;
  const url = new URL(request.url);

  // Não interceptar requisições externas.
  // Preserva Firebase, Google, Hugging Face,
  // jsDelivr e demais serviços externos.

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // HTML, JavaScript, CSS e JSON:
  // Priorizar sempre a versão atualizada da rede.

  const isAppCode =
    request.mode === 'navigate' ||
    /\.(html|js|css|json)$/.test(url.pathname);

  if (isAppCode) {

    event.respondWith((async () => {

      try {

        const fresh = await fetch(request);

        if (fresh && fresh.ok) {

          const cache = await caches.open(CACHE_NAME);

          await cache.put(
            request,
            fresh.clone()
          );

        }

        return fresh;

      } catch (error) {

        const cached = await caches.match(
          request,
          { cacheName: CACHE_NAME }
        );

        return cached || Response.error();

      }

    })());

    return;

  }

  // Demais arquivos estáticos:
  // Cache primeiro, rede como alternativa.

  event.respondWith((async () => {

    const cached = await caches.match(
      request,
      { cacheName: CACHE_NAME }
    );

    if (cached) return cached;

    const response = await fetch(request);

    if (response && response.ok) {

      const cache = await caches.open(CACHE_NAME);

      await cache.put(
        request,
        response.clone()
      );

    }

    return response;

  })());

});
