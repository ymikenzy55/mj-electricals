const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getAllContactMessages,
  respondToContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

// Public route - auth required to send messages
router.post('/', protect, createContactMessage);

// Admin routes
router.get('/all', protect, authorize('admin', 'superadmin'), getAllContactMessages);
router.put('/:id/respond', protect, authorize('admin', 'superadmin'), respondToContact);

module.exports = router;
