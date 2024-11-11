<<<<<<< HEAD
// MainPage.jsx
import React from 'react';
import './MainPage.css';
import Navbar from '../NavigationBar/navbar'; // Import Navbar correctly
import StorePage from '../Store/StorePage';
=======
import React, { useState, useEffect, useRef } from "react";
import "./MainPage.css";
import StorePage from "../Store/StorePage";
>>>>>>> a25850565b1c5cc3dd76e08d61c8af0e7be8f4c5

const MainPage = () => {
  const handleScroll = () => {
    document.getElementById("store").scrollIntoView({ behavior: "smooth" });
  };

<<<<<<< HEAD
  return (
    <div className="main-page">
      <Navbar /> {/* Navbar component is now reusable */}
=======
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
>>>>>>> a25850565b1c5cc3dd76e08d61c8af0e7be8f4c5

      <main className="content">
        <section id="hero" className="hero">
          <h2>SUtore</h2>
          <h3>Store for Sabancı students.</h3>
<<<<<<< HEAD
          <button onClick={handleScroll}>Shop Now!</button>
=======
          <button onClick={handleScroll}>
            <p>Shop Now!</p>
          </button>
>>>>>>> a25850565b1c5cc3dd76e08d61c8af0e7be8f4c5
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
