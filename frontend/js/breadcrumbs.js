// Breadcrumb Generator
class BreadcrumbManager {
  constructor() {
    this.pageNames = {
      'index.html': 'Home',
      'products.html': 'Products',
      'product-details.html': 'Product Details',
      'categories.html': 'Categories',
      'cart.html': 'Shopping Cart',
      'checkout.html': 'Checkout',
      'wishlist.html': 'Wishlist',
      'compare.html': 'Compare Products',
      'about.html': 'About Us',
      'contact.html': 'Contact Us',
      'faq.html': 'FAQ',
      'user-dashboard.html': 'My Account',
      'admin-dashboard.html': 'Admin Dashboard',
      'payment-success.html': 'Payment Successful',
      'payment-failed.html': 'Payment Failed',
      'login.html': 'Login',
      'register.html': 'Register'
    };
  }

  generate(customCrumbs = []) {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    const urlParams = new URLSearchParams(window.location.search);
    
    const breadcrumbs = [
      { name: 'Home', url: 'index.html', icon: 'fas fa-home' }
    ];

    // Add custom breadcrumbs if provided
    if (customCrumbs.length > 0) {
      breadcrumbs.push(...customCrumbs);
    } else {
      // Auto-generate based on current page
      const pageName = this.pageNames[filename] || 'Page';
      
      // Special handling for specific pages
      if (filename === 'product-details.html') {
        breadcrumbs.push({ name: 'Products', url: 'products.html', icon: 'fas fa-box' });
        const productName = urlParams.get('name') || 'Product Details';
        breadcrumbs.push({ name: productName, url: null, icon: 'fas fa-info-circle' });
      } else if (filename === 'products.html') {
        const category = urlParams.get('category');
        const search = urlParams.get('search');
        
        if (category) {
          breadcrumbs.push({ name: 'Products', url: 'products.html', icon: 'fas fa-box' });
          breadcrumbs.push({ name: category, url: null, icon: 'fas fa-tag' });
        } else if (search) {
          breadcrumbs.push({ name: 'Products', url: 'products.html', icon: 'fas fa-box' });
          breadcrumbs.push({ name: `Search: "${search}"`, url: null, icon: 'fas fa-search' });
        } else {
          breadcrumbs.push({ name: pageName, url: null, icon: 'fas fa-box' });
        }
      } else if (filename === 'checkout.html') {
        breadcrumbs.push({ name: 'Cart', url: 'cart.html', icon: 'fas fa-shopping-cart' });
        breadcrumbs.push({ name: 'Checkout', url: null, icon: 'fas fa-credit-card' });
      } else if (filename === 'payment-success.html' || filename === 'payment-failed.html') {
        breadcrumbs.push({ name: 'Cart', url: 'cart.html', icon: 'fas fa-shopping-cart' });
        breadcrumbs.push({ name: 'Checkout', url: 'checkout.html', icon: 'fas fa-credit-card' });
        breadcrumbs.push({ name: pageName, url: null, icon: filename === 'payment-success.html' ? 'fas fa-check-circle' : 'fas fa-times-circle' });
      } else if (filename !== 'index.html') {
        // Default: just add the current page
        const icon = this.getIconForPage(filename);
        breadcrumbs.push({ name: pageName, url: null, icon });
      }
    }

    return this.render(breadcrumbs);
  }

  getIconForPage(filename) {
    const icons = {
      'products.html': 'fas fa-box',
      'categories.html': 'fas fa-th',
      'cart.html': 'fas fa-shopping-cart',
      'wishlist.html': 'fas fa-heart',
      'compare.html': 'fas fa-balance-scale',
      'about.html': 'fas fa-info-circle',
      'contact.html': 'fas fa-phone',
      'faq.html': 'fas fa-question-circle',
      'user-dashboard.html': 'fas fa-user',
      'admin-dashboard.html': 'fas fa-tachometer-alt'
    };
    return icons[filename] || 'fas fa-file';
  }

  render(breadcrumbs) {
    const html = breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      
      if (isLast) {
        return `<span class="current"><i class="${crumb.icon}"></i> ${crumb.name}</span>`;
      } else {
        return `
          <a href="${crumb.url}"><i class="${crumb.icon}"></i> ${crumb.name}</a>
          <span class="separator"><i class="fas fa-chevron-right"></i></span>
        `;
      }
    }).join('');

    return `<nav class="breadcrumbs" aria-label="Breadcrumb">${html}</nav>`;
  }

  insert(containerId = 'breadcrumb-container') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.generate();
    }
  }

  insertCustom(customCrumbs, containerId = 'breadcrumb-container') {
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = this.generate(customCrumbs);
    }
  }
}

// Create global instance
const breadcrumbManager = new BreadcrumbManager();
window.breadcrumbManager = breadcrumbManager;
