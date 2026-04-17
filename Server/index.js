const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB().then(async () => {
  const Product = require('./models/Product');
  const axios = require('axios');
  
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Auto-seeding fake products...');
      const { data } = await axios.get('https://fakestoreapi.com/products');
      const mappedProducts = data.map(p => ({
        title: p.title,
        description: p.description,
        mainImg: p.image,
        carousel: [p.image],
        category: p.category.includes('clothing') ? 'Fashion' : 
                  p.category === 'electronics' ? 'Electronics' : 'mobiles',
        sizes: p.category.includes('clothing') ? ['S', 'M', 'L', 'XL'] : [],
        gender: p.category.includes('men') ? 'Men' : 
                p.category.includes('women') ? 'Women' : 'Unisex',
        price: Math.round(p.price * 80),
        discount: Math.floor(Math.random() * 30)
      }));
      await Product.insertMany(mappedProducts);
      console.log(`${mappedProducts.length} dummy products automatically seeded!`);
    } else {
      console.log(`Database already has ${count} products.`);
    }
  } catch (error) {
    console.error('Failed to auto-seed products:', error.message);
  }
});

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ShopEZ API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ShopEZ Server running on port ${PORT}`);
});
