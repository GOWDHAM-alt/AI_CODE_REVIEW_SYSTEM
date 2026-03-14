import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      {/* Logo */}
      <Link to="/dashboard" style={styles.logo}>
        ⚡ CodeReview AI
      </Link>

      {/* Nav Links */}
      <div style={styles.links}>
        <Link
          to="/dashboard"
          style={location.pathname === '/dashboard' ? styles.activeLink : styles.link}
        >
          Dashboard
        </Link>
        <Link
          to="/history"
          style={location.pathname === '/history' ? styles.activeLink : styles.link}
        >
          History
        </Link>
      </div>

      {/* User info + Logout */}
      <div style={styles.right}>
        <span style={styles.username}>👤 {user?.username}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: '#6366f1',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: '700',
  },
  links: {
    display: 'flex',
    gap: '8px',
  },
  link: {
    color: '#94a3b8',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  activeLink: {
    color: '#6366f1',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    background: '#1e1b4b',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  username: {
    color: '#cbd5e1',
    fontSize: '14px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #475569',
    color: '#94a3b8',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default Navbar;