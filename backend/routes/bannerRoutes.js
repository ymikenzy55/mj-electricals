const express = require('express');
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getBanners);
router.post('/', protect, authorize('admin', 'superadmin'), createBanner);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateBanner);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteBanner);

module.exports = router;
