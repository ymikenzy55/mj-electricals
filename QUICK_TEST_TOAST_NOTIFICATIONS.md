# Quick Test Guide - Toast Notifications

## 🎯 Purpose
Quick reference to test all toast notifications after the migration from Modal to Toast system.

---

## 🧪 Test Scenarios

### 1. Authentication Tests

#### Login Page (login.html)
1. **Test Invalid Login**
   - Enter wrong credentials
   - ✅ Should show: Red toast "Invalid credentials" or similar

2. **Test Successful Login**
   - Enter correct credentials
   - ✅ Should show: Green toast "Login successful" or similar

3. **Test Google OAuth Error**
   - Simulate OAuth error (add ?error=true to URL)
   - ✅ Should show: Red toast "Google authentication failed"

4. **Test Google OAuth Success**
   - Simulate OAuth success (add ?token=test&name=Test to URL)
   - ✅ Should show: Green toast "Welcome back, Test!"

#### Register Page (register.html)
1. **Test Password Mismatch**
   - Enter different passwords in password fields
   - ✅ Should show: Red toast "Passwords do not match"

2. **Test Successful Registration**
   - Fill form correctly and submit
   - ✅ Should show: Green toast "Registration successful" or similar

---

### 2. Shopping Tests

#### Products Page (products.html)
1. **Test Add to Cart**
   - Click "Add to Cart" on any product
   - ✅ Should show: Green toast "Product added to cart!"

2. **Test Newsletter Subscription**
   - Enter email in footer newsletter form
   - ✅ Should show: Green toast "Thank you for subscribing to our newsletter!"

3. **Test Newsletter Error**
   - Enter invalid email or duplicate
   - ✅ Should show: Red toast with error message

#### Product Details Page (product-details.html)
1. **Test Review Submission**
   - Submit a product review
   - ✅ Should show: Green toast "Review submitted successfully!"
   - ✅ Should show: Green toast "Your review has been submitted and is pending admin approval"

2. **Test Review Error**
   - Try submitting without rating
   - ✅ Should show: Red toast with error message

---

### 3. Cart & Wishlist Tests

#### Cart Page (cart.html)
1. **Test Newsletter Subscription**
   - Enter email in newsletter form
   - ✅ Should show: Green toast "Thank you for subscribing to our newsletter!"

#### Wishlist Page (wishlist.html)
1. **Test Remove from Wishlist**
   - Click remove button on wishlist item
   - ✅ Should show: Green toast "Product removed from wishlist"

2. **Test Clear Wishlist**
   - Click "Clear Wishlist" button
   - ✅ Should show: Green toast "Wishlist cleared"

3. **Test Move to Cart**
   - Click "Move to Cart" on wishlist item
   - ✅ Should show: Green toast "Product moved to cart!"

4. **Test Newsletter Subscription**
   - Enter email in newsletter form
   - ✅ Should show: Green toast "Thank you for subscribing!"

#### Compare Page (compare.html)
1. **Test Add to Cart**
   - Click "Add to Cart" on comparison table
   - ✅ Should show: Green toast "Product added to cart!"

---

### 4. User Dashboard Tests

#### User Dashboard (user-dashboard.html)
1. **Test Password Update**
   - Go to Profile tab
   - Update password
   - ✅ Should show: Green toast "Password updated successfully!"

2. **Test Password Update Error**
   - Enter wrong current password
   - ✅ Should show: Red toast with error message

3. **Test Feedback Submission**
   - Go to Feedback tab
   - Submit feedback
   - ✅ Should show: Green toast "Feedback submitted successfully!"

4. **Test Remove from Wishlist**
   - Go to Wishlist tab
   - Remove item
   - ✅ Should show: Green toast "Removed from wishlist"

5. **Test Add to Cart from Wishlist**
   - Go to Wishlist tab
   - Click "Add to Cart"
   - ✅ Should show: Green toast "Added to cart!"

6. **Test Cancel Order**
   - Go to Orders tab
   - Cancel a pending order
   - ✅ Should show: Green toast "Order cancelled successfully! Admin will process your refund shortly."

---

### 5. Payment Tests

#### Payment Success Page (payment-success.html)
1. **Test Invoice Download Error**
   - Try downloading invoice without order ID
   - ✅ Should show: Red toast "Order ID not found"

2. **Test Invoice Generation Error**
   - Simulate invoice generation failure
   - ✅ Should show: Red toast "Failed to generate invoice. Please try again."

---

### 6. Homepage Tests

#### Index Page (index.html)
1. **Test Newsletter Subscription**
   - Enter email in footer newsletter form
   - ✅ Should show: Green toast "Thank you for subscribing to our newsletter!"

2. **Test Newsletter Error**
   - Enter invalid email
   - ✅ Should show: Red toast with error message

---

## 🎨 Toast Appearance Checklist

For each toast notification, verify:

### Visual Checks
- [ ] Toast appears in **top-right corner**
- [ ] Success toasts are **green**
- [ ] Error toasts are **red**
- [ ] Toast has **smooth slide-in animation**
- [ ] Toast text is **readable**
- [ ] Toast has **proper padding and spacing**

### Behavior Checks
- [ ] Toast **auto-dismisses** after 3-5 seconds
- [ ] Multiple toasts **stack vertically**
- [ ] Toast can be **manually dismissed** (if X button present)
- [ ] Toast doesn't **block page content**
- [ ] User can **continue interacting** with page while toast is visible

### Mobile Checks
- [ ] Toast is **visible on mobile** (not cut off)
- [ ] Toast is **properly sized** for mobile screens
- [ ] Toast doesn't **interfere with mobile navigation**
- [ ] Toast is **touch-friendly** (if dismissible)

---

## 🐛 Common Issues to Watch For

### Issue 1: Toast Not Appearing
**Possible Causes:**
- toast.js not loaded
- JavaScript error preventing execution
- Toast container not in DOM

**Check:**
- Open browser console for errors
- Verify toast.js is included in page
- Check network tab for failed requests

### Issue 2: Toast Appears But Doesn't Dismiss
**Possible Causes:**
- Auto-dismiss timer not working
- JavaScript error in toast.js

**Check:**
- Browser console for errors
- Verify toast.js has dismiss functionality

### Issue 3: Multiple Toasts Overlap
**Possible Causes:**
- CSS z-index issues
- Toast positioning not set correctly

**Check:**
- Inspect toast container CSS
- Verify toast stacking styles

### Issue 4: Toast Text Cut Off
**Possible Causes:**
- Toast width too narrow
- Long text without word wrap

**Check:**
- Toast CSS max-width
- Word-wrap settings

---

## 📱 Mobile Testing

### Test on Different Devices
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

### Mobile-Specific Tests
1. **Portrait Mode**
   - Trigger various toasts
   - Verify visibility and positioning

2. **Landscape Mode**
   - Trigger various toasts
   - Verify toasts don't interfere with content

3. **Small Screens (< 375px)**
   - Verify toasts are readable
   - Check for text overflow

---

## ✅ Success Criteria

All tests pass if:
- ✅ All toasts appear correctly
- ✅ All toasts auto-dismiss
- ✅ All toasts have correct colors (green/red)
- ✅ All toasts are readable
- ✅ No JavaScript errors in console
- ✅ Toasts work on mobile devices
- ✅ Multiple toasts stack properly
- ✅ User can continue using site while toasts are visible

---

## 🚀 Quick Test Commands

### Test All Success Toasts
```javascript
// Run in browser console
toast.success('Test success message 1');
setTimeout(() => toast.success('Test success message 2'), 1000);
setTimeout(() => toast.success('Test success message 3'), 2000);
```

### Test All Error Toasts
```javascript
// Run in browser console
toast.error('Test error message 1');
setTimeout(() => toast.error('Test error message 2'), 1000);
setTimeout(() => toast.error('Test error message 3'), 2000);
```

### Test Toast Stacking
```javascript
// Run in browser console
for(let i = 1; i <= 5; i++) {
  setTimeout(() => toast.success(`Toast ${i}`), i * 500);
}
```

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Authentication Tests:
[ ] Login error toast
[ ] Login success toast
[ ] Register error toast
[ ] Register success toast
[ ] Google OAuth toasts

Shopping Tests:
[ ] Add to cart toast
[ ] Newsletter subscription toast
[ ] Review submission toast

Wishlist Tests:
[ ] Remove from wishlist toast
[ ] Clear wishlist toast
[ ] Move to cart toast

Dashboard Tests:
[ ] Password update toast
[ ] Feedback submission toast
[ ] Order cancellation toast

Mobile Tests:
[ ] Toasts visible on mobile
[ ] Toasts properly positioned
[ ] Toasts don't interfere with navigation

Overall Status: [ ] PASS [ ] FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🎯 Priority Test Cases

If time is limited, test these first:

1. **Login success/error** - Most common user action
2. **Add to cart** - Core shopping functionality
3. **Order cancellation** - Important user action
4. **Mobile visibility** - Large user base on mobile

---

**Last Updated:** December 28, 2024  
**Status:** Ready for Testing
