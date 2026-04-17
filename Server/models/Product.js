const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    mainImg: {
      type: String,
      required: [true, 'Main image URL is required'],
    },
    carousel: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'],
    },
    sizes: {
      type: [String],
      default: [],
    },
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      default: 'Unisex',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    discount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
