import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import "./Navbar.css";
import TopRightNotification from "../NotificationModal/TopRightNotification";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarOpen2, setIsSidebarOpen2] = useState(false);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  const sidebarRef = useRef(null);
  const sidebarRef2 = useRef(null);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

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

  const handleLogout = () => {
    localStorage.setItem("username", null);
    localStorage.setItem("password", null);
    localStorage.setItem("order_id", null);
    localStorage.setItem("role", null);

    setNotification({
      isOpen: true,
      message: "You have been logged out.",
      type: "success",
    });

    setTimeout(() => {
      navigate("/");
      setIsSidebarOpen2(false);
    }, 2000);
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/categories/get_all/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories.");
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside2);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
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
        <p className="animation" onClick={toggleSidebar}>
          Categories
        </p>
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
        <p className="animation2" onClick={toggleSidebar2}>
          <img src="/userprofile.png" alt="" className="logo" />
        </p>
        {localStorage.getItem("role") !== "sales_manager" &&
          localStorage.getItem("role") !== "product_manager" && (
            <a href="/cart" className="SUtore">
              <img src="/navbarlogo.png" alt="" className="logo2" />
            </a>
          )}
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
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                to={`/categories/${encodeURIComponent(category.name)}`}
                onClick={toggleSidebar}
              >
                {category.name} <span className="arrow">›</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`sidebar2 ${isSidebarOpen2 ? "sidebar2-open" : ""}`}
        ref={sidebarRef2}
      >
        <button className="close-button2" onClick={toggleSidebar2}>
          ×
        </button>
        <h2>
          {localStorage.getItem("username") === "null" ||
          !localStorage.getItem("username")
            ? "Welcome!"
            : `Welcome ${localStorage.getItem("username")}!`}
        </h2>
        <ul className="sidebar-menu2">
          {localStorage.getItem("username") === "null" && (
            <div className="register-login">
              <li>
                <Link to="/register" onClick={toggleSidebar2}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={toggleSidebar2}>
                  Login
                </Link>
              </li>
            </div>
          )}

          {localStorage.getItem("username") !== "null" &&
            localStorage.getItem("username") && (
              <div>
                {localStorage.getItem("role") === "sales_manager" && (
                  <li className="sales-manager">
                    <p className="admin">Admin Interface:</p>
                    <Link to="/sales-manager" onClick={toggleSidebar2}>
                      Sales Manager Page
                    </Link>
                  </li>
                )}

                {localStorage.getItem("role") === "product_manager" && (
                  <li className="product-manager">
                    <p className="admin">Admin Interface:</p>
                    <Link to="/product-manager" onClick={toggleSidebar2}>
                      Product Manager Page
                    </Link>
                  </li>
                )}

                {localStorage.getItem("role") === "customer" && (
                  <li>
                    <Link to="/profile" onClick={toggleSidebar2}>
                      Profile
                    </Link>
                    <Link to="/wishlist" onClick={toggleSidebar2}>
                      Wishlist
                    </Link>
                    <Link to="/order-history" onClick={toggleSidebar2}>
                      Order History
                    </Link>
                  </li>
                )}

                <li>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </li>
              </div>
            )}
        </ul>
      </div>

      {/* TopRightNotification */}
      <TopRightNotification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        customClass="custom-logout-notification"
      />
    </div>
  );
};

export default Navbar;
