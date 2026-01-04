const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const { addToCartValidation, mongoIdValidation } = require('../middleware/validator');

router.use(protect);

router.get('/', getCart);
router.post('/', addToCartValidation, addToCart);
router.put('/', addToCartValidation, updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
