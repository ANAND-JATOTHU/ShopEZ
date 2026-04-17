import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, addToCart as apiAddToCart, removeCartItem, clearCart as apiClearCart } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  // Load cart when user logs in
  useEffect(() => {
    if (user && user.userType !== 'admin') {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setCartLoading(true);
      const { data } = await fetchCart();
      setCartItems(data);
    } catch (err) {
      console.error('Cart load error:', err);
    } finally {
      setCartLoading(false);
    }
  };

  const addItem = async (product, size = 'M', quantity = 1) => {
    try {
      const payload = {
        productId: product._id,
        title: product.title,
        description: product.description,
        mainImg: product.mainImg,
        size,
        quantity,
        price: Math.round(product.price * (1 - product.discount / 100)),
        discount: product.discount,
      };
      const { data } = await apiAddToCart(payload);
      // Refresh cart
      await loadCart();
      return data;
    } catch (err) {
      throw err;
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (err) {
      throw err;
    }
  };

  const clearCartItems = async () => {
    try {
      await apiClearCart();
      setCartItems([]);
    } catch (err) {
      throw err;
    }
  };

  const cartCount = cartItems.length;

  const cartTotals = cartItems.reduce(
    (acc, item) => {
      const originalPrice = item.price / (1 - item.discount / 100) || item.price;
      acc.totalMRP += Math.round(originalPrice) * item.quantity;
      acc.totalDiscount += Math.round(originalPrice - item.price) * item.quantity;
      acc.finalPrice += item.price * item.quantity;
      return acc;
    },
    { totalMRP: 0, totalDiscount: 0, finalPrice: 0 }
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartCount,
        cartTotals,
        addItem,
        removeItem,
        clearCartItems,
        loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
