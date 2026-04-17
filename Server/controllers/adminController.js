const Admin = require('../models/Admin');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Helper: get or create the single admin config document
const getAdminDoc = async () => {
  let adminDoc = await Admin.findOne();
  if (!adminDoc) adminDoc = await Admin.create({});
  return adminDoc;
};

// @desc    Get admin config (banner, categories)
// @route   GET /api/admin/config
// @access  Admin only
const getAdminConfig = async (req, res) => {
  try {
    const adminDoc = await getAdminDoc();
    res.json(adminDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update banner URL
// @route   PUT /api/admin/banner
// @access  Admin only
const updateBanner = async (req, res) => {
  try {
    const { bannerUrl } = req.body;
    if (!bannerUrl) return res.status(400).json({ message: 'Banner URL required' });
    const adminDoc = await getAdminDoc();
    if (!adminDoc.banner.includes(bannerUrl)) {
      adminDoc.banner.push(bannerUrl);
    }
    await adminDoc.save();
    res.json({ message: 'Banner updated', banner: adminDoc.banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove banner URL
// @route   DELETE /api/admin/banner
// @access  Admin only
const removeBanner = async (req, res) => {
  try {
    const { bannerUrl } = req.body;
    const adminDoc = await getAdminDoc();
    adminDoc.banner = adminDoc.banner.filter((b) => b !== bannerUrl);
    await adminDoc.save();
    res.json({ message: 'Banner removed', banner: adminDoc.banner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ userType: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminConfig, updateBanner, removeBanner, getDashboardStats, getAllUsers };
