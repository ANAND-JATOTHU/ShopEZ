const Razorpay = require('razorpay');
const crypto = require('crypto');

// Create an order
const generateOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // You should use environment variables ideally, but these are test keys for demo
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_TYe4WeV3D6b5d9', 
      key_secret: process.env.RAZORPAY_SECRET || 'aGZgY6tQo1s0xKjQZXYXG5qW'
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: "receipt_order_" + Math.random().toString(36).substring(7),
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).json({ message: "Some error occurred" });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const secret = process.env.RAZORPAY_SECRET || 'aGZgY6tQo1s0xKjQZXYXG5qW';

    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateOrder, verifyPayment };
