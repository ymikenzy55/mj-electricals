const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createAdmin,
  updateUserRole,
  deactivateUser,
  getDashboardStats,
  getFinancialAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Stats accessible by both admin and superadmin
router.get('/stats', protect, authorize('admin', 'superadmin'), getDashboardStats);
router.get('/analytics', protect, authorize('admin', 'superadmin'), getFinancialAnalytics);

// Super admin only routes
router.use(protect, authorize('superadmin'));
router.get('/users', getAllUsers);
router.post('/create-admin', createAdmin);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/deactivate', deactivateUser);

module.exports = router;
