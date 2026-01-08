// Homepage Performance Optimizer
// This script wakes up the backend server before the page loads

(function() {
  'use strict';
  
  // Wake up the backend server as early as possible
  const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://mj-electricals.onrender.com/api';
  
  // Ping the server to wake it up (Render cold start)
  fetch(`${API_URL}/products?limit=1`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  }).catch(() => {
    // Silently fail - this is just a wake-up call
  });
  
  // Preload critical resources
  const preloadResources = [
    { href: '../css/style.css', as: 'style' },
    { href: '../css/skeleton-loaders.css', as: 'style' },
    { href: '../js/api.js', as: 'script' }
  ];
  
  preloadResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    document.head.appendChild(link);
  });
  
})();
