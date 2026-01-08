// Test backend endpoints directly
const https = require('https');

const endpoints = [
  '/api/products?limit=1',
  '/api/banners?status=active',
  '/api/categories'
];

async function testEndpoint(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = https.get(`https://mj-electricals.onrender.com${path}`, {
      timeout: 30000
    }, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          duration: `${duration}ms`,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path,
        error: err.message,
        duration: `${Date.now() - startTime}ms`,
        success: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        path,
        error: 'TIMEOUT',
        duration: '30000ms+',
        success: false
      });
    });
  });
}

async function runTests() {
  console.log('🧪 Testing Render Backend Endpoints...\n');
  
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint}`);
    const result = await testEndpoint(endpoint);
    
    if (result.success) {
      console.log(`✅ SUCCESS - ${result.duration} - Status: ${result.status}`);
    } else {
      console.log(`❌ FAILED - ${result.duration} - Error: ${result.error || 'Unknown'}`);
    }
    console.log('');
  }
}

runTests();
