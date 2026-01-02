require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const initSuperAdmin = require('./utils/initSuperAdmin');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve static files from frontend directory
const path = require('path');
const fs = require('fs');

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

// API Routes (MUST be first - before any static file serving)
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

// Health check route for API
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'MJ Electricals API is running',
    version: '1.0.0',
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

// Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Custom middleware to handle clean URLs (without .html extension)
// This MUST come after static files so .html files are served first
app.use((req, res, next) => {
  // Skip if it's an API route
  if (req.path.startsWith('/api')) {
    return next();
  }
  
  // If path doesn't have extension, try to find HTML file
  if (!req.path.includes('.')) {
    const htmlPath = path.join(__dirname, '../frontend', `${req.path}.html`);
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  
  next();
});

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
  // If it's an API route, return JSON
  if (req.path.startsWith('/api')) {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  
  // For frontend routes, send 404 page
  const notFoundPath = path.join(__dirname, '../frontend/404.html');
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  
  res.status(404).send('Page not found');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
