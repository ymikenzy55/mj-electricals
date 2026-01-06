// Cart Button State Manager
// Tracks which products are in cart and updates button states accordingly

class CartButtonStateManager {
  constructor() {
    this.init();
  }

  init() {
    // Subscribe to state changes to update button states
    if (typeof stateManager !== 'undefined') {
      stateManager.subscribe((state) => {
        this.updateAllButtons(state.cart);
      });
    }
  }

  // Check if product is in cart
  isInCart(productId) {
    const state = stateManager.getState();
    return state.cart.some(item => item.product._id === productId);
  }

  // Get quantity of product in cart
  getQuantityInCart(productId) {
    const state = stateManager.getState();
    const item = state.cart.find(item => item.product._id === productId);
    return item ? item.quantity : 0;
  }

  // Update all add-to-cart buttons on the page
  updateAllButtons(cart = null) {
    if (!cart) {
      const state = stateManager.getState();
      cart = state.cart;
    }

    // Get all product IDs in cart
    const productIdsInCart = cart.map(item => item.product._id);

    // Only update BUTTON elements with add-to-cart-btn class
    document.querySelectorAll('button.add-to-cart-btn[data-product-id]').forEach(button => {
      const productId = button.getAttribute('data-product-id');
      if (productIdsInCart.includes(productId)) {
        this.setButtonAdded(button);
      } else {
        this.setButtonDefault(button);
      }
    });

    // Also update buttons with onclick containing product ID (legacy support)
    document.querySelectorAll('button.add-to-cart-btn[onclick]').forEach(button => {
      const onclick = button.getAttribute('onclick');
      if (onclick) {
        // Extract product ID from onclick
        const match = onclick.match(/'([a-f0-9]{24})'/);
        if (match) {
          const productId = match[1];
          if (productIdsInCart.includes(productId)) {
            this.setButtonAdded(button);
          } else {
            this.setButtonDefault(button);
          }
        }
      }
    });
  }

  // Set button to "Added" state
  setButtonAdded(button) {
    if (!button) return;
    
    button.classList.add('added');
    button.disabled = false; // Keep clickable to add more
    
    // Clear and rebuild button content
    button.innerHTML = '<i class="fas fa-check"></i> Added';
  }

  // Set button to default "Add to Cart" state
  setButtonDefault(button) {
    if (!button) return;
    
    button.classList.remove('added');
    button.disabled = false;
    
    // Clear and rebuild button content
    button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
  }

  // Set button to loading state
  setButtonLoading(button) {
    if (!button) return;
    
    button.disabled = true;
    
    // Clear and rebuild button content
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
  }

  // Handle add to cart with button state management
  async handleAddToCart(productId, quantity, button) {
    try {
      // Set loading state
      this.setButtonLoading(button);
      
      // Add to cart
      await stateManager.addToCart(productId, quantity);
      
      // Set added state
      this.setButtonAdded(button);
      
      // Show success message
      if (typeof toast !== 'undefined') {
        toast.success('Added to cart!');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      
      // Reset button state
      this.setButtonDefault(button);
      
      // Show error message
      if (typeof toast !== 'undefined') {
        toast.error('Failed to add to cart: ' + error.message);
      }
      
      return false;
    }
  }
}

// Create global instance
const cartButtonState = new CartButtonStateManager();

// Export to window for global access
window.cartButtonState = cartButtonState;

// Initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cartButtonState.updateAllButtons();
  });
} else {
  // DOM already loaded
  cartButtonState.updateAllButtons();
}
