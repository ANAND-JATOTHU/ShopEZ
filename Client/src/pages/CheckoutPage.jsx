import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder, generateOrder, verifyPayment } from '../services/api';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cartItems, cartTotals, clearCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.username || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    address: user?.address || '',
    pincode: user?.pincode || '',
    paymentMethod: 'COD',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const deliveryCharge = cartTotals.finalPrice > 499 ? 0 : 49;
  const grandTotal = cartTotals.finalPrice + deliveryCharge;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (orderData) => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }

    try {
      const { data: order } = await generateOrder(grandTotal);

      const options = {
        key: 'rzp_test_TYe4WeV3D6b5d9', // Use environment variable in production
        amount: order.amount,
        currency: order.currency,
        name: 'ShopEZ',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            // Payment verified, place order
            await placeOrder(orderData);
            await clearCartItems();
            toast.success('Payment successful! Order placed 🎉');
            navigate('/orders');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.mobile,
        },
        theme: { color: '#2874f0' },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      toast.error('Failed to initiate payment');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error('Your cart is empty'); return; }
    
    const orderData = { ...form, items: cartItems };

    if (form.paymentMethod === 'card' || form.paymentMethod === 'netbanking' || form.paymentMethod === 'upi') {
      await handleRazorpayPayment(orderData);
      return;
    }

    // Handle COD
    try {
      setLoading(true);
      await placeOrder(orderData);
      await clearCartItems();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="page-wrapper">
          <div className="empty-state container">
            <h3>No items to checkout</h3>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/products')}>
              Shop Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="container checkout-layout">
          {/* Delivery Form */}
          <div className="checkout-form-card">
            <h2>Delivery Details</h2>
            <form onSubmit={handleSubmit} id="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkout-name">Full Name</label>
                  <input type="text" id="checkout-name" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="checkout-mobile">Mobile Number</label>
                  <input type="tel" id="checkout-mobile" name="mobile" className="form-control" value={form.mobile} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="checkout-email">Email</label>
                <input type="email" id="checkout-email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="checkout-address">Full Address</label>
                <textarea id="checkout-address" name="address" className="form-control" rows="3" value={form.address} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="checkout-pincode">Pincode</label>
                <input type="text" id="checkout-pincode" name="pincode" className="form-control" value={form.pincode} onChange={handleChange} required />
              </div>

              <h3 className="payment-title">Payment Method</h3>
              <div className="payment-options">
                {[
                  { value: 'COD', label: '💵 Cash on Delivery' },
                  { value: 'netbanking', label: '🏦 Net Banking' },
                  { value: 'upi', label: '📱 UPI' },
                  { value: 'card', label: '💳 Credit/Debit Card' },
                ].map((opt) => (
                  <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      id={`pay-${opt.value}`}
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={handleChange}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>

              <button type="submit" id="confirm-order-btn" className="btn btn-primary btn-full" style={{ padding: '14px', fontSize: '16px', marginTop: '20px' }} disabled={loading}>
                {loading ? 'Placing Order...' : `Confirm Order • ₹ ${grandTotal.toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <img src={item.mainImg} alt={item.title} onError={(e) => { e.target.src='https://via.placeholder.com/50'; }} />
                <div>
                  <p className="summary-item-title">{item.title}</p>
                  <p className="summary-item-meta">Size: {item.size} | Qty: {item.quantity}</p>
                  <p className="summary-item-price">₹ {(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
            <div className="summary-totals">
              <div className="price-row"><span>Total MRP</span><span>₹ {cartTotals.totalMRP.toLocaleString('en-IN')}</span></div>
              <div className="price-row"><span>Discount</span><span style={{ color: '#388e3c' }}>- ₹ {cartTotals.totalDiscount.toLocaleString('en-IN')}</span></div>
              <div className="price-row"><span>Delivery</span><span>{deliveryCharge === 0 ? 'FREE' : `₹ ${deliveryCharge}`}</span></div>
              <div className="price-total"><span>Total</span><span>₹ {grandTotal.toLocaleString('en-IN')}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
