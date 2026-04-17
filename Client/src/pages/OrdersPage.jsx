import { useState, useEffect } from 'react';
import { fetchMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './OrdersPage.css';

const statusClass = {
  Ordered: 'status-ordered',
  'In-transit': 'status-in-transit',
  Delivered: 'status-delivered',
  Cancelled: 'status-cancelled',
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="container" style={{ padding: '24px 16px 40px' }}>
          <h2 className="orders-page-title">My Orders</h2>
          {loading ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
              <h3>No orders yet</h3>
              <p>You haven't placed any orders. Start shopping!</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card" id={`order-${order._id}`}>
                  <div className="order-card-img">
                    <img src={order.image} alt={order.title} onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} />
                  </div>
                  <div className="order-card-content">
                    <h3>{order.title}</h3>
                    <p className="order-desc">{order.description?.slice(0, 80)}...</p>
                    <div className="order-meta-row">
                      <span>Size: <strong>{order.size}</strong></span>
                      <span>Qty: <strong>{order.quantity}</strong></span>
                      <span>Price: <strong>₹ {order.price.toLocaleString('en-IN')}</strong></span>
                      <span>Payment: <strong>{order.paymentMethod}</strong></span>
                    </div>
                    <div className="order-meta-row" style={{ color: '#ff9f00' }}>
                      <span>Ordered on: {new Date(order.orderDate).toLocaleDateString('en-IN')}</span>
                      <span>Address: {order.address}</span>
                      <span>Pincode: {order.pincode}</span>
                    </div>
                    <div className="order-status-row">
                      <span className={`status-badge ${statusClass[order.status] || 'status-ordered'}`}>
                        Order status: {order.status}
                      </span>
                      {order.deliveryDate && (
                        <span className="delivery-date">
                          Expected: {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OrdersPage;
