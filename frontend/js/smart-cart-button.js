/**
 * Smart Cart Button - Transforms "Add to Cart" into quantity selector after adding
 */

class SmartCartButton {
  constructor() {
    this.cartItems = new Map(); // productId -> quantity
    this.init();
  }

  init() {
    // Subscribe to state changes to update cart items
    if (typeof stateManager !== 'undefined') {
      stateManager.subscribe(() => {
        this.syncWithCart();
      });
      this.syncWithCart();
    }
  }

  syncWithCart() {
    const state = stateManager.getState();
    this.cartItems.clear();
    
    if (state.cart && Array.isArray(state.cart)) {
      state.cart.forEach(item => {
        this.cartItems.set(item.product._id || item.product, item.quantity);
      });
    }
    
    // Update all buttons on the page
    this.updateAllButtons();
  }

  isInCart(productId) {
    return this.cartItems.has(productId);
  }

  getQuantity(productId) {
    return this.cartItems.get(productId) || 0;
  }

  /**
   * Render smart cart button
   * @param {string} productId - Product ID
   * @param {number} stock - Available stock
   * @param {string} buttonClass - CSS class for button (optional)
   * @returns {string} HTML string
   */
  renderButton(productId, stock = 999, buttonClass = 'btn add-to-cart-btn') {
    if (stock === 0) {
      return `
        <button class="${buttonClass}" disabled data-product-id="${productId}">
          <i class="fas fa-times-circle"></i> Out of Stock
        </button>
      `;
    }

    const inCart = this.isInCart(productId);
    const quantity = this.getQuantity(productId);

    if (inCart) {
      return `
        <div class="cart-quantity-control" data-product-id="${productId}">
          <button class="qty-btn qty-decrease" onclick="smartCartButton.decreaseQuantity('${productId}', event)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="qty-display">${quantity}</span>
          <button class="qty-btn qty-increase" onclick="smartCartButton.increaseQuantity('${productId}', ${stock}, event)">
            <i class="fas fa-plus"></i>
          </button>
          <a href="cart.html" class="view-cart-btn" title="View Cart">
            <i class="fas fa-shopping-cart"></i>
          </a>
        </div>
      `;
    }

    return `
      <button class="${buttonClass}" onclick="smartCartButton.addToCart('${productId}', event)" data-product-id="${productId}">
        <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
    `;
  }

  /**
   * Add product to cart
   */
  async addToCart(productId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const state = stateManager.getState();
    if (!state.isAuthenticated) {
      toast.info('Please login to add items to cart');
      setTimeout(() => {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
      }, 1500);
      return;
    }

    const button = event?.target.closest('button');
    if (button) {
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    }

    try {
      await stateManager.addToCart(productId, 1);
      toast.success('Added to cart!');
      
      // Button will auto-update via state subscription
    } catch (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
      
      // Restore button
      if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      }
    }
  }

  /**
   * Increase quantity
   */
  async increaseQuantity(productId, maxStock, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentQty = this.getQuantity(productId);
    
    if (currentQty >= maxStock) {
      toast.warning(`Maximum stock (${maxStock}) reached`);
      return;
    }

    try {
      await stateManager.updateCartQuantity(productId, currentQty + 1);
      // UI will update via state subscription
    } catch (error) {
      console.error('Increase quantity error:', error);
      toast.error('Failed to update quantity');
    }
  }

  /**
   * Decrease quantity
   */
  async decreaseQuantity(productId, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const currentQty = this.getQuantity(productId);
    
    if (currentQty <= 1) {
      // Remove from cart
      if (confirm('Remove this item from cart?')) {
        try {
          await stateManager.removeFromCart(productId);
          toast.success('Removed from cart');
        } catch (error) {
          console.error('Remove from cart error:', error);
          toast.error('Failed to remove item');
        }
      }
      return;
    }

    try {
      await stateManager.updateCartQuantity(productId, currentQty - 1);
      // UI will update via state subscription
    } catch (error) {
      console.error('Decrease quantity error:', error);
      toast.error('Failed to update quantity');
    }
  }

  /**
   * Update all buttons on the page
   */
  updateAllButtons() {
    // Find all product containers with data-product-id
    document.querySelectorAll('[data-product-id]').forEach(element => {
      const productId = element.getAttribute('data-product-id');
      const stock = parseInt(element.getAttribute('data-product-stock')) || 999;
      
      // Find the button container
      const container = element.closest('.product-card, .product-item, .product-actions');
      if (!container) return;
      
      const buttonContainer = container.querySelector('.cart-button-container');
      if (buttonContainer) {
        buttonContainer.innerHTML = this.renderButton(productId, stock);
      }
    });
  }
}

// Initialize global instance
const smartCartButton = new SmartCartButton();
