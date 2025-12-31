const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getUserFeedbacks,
  getAllFeedbacks,
  respondToFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createFeedback);
router.get('/my-feedbacks', protect, getUserFeedbacks);
router.get('/all', protect, authorize('admin', 'superadmin'), getAllFeedbacks);
router.put('/:id/respond', protect, authorize('admin', 'superadmin'), respondToFeedback);

module.exports = router;
