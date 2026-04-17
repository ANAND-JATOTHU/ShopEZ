import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

  const discountedPrice = Math.round(product.price * (1 - product.discount / 100));

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (user.userType === 'admin') {
      toast.info('Admins cannot add to cart');
      return;
    }
    try {
      setAdding(true);
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M';
      await addItem(product, defaultSize, 1);
      toast.success(`${product.title} added to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card" id={`product-${product._id}`}>
      <div className="product-card-img-wrap">
        <img src={product.mainImg} alt={product.title} loading="lazy" onError={(e) => { e.target.src = 'https://via.placeholder.com/280x280?text=No+Image'; }} />
        {product.discount > 0 && (
          <span className="product-discount-badge">{product.discount}% off</span>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-desc">{product.description.slice(0, 60)}...</p>
        <div className="product-price-row">
          <span className="price-final">₹ {discountedPrice.toLocaleString('en-IN')}</span>
          {product.discount > 0 && (
            <>
              <span className="price-original">₹ {product.price.toLocaleString('en-IN')}</span>
              <span className="discount-tag">({product.discount}% off)</span>
            </>
          )}
        </div>
        <button
          className="btn btn-accent btn-full"
          id={`add-cart-${product._id}`}
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
