const express = require('express');
const router = express.Router();
const { messageLimiter } = require('../middleware/rateLimiter');
const {
  createContactMessage,
  getAllContactMessages,
  respondToContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Protected route - auth required with rate limiting
router.post('/', protect, messageLimiter, createContactMessage);

// Admin routes
router.get('/all', protect, authorize('admin', 'superadmin'), getAllContactMessages);
router.put('/:id/respond', protect, authorize('admin', 'superadmin'), respondToContact);

module.exports = router;
