const rateLimit = require('express-rate-limit');

// General API rate limiter - 1000 requests per 15 minutes (very generous for normal browsing)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth routes - 20 attempts per 15 minutes PER EMAIL
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window per email
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => {
    // Rate limit by email instead of IP
    return req.body.email || req.ip;
  }
});

// Password reset limiter - 3 attempts per hour PER EMAIL
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour per email
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  }
});

// Payment limiter - 10 attempts per hour
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact/Feedback limiter - 5 messages per hour PER EMAIL
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 messages per hour per email
  message: {
    success: false,
    message: 'Too many messages sent, please try again after 1 hour.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  paymentLimiter,
  messageLimiter
};
