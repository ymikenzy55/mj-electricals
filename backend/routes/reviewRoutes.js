const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');
const { createReviewValidation, mongoIdValidation } = require('../middleware/validator');

// Public routes
router.get('/product/:productId', mongoIdValidation, reviewController.getProductReviews);

// Protected routes (require authentication)
router.post('/', protect, createReviewValidation, reviewController.createReview);
router.get('/my-reviews', protect, reviewController.getUserReviews);
router.put('/:reviewId', protect, mongoIdValidation, reviewController.updateReview);
router.delete('/:reviewId', protect, mongoIdValidation, reviewController.deleteReview);
router.post('/:reviewId/helpful', mongoIdValidation, reviewController.markHelpful);

// Admin routes
router.get('/admin/all', protect, admin, reviewController.getAllReviews);
router.put('/admin/:reviewId/status', protect, admin, mongoIdValidation, reviewController.updateReviewStatus);
router.delete('/admin/:reviewId', protect, admin, mongoIdValidation, reviewController.adminDeleteReview);

module.exports = router;
