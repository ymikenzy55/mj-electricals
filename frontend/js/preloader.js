// Preloader functionality
(function() {
  // Create preloader HTML
  const preloaderHTML = `
    <div class="preloader" id="preloader">
      <img src="../mj-images/mj-logo.gif" alt="Loading..." class="preloader-logo" onerror="this.style.display='none'">
      <div class="preloader-spinner"></div>
      <p class="preloader-text">Loading...</p>
    </div>
  `;

  // Add preloader to page
  document.addEventListener('DOMContentLoaded', function() {
    // Insert preloader at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
    
    // Add preloader CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../css/preloader-redesign.css';
    document.head.appendChild(link);
    
    // Track when page is fully loaded
    let pageLoaded = false;
    let minTimeElapsed = false;
    
    // Set minimum display time (1 second) and maximum (3 seconds)
    const minDisplayTime = 1000;
    const maxDisplayTime = 3000;
    
    // Start minimum time counter
    setTimeout(() => {
      minTimeElapsed = true;
      hidePreloaderIfReady();
    }, minDisplayTime);
    
    // Force hide after maximum time
    setTimeout(() => {
      hidePreloader();
    }, maxDisplayTime);
    
    // Hide preloader after page loads (if within max time)
    window.addEventListener('load', function() {
      pageLoaded = true;
      hidePreloaderIfReady();
    });
    
    function hidePreloaderIfReady() {
      if (pageLoaded && minTimeElapsed) {
        hidePreloader();
      }
    }
    
    function hidePreloader() {
      const preloader = document.getElementById('preloader');
      if (preloader && !preloader.classList.contains('hidden')) {
        preloader.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(function() {
          preloader.remove();
        }, 500);
      }
    }
  });

  // Show preloader on page navigation
  window.addEventListener('beforeunload', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.remove('hidden');
    }
  });
})();

