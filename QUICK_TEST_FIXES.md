# Quick Test Guide - Critical Fixes

## Test 1: Customer Contact Information ✅

### Steps:
1. Login as a user
2. Add items to cart
3. Go to checkout
4. Fill in:
   - Full Name: "John Doe"
   - Phone: "+233 24 123 4567"
   - Address details
5. Complete order
6. Login as admin
7. View the order details

### Expected Result:
✅ Admin should see:
- Customer Name: John Doe
- Phone: +233 24 123 4567
- Email: user's email
- All organized in sections

---

## Test 2: Mobile Menu on All Pages 📱

### Pages to Test:
Test hamburger menu on these pages (mobile view):

1. Home (index.html) ✅
2. Products (products.html) ✅
3. Categories (categories.html) ✅
4. About (about.html) ✅
5. Contact (contact.html) ✅
6. Cart (cart.html) ✅
7. Checkout (checkout.html) ✅
8. Wishlist (wishlist.html) ✅
9. Compare (compare.html) ✅
10. Product Details (product-details.html) ✅
11. Login (login.html) ✅
12. Register (register.html) ✅
13. User Dashboard (user-dashboard.html) ✅
14. FAQ (faq.html) ✅

### Steps for Each Page:
1. Open page on mobile or use browser dev tools (F12)
2. Set viewport to mobile (375px width)
3. Click hamburger menu (☰) button
4. Menu should slide in from left
5. Click overlay or X to close
6. Menu should slide out

### Expected Result:
✅ Hamburger menu works on ALL pages
✅ Menu slides smoothly
✅ Overlay closes menu
✅ No JavaScript errors in console

---

## Test 3: Search Functionality 🔍

### Pages to Test:
1. Click search icon in navbar
2. Type "light" or any product name
3. Press Enter or click search button

### Expected Result:
✅ Redirects to products.html with search results
✅ Shows matching products
✅ No errors

---

## Test 4: Payment Flow 💳

### Steps:
1. Create an order
2. Select online payment
3. Check console for errors

### Expected Result:
✅ No "PAYSTACK_PUBLIC_KEY is not defined" error
⚠️ Payment may fail if using placeholder key (expected)

---

## Quick Mobile Test Commands

### Using Browser DevTools:
```
1. Press F12
2. Click device toolbar icon (or Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Test each page
```

### Test on Real Device:
```
1. Get your local IP: ipconfig (Windows) or ifconfig (Mac/Linux)
2. Access: http://YOUR_IP:3000
3. Test on phone connected to same WiFi
```

---

## Database Check

### Check if customerInfo is saved:
```javascript
// In MongoDB or using MongoDB Compass
db.orders.findOne({}, { customerInfo: 1, user: 1, createdAt: 1 })

// Should show:
{
  "_id": "...",
  "customerInfo": {
    "fullName": "John Doe",
    "phone": "+233 24 123 4567",
    "email": "user@example.com"
  },
  "user": "...",
  "createdAt": "..."
}
```

---

## Common Issues & Solutions

### Issue: Hamburger menu doesn't work
**Solution:** Check browser console for errors. Ensure page has the mobile menu functions.

### Issue: Search doesn't work
**Solution:** Check if `performNavSearch()` function exists. Check console for errors.

### Issue: Customer info not showing in admin
**Solution:** 
- Check if order was created AFTER the fix
- Old orders won't have customerInfo
- Check browser console for errors

### Issue: Payment fails
**Solution:** Replace Paystack placeholder key with actual key from Paystack dashboard.

---

## Success Criteria

All fixes are working if:
- ✅ New orders have customer phone numbers
- ✅ Admin can see customer contact info
- ✅ Hamburger menu works on all 14 pages
- ✅ Search works from any page
- ✅ No JavaScript console errors
- ✅ Mobile experience is smooth

---

## Report Issues

If you find any issues:
1. Note the page URL
2. Copy console error messages
3. Note steps to reproduce
4. Check if issue exists on desktop vs mobile
5. Report with all details

---

## Next Steps After Testing

1. ✅ All tests pass → Deploy to production
2. ❌ Issues found → Fix and retest
3. 📝 Document any new issues
4. 🚀 Update Paystack key before going live
