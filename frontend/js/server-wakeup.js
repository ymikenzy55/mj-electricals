// Server Wake-up Helper
// This script pings the backend to wake it up from cold start
// Place this in the <head> of your HTML to start waking up the server early

(function() {
  const BACKEND_URL = 'https://mj-electricals.onrender.com';
  const WAKE_UP_TIMEOUT = 90000; // 90 seconds max wait
  
  let wakeUpStarted = false;
  let wakeUpComplete = false;
  
  // Start wake-up process
  function wakeUpServer() {
    if (wakeUpStarted) return;
    wakeUpStarted = true;
    
    console.log('🔄 Waking up server... (this may take up to 60 seconds on first visit)');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), WAKE_UP_TIMEOUT);
    
    fetch(`${BACKEND_URL}/`, {
      signal: controller.signal
    })
      .then(response => response.json())
      .then(data => {
        clearTimeout(timeoutId);
        wakeUpComplete = true;
        console.log('✅ Server is awake and ready!', data);
        
        // Dispatch custom event so other scripts know server is ready
        window.dispatchEvent(new CustomEvent('serverReady', { detail: data }));
      })
      .catch(error => {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          console.warn('⚠️ Server wake-up timed out. It may still be starting...');
        } else {
          console.error('❌ Failed to wake up server:', error.message);
        }
      });
  }
  
  // Check if server is already awake
  function checkServerStatus() {
    return fetch(`${BACKEND_URL}/`, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    })
      .then(() => true)
      .catch(() => false);
  }
  
  // Start wake-up immediately
  wakeUpServer();
  
  // Make functions available globally
  window.serverWakeup = {
    isComplete: () => wakeUpComplete,
    isStarted: () => wakeUpStarted,
    checkStatus: checkServerStatus,
    wake: wakeUpServer
  };
})();
