// Simple script to wake up the Render backend server
// Run this before testing or share it with users

const API_URL = 'https://mj-electricals.onrender.com/api';

async function wakeServer() {
  console.log('🔄 Waking up server...');
  console.log('⏳ This may take 50-60 seconds on first request (cold start)...\n');
  
  const startTime = Date.now();
  
  try {
    // Try to fetch categories (simple endpoint)
    const response = await fetch(`${API_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Server is awake! (${elapsed}s)`);
      console.log(`📊 Found ${data.categories?.length || 0} categories`);
      console.log('\n🎉 Your site should load quickly now!');
    } else {
      console.log(`⚠️  Server responded but with error: ${response.status}`);
    }
  } catch (error) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`❌ Failed to wake server (${elapsed}s):`, error.message);
    console.log('\n💡 Tip: Render free tier can take 50-60 seconds to wake up.');
    console.log('   Try running this script again or wait a moment.');
  }
}

wakeServer();
