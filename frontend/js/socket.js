// Socket.IO client for real-time updates
class SocketManager {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket) return;

    // Auto-detect socket URL based on environment
    const getSocketUrl = () => {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.')) {
        return 'http://localhost:5000';
      }
      return 'https://mj-electricals.onrender.com';
    };

    this.socket = io(getSocketUrl());

    this.socket.on('connect', () => {
      const log = typeof logger !== 'undefined' ? logger : console;
      log.info('Socket connected');
      this.connected = true;

      // Authenticate socket with user ID
      const state = stateManager.getState();
      if (state.user) {
        this.socket.emit('authenticate', state.user.id);
      }
    });

    this.socket.on('disconnect', () => {
      const log = typeof logger !== 'undefined' ? logger : console;
      log.info('Socket disconnected');
      this.connected = false;
    });

    // Listen for real-time events
    this.setupListeners();
  }

  setupListeners() {
    // Order status updates
    this.socket.on('order:statusUpdate', (data) => {
      this.showNotification(`Order #${data.orderId.slice(-8)} status: ${data.status}`);
      // Dynamically update if on orders page
      if (typeof loadOrders === 'function') {
        loadOrders();
      }
    });

    // Feedback responses
    this.socket.on('feedback:response', (feedback) => {
      this.showNotification('Admin responded to your feedback');
      // Dynamically update if on feedback page
      if (typeof loadFeedback === 'function') {
        loadFeedback();
      }
    });

    // New orders (for admins)
    this.socket.on('order:new', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification('🔔 New order received!', 'success');
        // Update stats and orders dynamically
        if (typeof loadStats === 'function') {
          loadStats();
        }
        if (typeof loadOrders === 'function') {
          loadOrders();
        }
        // Update notification badge
        this.updateOrderBadge();
      }
    });

    // Low stock alerts (for admins)
    this.socket.on('product:lowStock', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification(`⚠️ Low Stock: ${data.productName} - Only ${data.stock} left!`, 'warning');
        if (typeof updateOutOfStockBadge === 'function') {
          updateOutOfStockBadge();
        }
      }
    });

    // Out of stock alerts (for admins)
    this.socket.on('product:outOfStock', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification(`🚨 OUT OF STOCK: ${data.productName} (${data.productCode})`, 'error');
        if (typeof updateOutOfStockBadge === 'function') {
          updateOutOfStockBadge();
        }
      }
    });

    // New feedback (for admins)
    this.socket.on('feedback:new', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification('💬 New feedback received!', 'info');
        if (typeof loadStats === 'function') {
          loadStats();
        }
        if (typeof loadFeedback === 'function') {
          loadFeedback();
        }
      }
    });

    // New contact message (for admins)
    this.socket.on('contact:new', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification('📧 New contact message received!', 'info');
      }
    });

    // Product updates
    this.socket.on('product:updated', (product) => {
      if (typeof loadProducts === 'function') {
        loadProducts();
      }
    });

    // Product created
    this.socket.on('product:created', (product) => {
      if (typeof loadProducts === 'function') {
        loadProducts();
      }
    });
  }

  updateOrderBadge() {
    const badge = document.getElementById('pending-orders-badge');
    if (badge) {
      const currentCount = parseInt(badge.textContent) || 0;
      badge.textContent = currentCount + 1;
      badge.style.display = 'inline-block';
      // Add pulse animation
      badge.style.animation = 'pulse 0.5s ease';
      setTimeout(() => {
        badge.style.animation = '';
      }, 500);
    }
  }

  showNotification(message, type = 'info') {
    // Use toast if available, otherwise create notification
    if (typeof toast !== 'undefined') {
      switch(type) {
        case 'success':
          toast.success(message);
          break;
        case 'warning':
          toast.warning(message);
          break;
        case 'error':
          toast.error(message);
          break;
        default:
          toast.info(message);
      }
      return;
    }

    // Fallback notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
      info: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 400px;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    const duration = type === 'error' || type === 'warning' ? 7000 : 4000;
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
}

const socketManager = new SocketManager();
