const Product = require('../models/Product');
const axios = require('axios');

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const { category, gender, sortBy, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortOption = {};
    if (sortBy === 'price_asc') sortOption = { price: 1 };
    else if (sortBy === 'price_desc') sortOption = { price: -1 };
    else if (sortBy === 'discount') sortOption = { discount: -1 };
    else sortOption = { createdAt: -1 }; // default: newest / popularity

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin only
const createProduct = async (req, res) => {
  try {
    const { title, description, mainImg, carousel, category, sizes, gender, price, discount } = req.body;

    if (!title || !description || !mainImg || !category || !price) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const product = await Product.create({
      title, description, mainImg, carousel, category, sizes, gender, price, discount,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin only
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin only
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed database with fake products
// @route   POST /api/products/seed
// @access  Admin only
const seedFakeProducts = async (req, res) => {
  try {
    const { data } = await axios.get('https://fakestoreapi.com/products');
    
    // Map fakestoreapi products to our schema
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
      price: Math.round(p.price * 80), // Approx USD to INR
      discount: Math.floor(Math.random() * 30) // Random 0-30% discount
    }));

    // Delete existing standard exact products or all products? Let's just append
    await Product.insertMany(mappedProducts);

    res.status(201).json({ message: `${mappedProducts.length} products seeded successfully!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, seedFakeProducts };
