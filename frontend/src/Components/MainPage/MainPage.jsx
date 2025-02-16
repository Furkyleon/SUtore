import React from 'react';
import './MainPage.css';
import StorePage from '../Store/StorePage';

const MainPage = () => {
  const handleScroll = () => {
    document.getElementById('store').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="main-page">
      <main className="contentm">
        <section id="hero" className="hero">
          <h2>SUtore</h2>
          <h3>Store for Sabancı students.</h3>
          <button onClick={handleScroll}>Shop Now!</button>
        </section>
        <section id="store">
          <StorePage />
        </section>
      </main>
    </div>
  );
};

export default MainPage;
