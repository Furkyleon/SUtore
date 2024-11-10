// src/Components/Categories/CategoriesPage.jsx
import React from 'react';
import './CategoriesPage.css';

const categories = [
  { name: 'Telephone', path: '/categories/Telephone' },
  { name: 'TV', path: '/categories/TV' },
  { name: 'Laptop', path: '/categories/Laptop' },
  { name: 'White', path: '/categories/White' },
  { name: 'Accessory', path: '/categories/Accessory' },
  { name: 'Consoles', path: '/categories/Consoles' },
];

const CategoriesPage = () => {
  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <ul className="category-list">
        {categories.map((category, index) => (
          <li key={index} className="category-item">
            <a href={category.path}>{category.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
