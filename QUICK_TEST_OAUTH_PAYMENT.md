# ⚡ Quick Test - OAuth & Payment

## 🔐 Test Google Sign-In (30 seconds)

1. Go to: `http://localhost:8000/pages/login.html`
2. Click "Sign in with Google"
3. Select your Google account
4. ✅ Done! You're logged in

## 💳 Test Paystack Payment (2 minutes)

1. Add products to cart
2. Go to checkout: `http://localhost:8000/pages/checkout.html`
3. Fill shipping details
4. Select "Online Payment"
5. Click "Place Order"
6. Use test card:
   ```
   Card: 4084 0840 8408 4081
   CVV: 408
   Expiry: 12/25
   PIN: 0000
   OTP: 123456
   ```
7. ✅ Payment successful!

## 📋 Quick Links

- **Login**: http://localhost:8000/pages/login.html
- **Register**: http://localhost:8000/pages/register.html
- **Products**: http://localhost:8000/pages/products.html
- **Checkout**: http://localhost:8000/pages/checkout.html

## 📚 Documentation

- **Complete Guide**: `GOOGLE_PAYSTACK_GUIDE.md`
- **Test Guide**: `TEST_GOOGLE_PAYSTACK.md`
- **Summary**: `OAUTH_PAYMENT_COMPLETE.md`

## ✅ What Works

- ✅ Google Sign-In
- ✅ Google Sign-Up
- ✅ Paystack Payment
- ✅ Payment Verification
- ✅ Order Tracking

## 🎉 Ready to Test!

Servers running at:
- Backend: http://localhost:5000
- Frontend: http://localhost:8000
