// DISABLED SERVICE WORKER - Prevents all caching issues
// This ensures users ALWAYS get fresh files from the server

self.addEventListener('install', (event) => {
  console.log('Service Worker: Uninstalling to prevent caching...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Clearing all caches...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      // Unregister this service worker
      return self.registration.unregister();
    }).then(() => {
      console.log('Service Worker: Unregistered successfully');
      return self.clients.claim();
    })
  );
});

// Don't intercept any fetch requests - let browser get fresh files
self.addEventListener('fetch', (event) => {
  // Do nothing - let all requests go directly to network
  return;
});
