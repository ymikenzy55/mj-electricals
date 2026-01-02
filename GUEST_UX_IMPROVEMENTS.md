# Guest UX & Mobile Navigation Improvements

## Issues to Fix:

### 1. Guest User Restrictions ✓
- **Problem**: Guests can't search or add to cart
- **Solution**: Allow guests full shopping experience, only require login at checkout
- **Files**: Remove auth checks from search and add-to-cart functions

### 2. Mobile Navbar Order ✓
- **Problem**: Company topbar appears below main navbar on mobile
- **Solution**: Ensure company topbar loads first and stays on top
- **Files**: Adjust z-index and loading order

### 3. Login Redirect ✓  
- **Current**: Already correct - users go to index, admins to dashboard
- **Status**: No changes needed

### 4. Mobile Wishlist/Compare Icons ✓
- **Problem**: Wishlist and Compare icons visible on mobile topbar
- **Solution**: Hide on mobile, add to hamburger menu instead
- **Files**: company-topbar.html, mobile-menu.html

## Implementation Priority:
1. Fix guest cart/search (HIGH)
2. Fix mobile navbar order (HIGH)
3. Move wishlist/compare to hamburger menu (MEDIUM)
