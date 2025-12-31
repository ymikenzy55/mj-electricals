// Wishlist Management
class WishlistManager {
  constructor() {
    this.wishlistItems = new Set();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    const state = stateManager.getState();
    if (state.isAuthenticated) {
      await this.loadWishlist();
    }
    this.initialized = true;
  }

  async loadWishlist() {
    try {
      const response = await api.getWishlist();
      this.wishlistItems.clear();
      
      if (response.wishlist && response.wishlist.items) {
        response.wishlist.items.forEach(item => {
          if (item.product && item.product._id) {
            this.wishlistItems.add(item.product._id);
          }
        });
      }
      
      this.updateBadge();
      this.updateAllButtons();
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  }

  async toggleWishlist(productId, buttonElement) {
    const state = stateManager.getState();
    if (!state.isAuthenticated) {
      Modal.confirm('Please login to use wishlist. Go to login page?', () => {
        window.location.href = 'login.html';
      });
      return;
    }

    try {
      if (this.wishlistItems.has(productId)) {
        await api.removeFromWishlist(productId);
        this.wishlistItems.delete(productId);
        Modal.success('Removed from wishlist');
      } else {
        await api.addToWishlist(productId);
        this.wishlistItems.add(productId);
        Modal.success('Added to wishlist');
      }
      
      this.updateBadge();
      if (buttonElement) {
        this.updateButton(buttonElement, productId);
      } else {
        this.updateAllButtons();
      }
    } catch (error) {
      Modal.error(error.message || 'Failed to update wishlist');
    }
  }

  isInWishlist(productId) {
    return this.wishlistItems.has(productId);
  }

  getCount() {
    return this.wishlistItems.size;
  }

  updateBadge() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.wishlist-badge, .mobile-wishlist-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  updateButton(button, productId) {
    const isInWishlist = this.isInWishlist(productId);
    const icon = button.querySelector('i');
    
    if (isInWishlist) {
      button.classList.add('in-wishlist');
      if (icon) {
        icon.classList.remove('far');
        icon.classList.add('fas');
      }
      button.title = 'Remove from wishlist';
    } else {
      button.classList.remove('in-wishlist');
      if (icon) {
        icon.classList.remove('fas');
        icon.classList.add('far');
      }
      button.title = 'Add to wishlist';
    }
  }

  updateAllButtons() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    buttons.forEach(button => {
      const productId = button.dataset.productId;
      if (productId) {
        this.updateButton(button, productId);
      }
    });
  }

  createWishlistButton(productId) {
    const button = document.createElement('button');
    button.className = 'wishlist-btn';
    button.dataset.productId = productId;
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleWishlist(productId, button);
    };
    
    const icon = document.createElement('i');
    icon.className = this.isInWishlist(productId) ? 'fas fa-heart' : 'far fa-heart';
    button.appendChild(icon);
    
    button.title = this.isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist';
    
    if (this.isInWishlist(productId)) {
      button.classList.add('in-wishlist');
    }
    
    return button;
  }
}

// Create global wishlist manager instance
const wishlistManager = new WishlistManager();

// Initialize wishlist when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    wishlistManager.init();
  });
} else {
  wishlistManager.init();
}
