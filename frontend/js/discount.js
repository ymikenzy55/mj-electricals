// Discount Calculation Utilities
// Centralized discount logic for the entire application

/**
 * Calculate discounted price
 * @param {number} originalPrice - Original product price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Discounted price
 */
function calculateDiscountedPrice(originalPrice, discountPercent) {
  if (!discountPercent || discountPercent <= 0) {
    return originalPrice;
  }
  const discount = (originalPrice * discountPercent) / 100;
  return originalPrice - discount;
}

/**
 * Calculate savings amount
 * @param {number} originalPrice - Original product price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Amount saved
 */
function calculateSavings(originalPrice, discountPercent) {
  if (!discountPercent || discountPercent <= 0) {
    return 0;
  }
  return (originalPrice * discountPercent) / 100;
}

/**
 * Generate discount badge HTML
 * @param {number} discountPercent - Discount percentage
 * @returns {string} HTML for discount badge
 */
function getDiscountBadge(discountPercent) {
  if (!discountPercent || discountPercent <= 0) {
    return '';
  }
  return `<span class="discount-badge">${discountPercent}% OFF</span>`;
}

/**
 * Generate price display HTML with discount
 * @param {number} currentPrice - Current product price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @param {number} oldPrice - Original price before discount (optional)
 * @returns {string} HTML for price display
 */
function getPriceDisplay(currentPrice, discountPercent, oldPrice = 0) {
  // If oldPrice is provided and greater than current price, use it
  if (oldPrice && oldPrice > currentPrice) {
    return `
      <div class="price-container">
        <span class="product-price-discounted">${formatPrice(currentPrice)}</span>
        <span class="product-price-original">${formatPrice(oldPrice)}</span>
        <span class="savings-text">Save ${formatPrice(oldPrice - currentPrice)}</span>
      </div>
    `;
  }
  
  // Fallback to old discount calculation if no oldPrice
  if (!discountPercent || discountPercent <= 0) {
    return `<span class="product-price">${formatPrice(currentPrice)}</span>`;
  }
  
  const originalPrice = currentPrice / (1 - discountPercent / 100);
  const savings = originalPrice - currentPrice;
  
  return `
    <div class="price-container">
      <span class="product-price-discounted">${formatPrice(currentPrice)}</span>
      <span class="product-price-original">${formatPrice(originalPrice)}</span>
      <span class="savings-text">Save ${formatPrice(savings)}</span>
    </div>
  `;
}

/**
 * Check if product has active discount
 * @param {object} product - Product object
 * @returns {boolean} True if product has discount
 */
function hasDiscount(product) {
  return product.discount && product.discount > 0;
}

/**
 * Get final price (with discount if applicable)
 * @param {object} product - Product object
 * @returns {number} Final price
 */
function getFinalPrice(product) {
  if (hasDiscount(product)) {
    return calculateDiscountedPrice(product.price, product.discount);
  }
  return product.price;
}
