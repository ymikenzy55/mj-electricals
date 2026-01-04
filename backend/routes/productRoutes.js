const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const {
  createProductValidation,
  updateProductValidation,
  mongoIdValidation
} = require('../middleware/validator');

router.get('/', getProducts);
router.get('/:id', mongoIdValidation, getProduct);
router.get('/:id/related', mongoIdValidation, getRelatedProducts);
router.post('/', protect, authorize('admin', 'superadmin'), createProductValidation, createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProductValidation, updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), mongoIdValidation, deleteProduct);

module.exports = router;
