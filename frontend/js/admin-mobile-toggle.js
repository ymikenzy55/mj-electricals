// Admin Dashboard Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Admin mobile toggle script loaded');
  
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const debugInfo = document.getElementById('debug-info');
  const debugText = document.getElementById('debug-text');
  
  // Show debug on mobile
  if (window.innerWidth <= 768 && debugInfo) {
    debugInfo.style.display = 'block';
    updateDebug('Script loaded');
  }
  
  function updateDebug(message) {
    console.log('📱 ' + message);
    if (debugText) {
      debugText.innerHTML = message + '<br>' + new Date().toLocaleTimeString();
    }
  }
  
  console.log('📱 Mobile toggle button:', mobileToggle);
  console.log('📂 Sidebar element:', sidebar);
  console.log('🎭 Overlay element:', overlay);
  
  if (!mobileToggle) {
    console.error('❌ Mobile toggle button not found!');
    updateDebug('❌ Button not found!');
    return;
  }
  
  if (!sidebar) {
    console.error('❌ Sidebar not found!');
    updateDebug('❌ Sidebar not found!');
    return;
  }
  
  if (!overlay) {
    console.error('❌ Overlay not found!');
    updateDebug('❌ Overlay not found!');
    return;
  }
  
  console.log('✅ All elements found successfully');
  updateDebug('✅ All elements found');
  
  // Toggle sidebar on button click
  mobileToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log('🔘 Mobile toggle button clicked!');
    updateDebug('🔘 Button clicked!');
    toggleSidebar();
  });
  
  // Close sidebar when clicking overlay
  overlay.addEventListener('click', function(e) {
    console.log('🎭 Overlay clicked - closing sidebar');
    updateDebug('🎭 Overlay clicked');
    closeSidebar();
  });
  
  function toggleSidebar() {
    const isOpen = sidebar.classList.contains('mobile-open');
    console.log('🔄 Toggle sidebar - currently open:', isOpen);
    console.log('📏 Window width:', window.innerWidth);
    console.log('📍 Sidebar classes before:', sidebar.className);
    console.log('🎨 Sidebar computed styles:', {
      display: window.getComputedStyle(sidebar).display,
      visibility: window.getComputedStyle(sidebar).visibility,
      left: window.getComputedStyle(sidebar).left,
      zIndex: window.getComputedStyle(sidebar).zIndex
    });
    
    updateDebug(`🔄 Toggle: ${isOpen ? 'Closing' : 'Opening'}`);
    
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
  
  function openSidebar() {
    console.log('🔓 Opening sidebar...');
    updateDebug('🔓 Opening sidebar...');
    
    // Add classes
    sidebar.classList.add('mobile-open');
    overlay.classList.add('active');
    
    // Force styles for debugging and functionality
    sidebar.style.display = 'block';
    sidebar.style.visibility = 'visible';
    sidebar.style.left = '0';
    sidebar.style.zIndex = '10001';
    sidebar.style.background = 'white';
    sidebar.style.opacity = '1';
    sidebar.style.pointerEvents = 'auto';
    
    // Position overlay to NOT cover sidebar
    const sidebarWidth = sidebar.offsetWidth;
    overlay.style.display = 'block';
    overlay.style.left = sidebarWidth + 'px';
    overlay.style.zIndex = '9999';
    
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Sidebar opened');
    console.log('📍 Sidebar width:', sidebarWidth);
    console.log('📍 Sidebar classes after:', sidebar.className);
    console.log('🎨 Sidebar styles after:', {
      display: sidebar.style.display,
      visibility: sidebar.style.visibility,
      left: sidebar.style.left,
      zIndex: sidebar.style.zIndex,
      opacity: sidebar.style.opacity,
      pointerEvents: sidebar.style.pointerEvents
    });
    console.log('🎭 Overlay styles:', {
      display: overlay.style.display,
      left: overlay.style.left,
      zIndex: overlay.style.zIndex
    });
    
    updateDebug('✅ Opened!<br>Sidebar: ' + sidebarWidth + 'px<br>Overlay starts at: ' + overlay.style.left);
  }
  
  function closeSidebar() {
    console.log('🔒 Closing sidebar...');
    updateDebug('🔒 Closing...');
    
    sidebar.classList.remove('mobile-open');
    overlay.classList.remove('active');
    
    // Reset inline styles
    sidebar.style.left = '';
    sidebar.style.zIndex = '';
    overlay.style.display = '';
    overlay.style.left = '';
    overlay.style.zIndex = '';
    
    document.body.style.overflow = '';
    
    console.log('✅ Sidebar closed');
    updateDebug('✅ Closed');
  }
  
  // Make toggle function globally accessible
  window.toggleMobileSidebar = toggleSidebar;
  
  console.log('✅ Mobile toggle setup complete');
  updateDebug('✅ Setup complete!<br>Tap button to test');
});
