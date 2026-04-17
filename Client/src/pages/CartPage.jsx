import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, cartTotals, removeItem, cartLoading } = useCart();
  const navigate = useNavigate();

  const handleRemove = async (itemId, title) => {
    try {
      await removeItem(itemId);
      toast.success(`${title} removed from cart`);
    } catch { toast.error('Failed to remove item'); }
  };

  const deliveryCharge = cartTotals.finalPrice > 499 ? 0 : 49;
  const grandTotal = cartTotals.finalPrice + deliveryCharge;

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="container cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            {cartLoading ? (
              <div className="spinner" />
            ) : cartItems.length === 0 ? (
              <div className="empty-state" style={{ padding: '80px 20px' }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some products to your cart</p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/products')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="cart-item" id={`cart-item-${item._id}`}>
                  <div className="cart-item-img">
                    <img src={item.mainImg} alt={item.title} onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-desc">{item.description?.slice(0, 80)}...</p>
                    <div className="cart-item-meta">
                      <span>Size: <strong>{item.size}</strong></span>
                      &nbsp;&nbsp;
                      <span>Quantity: <strong>{item.quantity}</strong></span>
                    </div>
                    <p className="cart-item-price">Price: ₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <button
                      id={`remove-${item._id}`}
                      className="remove-btn"
                      onClick={() => handleRemove(item._id, item.title)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Price Details */}
          {cartItems.length > 0 && (
            <div className="price-details-card">
              <h3>Price Details</h3>
              <div className="price-row">
                <span>Total MRP</span>
                <span>₹ {cartTotals.totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row discount-row">
                <span>Discount on MRP</span>
                <span>- ₹ {cartTotals.totalDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span style={{ color: deliveryCharge === 0 ? '#388e3c' : '#333' }}>
                  {deliveryCharge === 0 ? '+ ₹ 0' : `+ ₹ ${deliveryCharge}`}
                </span>
              </div>
              <div className="price-total">
                <span>Final Price</span>
                <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <button
                id="place-order-btn"
                className="btn btn-primary btn-full"
                style={{ padding: '14px', fontSize: '16px', marginTop: '8px' }}
                onClick={() => navigate('/checkout')}
              >
                Place order
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default CartPage;
