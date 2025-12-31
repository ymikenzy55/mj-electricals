# MJE E-Commerce Platform

A production-ready e-commerce platform built with Node.js, Express, MongoDB, and Vanilla JavaScript.

## Features

### Core Functionality
- **Role-Based Access Control**: User, Admin, and Super Admin roles
- **Product Management**: Unique product IDs (MJE-XXXXXX format), categories, filtering
- **Shopping Cart**: Persistent cart (database for logged-in users, localStorage for guests)
- **Order Management**: Complete order lifecycle with status tracking
- **Real-Time Updates**: Socket.IO for instant notifications
- **Feedback System**: Users can submit feedback, admins can respond

### Security
- JWT authentication
- Password hashing with bcrypt
- Role-based route protection
- Input validation
- Secure password requirements (min 8 characters)

### User Features
- Browse products with advanced filtering (category, wattage, price)
- Search by product name or ID
- Add to cart (guest and authenticated)
- Checkout with shipping address
- View order history
- Submit and track feedback
- Change password

### Admin Features
- Dashboard with statistics
- Manage products (create, update, delete, stock management)
- Manage categories
- View and update order status
- Respond to customer feedback
- Real-time notifications for new orders and feedback

### Super Admin Features
- All admin capabilities
- User management
- Create and manage admins
- Change user roles
- View system-wide statistics
- Full audit visibility

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.IO for real-time features
- JWT for authentication
- bcrypt for password hashing

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Socket.IO client
- Responsive design with mobile navigation
- Centralized state management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development
   
   # Default Super Admin Credentials
   SUPER_ADMIN_EMAIL=superadmin@mje.com
   SUPER_ADMIN_PASSWORD=SuperAdmin@123
   ```

4. **Start MongoDB**
   - If using local MongoDB:
   ```bash
   mongod
   ```
   - Or use MongoDB Atlas connection string

5. **Run the application**
   
   Development mode (with auto-restart):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Access the application**
   - Frontend: Open `frontend/pages/index.html` in your browser
   - Or serve via a local server (recommended):
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server frontend -p 8000
   ```
   - Then visit: `http://localhost:8000/pages/index.html`

## Default Credentials

### Super Admin
- Email: `superadmin@mje.com`
- Password: `SuperAdmin@123`

**Important**: Change these credentials immediately after first login in production!

## Project Structure

```
ecommerce-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product management
│   │   ├── cartController.js     # Cart operations
│   │   ├── orderController.js    # Order processing
│   │   ├── feedbackController.js # Feedback system
│   │   ├── categoryController.js # Category management
│   │   └── adminController.js    # Admin operations
│   ├── middleware/
│   │   └── auth.js               # JWT & role verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Order.js              # Order schema
│   │   ├── Feedback.js           # Feedback schema
│   │   └── Category.js           # Category schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateToken.js      # JWT token generation
│   │   └── initSuperAdmin.js     # Super admin initialization
│   └── server.js                 # Main server file
├── frontend/
│   ├── css/
│   │   └── style.css             # Global styles
│   ├── js/
│   │   ├── api.js                # API client
│   │   ├── state.js              # State management
│   │   ├── socket.js             # Socket.IO client
│   │   └── auth.js               # Auth utilities
│   └── pages/
│       ├── index.html            # Home page
│       ├── login.html
│       ├── register.html
│       ├── products.html
│       ├── product-details.html
│       ├── categories.html
│       ├── cart.html
│       ├── checkout.html
│       ├── user-dashboard.html
│       ├── admin-dashboard.html
│       ├── super-admin-dashboard.html
│       ├── about.html
│       └── contact.html
├── .env.example
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/password` - Update password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/all` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/my-feedbacks` - Get user feedbacks
- `GET /api/feedback/all` - Get all feedbacks (Admin)
- `PUT /api/feedback/:id/respond` - Respond to feedback (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Admin (Super Admin Only)
- `GET /api/admin/users` - Get all users
- `POST /api/admin/create-admin` - Create admin
- `PUT /api/admin/users/:id/role` - Update user role
- `PUT /api/admin/users/:id/deactivate` - Deactivate user
- `GET /api/admin/stats` - Get dashboard statistics

## Real-Time Events

### User Events
- `order:statusUpdate` - Order status changed
- `feedback:response` - Admin responded to feedback

### Admin Events
- `order:new` - New order received
- `feedback:new` - New feedback submitted
- `product:updated` - Product updated
- `product:deleted` - Product deleted

## Design Specifications

### Colors
- Primary Black: `#000000`
- Primary Orange: `#ff6600`
- Primary White: `#ffffff`

### Responsive Breakpoints
- Mobile: < 768px (bottom navigation)
- Desktop: ≥ 768px (top navigation)

## Security Best Practices

1. **Never commit `.env` file**
2. **Change default Super Admin credentials**
3. **Use strong JWT secret in production**
4. **Enable HTTPS in production**
5. **Implement rate limiting for production**
6. **Regular security audits**
7. **Keep dependencies updated**

## Known Features

### Cart Persistence
- Guest users: Cart stored in localStorage
- Logged-in users: Cart stored in database
- Cart migrates from localStorage to database on login

### Product ID Generation
- Format: `MJE-XXXXXX` (6 random digits)
- Automatically generated on product creation
- Cannot be edited or duplicated
- Validated with regex pattern

### Role-Based Redirects
- User login → User Dashboard
- Admin login → Admin Dashboard
- Super Admin login → Super Admin Dashboard

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access (for Atlas)

### Port Already in Use
- Change PORT in `.env`
- Or kill process using the port

### CORS Issues
- Backend configured for all origins in development
- Update CORS settings for production

### Socket.IO Connection Failed
- Ensure backend server is running
- Check Socket.IO URL in `frontend/js/socket.js`

## Future Enhancements

- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Advanced analytics
- Image upload functionality
- Multi-language support
- Export orders to CSV/PDF

## License

ISC

## Support

For issues and questions, please use the feedback system or contact support@mje-ecommerce.com

## 🌐 Public Access with Ngrok

Want to share your site with others? Use ngrok to create a public URL!

### Quick Setup

1. **Install Ngrok**
   - Download from https://ngrok.com/download
   - Or run: `npm install -g ngrok`

2. **Get Auth Token**
   - Sign up at https://dashboard.ngrok.com/signup
   - Get token from https://dashboard.ngrok.com/get-started/your-authtoken
   - Run: `ngrok config add-authtoken YOUR_TOKEN`

3. **Start with Ngrok**
   ```bash
   start-with-ngrok-simple.bat
   ```

4. **Share Your URL**
   - Check the Ngrok window for your public URL
   - Share: `https://xxxx.ngrok-free.app/pages/index.html`

### Available Scripts

- `start-servers.bat` - Local development only
- `start-with-ngrok-simple.bat` - Public access (free tier)
- `start-with-ngrok-full.bat` - Full tunnel (paid plan required)

### Documentation

- **Quick Start**: See `NGROK_QUICK_START.md`
- **Detailed Setup**: See `NGROK_SETUP.md`

### Notes

- Free ngrok shows a warning page (users click "Visit Site")
- URL changes each restart (upgrade for permanent URL)
- Free tier: 1 tunnel at a time, 2-hour sessions
