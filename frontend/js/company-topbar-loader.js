// Company Topbar Loader
(function() {
  // Load company topbar on all pages
  async function loadCompanyTopbar() {
    try {
      const response = await fetch('../components/company-topbar.html');
      if (!response.ok) {
        throw new Error('Failed to fetch topbar');
      }
      const html = await response.text();
      
      // Insert at the very beginning of body
      document.body.insertAdjacentHTML('afterbegin', html);
      
      // Ensure topbar is visible
      const topbar = document.querySelector('.company-topbar');
      if (topbar) {
        topbar.style.display = 'block';
        topbar.style.visibility = 'visible';
      }
    } catch (error) {
      // Silently fail in production, log in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('Failed to load company topbar:', error);
      }
    }
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCompanyTopbar);
  } else {
    loadCompanyTopbar();
  }
})();
