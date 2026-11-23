
const CACHE_NAME = 'mpb-shell-v3';

const APP_FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './favicon.ico',
  './favicon-96x96.png',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

// Install service worker and cache app files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate new service worker and remove old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Serve cached files when offline
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin GET requests
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Navigation requests: network first, cached fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('./index.html', copy);
            });
          }
          return response;
        })
        .catch(async () => {
          return (
            await caches.match('./index.html')
          ) || new Response('You are offline and the app is not cached.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        })
    );
    return;
  }

  // Other app resources: cache first, then network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });
        }
        return response;
      });
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow('./');
      }
    })
  );
});
