import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          ShopEZ
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            id="search-input"
            placeholder="Search Electronics, Fashion, mobiles, etc,"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" id="search-btn" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div className="user-btn" id="user-menu-btn">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{user.username.split(' ')[0]}</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-menu animate-fade">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>My Orders</Link>
                  <button onClick={handleLogout} className="dropdown-logout">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
              Login
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" id="cart-btn" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
