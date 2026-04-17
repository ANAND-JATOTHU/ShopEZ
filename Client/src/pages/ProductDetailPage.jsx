import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImg, setSelectedImg] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchProductById(id);
        setProduct(data);
        setSelectedImg(data.mainImg);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <><Navbar /><div className="page-wrapper"><div className="spinner" /></div></>;
  if (!product) return null;

  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
  const allImages = [product.mainImg, ...(product.carousel || [])].filter(Boolean);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (!selectedSize && product.sizes?.length > 0) { toast.error('Please select a size'); return; }
    try {
      setAdding(true);
      await addItem(product, selectedSize || 'M', 1);
      toast.success('Added to cart!');
    } catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return; }
    if (!selectedSize && product.sizes?.length > 0) { toast.error('Please select a size'); return; }
    try {
      setAdding(true);
      await addItem(product, selectedSize || 'M', 1);
      navigate('/cart');
    } catch { toast.error('Failed'); }
    finally { setAdding(false); }
  };

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <span onClick={() => navigate('/')}>Home</span> /
            <span onClick={() => navigate('/products')}> Products</span> /
            <span className="bc-current"> {product.title}</span>
          </nav>

          <div className="product-detail-layout">
            {/* Image Gallery */}
            <div className="product-gallery">
              <div className="gallery-thumbnails">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    id={`thumb-${i}`}
                    className={`thumb-btn ${selectedImg === img ? 'active' : ''}`}
                    onClick={() => setSelectedImg(img)}
                  >
                    <img src={img} alt={`View ${i + 1}`} onError={(e) => { e.target.src = 'https://via.placeholder.com/60'; }} />
                  </button>
                ))}
              </div>
              <div className="gallery-main">
                <img
                  src={selectedImg}
                  alt={product.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400'; }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info">
              <span className="product-category-tag">{product.category}</span>
              <h1 className="product-detail-title">{product.title}</h1>
              <p className="product-detail-desc">{product.description}</p>

              {/* Price */}
              <div className="detail-price-section">
                <span className="detail-price">₹ {discountedPrice.toLocaleString('en-IN')}</span>
                {product.discount > 0 && (
                  <>
                    <span className="detail-mrp">₹ {product.price.toLocaleString('en-IN')}</span>
                    <span className="detail-discount">{product.discount}% off</span>
                  </>
                )}
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="size-section">
                  <h4>Select Size</h4>
                  <div className="size-options">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        id={`size-${size}`}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender */}
              <p className="detail-gender"><strong>Gender:</strong> {product.gender}</p>

              {/* Action Buttons */}
              <div className="detail-actions">
                <button
                  id="add-to-cart-btn"
                  className="btn btn-accent btn-lg"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  🛒 {adding ? 'Adding...' : 'Add to Cart'}
                </button>
                <button
                  id="buy-now-btn"
                  className="btn btn-primary btn-lg"
                  onClick={handleBuyNow}
                  disabled={adding}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* Highlights */}
              <div className="product-highlights">
                <h4>Highlights</h4>
                <ul>
                  <li>✓ Free delivery on orders above ₹499</li>
                  <li>✓ 7-day return policy</li>
                  <li>✓ Secure payments</li>
                  <li>✓ {product.gender} category</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetailPage;
