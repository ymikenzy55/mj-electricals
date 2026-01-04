const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { authLimiter, passwordResetLimiter } = require('../middleware/rateLimiter');
const { 
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require('../middleware/validator');
const { 
  register, 
  login, 
  getMe, 
  updatePassword, 
  updateProfile,
  forgotPassword,
  resetPassword,
  googleCallback 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Apply strict rate limiting and validation to auth routes
router.post('/register', authLimiter, registerValidation, register);
router.post('/login', authLimiter, loginValidation, login);
router.post('/forgot-password', passwordResetLimiter, forgotPasswordValidation, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPasswordValidation, resetPassword);

// Protected routes (no extra rate limiting needed)
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);
router.put('/profile', protect, updateProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false 
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/pages/login.html?error=google_auth_failed'
  }),
  googleCallback
);

module.exports = router;
