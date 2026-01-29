// AUTOMATIC CACHE BUSTING - Forces fresh files on every page load
window.APP_VERSION = Date.now();

// Immediately force reload ALL CSS and JS files with unique timestamp
(function() {
  const version = window.APP_VERSION;
  
  // Force reload all CSS files
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    if (link.href && !link.href.includes('cdnjs') && !link.href.includes('cdn.')) {
      const url = new URL(link.href);
      url.searchParams.set('v', version);
      link.href = url.toString();
    }
  });
  
  // Force reload all JS files (except this one and CDNs)
  const scripts = document.querySelectorAll('script[src]');
  scripts.forEach(script => {
    if (script.src && !script.src.includes('cdn') && !script.src.includes('version.js')) {
      const url = new URL(script.src);
      url.searchParams.set('v', version);
      const newScript = document.createElement('script');
      newScript.src = url.toString();
      if (script.type) newScript.type = script.type;
      if (script.async) newScript.async = true;
      if (script.defer) newScript.defer = true;
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
