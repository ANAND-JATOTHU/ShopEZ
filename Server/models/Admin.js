const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    banner: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
        'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
      ],
    },
    categories: {
      type: [String],
      default: ['mobiles', 'Electronics', 'Sports-Equipment', 'Fashion', 'Groceries'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
