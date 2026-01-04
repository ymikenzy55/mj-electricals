// Preloader functionality - Admin Style
(function() {
  // Create preloader HTML with admin design
  const preloaderHTML = `
    <div class="admin-preloader" id="preloader">
      <div class="admin-preloader-content">
        <img src="mj-images/mj-logo.gif" alt="MJ Electricals" class="admin-preloader-logo" onerror="this.style.display='none'">
        <h1 class="admin-preloader-title">MJ ELECTRICALS</h1>
        <p class="admin-preloader-subtitle">Quality Electrical Solutions</p>
        <div class="admin-spinner"></div>
        <div class="admin-progress-bar">
          <div class="admin-progress-fill"></div>
        </div>
        <p class="admin-loading-text">Loading your experience...</p>
      </div>
    </div>
  `;

  // Add preloader to page
  document.addEventListener('DOMContentLoaded', function() {
    // Insert preloader at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
    
    // Add admin preloader CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '../css/admin-preloader.css';
    document.head.appendChild(link);
    
    // Hide preloader after page loads
    window.addEventListener('load', function() {
      setTimeout(function() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
          preloader.classList.add('hidden');
          // Remove from DOM after animation
          setTimeout(function() {
            preloader.remove();
          }, 500);
        }
      }, 300); // Small delay for smooth experience
    });
  });

  // Show preloader on page navigation
  window.addEventListener('beforeunload', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.remove('hidden');
    }
  });
})();
