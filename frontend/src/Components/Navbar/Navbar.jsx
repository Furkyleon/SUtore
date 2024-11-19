import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { IoMdSearch } from "react-icons/io";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log("Search Term:", searchTerm); // Handle search logic here
    // Example: Navigate to a search results page or filter products
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar">
      <div className="nav-left">
        <a href="/">
          <img src="/navbarlogo.png" alt="" className="logo" />
        </a>
        <a href="/" className="SUtore">
          SUtore
        </a>
        <a className = "animation" href="javascript:void(0)" onClick={toggleSidebar}>
          Categories
        </a>
      </div>

      <div className="nav-center">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-button">
          <IoMdSearch />
          </button>
        </form>
      </div>

      <div className="nav-right">
        <a href="/login" className="SUtore">
          Login
        </a>
        <a href="/register" className="SUtore">
          Register
        </a>
        <a href="/cart" className="SUtore">
          <img src="/navbarlogo.png" alt="" className="logo" />
        </a>
      </div>

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
