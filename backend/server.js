require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const initSuperAdmin = require('./utils/initSuperAdmin');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Connect to database
connectDB();

// Initialize Super Admin
initSuperAdmin();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(passport.initialize());

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Add cache control headers for static files
app.use((req, res, next) => {
  // Disable caching for HTML files
  if (req.url.endsWith('.html') || req.url === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  // Short cache for CSS/JS (5 minutes)
  else if (req.url.endsWith('.css') || req.url.endsWith('.js')) {
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  next();
});

// Make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('authenticate', (userId) => {
    socket.join(`user:${userId}`);
    console.log(`User ${userId} authenticated`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check route - Email enabled
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MJ Electricals API is running',
    version: '1.0.1',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      feedback: '/api/feedback',
      categories: '/api/categories',
      admin: '/api/admin',
      newsletter: '/api/newsletter',
      banners: '/api/banners',
      wishlist: '/api/wishlist',
      reviews: '/api/reviews',
      deliveryCharges: '/api/delivery-charges',
      payments: '/api/payments'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/delivery-charges', require('./routes/deliveryChargeRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
