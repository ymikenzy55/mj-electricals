// Search Suggestions Component
class SearchSuggestions {
  constructor(inputElement, options = {}) {
    this.input = inputElement;
    this.options = {
      minChars: 2,
      maxResults: 8,
      debounceTime: 300,
      onSelect: options.onSelect || (() => {}),
      searchType: options.searchType || 'products', // 'products', 'orders', 'users', etc.
      placeholder: options.placeholder || 'Search...',
      ...options
    };
    
    this.suggestionsBox = null;
    this.debounceTimer = null;
    this.allItems = [];
    this.isLoading = false;
    
    this.init();
  }

  init() {
    // Create suggestions dropdown
    this.createSuggestionsBox();
    
    // Set placeholder
    if (this.options.placeholder) {
      this.input.placeholder = this.options.placeholder;
    }
    
    // Add event listeners
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('focus', (e) => this.handleFocus(e));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.input.contains(e.target) && !this.suggestionsBox.contains(e.target)) {
        this.hideSuggestions();
      }
    });
    
    // Load initial data
    this.loadData();
  }

  createSuggestionsBox() {
    this.suggestionsBox = document.createElement('div');
    this.suggestionsBox.className = 'search-suggestions';
    this.suggestionsBox.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      display: none;
    `;
    
    // Make input container relative
    const container = this.input.parentElement;
    if (container && getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    
    this.input.parentElement.appendChild(this.suggestionsBox);
  }

  async loadData() {
    try {
      if (this.options.searchType === 'products') {
        const response = await api.getProducts({ limit: 1000 });
        this.allItems = response.products || [];
      } else if (this.options.searchType === 'orders') {
        const response = await api.getAllOrders();
        this.allItems = response.orders || [];
      } else if (this.options.searchType === 'users') {
        const response = await api.getAllUsers();
        this.allItems = response.users || [];
      }
    } catch (error) {
      console.error('Failed to load search data:', error);
    }
  }

  handleInput(e) {
    const query = e.target.value.trim();
    
    clearTimeout(this.debounceTimer);
    
    if (query.length < this.options.minChars) {
      this.hideSuggestions();
      return;
    }
    
    this.debounceTimer = setTimeout(() => {
      this.showSuggestions(query);
    }, this.options.debounceTime);
  }

  handleFocus(e) {
    const query = e.target.value.trim();
    if (query.length >= this.options.minChars) {
      this.showSuggestions(query);
    }
  }

  handleKeydown(e) {
    const items = this.suggestionsBox.querySelectorAll('.suggestion-item');
    const activeItem = this.suggestionsBox.querySelector('.suggestion-item.active');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!activeItem) {
        items[0]?.classList.add('active');
      } else {
        activeItem.classList.remove('active');
        const next = activeItem.nextElementSibling;
        if (next) {
          next.classList.add('active');
          next.scrollIntoView({ block: 'nearest' });
        } else {
          items[0]?.classList.add('active');
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeItem) {
        activeItem.classList.remove('active');
        const prev = activeItem.previousElementSibling;
        if (prev) {
          prev.classList.add('active');
          prev.scrollIntoView({ block: 'nearest' });
        } else {
          items[items.length - 1]?.classList.add('active');
        }
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeItem) {
        activeItem.click();
      }
    } else if (e.key === 'Escape') {
      this.hideSuggestions();
    }
  }

  showSuggestions(query) {
    const results = this.search(query);
    
    if (results.length === 0) {
      this.suggestionsBox.innerHTML = `
        <div style="padding: 1rem; text-align: center; color: #6b7280;">
          <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.3;"></i>
          <p>No results found for "${query}"</p>
        </div>
      `;
      this.suggestionsBox.style.display = 'block';
      return;
    }
    
    this.suggestionsBox.innerHTML = results.map(item => 
      this.renderSuggestion(item, query)
    ).join('');
    
    // Add click handlers
    this.suggestionsBox.querySelectorAll('.suggestion-item').forEach((el, index) => {
      el.addEventListener('click', () => {
        this.selectSuggestion(results[index]);
      });
    });
    
    this.suggestionsBox.style.display = 'block';
  }

  search(query) {
    const lowerQuery = query.toLowerCase();
    
    let filtered = this.allItems.filter(item => {
      if (this.options.searchType === 'products') {
        return (
          item.name.toLowerCase().includes(lowerQuery) ||
          item.productId?.toLowerCase().includes(lowerQuery) ||
          item.category?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
        );
      } else if (this.options.searchType === 'orders') {
        return (
          item._id.toLowerCase().includes(lowerQuery) ||
          item.orderId?.toLowerCase().includes(lowerQuery) ||
          item.user?.name?.toLowerCase().includes(lowerQuery) ||
          item.user?.email?.toLowerCase().includes(lowerQuery)
        );
      } else if (this.options.searchType === 'users') {
        return (
          item.name.toLowerCase().includes(lowerQuery) ||
          item.email.toLowerCase().includes(lowerQuery)
        );
      }
      return false;
    });
    
    // Sort by relevance (exact matches first)
    filtered.sort((a, b) => {
      const aName = this.getItemName(a).toLowerCase();
      const bName = this.getItemName(b).toLowerCase();
      const aStarts = aName.startsWith(lowerQuery);
      const bStarts = bName.startsWith(lowerQuery);
      
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });
    
    return filtered.slice(0, this.options.maxResults);
  }

  getItemName(item) {
    if (this.options.searchType === 'products') {
      return item.name;
    } else if (this.options.searchType === 'orders') {
      return item.orderId || item._id;
    } else if (this.options.searchType === 'users') {
      return item.name;
    }
    return '';
  }

  renderSuggestion(item, query) {
    if (this.options.searchType === 'products') {
      return this.renderProductSuggestion(item, query);
    } else if (this.options.searchType === 'orders') {
      return this.renderOrderSuggestion(item, query);
    } else if (this.options.searchType === 'users') {
      return this.renderUserSuggestion(item, query);
    }
    return '';
  }

  renderProductSuggestion(product, query) {
    const highlightedName = this.highlightMatch(product.name, query);
    const stockStatus = product.stock === 0 ? 
      '<span style="color: #ef4444; font-size: 0.75rem;">Out of Stock</span>' : 
      product.stock <= 5 ? 
      `<span style="color: #f59e0b; font-size: 0.75rem;">Low Stock (${product.stock})</span>` : 
      '';
    
    return `
      <div class="suggestion-item" style="padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">
        ${product.images && product.images[0] ? 
          `<img src="${product.images[0]}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" alt="${product.name}">` : 
          '<div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-image" style="color: #9ca3af;"></i></div>'
        }
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 500; color: #111827; margin-bottom: 0.25rem;">${highlightedName}</div>
          <div style="font-size: 0.875rem; color: #6b7280; display: flex; align-items: center; gap: 0.5rem;">
            <span>${product.category}</span>
            <span>•</span>
            <span style="color: var(--primary-orange); font-weight: 600;">${formatPrice(product.price)}</span>
            ${stockStatus ? `<span>•</span>${stockStatus}` : ''}
          </div>
        </div>
        <i class="fas fa-arrow-right" style="color: #9ca3af; font-size: 0.875rem;"></i>
      </div>
    `;
  }

  renderOrderSuggestion(order, query) {
    const orderId = order.orderId || '#' + order._id.slice(-8);
    const highlightedId = this.highlightMatch(orderId, query);
    
    return `
      <div class="suggestion-item" style="padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">
        <div style="width: 40px; height: 40px; background: #f3f4f6; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
          <i class="fas fa-shopping-bag" style="color: var(--primary-orange);"></i>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 500; color: #111827; margin-bottom: 0.25rem;">${highlightedId}</div>
          <div style="font-size: 0.875rem; color: #6b7280;">
            ${order.user?.name || 'Unknown'} • ${formatPrice(order.totalAmount)} • ${order.status}
          </div>
        </div>
        <i class="fas fa-arrow-right" style="color: #9ca3af; font-size: 0.875rem;"></i>
      </div>
    `;
  }

  renderUserSuggestion(user, query) {
    const highlightedName = this.highlightMatch(user.name, query);
    
    return `
      <div class="suggestion-item" style="padding: 0.75rem 1rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">
        <div style="width: 40px; height: 40px; background: var(--primary-orange); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
          ${user.name.charAt(0).toUpperCase()}
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 500; color: #111827; margin-bottom: 0.25rem;">${highlightedName}</div>
          <div style="font-size: 0.875rem; color: #6b7280;">${user.email}</div>
        </div>
        <span style="font-size: 0.75rem; padding: 0.25rem 0.5rem; background: #f3f4f6; border-radius: 4px; color: #6b7280;">${user.role}</span>
      </div>
    `;
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: #fef3c7; padding: 0 2px; border-radius: 2px;">$1</mark>');
  }

  selectSuggestion(item) {
    this.input.value = this.getItemName(item);
    this.hideSuggestions();
    this.options.onSelect(item);
  }

  hideSuggestions() {
    this.suggestionsBox.style.display = 'none';
  }

  destroy() {
    if (this.suggestionsBox) {
      this.suggestionsBox.remove();
    }
    clearTimeout(this.debounceTimer);
  }
}

// Add hover styles
const style = document.createElement('style');
style.textContent = `
  .suggestion-item:hover,
  .suggestion-item.active {
    background: #f9fafb !important;
  }
  
  .search-suggestions::-webkit-scrollbar {
    width: 8px;
  }
  
  .search-suggestions::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  
  .search-suggestions::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }
  
  .search-suggestions::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;
document.head.appendChild(style);

// Make it globally available
window.SearchSuggestions = SearchSuggestions;
