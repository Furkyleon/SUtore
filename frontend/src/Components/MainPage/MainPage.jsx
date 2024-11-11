// MainPage.jsx
import React from 'react';
import './MainPage.css';
import Navbar from '../NavigationBar/navbar'; // Import Navbar correctly
import StorePage from '../Store/StorePage';

const MainPage = () => {
  const handleScroll = () => {
    document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="main-page">
      <Navbar /> {/* Navbar component is now reusable */}

      <main className="content">
        <section id="hero" className="hero">
          <h2>SUtore</h2>
          <h3>Store for Sabancı students.</h3>
          <button onClick={handleScroll}>Shop Now!</button>
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
