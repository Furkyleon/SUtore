import React, { useState, useEffect, useRef  } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { IoMdSearch } from "react-icons/io";

const Navbar = () => {
const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevents the default form submission behavior
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOpen2, setIsSidebarOpen2] = useState(false);
  const sidebarRef = useRef(null);
  const sidebarRef2 = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleSidebar2 = () => {
    setIsSidebarOpen2((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsSidebarOpen(false);
    }
  };

  const handleClickOutside2 = (event) => {
    if (sidebarRef2.current && !sidebarRef2.current.contains(event.target)) {
      setIsSidebarOpen2(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
        <a
          className="animation"
          href="javascript:void(0)"
          onClick={toggleSidebar}
        >
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
        <a
          className="animation2"
          href="javascript:void(0)"
          onClick={toggleSidebar2}
        >
          <img src="/loginregister.png" alt="" className="logo" />
        </a>

        <a href="/cart" className="SUtore">
          <img src="/navbarlogo.png" alt="" className="logo2" />
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
            <Link to="/categories/Television" onClick={toggleSidebar}>
              Television <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Laptop" onClick={toggleSidebar}>
              Laptop <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/White Goods" onClick={toggleSidebar}>
              White Goods <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Accessory" onClick={toggleSidebar}>
              Accessory <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Console" onClick={toggleSidebar}>
              Console <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Photography" onClick={toggleSidebar}>
              Photography <span className="arrow">›</span>
            </Link>
          </li>
          <li>
            <Link to="/categories/Self Care" onClick={toggleSidebar}>
              Self Care <span className="arrow">›</span>
            </Link>
          </li>
        </ul>
      </div>

      <div
        className={`sidebar2 ${isSidebarOpen2 ? "sidebar2-open" : ""}`}
        ref={sidebarRef2}
      >
        <button className="close-button2" onClick={toggleSidebar2}>
          ×
        </button>
        <h2>Login / Register:</h2>
        <ul className="sidebar-menu2">
          <li>
            <Link to="/login" onClick={toggleSidebar2}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" onClick={toggleSidebar2}>
              Register
            </Link>
          </li> 
          <li> 
          <h2>Order History:</h2>
            <Link to="/orderhistory" onClick={toggleSidebar2}>
              Order History
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
