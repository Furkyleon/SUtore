import React, { useState, useEffect, useRef } from "react";
import "./MainPage.css";
import StorePage from "../Store/StorePage";

const MainPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleScroll = () => {
    document.getElementById("store").scrollIntoView({ behavior: "smooth" });
  };

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
    <div className="main-page">
      <header className="header">
        <nav className="nav-left">
          <ul>
            <li>
              <a href="/">Main Page</a>
            </li>
          </ul>
          <ul>
            <li ref={dropdownRef}>
              <p onClick={toggleDropdown}>Categories</p>
              {isDropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <a href="/categories/Telephone">Telephone</a>
                  </li>
                  <li>
                    <a href="/categories/Television">TV</a>
                  </li>
                  <li>
                    <a href="/categories/Laptop">Laptop</a>
                  </li>
                  <li>
                    <a href="/categories/White">White</a>
                  </li>
                  <li>
                    <a href="/categories/Accessory">Accessory</a>
                  </li>
                  <li>
                    <a href="/categories/Consoles">Consoles</a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className="nav-right">
          <a href="./login">Login</a>
          <a href="./register">Register</a>
        </div>
      </header>

      <main className="content">
        <section id="hero" className="hero">
          <h2>SUtore</h2>
          <h3>Store for Sabancı students.</h3>
          <button onClick={handleScroll}>
            <p>Shop Now!</p>
          </button>
        </section>

        <section id="store">
          <StorePage />
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2024 SUtore. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;
