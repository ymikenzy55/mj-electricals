// Keep Render Backend Alive
// Run this script to prevent Render cold starts
// Usage: node keep-render-alive.js

const https = require('https');

const BACKEND_URL = 'https://mj-electricals.onrender.com/api/products?limit=1';
const PING_INTERVAL = 10 * 60 * 1000; // 10 minutes

function pingServer() {
  const startTime = Date.now();
  
  https.get(BACKEND_URL, (res) => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Server pinged - Status: ${res.statusCode} - Response time: ${duration}ms`);
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ Ping failed:`, err.message);
  });
}

console.log('🚀 Keep-Alive Script Started');
console.log(`📡 Pinging ${BACKEND_URL} every 10 minutes`);
console.log('Press Ctrl+C to stop\n');

// Ping immediately
pingServer();

// Then ping every 10 minutes
setInterval(pingServer, PING_INTERVAL);
