const express = require('express');
const router = express.Router();
const { generateOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-order', protect, generateOrder);
router.post('/verify', protect, verifyPayment);

module.exports = router;
