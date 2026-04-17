const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['COD', 'netbanking', 'upi', 'card'],
      default: 'COD',
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    status: {
      type: String,
      enum: ['Ordered', 'In-transit', 'Delivered', 'Cancelled'],
      default: 'Ordered',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
