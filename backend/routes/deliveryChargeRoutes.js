const express = require('express');
const router = express.Router();
const deliveryChargeController = require('../controllers/deliveryChargeController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', deliveryChargeController.getDeliveryCharges);
router.get('/city/:city', deliveryChargeController.getDeliveryChargeByCity);

// Admin routes
router.post('/', protect, admin, (req, res, next) => {
  console.log('=== DELIVERY CHARGE POST ROUTE HIT ===');
  console.log('Headers:', req.headers.authorization ? 'Token present' : 'No token');
  console.log('User from protect middleware:', req.user ? req.user.role : 'No user');
  next();
}, deliveryChargeController.createDeliveryCharge);

router.put('/:id', protect, admin, deliveryChargeController.updateDeliveryCharge);
router.delete('/:id', protect, admin, deliveryChargeController.deleteDeliveryCharge);

module.exports = router;
