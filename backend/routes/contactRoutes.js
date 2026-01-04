const express = require('express');
const router = express.Router();
const { messageLimiter } = require('../middleware/rateLimiter');
const { contactValidation, mongoIdValidation } = require('../middleware/validator');
const {
  createContactMessage,
  getAllContactMessages,
  respondToContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Protected route - auth required with rate limiting and validation
router.post('/', protect, messageLimiter, contactValidation, createContactMessage);

// Admin routes
router.get('/all', protect, authorize('admin', 'superadmin'), getAllContactMessages);
router.put('/:id/respond', protect, authorize('admin', 'superadmin'), mongoIdValidation, respondToContact);

module.exports = router;
