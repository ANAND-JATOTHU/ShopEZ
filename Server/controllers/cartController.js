const Cart = require('../models/Cart');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, title, description, mainImg, quantity, size, price, discount } = req.body;

    // Check if item already in cart for this user
    const existing = await Cart.findOne({ userId: req.user._id, productId, size });
    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await Cart.create({
      userId: req.user._id,
      productId,
      title,
      description,
      mainImg,
      quantity: quantity || 1,
      size: size || 'M',
      price,
      discount: discount || 0,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const item = await Cart.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });

    item.quantity = req.body.quantity || item.quantity;
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findOne({ _id: req.params.id, userId: req.user._id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
