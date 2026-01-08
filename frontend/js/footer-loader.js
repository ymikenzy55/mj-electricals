/**
 * Footer Loader
 * Dynamically loads the standardized footer component
 */

(function() {
  'use strict';

  // Load footer component
  async function loadFooter() {
    try {
      const response = await fetch('../components/footer.html');
      if (!response.ok) throw new Error('Failed to load footer');
      
      const footerHTML = await response.text();
      
      // Insert footer before the last script tag or at the end of body
      const mobileNav = document.querySelector('.mobile-nav');
      if (mobileNav) {
        // Insert before mobile nav
        mobileNav.insertAdjacentHTML('beforebegin', footerHTML);
      } else {
        // Insert at the end of body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
      }
      
      // Trigger custom event to notify footer is loaded
      document.dispatchEvent(new CustomEvent('footerLoaded'));
      
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  }

  // Load footer when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
})();
