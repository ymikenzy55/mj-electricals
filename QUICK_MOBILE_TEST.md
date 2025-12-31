# Quick Mobile Test Guide

## 🚀 Fast Testing (5 Minutes)

### Test 1: Navbar Consistency (1 min)

**Steps:**
1. Open homepage → See hamburger menu ✓
2. Open products page → See hamburger menu ✓
3. Open cart page → See hamburger menu ✓
4. Click hamburger on any page → Menu opens ✓

**Expected:** Same navbar on all pages with hamburger menu

---

### Test 2: Cart Horizontal Layout (2 min)

**Steps:**
1. Add 2-3 items to cart
2. Go to cart page
3. Resize browser to 375px (or use phone)
4. Observe cart items

**Expected:**
```
┌─────────────────────────────────────┐
│ [📦] LED Bulb 60W    [- 1 +] $25 🗑│
│      Lighting | 60W                 │
├─────────────────────────────────────┤
│ [📦] Ceiling Fan     [- 2 +] $80 🗑│
│      Fans | 75W                     │
└─────────────────────────────────────┘
```

✓ Items in horizontal rows
✓ Small images (70px)
✓ Compact layout
✓ No excessive scrolling

---

### Test 3: Dashboard Tabs (2 min)

**Steps:**
1. Login to your account
2. Go to dashboard
3. Resize to mobile (< 768px)
4. Click bottom tabs: Profile → Orders → Wishlist → Feedback

**Expected:**
- Each tab click switches the view ✓
- Active tab is highlighted ✓
- Content changes immediately ✓
- No console errors ✓

---

## 📱 Device Testing

### iPhone SE (375px)
```bash
# Chrome DevTools
1. F12 → Toggle device toolbar
2. Select "iPhone SE"
3. Test all three features
```

### iPad (768px)
```bash
# Chrome DevTools
1. F12 → Toggle device toolbar
2. Select "iPad"
3. Test navbar and cart
```

---

## ✅ Quick Checklist

- [ ] Hamburger menu on homepage
- [ ] Hamburger menu on products page
- [ ] Hamburger menu on cart page
- [ ] Cart items horizontal on mobile
- [ ] Cart images 70px × 70px
- [ ] Dashboard tabs work on mobile
- [ ] No console errors

---

## 🐛 Common Issues

### Issue: Hamburger menu doesn't open
**Fix:** Clear browser cache and reload

### Issue: Cart items still vertical
**Fix:** Ensure screen width < 768px

### Issue: Dashboard tabs don't work
**Fix:** Hard refresh (Ctrl+Shift+R)

---

## 📊 Success Criteria

✅ **Pass:** All 3 tests work as expected
⚠️ **Review:** 1-2 tests have issues
❌ **Fail:** Multiple tests broken

---

**Status:** All fixes implemented and verified ✅
**Ready for:** Production deployment 🚀
