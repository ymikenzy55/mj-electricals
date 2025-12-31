// Socket.IO client for real-time updates
class SocketManager {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect() {
    if (this.socket) return;

    this.socket = io('http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.connected = true;

      // Authenticate socket with user ID
      const state = stateManager.getState();
      if (state.user) {
        this.socket.emit('authenticate', state.user.id);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
    });

    // Listen for real-time events
    this.setupListeners();
  }

  setupListeners() {
    // Order status updates
    this.socket.on('order:statusUpdate', (data) => {
      this.showNotification(`Order ${data.orderId} status: ${data.status}`);
      // Refresh orders if on orders page
      if (window.location.pathname.includes('orders')) {
        window.location.reload();
      }
    });

    // Feedback responses
    this.socket.on('feedback:response', (feedback) => {
      this.showNotification('Admin responded to your feedback');
      // Refresh feedback if on feedback page
      if (window.location.pathname.includes('feedback')) {
        window.location.reload();
      }
    });

    // New orders (for admins)
    this.socket.on('order:new', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification('New order received!', 'info');
        // Refresh admin dashboard
        if (window.location.pathname.includes('admin') || window.location.pathname.includes('dashboard')) {
          window.location.reload();
        }
      }
    });

    // Low stock alerts (for admins)
    this.socket.on('product:lowStock', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification(`⚠️ Low Stock: ${data.productName} - Only ${data.stock} left!`, 'warning');
      }
    });

    // Out of stock alerts (for admins)
    this.socket.on('product:outOfStock', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification(`🚨 OUT OF STOCK: ${data.productName} (${data.productCode})`, 'error');
      }
    });

    // New feedback (for admins)
    this.socket.on('feedback:new', (data) => {
      const state = stateManager.getState();
      if (state.user && ['admin', 'superadmin'].includes(state.user.role)) {
        this.showNotification('New feedback received!', 'info');
      }
    });

    // Product updates
    this.socket.on('product:updated', (product) => {
      if (window.location.pathname.includes('products')) {
        window.location.reload();
      }
    });
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Color based on type
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

    // Auto-dismiss after 5 seconds (longer for important messages)
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
