import { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchProducts, fetchAllOrders, fetchAllUsers, createProduct, updateProduct, deleteProduct, updateOrderStatus, fetchAdminConfig, updateBanner, removeBanner, seedFakeProducts } from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [config, setConfig] = useState({ banner: [] });

  // Form states
  const [productForm, setProductForm] = useState({ _id: '', title: '', description: '', mainImg: '', img1: '', img2: '', img3: '', category: 'Electronics', sizes: [], gender: 'Unisex', price: '', discount: 0 });
  const [bannerUrl, setBannerUrl] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const { data } = await fetchDashboardStats();
      setStats(data);
    } catch { toast.error('Failed to load stats'); }
    finally { setLoading(false); }
  };

  const loadProducts = async () => { const { data } = await fetchProducts({}); setProducts(data); };
  const loadOrders = async () => { const { data } = await fetchAllOrders(); setOrders(data); };
  const loadUsers = async () => { const { data } = await fetchAllUsers(); setUsers(data); };
  const loadConfig = async () => { const { data } = await fetchAdminConfig(); setConfig(data); };

  useEffect(() => {
    if (activeTab === 'dashboard') loadDashboard();
    else if (activeTab === 'products') loadProducts();
    else if (activeTab === 'orders') loadOrders();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'banners') loadConfig();
  }, [activeTab]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const carousel = [productForm.img1, productForm.img2, productForm.img3].filter(Boolean);
      const payload = { ...productForm, carousel, price: Number(productForm.price), discount: Number(productForm.discount) };

      if (productForm._id) {
        await updateProduct(productForm._id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      setProductForm({ _id: '', title: '', description: '', mainImg: '', img1: '', img2: '', img3: '', category: 'Electronics', sizes: [], gender: 'Unisex', price: '', discount: 0 });
      setActiveTab('products');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleProductEdit = (p) => {
    setProductForm({
      _id: p._id, title: p.title, description: p.description, mainImg: p.mainImg,
      img1: p.carousel?.[0] || '', img2: p.carousel?.[1] || '', img3: p.carousel?.[2] || '',
      category: p.category, sizes: p.sizes || [], gender: p.gender, price: p.price, discount: p.discount || 0
    });
    setActiveTab('new_product');
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try { await deleteProduct(id); toast.success('Deleted'); loadProducts(); }
      catch { toast.error('Failed to delete'); }
    }
  };

  const handleOrderStatusUpdate = async (id, status) => {
    try { await updateOrderStatus(id, status); toast.success('Status updated'); loadOrders(); }
    catch { toast.error('Failed to update'); }
  };

  const handleAddBanner = async () => {
    try { await updateBanner(bannerUrl); toast.success('Banner added'); setBannerUrl(''); loadConfig(); }
    catch { toast.error('Failed'); }
  };

  const handleSeedData = async () => {
    try {
      setLoading(true);
      const res = await seedFakeProducts();
      toast.success(res.data.message || 'Seeded successfully!');
      if (activeTab === 'products') loadProducts();
    } catch (err) {
       toast.error(err.response?.data?.message || 'Failed to seed products');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBanner = async (url) => {
    try { await removeBanner(url); toast.success('Banner removed'); loadConfig(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-layout">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <ul className="admin-sidebar-nav">
            {['dashboard', 'users', 'orders', 'products', 'new_product', 'banners'].map(tab => (
              <li key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                {tab.replace('_', ' ').toUpperCase()}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="admin-content">
          <div className="container">
            {loading && activeTab === 'dashboard' ? <div className="spinner" /> : (
              <>
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div>
                    <h2 style={{ marginBottom: 20 }}>Dashboard Overview</h2>
                    <div className="stats-grid">
                      <div className="stat-card"><h3>Total Users</h3><p>{stats.totalUsers}</p></div>
                      <div className="stat-card"><h3>Total Products</h3><p>{stats.totalProducts}</p></div>
                      <div className="stat-card"><h3>Total Orders</h3><p>{stats.totalOrders}</p></div>
                    </div>
                  </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <h2>Manage Products</h2>
                      <button className="btn-admin-primary" onClick={handleSeedData} disabled={loading}>
                        {loading ? 'Seeding...' : '🌱 Seed Dummy Products (FakeStore)'}
                      </button>
                    </div>
                    <div className="admin-products-grid">
                      {products.map(p => (
                        <div key={p._id} className="admin-product-card">
                          <img src={p.mainImg} alt={p.title} />
                          <div className="apc-body">
                            <h4>{p.title}</h4>
                            <p>₹ {p.price} | {p.category}</p>
                            <div className="apc-actions">
                              <button className="btn-admin-outline" onClick={() => handleProductEdit(p)}>Edit</button>
                              <button className="btn-admin-outline" style={{ borderColor: '#f44336', color: '#f44336' }} onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Product Tab */}
                {activeTab === 'new_product' && (
                  <div className="admin-form-container">
                    <h2>{productForm._id ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleProductSubmit} className="admin-card mt-4">
                      <div className="form-group"><input className="admin-form-control" type="text" placeholder="Product Title" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} required /></div>
                      <div className="form-group"><textarea className="admin-form-control" placeholder="Description" rows="3" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} required /></div>
                      <div className="form-group"><input className="admin-form-control" type="text" placeholder="Main Image URL" value={productForm.mainImg} onChange={e => setProductForm({...productForm, mainImg: e.target.value})} required /></div>
                      <div className="form-row">
                        <div className="form-group"><input className="admin-form-control" type="text" placeholder="Carousel Img 1 URL" value={productForm.img1} onChange={e => setProductForm({...productForm, img1: e.target.value})} /></div>
                        <div className="form-group"><input className="admin-form-control" type="text" placeholder="Carousel Img 2 URL" value={productForm.img2} onChange={e => setProductForm({...productForm, img2: e.target.value})} /></div>
                        <div className="form-group"><input className="admin-form-control" type="text" placeholder="Carousel Img 3 URL" value={productForm.img3} onChange={e => setProductForm({...productForm, img3: e.target.value})} /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <select className="admin-form-control" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})}>
                            <option value="mobiles">Mobiles</option><option value="Electronics">Electronics</option><option value="Sports-Equipment">Sports</option><option value="Fashion">Fashion</option><option value="Groceries">Groceries</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <select className="admin-form-control" value={productForm.gender} onChange={e => setProductForm({...productForm, gender: e.target.value})}>
                            <option value="Unisex">Unisex</option><option value="Men">Men</option><option value="Women">Women</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group"><input className="admin-form-control" type="number" placeholder="Price (₹)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required /></div>
                        <div className="form-group"><input className="admin-form-control" type="number" placeholder="Discount (%)" value={productForm.discount} onChange={e => setProductForm({...productForm, discount: e.target.value})} /></div>
                      </div>
                      <div className="form-group">
                        <label style={{color: '#fff', marginBottom: 8, display: 'block'}}>Available Sizes (comma separated)</label>
                        <input className="admin-form-control" type="text" placeholder="e.g. S, M, L, XL" value={productForm.sizes.join(', ')} onChange={e => setProductForm({...productForm, sizes: e.target.value.split(',').map(s=>s.trim())})} />
                      </div>
                      <button type="submit" className="btn-admin-primary mt-2">{productForm._id ? 'Update Product' : 'Add Product'}</button>
                      {productForm._id && <button type="button" className="btn-admin-outline" style={{marginLeft: 10}} onClick={() => setProductForm({ _id: '', title: '', description: '', mainImg: '', img1: '', img2: '', img3: '', category: 'Electronics', sizes: [], gender: 'Unisex', price: '', discount: 0 })}>Cancel Edit</button>}
                    </form>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 style={{ marginBottom: 20 }}>Manage Orders</h2>
                    <div className="admin-card">
                      <table className="admin-table">
                        <thead><tr><th>Order ID</th><th>User</th><th>Item</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o._id}>
                              <td>{o._id.slice(-6)}</td>
                              <td>{o.name}<br/><small>{o.email}</small></td>
                              <td>{o.title} (x{o.quantity})</td>
                              <td>₹ {o.price * o.quantity}</td>
                              <td><span className={`status-badge status-${o.status.toLowerCase()}`}>{o.status}</span></td>
                              <td>
                                <select className="admin-form-control" style={{width: 120, padding: 6}} value={o.status} onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}>
                                  <option value="Ordered">Ordered</option><option value="In-transit">In-transit</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div>
                    <h2 style={{ marginBottom: 20 }}>Registered Users</h2>
                    <div className="admin-card">
                      <table className="admin-table">
                        <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Joined</th></tr></thead>
                        <tbody>
                          {users.map(u => (
                            <tr key={u._id}>
                              <td>{u.username}</td><td>{u.email}</td><td>{u.mobile || '-'}</td>
                              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Banners Tab */}
                {activeTab === 'banners' && (
                  <div>
                    <h2 style={{ marginBottom: 20 }}>Manage Homepage Banners</h2>
                    <div className="admin-card mb-4" style={{display: 'flex', gap: 10, marginBottom: 20}}>
                      <input type="text" className="admin-form-control" placeholder="New Banner Image URL" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} />
                      <button className="btn-admin-primary" onClick={handleAddBanner}>Add Banner</button>
                    </div>
                    <div className="banner-images-grid">
                      {config.banner?.map((b, i) => (
                        <div key={i} className="banner-preview">
                          <img src={b} alt={`banner ${i}`} />
                          <button className="btn-remove-banner" onClick={() => handleRemoveBanner(b)}>X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
