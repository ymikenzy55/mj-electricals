# 🧪 Quick Test Guide - Google OAuth & Paystack

## ✅ Servers Running

Your servers are now running with Google OAuth and Paystack integration!

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:8000

---

## 🔐 Test Google Sign-In

### Step 1: Go to Login Page
```
http://localhost:8000/pages/login.html
```

### Step 2: Click "Sign in with Google"
- You'll see a button with Google logo
- Click it

### Step 3: Select Google Account
- Choose your Google account
- Grant permissions

### Step 4: Verify Success
- ✅ Redirected to dashboard
- ✅ User info displayed
- ✅ Can browse products

**Expected Result:** Logged in successfully without entering password!

---

## 💳 Test Paystack Payment

### Step 1: Add Products to Cart
```
http://localhost:8000/pages/products.html
```
- Add 2-3 products to cart

### Step 2: Go to Checkout
```
http://localhost:8000/pages/checkout.html
```

### Step 3: Fill Shipping Details
- Name: Test User
- Email: test@example.com
- Phone: 08012345678
- Address: 123 Test Street
- City: Lagos
- State: Lagos
- Zip: 100001
- Country: Nigeria

### Step 4: Select Payment Method
- Choose "Online Payment"
- Click "Continue to Review"

### Step 5: Place Order
- Review your order
- Click "Place Order"
- Paystack modal will open

### Step 6: Enter Test Card Details

**Test Card (Always Successful):**
```
Card Number: 4084 0840 8408 4081
CVV: 408
Expiry: 12/25
PIN: 0000
OTP: 123456
```

**Alternative Test Cards:**

Success Card:
```
Card: 5060 6666 6666 6666 6666
CVV: 123
Expiry: Any future date
```

Insufficient Funds:
```
Card: 5060 6666 6666 6666 6666
CVV: 606
```

### Step 7: Complete Payment
- Enter card details
- Enter PIN when prompted
- Enter OTP when prompted
- Payment processes

### Step 8: Verify Success
- ✅ Redirected to success page
- ✅ Order ID displayed
- ✅ Payment reference shown
- ✅ Order marked as "Paid" in dashboard

---

## 🎯 Quick Test Scenarios

### Scenario 1: New User with Google
1. Go to register page
2. Click "Sign up with Google"
3. Select Google account
4. ✅ Account created automatically
5. ✅ Logged in to dashboard

### Scenario 2: Existing User Links Google
1. Register normally with email/password
2. Logout
3. Click "Sign in with Google" with same email
4. ✅ Google account linked
5. ✅ Can login with either method

### Scenario 3: Complete Purchase Flow
1. Browse products
2. Add to cart
3. Checkout
4. Pay with Paystack
5. ✅ Order completed
6. ✅ Payment confirmed
7. ✅ View in dashboard

### Scenario 4: Cash on Delivery
1. Add products to cart
2. Checkout
3. Select "Cash on Delivery"
4. Place order
5. ✅ Order created (payment pending)
6. ✅ No payment modal

---

## 🔍 What to Check

### Google OAuth
- [ ] "Sign in with Google" button visible
- [ ] Button has Google logo
- [ ] Redirects to Google
- [ ] Returns to site after auth
- [ ] User logged in automatically
- [ ] User data saved in database

### Paystack Payment
- [ ] Payment modal opens
- [ ] Card input fields work
- [ ] Test card processes successfully
- [ ] Payment verified
- [ ] Order status updated to "paid"
- [ ] Success page displays
- [ ] Payment reference saved

---

## 🐛 Common Issues & Fixes

### Google Sign-In Not Working

**Issue:** Button doesn't redirect
- **Fix:** Check `.env` has correct Google credentials
- **Fix:** Verify Google Console redirect URI

**Issue:** "redirect_uri_mismatch" error
- **Fix:** Add `http://localhost:5000/api/auth/google/callback` to Google Console

### Paystack Not Working

**Issue:** Modal doesn't open
- **Fix:** Check browser console for errors
- **Fix:** Verify Paystack script loaded

**Issue:** Payment fails
- **Fix:** Use correct test card numbers
- **Fix:** Check Paystack dashboard for errors

**Issue:** Payment not verified
- **Fix:** Check backend logs
- **Fix:** Verify secret key in `.env`

---

## 📊 Check Database

### View Users with Google
```javascript
// In MongoDB
db.users.find({ googleId: { $exists: true } })
```

### View Paid Orders
```javascript
// In MongoDB
db.orders.find({ paymentStatus: 'paid' })
```

---

## 🎉 Success Indicators

### Google OAuth Working:
- ✅ Can login with Google
- ✅ User created in database
- ✅ JWT token generated
- ✅ Redirected to dashboard

### Paystack Working:
- ✅ Payment modal opens
- ✅ Test payment succeeds
- ✅ Order marked as paid
- ✅ Payment reference saved
- ✅ Success page shows

---

## 📝 Test Checklist

**Google OAuth:**
- [ ] Login with Google works
- [ ] Register with Google works
- [ ] Existing user can link Google
- [ ] User data synced correctly
- [ ] Dashboard accessible after login

**Paystack Payment:**
- [ ] Checkout page loads
- [ ] Payment method selection works
- [ ] Paystack modal opens
- [ ] Test card payment succeeds
- [ ] Payment verified successfully
- [ ] Order status updated
- [ ] Success page displays
- [ ] Payment history shows transaction

**Integration:**
- [ ] Can login with Google and make payment
- [ ] Payment works for all user types
- [ ] Error handling works
- [ ] Loading states display
- [ ] Success messages show

---

## 🚀 Ready to Test!

1. **Servers are running** ✅
2. **Google OAuth configured** ✅
3. **Paystack integrated** ✅

**Start testing:**
```
http://localhost:8000/pages/login.html
```

**Need help?** Check `GOOGLE_PAYSTACK_GUIDE.md` for detailed documentation.

Happy testing! 🎊
