// Service Worker for cache management
const CACHE_VERSION = 'v2.1.' + Date.now();
const CACHE_NAME = 'mj-electricals-' + CACHE_VERSION;

// Install event - clear old caches
self.addEventListener('install', (event) => {
  console.log('Service Worker installing with version:', CACHE_VERSION);
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - network first, then cache (only for GET requests)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip service worker for:
  // 1. Non-GET requests
  // 2. API requests
  // 3. Socket.IO requests
  // 4. External domains (except CDNs)
  if (
    event.request.method !== 'GET' ||
    url.pathname.includes('/api/') ||
    url.pathname.includes('/socket.io/') ||
    url.hostname.includes('onrender.com')
  ) {
    return; // Let the browser handle it normally
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Cache the fetched response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return a basic offline response for HTML pages
          if (event.request.headers.get('accept').includes('text/html')) {
            return new Response(
              '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          }
          // For other requests, just fail
          return new Response('Network error', { status: 408, statusText: 'Request Timeout' });
        });
      })
  );
});
