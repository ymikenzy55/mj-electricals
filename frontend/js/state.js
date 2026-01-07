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
        // Load guest cart even when not authenticated
        await this.loadCart();
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
      // Don't logout on temporary errors - only on explicit auth failures
      // Check for 401 Unauthorized or 403 Forbidden
      if (error.status === 401 || error.status === 403 || 
          (error.message && (error.message.includes('401') || error.message.includes('Unauthorized')))) {
        console.warn('Authentication failed, logging out');
        this.logout();
      } else {
        // Keep user logged in for network errors or other temporary issues
        console.warn('Temporary error loading user, keeping session active');
        // Try to use cached user data if available
        const cachedUser = localStorage.getItem('cachedUser');
        if (cachedUser) {
          try {
            this.setState({
              user: JSON.parse(cachedUser),
              isAuthenticated: true
            });
          } catch (e) {
            console.error('Failed to parse cached user');
          }
        }
      }
    }
  }

  async loadCart() {
    try {
      if (this.state.isAuthenticated) {
        const response = await api.getCart();
        // Filter out items with null products (deleted products)
        const validCart = response.cart.filter(item => item.product);
        
        // If cart was cleaned up, update it on the server
        if (validCart.length !== response.cart.length) {
          console.log(`Cleaned up ${response.cart.length - validCart.length} deleted products from cart`);
          // Update server cart to remove null products
          for (const item of response.cart) {
            if (!item.product) {
              try {
                await api.removeFromCart(item._id || item.product);
              } catch (e) {
                console.error('Failed to remove null product:', e);
              }
            }
          }
        }
        
        this.setState({ cart: validCart });
      } else {
        // Load guest cart from localStorage - ALWAYS load on page load
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        // Filter out items with null products for guest cart too
        const validGuestCart = guestCart.filter(item => item.product);
        if (validGuestCart.length !== guestCart.length) {
          localStorage.setItem('guestCart', JSON.stringify(validGuestCart));
        }
        this.setState({ cart: validGuestCart });
        console.log('Guest cart loaded:', validGuestCart.length, 'items');
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Fallback to guest cart if API fails
      if (!this.state.isAuthenticated) {
        const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
        this.setState({ cart: guestCart });
      }
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
    // Only count items with valid products
    return this.state.cart
      .filter(item => item.product)
      .reduce((total, item) => total + item.quantity, 0);
  }

  getCartTotal() {
    // Only calculate total for items with valid products
    return this.state.cart
      .filter(item => item.product && item.product.price)
      .reduce((total, item) => {
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

  async login(token, user) {
    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
    // Cache user data for offline resilience
    localStorage.setItem('cachedUser', JSON.stringify(user));
    api.setToken(token);
    this.setState({
      user,
      isAuthenticated: true
    });
    
    // Migrate guest cart if exists - AWAIT this to ensure cart is migrated before redirect
    await this.migrateGuestCart();
    
    // Log for debugging
    const log = typeof logger !== 'undefined' ? logger : console;
    log.info('User logged in successfully:', user.email);
  }

  async migrateGuestCart() {
    const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    console.log('Migrating guest cart:', guestCart.length, 'items');
    
    if (guestCart.length > 0) {
      try {
        // Migrate each item to user's cart
        for (const item of guestCart) {
          try {
            await api.addToCart(item.product._id, item.quantity);
            console.log('Migrated item:', item.product.name);
          } catch (itemError) {
            console.error('Failed to migrate item:', item.product.name, itemError);
            // Continue with other items even if one fails
          }
        }
        
        // Clear guest cart after successful migration
        localStorage.removeItem('guestCart');
        console.log('Guest cart cleared after migration');
        
        // Reload cart to get updated data from server
        await this.loadCart();
        console.log('Cart reloaded after migration');
      } catch (error) {
        console.error('Failed to migrate guest cart:', error);
        // Don't clear guest cart if migration failed
      }
    }
  }

  logout() {
    api.clearToken();
    localStorage.removeItem('token');
    localStorage.removeItem('cachedUser');
    // DON'T remove guestCart - let it persist for guest users
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
