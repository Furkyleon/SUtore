// MainPage.jsx
import React from 'react';
import './MainPage.css';
import StorePage from '../Store/StorePage';

const MainPage = () => {

    const handleScroll = () => {
        document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
      };

  return (
    <div className="main-page">
      <header className="header">
        <nav>
          <ul>
            <li><a href="./">Main Page</a></li>
            <li><a href="./login">Login</a></li>
            <li><a href="./register">Register</a></li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <section id="hero" className="hero">
          <h2>SUtore</h2>
          <h3>Store for Sabancı students.</h3>
          <button onClick={handleScroll}><a href="#store">Shop Now!</a></button>
        </section>

        {/* Insert StorePage below the hero section */}
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
