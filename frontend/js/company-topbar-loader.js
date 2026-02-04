/**
 * Company Topbar Loader
 * Loads the company contact topbar at the very top of every page
 */
(function() {
  'use strict';

  async function loadCompanyTopbar() {
    try {
      // Determine the correct path based on current location
      const path = window.location.pathname;
      const isInPagesFolder = path.includes('/pages/');
      const topbarPath = isInPagesFolder ? '../components/company-topbar.html' : 'components/company-topbar.html';
      
      const response = await fetch(topbarPath);
      if (!response.ok) {
        throw new Error('Failed to fetch topbar');
      }
      const html = await response.text();
      
      // Always insert at the very beginning of body (before navbar)
      document.body.insertAdjacentHTML('afterbegin', html);
      
      // Ensure topbar is visible and properly ordered
      const topbar = document.querySelector('.company-topbar');
      if (topbar) {
        topbar.style.display = 'block';
        topbar.style.visibility = 'visible';
        topbar.style.order = '-2'; // Ensure it's before navbar
      }
      
      // Trigger custom event
      document.dispatchEvent(new CustomEvent('topbarLoaded'));
      
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
