const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'frontend', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has topbar-fix.css
  if (content.includes('topbar-fix.css')) {
    console.log(`Skipped ${file} - already has topbar-fix.css`);
    return;
  }
  
  // Add topbar-fix.css after responsive-fixes.css
  if (content.includes('responsive-fixes.css')) {
    content = content.replace(
      /<link rel="stylesheet" href="\.\.\/css\/responsive-fixes\.css">/,
      '<link rel="stylesheet" href="../css/responsive-fixes.css">\n  <link rel="stylesheet" href="../css/topbar-fix.css">'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('Done!');
