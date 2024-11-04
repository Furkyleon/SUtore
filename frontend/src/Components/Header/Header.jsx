import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import { FaUser, FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();

  // Hide header on login and register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">
          <img src="/logo.png" alt="Logo" className="logo" />
        </Link>
      </div>
      <nav className="nav-links">
        <Link to="/store" className="nav-link">Store</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </nav>
      <div className="header-icons">
        <FaUser className="icon" />
        <FaShoppingCart className="icon" />
      </div>
    </header>
  );
};

export default Header;
