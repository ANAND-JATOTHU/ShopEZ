import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/admin', label: 'Home' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/new-product', label: 'New Product' },
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-inner">
        <span className="admin-brand">ShopEZ <span className="admin-tag">(admin)</span></span>
        <ul className="admin-nav-links">
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <button onClick={handleLogout} className="admin-logout-btn" id="admin-logout">
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
