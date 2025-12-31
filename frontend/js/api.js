// Auto-detect API URL based on environment
const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.')) {
    return 'http://localhost:5000/api';
  }
  
  // Production - Render backend
  return 'https://mj-electricals.onrender.com/api';
};

const API_URL = getApiUrl();
console.log('API URL:', API_URL);

class API {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  getHeaders(skipAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token && !skipAuth) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const { skipAuth, ...fetchOptions } = options;
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers: this.getHeaders(skipAuth)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updatePassword(passwords) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwords)
    });
  }

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products?${query}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async updateCartItem(productId, quantity) {
    return this.request('/cart', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity })
    });
  }

  async removeFromCart(productId) {
    return this.request(`/cart/${productId}`, {
      method: 'DELETE'
    });
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getUserOrders() {
    return this.request('/orders/my-orders');
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/orders/all?${query}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async cancelOrder(orderId) {
    return this.request(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  }

  async processRefund(orderId) {
    return this.request(`/orders/${orderId}/refund`, {
      method: 'PUT'
    });
  }

  // Contact (Public - no auth required)
  async submitContactMessage(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
      skipAuth: true // Don't require authentication
    });
  }

  async getAllContactMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/contact/all?${query}`);
  }

  async respondToContact(id, response) {
    return this.request(`/contact/${id}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ response })
    });
  }

  // Feedback
  async submitFeedback(feedbackData) {
    return this.request('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  }

  async getMyFeedback() {
    return this.request('/feedback/my-feedbacks');
  }

  async getUserFeedbacks() {
    return this.request('/feedback/my-feedbacks');
  }

  async getAllFeedbacks(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/feedback/all?${query}`);
  }

  async respondToFeedback(id, response) {
    return this.request(`/feedback/${id}/respond`, {
      method: 'PUT',
      body: JSON.stringify({ response })
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, {
      method: 'DELETE'
    });
  }

  // Newsletter
  async subscribeNewsletter(email) {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async getNewsletterSubscribers() {
    return this.request('/newsletter');
  }

  // Banners
  async getBanners(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/banners?${query}`);
  }

  async createBanner(bannerData) {
    return this.request('/banners', {
      method: 'POST',
      body: JSON.stringify(bannerData)
    });
  }

  async updateBanner(id, bannerData) {
    return this.request(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bannerData)
    });
  }

  async deleteBanner(id) {
    return this.request(`/banners/${id}`, {
      method: 'DELETE'
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  // Admin
  async getAllUsers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${query}`);
  }

  async createAdmin(adminData) {
    return this.request('/admin/create-admin', {
      method: 'POST',
      body: JSON.stringify(adminData)
    });
  }

  async getDashboardStats() {
    return this.request('/admin/stats');
  }

  async getFinancialAnalytics(date) {
    const query = date ? `?date=${date}` : '';
    return this.request(`/admin/analytics${query}`);
  }

  // Reviews
  async createReview(reviewData) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    });
  }

  async getProductReviews(productId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reviews/product/${productId}?${query}`);
  }

  async getUserReviews() {
    return this.request('/reviews/my-reviews');
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData)
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE'
    });
  }

  // Admin review management
  async getAllReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reviews/admin/all?${query}`);
  }

  async updateReviewStatus(reviewId, status) {
    return this.request(`/reviews/admin/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async markReviewHelpful(reviewId) {
    return this.request(`/reviews/${reviewId}/helpful`, {
      method: 'POST'
    });
  }

  async getAllReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reviews/admin/all?${query}`);
  }

  async updateReviewStatus(reviewId, status) {
    return this.request(`/reviews/admin/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/remove/${productId}`, {
      method: 'DELETE'
    });
  }

  async clearWishlist() {
    return this.request('/wishlist/clear', {
      method: 'DELETE'
    });
  }

  async checkWishlist(productId) {
    return this.request(`/wishlist/check/${productId}`);
  }

  // Delivery Charges
  async getDeliveryCharges(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/delivery-charges?${query}`);
  }

  async getDeliveryChargeByCity(city) {
    return this.request(`/delivery-charges/city/${encodeURIComponent(city)}`);
  }

  async createDeliveryCharge(chargeData) {
    return this.request('/delivery-charges', {
      method: 'POST',
      body: JSON.stringify(chargeData)
    });
  }

  async updateDeliveryCharge(id, chargeData) {
    return this.request(`/delivery-charges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chargeData)
    });
  }

  async deleteDeliveryCharge(id) {
    return this.request(`/delivery-charges/${id}`, {
      method: 'DELETE'
    });
  }

  // Payments
  async initializePayment(paymentData) {
    return this.request('/payments/initialize', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  async verifyPayment(reference) {
    return this.request(`/payments/verify/${reference}`);
  }

  async getPaymentHistory() {
    return this.request('/payments/history');
  }
}

const api = new API();

// Paystack configuration (moved to checkout.html)
// const PAYSTACK_PUBLIC_KEY is now defined in checkout.html
