// Preloader functionality
(function() {
  // Create preloader HTML
  const preloaderHTML = `
    <div class="preloader" id="preloader">
      <img src="../mj-images/mj-logo.gif" alt="Loading..." class="preloader-logo">
      <div class="preloader-spinner"></div>
      <p class="preloader-text">Loading...</p>
    </div>
  `;

  // Add preloader to page
  document.addEventListener('DOMContentLoaded', function() {
    // Insert preloader at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
    
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
