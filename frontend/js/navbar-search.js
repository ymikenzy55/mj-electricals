// Navbar Search Functions - Global scope
// This file provides the toggleSearch function for all pages

let searchTimeout;

// Get API URL - same logic as api.js
const getSearchApiUrl = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('10.') || hostname.startsWith('192.168.')) {
    return 'http://localhost:5000/api';
  }
  return 'https://mj-electricals.onrender.com/api';
};

const SEARCH_API_URL = getSearchApiUrl();

function toggleSearch() {
  const dropdown = document.getElementById('search-dropdown');
  const overlay = document.getElementById('search-overlay');
  const input = document.getElementById('navbar-search-input');
  
  console.log('toggleSearch called', { dropdown, overlay, input }); // Debug log
  
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
  } else {
    console.error('Search elements not found:', { dropdown, overlay, input });
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
  
  if (!resultsContainer) {
    console.error('Search results container not found');
    return;
  }
  
  if (!query || query.length < 2) {
    resultsContainer.innerHTML = '<div class="search-empty">Type at least 2 characters to search...</div>';
    return;
  }
  
  resultsContainer.innerHTML = '<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
  
  try {
    const response = await fetch(`${SEARCH_API_URL}/products?search=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();
    
    if (data.success && data.products && data.products.length > 0) {
      resultsContainer.innerHTML = data.products.map(product => `
        <a href="product-details.html?id=${product._id}" class="search-result-item" onclick="closeSearch()">
          <img src="${product.images && product.images[0] ? product.images[0] : '../mj-images/placeholder.jpg'}" alt="${product.name}">
          <div class="search-result-info">
            <h4>${product.name}</h4>
            <p class="search-result-price">₵${product.price ? product.price.toLocaleString() : '0'}</p>
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
    console.error('Search error:', error);
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

// Make functions globally available
window.toggleSearch = toggleSearch;
window.closeSearch = closeSearch;
window.performNavbarSearch = performNavbarSearch;
