// AUTO CACHE CLEAR - Runs on every page load
(function() {
  'use strict';
  
  const CURRENT_VERSION = Date.now();
  const LAST_VERSION_KEY = 'app_last_version';
  
  // Check if this is a new version
  const lastVersion = localStorage.getItem(LAST_VERSION_KEY);
  
  if (!lastVersion || lastVersion !== CURRENT_VERSION.toString()) {
    console.log('🔄 New version detected, clearing cache...');
    
    // Clear localStorage (except user auth)
    const authToken = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    
    localStorage.clear();
    
    // Restore auth
    if (authToken) localStorage.setItem('token', authToken);
    if (userId) localStorage.setItem('userId', userId);
    if (userRole) localStorage.setItem('userRole', userRole);
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Unregister service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
      });
    }
    
    // Clear all caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Save new version
    localStorage.setItem(LAST_VERSION_KEY, CURRENT_VERSION.toString());
    
    console.log('✅ Cache cleared successfully');
  }
  
  // Force reload if page is from cache
  if (performance.navigation.type === 2) {
    console.log('🔄 Page loaded from cache, forcing reload...');
    location.reload(true);
  }
})();
