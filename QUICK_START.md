# Quick Start Guide

## ✅ System is Ready!

Both servers are now running:
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:8000

## 🚀 Access the Application

Open your browser and visit:
```
http://localhost:8000/pages/index.html
```

## 🔐 Default Login Credentials

### Super Admin
- **Email**: superadmin@mje.com
- **Password**: SuperAdmin@123

### Test User (Create via Register)
- Register a new account at: http://localhost:8000/pages/register.html

## 📋 Testing Checklist

### 1. Public Pages (No Login Required)
- ✅ Home Page: http://localhost:8000/pages/index.html
- ✅ Products: http://localhost:8000/pages/products.html
- ✅ Categories: http://localhost:8000/pages/categories.html
- ✅ About: http://localhost:8000/pages/about.html
- ✅ Contact: http://localhost:8000/pages/contact.html

### 2. User Registration & Login
1. Go to Register page
2. Create a new user account
3. Login with your credentials
4. Should redirect to User Dashboard

### 3. User Features (After Login)
- ✅ Browse products
- ✅ Filter by category, wattage, price
- ✅ Search products
- ✅ View product details
- ✅ Add to cart
- ✅ Update cart quantities
- ✅ Checkout
- ✅ View order history
- ✅ Submit feedback
- ✅ Change password

### 4. Admin Features
1. Login as Super Admin
2. Create a test admin:
   - Go to Super Admin Dashboard
   - Navigate to "Admins" section
   - Click "Create New Admin"
   - Fill in details
3. Logout and login as the new admin
4. Test admin features:
   - ✅ View dashboard statistics
   - ✅ Create products
   - ✅ Edit products
   - ✅ Delete products
   - ✅ Manage categories
   - ✅ View orders
   - ✅ Update order status
   - ✅ View feedback
   - ✅ Respond to feedback

### 5. Super Admin Features
1. Login as Super Admin
2. Test features:
   - ✅ View all users
   - ✅ Create admins
   - ✅ Change user roles
   - ✅ View system statistics
   - ✅ Access all admin features

### 6. Real-Time Features
1. Open two browser windows
2. Window 1: Login as user
3. Window 2: Login as admin
4. Test real-time updates:
   - User places order → Admin sees notification
   - User submits feedback → Admin sees notification
   - Admin updates order status → User sees notification
   - Admin responds to feedback → User sees notification

### 7. Cart Persistence
1. **Guest Cart**:
   - Browse products without login
   - Add items to cart
   - Refresh page → Cart persists
   - Login → Cart migrates to database

2. **Logged-in Cart**:
   - Login
   - Add items to cart
   - Logout and login again → Cart persists

### 8. Mobile Responsiveness
1. Resize browser to mobile size (< 768px)
2. Check:
   - ✅ Bottom navigation appears
   - ✅ Top navigation hidden
   - ✅ All pages responsive
   - ✅ Forms work properly

## 🧪 Sample Test Flow

### Complete User Journey
1. **Browse as Guest**
   - Visit home page
   - Browse products
   - View product details
   - Try to add to cart → Prompted to login

2. **Register & Login**
   - Register new account
   - Login successfully
   - Redirected to User Dashboard

3. **Shopping**
   - Browse products
   - Filter by category
   - Add 3 products to cart
   - Update quantities
   - Remove one item
   - Proceed to checkout

4. **Checkout**
   - Fill shipping address
   - Place order
   - View order in dashboard

5. **Feedback**
   - Submit feedback
   - Wait for admin response

### Complete Admin Journey
1. **Login as Super Admin**
   - Login with default credentials
   - View dashboard statistics

2. **Create Admin**
   - Navigate to Admins section
   - Create new admin account

3. **Manage Products**
   - Create new category
   - Create new product (auto-generates MJE-XXXXXX ID)
   - Edit product details
   - Update stock

4. **Handle Orders**
   - View pending orders
   - Update order status to "processing"
   - Update to "shipped"
   - Update to "completed"

5. **Respond to Feedback**
   - View pending feedback
   - Write response
   - Submit → User receives real-time notification

## 🔧 Troubleshooting

### Backend Not Starting
```bash
# Check if MongoDB is running
# Windows: Check Services
# Or start manually: mongod

# Check port 5000 is available
netstat -ano | findstr :5000
```

### Frontend Not Loading
```bash
# Check if port 8000 is available
netstat -ano | findstr :8000

# Try different port
npx http-server frontend -p 8080 -c-1
```

### Database Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Default: mongodb://localhost:27017/ecommerce

### CORS Issues
- Backend is configured for all origins in development
- If issues persist, check backend/server.js CORS settings

## 📊 API Testing (Optional)

You can test the API directly using tools like Postman or curl:

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"superadmin@mje.com\",\"password\":\"SuperAdmin@123\"}"
```

### Get Products
```bash
curl http://localhost:5000/api/products
```

## 🎯 Key Features to Demonstrate

1. **Unique Product IDs**: Every product gets MJE-XXXXXX format
2. **Role-Based Access**: Users can't access admin pages
3. **Cart Persistence**: Cart survives page refresh and login
4. **Real-Time Updates**: Instant notifications without refresh
5. **Responsive Design**: Mobile bottom nav, desktop top nav
6. **Security**: JWT tokens, password hashing, protected routes

## 📱 Mobile Testing

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (iPhone, Android)
4. Test all features on mobile view

## 🎨 Design Verification

- **Colors**: Black (#000000), Orange (#ff6600), White (#ffffff)
- **Typography**: Clean, modern, readable
- **Spacing**: Consistent padding and margins
- **Shadows**: Subtle box shadows on cards
- **Transitions**: Smooth hover effects

## ✨ Success Indicators

- ✅ No console errors
- ✅ All pages load correctly
- ✅ Login/logout works
- ✅ Cart updates properly
- ✅ Orders process successfully
- ✅ Real-time notifications appear
- ✅ Mobile navigation works
- ✅ Role-based access enforced

## 🛑 Stop Servers

When done testing:
1. Press Ctrl+C in both terminal windows
2. Or close the terminals

## 📞 Need Help?

- Check README.md for detailed documentation
- Review API endpoints in README.md
- Check browser console for errors
- Check server logs for backend errors

---

**Enjoy testing your production-ready e-commerce platform! 🎉**
