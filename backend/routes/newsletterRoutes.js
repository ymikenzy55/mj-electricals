const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect, authorize } = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.get('/', protect, authorize('admin', 'superadmin'), getSubscribers);

module.exports = router;
