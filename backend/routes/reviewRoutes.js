const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Protected routes (require authentication)
router.post('/', protect, reviewController.createReview);
router.get('/my-reviews', protect, reviewController.getUserReviews);
router.put('/:reviewId', protect, reviewController.updateReview);
router.delete('/:reviewId', protect, reviewController.deleteReview);
router.post('/:reviewId/helpful', reviewController.markHelpful);

// Admin routes
router.get('/admin/all', protect, admin, reviewController.getAllReviews);
router.put('/admin/:reviewId/status', protect, admin, reviewController.updateReviewStatus);

module.exports = router;
