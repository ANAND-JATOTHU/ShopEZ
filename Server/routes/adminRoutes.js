const express = require('express');
const router = express.Router();
const {
  getAdminConfig,
  updateBanner,
  removeBanner,
  getDashboardStats,
  getAllUsers,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/config', protect, adminOnly, getAdminConfig);
router.put('/banner', protect, adminOnly, updateBanner);
router.delete('/banner', protect, adminOnly, removeBanner);
router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
