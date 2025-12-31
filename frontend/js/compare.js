// Product Comparison Manager
class CompareManager {
  constructor() {
    this.compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    this.maxItems = 4;
  }

  // Add product to comparison
  addToCompare(productId) {
    if (this.compareList.includes(productId)) {
      Modal.info('Product is already in comparison list');
      return false;
    }

    if (this.compareList.length >= this.maxItems) {
      Modal.warning(`You can only compare up to ${this.maxItems} products at once`);
      return false;
    }

    this.compareList.push(productId);
    this.save();
    this.updateBadge();
    this.updateAllButtons();
    Modal.success('Product added to comparison');
    return true;
  }

  // Remove product from comparison
  removeFromCompare(productId) {
    this.compareList = this.compareList.filter(id => id !== productId);
    this.save();
    this.updateBadge();
    this.updateAllButtons();
    return true;
  }

  // Toggle product in comparison
  toggleCompare(productId) {
    if (this.isInCompare(productId)) {
      return this.removeFromCompare(productId);
    } else {
      return this.addToCompare(productId);
    }
  }

  // Check if product is in comparison
  isInCompare(productId) {
    return this.compareList.includes(productId);
  }

  // Get comparison list
  getCompareList() {
    return this.compareList;
  }

  // Get count
  getCount() {
    return this.compareList.length;
  }

  // Clear all
  clearAll() {
    this.compareList = [];
    this.save();
    this.updateBadge();
    this.updateAllButtons();
  }

  // Save to localStorage
  save() {
    localStorage.setItem('compareList', JSON.stringify(this.compareList));
  }

  // Update badge
  updateBadge() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.compare-badge');
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-block' : 'none';
    });
  }

  // Update button state
  updateButton(button, productId) {
    const isInCompare = this.isInCompare(productId);
    const icon = button.querySelector('i');
    
    if (isInCompare) {
      button.classList.add('in-compare');
      if (icon) {
        icon.classList.remove('far');
        icon.classList.add('fas');
      }
      button.title = 'Remove from comparison';
    } else {
      button.classList.remove('in-compare');
      if (icon) {
        icon.classList.remove('fas');
        icon.classList.add('far');
      }
      button.title = 'Add to comparison';
    }
  }

  // Update all buttons
  updateAllButtons() {
    const buttons = document.querySelectorAll('.compare-btn');
    buttons.forEach(button => {
      const productId = button.dataset.productId;
      if (productId) {
        this.updateButton(button, productId);
      }
    });
  }

  // Create compare button
  createCompareButton(productId) {
    const button = document.createElement('button');
    button.className = 'compare-btn';
    button.dataset.productId = productId;
    button.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleCompare(productId);
    };
    
    const icon = document.createElement('i');
    icon.className = this.isInCompare(productId) ? 'fas fa-balance-scale' : 'far fa-balance-scale';
    button.appendChild(icon);
    
    button.title = this.isInCompare(productId) ? 'Remove from comparison' : 'Add to comparison';
    
    if (this.isInCompare(productId)) {
      button.classList.add('in-compare');
    }
    
    return button;
  }

  // Fetch products for comparison
  async fetchCompareProducts() {
    if (this.compareList.length === 0) {
      return [];
    }

    try {
      const products = await Promise.all(
        this.compareList.map(async (productId) => {
          try {
            const response = await api.getProduct(productId);
            return response.product;
          } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            return null;
          }
        })
      );

      return products.filter(p => p !== null);
    } catch (error) {
      console.error('Failed to fetch compare products:', error);
      return [];
    }
  }
}

// Create global compare manager instance
const compareManager = new CompareManager();

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    compareManager.updateBadge();
    compareManager.updateAllButtons();
  });
} else {
  compareManager.updateBadge();
  compareManager.updateAllButtons();
}
