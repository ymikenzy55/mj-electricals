// Centralized state management
class StateManager {
  constructor() {
    this.state = {
      user: null,
      cart: [],
      isAuthenticated: false
    };
    this.listeners = [];
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
    // Update cart badges whenever state changes
    this.updateAllCartBadges();
  }

  async loadUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.setState({ user: null, isAuthenticated: false });
        return;
      }

      // Verify token is still valid
      const response = await api.getMe();
      this.setState({
        user: response.user,
        isAuthenticated: true
      });

      // Load cart for authenticated users
      await this.loadCart();
    } catch (error) {
      console.error('Failed to load user:', error);
      // Don't logout immediately - token might still be valid
      // Only clear if it's a 401 error
      if (error.message && error.message.includes('401')) {
        this.logout();
      } else {
        // Keep user logged in but log the error
        console.warn('Temporary error loading user, keeping session');
      }
    }
  }

  async loadCart() {
    try {
      if (this.state.isAuthenticated) {
        const response = await api.getCart();
        this.setState({ cart: response.cart });
      } else {
        // Load guest cart from localStorage
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        this.setState({ cart: guestCart });
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }

  async addToCart(productId, quantity) {
    try {
      if (this.state.isAuthenticated) {
        const response = await api.addToCart(productId, quantity);
        this.setState({ cart: response.cart });
      } else {
        // Guest cart
        const guestCart = [...this.state.cart];
        const existingItem = guestCart.find(item => item.product._id === productId);
        
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          const productResponse = await api.getProduct(productId);
          guestCart.push({
            product: productResponse.product,
            quantity
          });
        }
        
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        this.setState({ cart: guestCart });
      }
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      if (this.state.isAuthenticated) {
        const response = await api.updateCartItem(productId, quantity);
        this.setState({ cart: response.cart });
      } else {
        const guestCart = [...this.state.cart];
        const item = guestCart.find(item => item.product._id === productId);
        if (item) {
          item.quantity = quantity;
        }
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        this.setState({ cart: guestCart });
      }
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  }

  async removeFromCart(productId) {
    try {
      if (this.state.isAuthenticated) {
        const response = await api.removeFromCart(productId);
        this.setState({ cart: response.cart });
      } else {
        const guestCart = this.state.cart.filter(item => item.product._id !== productId);
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        this.setState({ cart: guestCart });
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  }

  async clearCart() {
    try {
      if (this.state.isAuthenticated) {
        // For authenticated users, cart is cleared on backend when order is created
        // Just update local state
        this.setState({ cart: [] });
      } else {
        // For guest users, clear localStorage
        localStorage.removeItem('guestCart');
        this.setState({ cart: [] });
      }
      return true;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }

  getCartCount() {
    return this.state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal() {
    return this.state.cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Update all cart badges (desktop and mobile)
  updateAllCartBadges() {
    const count = this.getCartCount();
    const badges = document.querySelectorAll('.cart-badge, .mobile-cart-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.add('show');
        badge.style.display = 'flex';
      } else {
        badge.classList.remove('show');
        badge.style.display = 'none';
      }
    });
  }

  login(token, user) {
    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
    api.setToken(token);
    this.setState({
      user,
      isAuthenticated: true
    });
    
    // Migrate guest cart if exists
    this.migrateGuestCart();
    
    // Log for debugging
    const log = typeof logger !== 'undefined' ? logger : console;
    log.info('User logged in successfully:', user.email);
  }

  async migrateGuestCart() {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    if (guestCart.length > 0) {
      try {
        for (const item of guestCart) {
          await api.addToCart(item.product._id, item.quantity);
        }
        localStorage.removeItem('guestCart');
        await this.loadCart();
      } catch (error) {
        console.error('Failed to migrate guest cart:', error);
      }
    }
  }

  logout() {
    api.clearToken();
    localStorage.removeItem('guestCart');
    this.setState({
      user: null,
      cart: [],
      isAuthenticated: false
    });
    window.location.href = '/pages/login.html';
  }
}

const stateManager = new StateManager();

// Export to window for global access
window.stateManager = stateManager;
