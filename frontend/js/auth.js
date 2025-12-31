// Authentication utilities
function requireAuth(redirectMessage = 'Please sign in to continue') {
  const token = localStorage.getItem('token');
  if (!token) {
    // Save the current page to redirect back after login
    localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
    
    // Show message if modal is available
    if (typeof Modal !== 'undefined') {
      Modal.info(redirectMessage);
    }
    
    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 1000);
    return false;
  }
  return true;
}

function requireRole(allowedRoles) {
  const state = stateManager.getState();
  if (!state.user || !allowedRoles.includes(state.user.role)) {
    window.location.href = '/pages/index.html';
    return false;
  }
  return true;
}

function redirectBasedOnRole(user) {
  // Redirect based on user role
  if (user.role === 'superadmin') {
    window.location.href = '/pages/super-admin-dashboard.html';
  } else if (user.role === 'admin') {
    window.location.href = '/pages/admin-dashboard.html';
  } else {
    // Regular users go to homepage
    window.location.href = '/pages/index.html';
  }
}

async function handleLogin(email, password) {
  try {
    const response = await api.login({ email, password });
    stateManager.login(response.token, response.user);
    socketManager.connect();
    
    // Check if there's a redirect URL saved (for protected pages)
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl && redirectUrl !== '/pages/login.html' && redirectUrl !== '/pages/register.html') {
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirectUrl;
      return;
    }
    
    // Clear any saved redirect
    localStorage.removeItem('redirectAfterLogin');
    
    // Redirect based on user role
    redirectBasedOnRole(response.user);
  } catch (error) {
    throw error;
  }
}

async function handleRegister(name, email, password) {
  try {
    const response = await api.register({ name, email, password });
    stateManager.login(response.token, response.user);
    socketManager.connect();
    
    // Clear any saved redirect for new users
    localStorage.removeItem('redirectAfterLogin');
    
    // New users always go to homepage
    window.location.href = '/pages/index.html';
  } catch (error) {
    throw error;
  }
}

function handleLogout(event) {
  if (event) {
    event.preventDefault();
  }
  socketManager.disconnect();
  stateManager.logout();
  return false;
}

// Make handleLogout globally accessible
window.handleLogout = handleLogout;

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', async () => {
  await stateManager.loadUser();
  
  const state = stateManager.getState();
  if (state.isAuthenticated) {
    socketManager.connect();
    updateUIForAuth(state.user);
  }
  
  updateCartBadge();
});

function updateUIForAuth(user) {
  // Update navigation based on user role
  const authLinks = document.querySelectorAll('.auth-link');
  const guestLinks = document.querySelectorAll('.guest-link');
  
  if (user) {
    authLinks.forEach(link => {
      // Use flex for nav-icon elements, block for others
      if (link.classList.contains('nav-icon') || link.querySelector('.nav-icon')) {
        link.style.display = 'flex';
      } else {
        link.style.display = 'block';
      }
    });
    guestLinks.forEach(link => link.style.display = 'none');
    
    // Update mobile menu user info
    if (typeof updateMobileMenuAuth === 'function') {
      updateMobileMenuAuth();
    }
    
    // Update dashboard link based on role
    const dashboardLinks = document.querySelectorAll('a[href="user-dashboard.html"], a[href="admin-dashboard.html"], a[href="super-admin-dashboard.html"]');
    dashboardLinks.forEach(link => {
      if (user.role === 'superadmin') {
        link.href = 'super-admin-dashboard.html';
        const text = link.innerHTML;
        if (text.includes('👤') || text.includes('fa-user')) {
          // Keep icon structure for nav-icon
          if (link.classList.contains('nav-icon')) {
            link.style.display = 'flex';
          } else {
            link.innerHTML = '👤<br>Admin';
            link.style.display = 'block';
          }
        } else {
          link.textContent = 'Admin Dashboard';
          link.style.display = 'block';
        }
      } else if (user.role === 'admin') {
        link.href = 'admin-dashboard.html';
        const text = link.innerHTML;
        if (text.includes('👤') || text.includes('fa-user')) {
          // Keep icon structure for nav-icon
          if (link.classList.contains('nav-icon')) {
            link.style.display = 'flex';
          } else {
            link.innerHTML = '👤<br>Admin';
            link.style.display = 'block';
          }
        } else {
          link.textContent = 'Admin Dashboard';
          link.style.display = 'block';
        }
      } else {
        // Regular users - show account link in desktop nav
        if (link.classList.contains('nav-icon')) {
          link.style.display = 'flex';
        } else if (link.href.includes('user-dashboard.html')) {
          link.style.display = 'block';
        } else {
          link.style.display = 'none';
        }
      }
    });
    
    // Hide admin links for regular users
    if (user.role === 'user') {
      document.querySelectorAll('.admin-link').forEach(link => {
        link.style.display = 'none';
      });
    }
  } else {
    authLinks.forEach(link => link.style.display = 'none');
    guestLinks.forEach(link => link.style.display = 'block');
  }
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  const mobileBadge = document.querySelector('.mobile-cart-badge');
  const count = stateManager.getCartCount();
  
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
  
  if (mobileBadge) {
    mobileBadge.textContent = count;
    mobileBadge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Subscribe to state changes
stateManager.subscribe((state) => {
  updateCartBadge();
  // Update mobile menu if it exists
  if (typeof updateMobileMenuAuth === 'function') {
    updateMobileMenuAuth();
  }
});
