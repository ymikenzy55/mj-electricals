# Testing Guide: Priority 2 & 3 Features

## 🧪 Testing Checklist

### Priority 2: Products Filter Sidebar

#### Desktop Testing (> 992px)
- [ ] **Sidebar Visibility**
  - Sidebar should be visible on page load
  - Sidebar should be 280px wide
  - Sidebar should stick to viewport when scrolling
  - Sidebar should stay at top: 100px position

- [ ] **Filter Functionality**
  - Category dropdown populates with categories
  - Min/Max wattage inputs accept numbers
  - Min/Max price inputs accept numbers
  - Apply Filters button triggers product reload
  - Clear All button resets all filters
  - Products count updates after filtering

- [ ] **Visual Design**
  - White background with shadow
  - Orange accents on icons and buttons
  - Proper spacing between sections
  - Border radius on inputs and buttons
  - Hover effects on buttons

#### Mobile Testing (< 992px)
- [ ] **Toggle Button**
  - Filter toggle button visible in toolbar
  - Button shows filter icon and text
  - Orange background with white text
  - Hover effect works (darker orange)

- [ ] **Sidebar Behavior**
  - Sidebar hidden by default
  - Clicking toggle opens sidebar from left
  - Backdrop overlay appears behind sidebar
  - Sidebar width: 320px (max 85vw)
  - Close button (X) visible in header

- [ ] **Interactions**
  - Clicking backdrop closes sidebar
  - Clicking X button closes sidebar
  - Sidebar slides smoothly (0.3s)
  - Body scroll disabled when sidebar open
  - Filters work same as desktop

#### Filter Testing
- [ ] **Category Filter**
  - Select "All Categories" shows all products
  - Select specific category filters products
  - Category persists from URL parameter

- [ ] **Wattage Filter**
  - Enter min wattage only
  - Enter max wattage only
  - Enter both min and max
  - Invalid range shows no products

- [ ] **Price Filter**
  - Enter min price only
  - Enter max price only
  - Enter both min and max
  - Invalid range shows no products

- [ ] **Combined Filters**
  - Apply multiple filters together
  - Clear all resets everything
  - Products count updates correctly

---

### Priority 3: Hero Banner Animations

#### Banner Display
- [ ] **Initial Load**
  - First banner visible immediately
  - Content fades in with slide-up animation
  - Title appears first (0.2s delay)
  - Subtitle appears second (0.4s delay)
  - Button appears last (0.6s delay)

- [ ] **Multiple Banners**
  - Navigation buttons visible (if > 1 banner)
  - Dot indicators visible (if > 1 banner)
  - First dot is active (pill shape)
  - Other dots are circles

- [ ] **Auto-Rotation**
  - Banner changes every 5 seconds
  - Smooth fade transition (1s)
  - Scale effect (1.1 to 1.0)
  - Content re-animates on each slide
  - Rotation loops continuously

#### Navigation Controls
- [ ] **Previous Button**
  - Located on left side
  - Circular white button with backdrop blur
  - Chevron left icon
  - Hover: Orange background, scale 1.1
  - Click: Goes to previous banner

- [ ] **Next Button**
  - Located on right side
  - Same styling as previous
  - Chevron right icon
  - Hover: Orange background, scale 1.1
  - Click: Goes to next banner

- [ ] **Dot Indicators**
  - Located at bottom center
  - Active dot: Pill shape, orange, 32px wide
  - Inactive dots: Circle, white border, 12px
  - Hover: Scale 1.2, brighter
  - Click: Jump to specific banner

#### Visual Effects
- [ ] **Banner Transitions**
  - Fade out current banner
  - Fade in next banner
  - Scale from 1.1 to 1.0
  - Smooth 1s transition
  - No flickering or jumps

- [ ] **Content Animations**
  - Title: Fade in up (30px movement)
  - Subtitle: Fade in up (30px movement)
  - Button: Fade in up (30px movement)
  - Staggered timing (0.2s intervals)
  - Text shadows for readability

- [ ] **Button Hover**
  - Darker orange background
  - Lift up effect (translateY -3px)
  - Larger shadow
  - Arrow icon moves right (5px)
  - Smooth 0.3s transition

#### Responsive Testing
- [ ] **Desktop (> 992px)**
  - Hero height: 600px
  - Large title (4.5rem max)
  - Large subtitle (1.5rem max)
  - Nav buttons: 50px
  - Button padding: 1rem 2.5rem

- [ ] **Tablet (768px - 992px)**
  - Hero height: 450px
  - Medium title (3rem)
  - Medium subtitle (1.2rem)
  - Nav buttons: 40px
  - Button padding: 0.875rem 2rem

- [ ] **Mobile (< 768px)**
  - Hero height: 400px
  - Small title (2rem)
  - Small subtitle (1rem)
  - Nav buttons: 36px
  - Button padding: 0.75rem 1.5rem
  - Content padding: 1rem

#### Fallback Testing
- [ ] **No Banners**
  - Default hero displays
  - Gradient background (orange)
  - Welcome message
  - Shop Now button
  - Fade in animation

---

## 🎯 User Experience Testing

### Products Page Flow
1. **Desktop User**
   - Lands on products page
   - Sees sidebar immediately
   - Scrolls down, sidebar stays visible
   - Applies filters, sees results
   - Clears filters, sees all products

2. **Mobile User**
   - Lands on products page
   - Sees filter toggle button
   - Clicks toggle, sidebar slides in
   - Applies filters
   - Clicks backdrop to close
   - Sees filtered products

### Home Page Flow
1. **First Visit**
   - Hero banner fades in
   - Content animates sequentially
   - User reads title and subtitle
   - Clicks Shop Now button
   - Navigates to products

2. **Browsing Banners**
   - User sees first banner
   - Waits for auto-rotation
   - Clicks next button
   - Clicks dot indicator
   - Hovers over button
   - Clicks CTA

---

## 🐛 Common Issues to Check

### Filter Sidebar
- ❌ Sidebar not sticky on desktop
- ❌ Backdrop not covering full screen
- ❌ Filters not applying
- ❌ Products count not updating
- ❌ Sidebar not closing on mobile
- ❌ Toggle button not visible

### Hero Banner
- ❌ Banners not rotating
- ❌ Navigation buttons not working
- ❌ Animations not playing
- ❌ Content not visible (contrast)
- ❌ Dots not updating
- ❌ Images not loading

---

## 📱 Device Testing Matrix

| Device | Screen Size | Filter Sidebar | Hero Banner |
|--------|-------------|----------------|-------------|
| Desktop | 1920x1080 | ✅ Sticky | ✅ 600px |
| Laptop | 1366x768 | ✅ Sticky | ✅ 600px |
| Tablet | 768x1024 | ✅ Modal | ✅ 450px |
| Mobile | 375x667 | ✅ Drawer | ✅ 400px |
| Mobile | 320x568 | ✅ Drawer | ✅ 400px |

---

## 🔍 Browser Testing

### Required Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Features to Test
- [ ] CSS animations work
- [ ] Backdrop blur effect
- [ ] Transform transitions
- [ ] Flexbox layout
- [ ] Sticky positioning
- [ ] Modal behavior

---

## ⚡ Performance Testing

### Metrics to Check
- [ ] **Animation FPS**: Should be 60fps
- [ ] **Page Load**: < 3 seconds
- [ ] **Filter Response**: < 500ms
- [ ] **Banner Transition**: Smooth, no lag
- [ ] **Mobile Performance**: No jank

### Tools
- Chrome DevTools Performance tab
- Lighthouse audit
- Network throttling test
- Mobile device testing

---

## ✅ Acceptance Criteria

### Filter Sidebar
- ✅ Visible and functional on all devices
- ✅ Smooth animations (0.3s)
- ✅ Filters work correctly
- ✅ Products count updates
- ✅ Mobile drawer works perfectly
- ✅ Accessible via keyboard

### Hero Banner
- ✅ Auto-rotates every 5 seconds
- ✅ Manual navigation works
- ✅ Animations are smooth
- ✅ Content is readable
- ✅ Responsive on all devices
- ✅ Fallback displays correctly

---

## 🚀 Quick Test Commands

### Start Development Server
```bash
# Run from project root
start-servers.bat
```

### Test URLs
- Products Page: `http://localhost:3000/pages/products.html`
- Home Page: `http://localhost:3000/pages/index.html`

### Browser DevTools
- Open: `F12` or `Ctrl+Shift+I`
- Mobile View: `Ctrl+Shift+M`
- Performance: `Ctrl+Shift+P` → "Performance"

---

## 📝 Bug Report Template

```markdown
### Bug Description
[Describe the issue]

### Steps to Reproduce
1. Go to [page]
2. Click on [element]
3. Observe [behavior]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Device/Browser
- Device: [Desktop/Mobile]
- Browser: [Chrome/Firefox/Safari]
- Screen Size: [1920x1080]

### Screenshots
[Attach if applicable]
```

---

**Testing Guide Created**: December 25, 2024
**Features**: Priority 2 & 3
**Status**: Ready for QA Testing
