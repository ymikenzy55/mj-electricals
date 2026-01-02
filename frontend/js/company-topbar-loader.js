// Company Topbar Loader
(function() {
  // Load company topbar on all pages
  async function loadCompanyTopbar() {
    try {
      const response = await fetch('../components/company-topbar.html');
      const html = await response.text();
      
      // Insert at the very beginning of body
      document.body.insertAdjacentHTML('afterbegin', html);
    } catch (error) {
      console.error('Failed to load company topbar:', error);
    }
  }

  // Load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCompanyTopbar);
  } else {
    loadCompanyTopbar();
  }
})();
