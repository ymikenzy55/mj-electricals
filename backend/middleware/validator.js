const { body, param, query, validationResult } = require('express-validator');
const validator = require('validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces')
    .escape(),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom((value) => {
      if (!validator.isEmail(value)) {
        throw new Error('Invalid email format');
      }
      return true;
    }),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters long'),
    // Removed regex validation - let controller handle detailed password validation
  
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

const forgotPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  handleValidationErrors
];

const resetPasswordValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('resetToken')
    .trim()
    .notEmpty().withMessage('Reset token is required')
    .isLength({ min: 6, max: 6 }).withMessage('Invalid reset token')
    .isNumeric().withMessage('Reset token must be numeric'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be at least 8 characters long'),
    // Removed regex validation - let controller handle detailed password validation
  
  handleValidationErrors
];

// Product validation rules
const createProductValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3, max: 200 }).withMessage('Name must be 3-200 characters')
    .escape(),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category must be 2-50 characters')
    .escape(),
  
  body('wattage')
    .notEmpty().withMessage('Wattage is required')
    .isInt({ min: 0, max: 100000 }).withMessage('Wattage must be 0-100000')
    .toInt(),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0, max: 10000000 }).withMessage('Price must be 0-10,000,000')
    .toFloat(),
  
  body('oldPrice')
    .optional()
    .isFloat({ min: 0, max: 10000000 }).withMessage('Old price must be 0-10,000,000')
    .toFloat(),
  
  body('discount')
    .optional()
    .isInt({ min: 0, max: 100 }).withMessage('Discount must be 0-100')
    .toInt(),
  
  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0, max: 1000000 }).withMessage('Stock must be 0-1,000,000')
    .toInt(),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters')
    .escape(),
  
  body('images')
    .optional()
    .custom((value) => {
      if (!Array.isArray(value)) return true;
      if (value.length > 4) throw new Error('Maximum 4 images allowed');
      return true;
    }),
  
  body('images.*')
    .optional()
    .custom((value) => {
      // Accept both URLs and base64 data URLs
      if (!value || typeof value !== 'string') return false;
      const isUrl = /^https?:\/\/.+/.test(value);
      const isDataUrl = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(value);
      if (!isUrl && !isDataUrl) {
        throw new Error('Invalid image format. Must be a URL or base64 data URL');
      }
      return true;
    }),
  
  body('featured')
    .optional()
    .isBoolean().withMessage('Featured must be true or false')
    .toBoolean(),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
  
  handleValidationErrors
];

const updateProductValidation = [
  param('id')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Name must be 3-200 characters')
    .escape(),
  
  body('category')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Category must be 2-50 characters')
    .escape(),
  
  body('wattage')
    .optional()
    .isInt({ min: 0, max: 100000 }).withMessage('Wattage must be 0-100000')
    .toInt(),
  
  body('price')
    .optional()
    .isFloat({ min: 0, max: 10000000 }).withMessage('Price must be 0-10,000,000')
    .toFloat(),
  
  body('stock')
    .optional()
    .isInt({ min: 0, max: 1000000 }).withMessage('Stock must be 0-1,000,000')
    .toInt(),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters')
    .escape(),
  
  handleValidationErrors
];

// Cart validation rules
const addToCartValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1, max: 100 }).withMessage('Quantity must be 1-100')
    .toInt(),
  
  handleValidationErrors
];

// Order validation rules
const createOrderValidation = [
  body('items')
    .isArray({ min: 1 }).withMessage('Order must contain at least 1 item'),
  
  body('items.*.product')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('items.*.quantity')
    .isInt({ min: 1, max: 100 }).withMessage('Quantity must be 1-100')
    .toInt(),
  
  body('shippingAddress.fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  
  body('shippingAddress.phone')
    .trim()
    .notEmpty().withMessage('Phone is required')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone format')
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters'),
  
  body('shippingAddress.address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Address must be 2-200 characters')
    .escape(),
  
  body('shippingAddress.street')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Street must be 2-200 characters')
    .escape(),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty().withMessage('City is required')
    .isLength({ min: 2, max: 50 }).withMessage('City must be 2-50 characters')
    .escape(),
  
  body('shippingAddress.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('State must be 2-50 characters')
    .escape(),
  
  body('shippingAddress.zipCode')
    .optional()
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage('Zip code must be 2-20 characters'),
  
  body('shippingAddress.country')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Country must be 2-50 characters')
    .escape(),
  
  body('subtotal')
    .optional()
    .isFloat({ min: 0 }).withMessage('Invalid subtotal')
    .toFloat(),
  
  body('deliveryCharge')
    .optional()
    .isFloat({ min: 0 }).withMessage('Invalid delivery charge')
    .toFloat(),
  
  body('totalAmount')
    .optional()
    .isFloat({ min: 0 }).withMessage('Invalid total amount')
    .toFloat(),
  
  handleValidationErrors
];

// Review validation rules
const createReviewValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),
  
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')
    .toInt(),
  
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
    .escape(),
  
  body('comment')
    .trim()
    .notEmpty().withMessage('Comment is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters')
    .escape(),
  
  handleValidationErrors
];

// Contact validation rules
const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/).withMessage('Invalid phone format')
    .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters'),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters')
    .escape(),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10-2000 characters')
    .escape(),
  
  handleValidationErrors
];

// Payment validation rules
const initializePaymentValidation = [
  body('orderId')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid order ID'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 100, max: 10000000 }).withMessage('Amount must be 100-10,000,000')
    .toFloat(),
  
  handleValidationErrors
];

// MongoDB ID validation
const mongoIdValidation = [
  param('id')
    .optional()
    .isMongoId().withMessage('Invalid ID format'),
  
  param('productId')
    .optional()
    .isMongoId().withMessage('Invalid product ID format'),
  
  param('reviewId')
    .optional()
    .isMongoId().withMessage('Invalid review ID format'),
  
  handleValidationErrors
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  createProductValidation,
  updateProductValidation,
  addToCartValidation,
  createOrderValidation,
  createReviewValidation,
  contactValidation,
  initializePaymentValidation,
  mongoIdValidation,
  handleValidationErrors
};
