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

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/all', protect, authorize('admin', 'superadmin'), getAllOrders);
router.post('/cleanup-expired', protect, authorize('admin', 'superadmin'), cleanupExpiredOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/refund', protect, authorize('admin', 'superadmin'), processRefund);

module.exports = router;
