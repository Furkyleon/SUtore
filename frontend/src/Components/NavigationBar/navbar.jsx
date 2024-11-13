import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <nav className="nav-left">
        <ul>
          <li>
            <a href="/">Main Page</a>
          </li>
        </ul>
        <ul>
          <li>
            <p onClick={toggleSidebar}>Categories</p>
          </li>
        </ul>
      </nav>

      <div className="nav-right">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/cart">Cart</Link>
      </div>

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
          <li>
            <Link to="/categories/Photo" onClick={toggleSidebar}>
              Photo <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Selfcare" onClick={toggleSidebar}>
              Self Care <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Outdoor" onClick={toggleSidebar}>
              Outdoor <span className="arrow">›</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
