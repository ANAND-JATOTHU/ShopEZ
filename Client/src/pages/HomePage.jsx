import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminConfig } from '../services/api';
import { fetchProducts } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../components/ProductCard.css';
import './HomePage.css';

const categories = [
  { name: 'mobiles', icon: '📱', label: 'Mobiles' },
  { name: 'Electronics', icon: '💻', label: 'Electronics' },
  { name: 'Sports-Equipment', icon: '🏏', label: 'Sports' },
  { name: 'Fashion', icon: '👗', label: 'Fashion' },
  { name: 'Groceries', icon: '🛒', label: 'Groceries' },
];

const HomePage = () => {
  const [banners, setBanners] = useState([
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80',
  ]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, adminRes] = await Promise.allSettled([
          fetchProducts({}),
          fetchAdminConfig(),
        ]);
        if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data);
        if (adminRes.status === 'fulfilled' && adminRes.value.data.banner?.length > 0) {
          setBanners(adminRes.value.data.banner);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Auto-slide banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        {/* Hero Banner */}
        <section className="hero-banner">
          <div className="banner-container">
            {banners.map((src, i) => (
              <div key={i} className={`banner-slide ${i === currentBanner ? 'active' : ''}`}>
                <img src={src} alt={`Banner ${i + 1}`} onError={(e) => { e.target.src='https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80'; }} />
              </div>
            ))}
            <div className="banner-dots">
              {banners.map((_, i) => (
                <button
                  key={i}
                  id={`banner-dot-${i}`}
                  className={`dot ${i === currentBanner ? 'active' : ''}`}
                  onClick={() => setCurrentBanner(i)}
                />
              ))}
            </div>
            <button className="banner-prev" onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}>‹</button>
            <button className="banner-next" onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}>›</button>
          </div>
        </section>

        {/* Categories */}
        <section className="home-section">
          <div className="container">
            <h2 className="section-title">Shop by Category</h2>
            <div className="categories-grid">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  id={`cat-${cat.name}`}
                  className="category-card"
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="home-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Products</h2>
              <button className="view-all-btn" id="view-all-products" onClick={() => navigate('/products')}>
                View All →
              </button>
            </div>
            {loading ? (
              <div className="spinner" />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>No products available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </section>

        {/* Promo banner */}
        <section className="promo-section">
          <div className="container">
            <div className="promo-banner">
              <div className="promo-text">
                <h3>🚀 Free Delivery on Orders Above ₹499</h3>
                <p>Shop from thousands of products with fast and reliable delivery</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>Shop Now</button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
