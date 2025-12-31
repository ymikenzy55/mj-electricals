/**
 * Navbar Loader
 * Dynamically loads the standardized navbar component
 */

(function() {
  'use strict';

  // Define global mobile menu functions before navbar loads
  window.toggleMobileMenu = function() {
    const sidebar = document.getElementById('mobile-menu-sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    const hamburger = document.getElementById('hamburger-menu');
    
    if (sidebar && overlay && hamburger) {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Update user data when menu opens
      if (sidebar.classList.contains('active')) {
        updateMobileMenuAuthGlobal();
      }
    }
  };
  
  window.closeMobileMenu = function() {
    const sidebar = document.getElementById('mobile-menu-sidebar');
    const overlay = document.getElementById('mobile-menu-overlay');
    const hamburger = document.getElementById('hamburger-menu');
    
    if (sidebar && overlay && hamburger) {
      sidebar.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  };
  
  // Define global update function
  window.updateMobileMenuAuthGlobal = function() {
    const state = window.stateManager?.getState();
    const username = document.getElementById('mobile-menu-username');
    const email = document.getElementById('mobile-menu-user-email');
    
    if (state && state.isAuthenticated && state.user) {
      if (username) username.textContent = state.user.name || 'User';
      if (email) email.textContent = state.user.email || '';
    } else {
      // If user data not loaded yet, try again after a short delay
      if (username && username.textContent === 'Loading...') {
        setTimeout(() => {
          const retryState = window.stateManager?.getState();
          if (retryState && retryState.isAuthenticated && retryState.user) {
            if (username) username.textContent = retryState.user.name || 'User';
            if (email) email.textContent = retryState.user.email || '';
          }
        }, 300);
      }
    }
    
    updateMobileMenuBadgesGlobal();
  };
  
  window.updateMobileMenuBadgesGlobal = function() {
    const cartBadge = document.getElementById('mobile-menu-cart-badge');
    
    if (cartBadge && typeof window.stateManager !== 'undefined') {
      const cartCount = window.stateManager.getCartCount();
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? 'inline-block' : 'none';
    }
  };

  // Load navbar component
  async function loadNavbar() {
    try {
      const response = await fetch('../components/navbar.html');
      if (!response.ok) throw new Error('Failed to load navbar');
      
      const navbarHTML = await response.text();
      
      // Insert navbar at the beginning of body
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = navbarHTML;
      
      // Insert all elements from the navbar
      while (tempDiv.firstChild) {
        document.body.insertBefore(tempDiv.firstChild, document.body.firstChild);
      }
      
      // Trigger custom event to notify navbar is loaded
      document.dispatchEvent(new CustomEvent('navbarLoaded'));
      
      // Subscribe to state changes after navbar is loaded
      if (typeof window.stateManager !== 'undefined') {
        window.stateManager.subscribe(() => {
          if (typeof window.updateMobileMenuAuthGlobal === 'function') {
            window.updateMobileMenuAuthGlobal();
          }
        });
        
        // Also update immediately if user is already loaded
        setTimeout(() => {
          if (typeof window.updateMobileMenuAuthGlobal === 'function') {
            window.updateMobileMenuAuthGlobal();
          }
        }, 500);
      }
      
    } catch (error) {
      console.error('Error loading navbar:', error);
    }
  }

  // Load navbar when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
  } else {
    loadNavbar();
  }
})();
