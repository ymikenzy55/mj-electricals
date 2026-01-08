// Utility functions

// Format price in Ghana Cedis with comma formatting
function formatPrice(price) {
  if (price === null || price === undefined) return 'GH₵ 0.00';
  
  const number = parseFloat(price);
  if (isNaN(number)) return 'GH₵ 0.00';
  
  return 'GH₵ ' + number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Alias for backward compatibility
window.formatMoney = formatPrice;
window.formatPrice = formatPrice;

// Calculate discounted price
function calculateDiscount(price, discount) {
  if (!discount || discount === 0) return price;
  return price - (price * discount / 100);
}

// Get final price with discount
function getFinalPrice(price, discount) {
  return calculateDiscount(price, discount);
}

// Format discount percentage
function formatDiscount(discount) {
  if (!discount || discount === 0) return '';
  return `-${discount}%`;
}

// Make functions globally available
window.formatPrice = formatPrice;
window.calculateDiscount = calculateDiscount;
window.getFinalPrice = getFinalPrice;
window.formatDiscount = formatDiscount;
