// Cache busting version - update this when deploying changes
window.APP_VERSION = '2.0.' + Date.now();

// Force reload CSS and JS with version parameter
(function() {
  const version = window.APP_VERSION;
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  const scripts = document.querySelectorAll('script[src]');
  
  links.forEach(link => {
    if (link.href && !link.href.includes('cdnjs') && !link.href.includes('?v=')) {
      link.href = link.href + '?v=' + version;
    }
  });
  
  scripts.forEach(script => {
    if (script.src && !script.src.includes('cdn') && !script.src.includes('?v=') && !script.src.includes('version.js')) {
      const newScript = document.createElement('script');
      newScript.src = script.src + '?v=' + version;
      script.parentNode.replaceChild(newScript, script);
    }
  });
})();

// Global money formatting function
window.formatMoney = function(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return 'GH₵ 0.00';
  return 'GH₵ ' + Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Also add to window for backward compatibility
window.formatPrice = window.formatMoney;
