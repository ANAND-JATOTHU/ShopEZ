const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Place order (from cart or single product)
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { name, mobile, email, address, pincode, items, paymentMethod } = req.body;

    if (!name || !mobile || !email || !address || !pincode || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    // Create one order per item
    const orders = [];
    for (const item of items) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 5);

      const order = await Order.create({
        userId: req.user._id,
        name,
        mobile,
        email,
        address,
        pincode,
        title: item.title,
        description: item.description,
        image: item.mainImg || item.image,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount || 0,
        paymentMethod: paymentMethod || 'COD',
        deliveryDate,
      });
      orders.push(order);
    }

    // Clear cart after order
    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json({ message: 'Order placed successfully', orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin only
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin only
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = 'Cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder };
