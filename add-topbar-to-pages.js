// Script to add company topbar to all user pages
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'pages');

// Pages that should have the company topbar (exclude admin pages)
const userPages = [
  'index.html',
  'products.html',
  'categories.html',
  'about.html',
  'contact.html',
  'faq.html',
  'cart.html',
  'checkout.html',
  'wishlist.html',
  'compare.html',
  'user-dashboard.html',
  'login.html',
  'register.html',
  'payment-failed.html',
  '404.html'
];

userPages.forEach(page => {
  const filePath = path.join(pagesDir, page);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${page} - file not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if topbar container already exists
  if (content.includes('company-topbar-container')) {
    console.log(`✓ ${page} already has topbar container`);
    return;
  }
  
  // Add topbar container after <body> tag
  if (content.includes('</head>\n<body>')) {
    content = content.replace(
      '</head>\n<body>',
      '</head>\n<body>\n  <!-- Company Contact Top Bar -->\n  <div id="company-topbar-container"></div>\n  '
    );
  } else if (content.includes('</head>\r\n<body>')) {
    content = content.replace(
      '</head>\r\n<body>',
      '</head>\r\n<body>\r\n  <!-- Company Contact Top Bar -->\r\n  <div id="company-topbar-container"></div>\r\n  '
    );
  }
  
  // Add topbar loader script if not present
  if (!content.includes('company-topbar-loader.js')) {
    // Find the first script tag and add before it
    const scriptMatch = content.match(/<script[^>]*src="[^"]*"[^>]*>/);
    if (scriptMatch) {
      const firstScript = scriptMatch[0];
      content = content.replace(
        firstScript,
        '  <script src="../js/company-topbar-loader.js"></script>\n  ' + firstScript
      );
    }
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated ${page}`);
});

console.log('\n✅ Company topbar added to all user pages!');
