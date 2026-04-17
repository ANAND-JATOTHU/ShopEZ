import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('shopez_user');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getUserProfile = () => API.get('/auth/profile');
export const updateUserProfile = (data) => API.put('/auth/profile', data);

// ---- Products ----
export const fetchProducts = (params) => API.get('/products', { params });
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const seedFakeProducts = () => API.post('/products/seed'); // ADMIN SEED

// ---- Cart ----
export const fetchCart = () => API.get('/cart');
export const addToCart = (data) => API.post('/cart', data);
export const updateCartItem = (id, data) => API.put(`/cart/${id}`, data);
export const removeCartItem = (id) => API.delete(`/cart/${id}`);
export const clearCart = () => API.delete('/cart/clear');

// ---- Orders ----
export const placeOrder = (data) => API.post('/orders', data);
export const fetchMyOrders = () => API.get('/orders/myorders');
export const fetchAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const cancelOrder = (id) => API.delete(`/orders/${id}`);

// ---- Admin ----
export const fetchAdminConfig = () => API.get('/admin/config');
export const updateBanner = (bannerUrl) => API.put('/admin/banner', { bannerUrl });
export const removeBanner = (bannerUrl) => API.delete('/admin/banner', { data: { bannerUrl } });
export const fetchDashboardStats = () => API.get('/admin/stats');
export const fetchAllUsers = () => API.get('/admin/users');

// ---- Payments ----
export const generateOrder = (amount) => API.post('/payment/generate-order', { amount });
export const verifyPayment = (paymentData) => API.post('/payment/verify', paymentData);
