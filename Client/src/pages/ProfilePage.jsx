import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import './OrdersPage.css'; // Inherits some layouts from existing CSS

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    pincode: user?.pincode || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await updateUserProfile(form);
      updateUser(data);
      toast.success('Profile updated successfully');
      setForm(prev => ({ ...prev, password: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Navbar />
      <div className="page-wrapper">
        <div className="container profile-layout">
          {/* Profile Card Summary */}
          <div className="profile-card">
            <div className="profile-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <h3 className="profile-name">{user.username}</h3>
            <p className="profile-email">{user.email}</p>
            <div className="profile-info">
              <p><strong>Mobile:</strong> {user.mobile || 'Not added'}</p>
              <p><strong>Pincode:</strong> {user.pincode || 'Not added'}</p>
              <p><strong>Joined:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="checkout-form-card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 20, marginBottom: 20, borderBottom: '1px solid #eee', paddingBottom: 12 }}>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="username" className="form-control" value={form.username} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input type="tel" name="mobile" className="form-control" value={form.mobile} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" className="form-control" rows="3" value={form.address} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input type="text" name="pincode" className="form-control" value={form.pincode} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input type="password" name="password" className="form-control" value={form.password} onChange={handleChange} placeholder="Min 6 chars" />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 10 }}>
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
