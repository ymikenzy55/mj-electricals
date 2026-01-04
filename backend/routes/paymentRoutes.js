const express = require('express');
const router = express.Router();
const { paymentLimiter } = require('../middleware/rateLimiter');
const { initializePaymentValidation, mongoIdValidation } = require('../middleware/validator');
const {
  initializePayment,
  verifyPayment,
  paystackWebhook,
  getPaymentHistory
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/initialize', protect, paymentLimiter, initializePaymentValidation, initializePayment);
router.get('/verify/:reference', protect, verifyPayment);
router.post('/webhook/paystack', paystackWebhook); // No rate limit for webhooks
router.get('/history', protect, getPaymentHistory);

module.exports = router;
