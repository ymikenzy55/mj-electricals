// Navbar Search Functions - Global scope
// This file provides the toggleSearch function for index.html

let searchTimeout;

function toggleSearch() {
  const dropdown = document.getElementById('search-dropdown');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('navbar-search-input');
  
  if (dropdown && overlay) {
    const isActive = dropdown.classList.contains('active');
    
    if (isActive) {
      closeSearch();
    } else {
      dropdown.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input && input.focus(), 100);
    }
  }
}

function closeSearch() {
  const dropdown = document.getElementById('search-dropdown');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('navbar-search-input');
  
  if (dropdown && overlay) {
    dropdown.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (input) input.value = '';
    const resultsContainer = document.getElementById('navbar-search-results');
    if (resultsContainer) resultsContainer.innerHTML = '';
  }
}

async function performNavbarSearch(query) {
  const resultsContainer = document.getElementById('navbar-search-results');
  
  if (!query || query.length < 2) {
    resultsContainer.innerHTML = '<div class="search-empty">Type at least 2 characters to search...</div>';
    return;
  }
  
  resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();
    
    if (data.success && data.products.length > 0) {
      resultsContainer.innerHTML = data.products.map(product => `
        <a href="product-details.html?id=${product._id}" class="search-result-item" onclick="closeSearch()">
          <img src="${product.images[0] || '../mj-images/placeholder.jpg'}" alt="${product.name}">
          <div class="search-result-info">
            <h4>${product.name}</h4>
            <p class="search-result-price">₵${product.price.toLocaleString()}</p>
            <p class="search-result-stock">${product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </a>
      `).join('') + `
        <a href="products.html?search=${encodeURIComponent(query)}" class="search-view-all" onclick="closeSearch()">
          View all results for "${query}" <i class="fas fa-arrow-right"></i>
        </a>
      `;
    } else {
      resultsContainer.innerHTML = `<div class="search-empty">No products found for "${query}"</div>`;
    }
  } catch (error) {
    resultsContainer.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
  }
}

// Search input listener
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('navbar-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performNavbarSearch(e.target.value.trim());
      }, 300);
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }
});
