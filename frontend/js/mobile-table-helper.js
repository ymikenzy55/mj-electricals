/**
 * Mobile Table Helper
 * Converts tables to mobile-friendly card view
 */

(function() {
  'use strict';

  // Convert tables to mobile cards
  function convertTablesToCards() {
    if (window.innerWidth > 768) return;

    const tables = document.querySelectorAll('.table-container table');
    
    tables.forEach(table => {
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());
      const rows = table.querySelectorAll('tbody tr');
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, index) => {
          if (headers[index]) {
            cell.setAttribute('data-label', headers[index]);
          }
        });
      });
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', convertTablesToCards);
  } else {
    convertTablesToCards();
  }

  // Re-convert on window resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(convertTablesToCards, 250);
  });

  // Export for manual triggering
  window.convertTablesToCards = convertTablesToCards;
})();
