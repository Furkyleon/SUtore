// Navbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import "./Navbar.css";
=======
import "./navbar.css"; // Create or link to a CSS file for Navbar styling
>>>>>>> parent of d9cdb476 (categories sidebar and footer etc)

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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <nav className="nav-left">
        <ul>
          <li>
            <a href="/">Main Page</a>
          </li>
        </ul>
        <ul>
<<<<<<< HEAD
          <li>
            <p onClick={toggleSidebar}>
              Categories
            </p>
=======
          <li ref={dropdownRef}>
            <a href="#!" onClick={toggleDropdown}>
              Categories
            </a>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/categories/Telephone">Telephone</Link>
                </li>
                <li>
                  <Link to="/categories/TV">TV</Link>
                </li>
                <li>
                  <Link to="/categories/Laptop">Laptop</Link>
                </li>
                <li>
                  <Link to="/categories/White">White</Link>
                </li>
                <li>
                  <Link to="/categories/Accessory">Accessory</Link>
                </li>
                <li>
                  <Link to="/categories/Consoles">Consoles</Link>
                </li>
              </ul>
            )}
>>>>>>> parent of d9cdb476 (categories sidebar and footer etc)
          </li>
        </ul>
      </nav>

      <div className="nav-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/cart">Cart</Link>
      </div>
<<<<<<< HEAD

      {/* Sidebar for categories */}
      <div
        className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}
        ref={sidebarRef}
      >
        <button className="close-button" onClick={toggleSidebar}>
          ×
        </button>
        <h2>All categories:</h2>
        <ul className="sidebar-menu">
        <li>
            <Link to="/store" onClick={toggleSidebar}>
              All products <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Telephone" onClick={toggleSidebar}>
              Telephone <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/TV" onClick={toggleSidebar}>
              TV <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Laptop" onClick={toggleSidebar}>
              Laptop <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/White" onClick={toggleSidebar}>
              White Goods <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Accessory" onClick={toggleSidebar}>
              Accessory <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Consoles" onClick={toggleSidebar}>
              Consoles <span className="arrow">›</span>
            </Link>
          </li>
        </ul>
      </div>
=======
>>>>>>> parent of d9cdb476 (categories sidebar and footer etc)
    </header>
  );
};

export default Navbar;
