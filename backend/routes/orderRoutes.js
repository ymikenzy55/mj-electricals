const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  processRefund,
  cleanupExpiredOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { createOrderValidation, mongoIdValidation } = require('../middleware/validator');

router.post('/', protect, createOrderValidation, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/all', protect, authorize('admin', 'superadmin'), getAllOrders);
router.post('/cleanup-expired', protect, authorize('admin', 'superadmin'), cleanupExpiredOrders);
router.get('/:id', protect, mongoIdValidation, getOrder);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), mongoIdValidation, updateOrderStatus);
router.put('/:id/cancel', protect, mongoIdValidation, cancelOrder);
router.put('/:id/refund', protect, authorize('admin', 'superadmin'), mongoIdValidation, processRefund);

module.exports = router;
