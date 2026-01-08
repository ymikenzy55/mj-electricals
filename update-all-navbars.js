const fs = require('fs');
const path = require('path');

// New navbar HTML structure
const newNavbar = `  <nav class="navbar">
    <div class="nav-container">
      <button class="hamburger-menu" id="hamburger-menu" onclick="toggleMobileMenu()" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <a href="index.html" class="logo">
        <img src="../mj-images/mj-logo.gif" alt="MJE Logo">
      </a>

      <!-- Search Bar -->
      <div class="nav-search-bar">
        <input type="text" id="nav-search-input" placeholder="Search products..." onkeypress="if(event.key==='Enter') performNavSearch()">
        <button onclick="performNavSearch()" class="search-btn">
          <i class="fas fa-search"></i>
        </button>
      </div>

      <!-- Navigation Links -->
      <ul class="nav-links">
        <li><a href="index.html"><i class="fas fa-home"></i> Home</a></li>
        <li><a href="products.html"><i class="fas fa-box"></i> Products</a></li>
        <li><a href="categories.html"><i class="fas fa-th"></i> Categories</a></li>
        <li class="nav-dropdown">
          <a href="#" class="dropdown-toggle"><i class="fas fa-ellipsis-h"></i> More <i class="fas fa-chevron-down"></i></a>
          <ul class="dropdown-menu">
            <li><a href="about.html"><i class="fas fa-info-circle"></i> About Us</a></li>
            <li><a href="contact.html"><i class="fas fa-phone"></i> Contact</a></li>
            <li><a href="faq.html"><i class="fas fa-question-circle"></i> FAQ</a></li>
          </ul>
        </li>
      </ul>

      <!-- Right Icons -->
      <div class="nav-icons">
        <a href="cart.html" class="nav-icon" title="Cart">
          <i class="fas fa-shopping-cart"></i>
          <span>Cart</span>
          <span class="cart-badge">0</span>
        </a>
        <a href="user-dashboard.html" class="nav-icon auth-link" style="display:none" title="Account">
          <i class="fas fa-user"></i>
          <span>Account</span>
        </a>
        <a href="login.html" class="nav-icon guest-link" title="Login">
          <i class="fas fa-user"></i>
          <span>Login</span>
        </a>
      </div>
    </div>
  </nav>`;

// Pages to update (excluding index.html which is already done)
const pagesToUpdate = [
  'products.html',
  'product-details.html',
  'categories.html',
  'cart.html',
  'checkout.html',
  'about.html',
  'contact.html',
  'faq.html',
  'wishlist.html',
  'compare.html',
  '404.html'
];

const pagesDir = path.join(__dirname, 'frontend', 'pages');

pagesToUpdate.forEach(page => {
  const filePath = path.join(pagesDir, page);
  
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${page} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find and replace the navbar section
  // Pattern: from <nav class="navbar"> to </nav> (including nested nav-bottom if exists)
  const navbarRegex = /<nav class="navbar">[\s\S]*?<\/nav>(?:\s*<div class="nav-bottom">[\s\S]*?<\/div>\s*<\/nav>)?/;
  
  if (navbarRegex.test(content)) {
    content = content.replace(navbarRegex, newNavbar);
    
    // Ensure navbar-redesign.css is included
    if (!content.includes('navbar-redesign.css')) {
      content = content.replace(
        /<link rel="stylesheet" href="\.\.\/css\/style\.css">/,
        `<link rel="stylesheet" href="../css/style.css">\n  <link rel="stylesheet" href="../css/navbar-redesign.css">`
      );
    }
    
    // Add performNavSearch function if not exists
    if (!content.includes('function performNavSearch()')) {
      const scriptToAdd = `
    // Prevent dropdown toggle link from navigating
    document.addEventListener('DOMContentLoaded', function() {
      const dropdownToggle = document.querySelector('.dropdown-toggle');
      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
          e.preventDefault();
        });
      }
    });

    function performNavSearch() {
      const query = document.getElementById('nav-search-input').value.trim();
      if (query) {
        window.location.href = \`products.html?search=\${encodeURIComponent(query)}\`;
      }
    }`;
      
      // Insert before closing </script> tag or before </body>
      if (content.includes('</script>')) {
        content = content.replace(/(<\/script>)(?![\s\S]*<\/script>)/, scriptToAdd + '\n  $1');
      } else if (content.includes('</body>')) {
        content = content.replace('</body>', `  <script>${scriptToAdd}\n  </script>\n</body>`);
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated ${page}`);
  } else {
    console.log(`✗ Could not find navbar in ${page}`);
  }
});

console.log('\nNavbar update complete!');
