// Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; // Create or link to a CSS file for Navbar styling

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <nav className="nav-left">
        <ul>
          <li ref={dropdownRef}>
            <a href="#!" onClick={toggleDropdown}>Categories</a>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/categories/Telephone">Telephone</Link></li>
                <li><Link to="/categories/TV">TV</Link></li>
                <li><Link to="/categories/Laptop">Laptop</Link></li>
                <li><Link to="/categories/White">White</Link></li>
                <li><Link to="/categories/Accessory">Accessory</Link></li>
                <li><Link to="/categories/Consoles">Consoles</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div className="nav-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/cart">Cart</Link>
      </div>
    </header>
  );
};

export default Navbar;
