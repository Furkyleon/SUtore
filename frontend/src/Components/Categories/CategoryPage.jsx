// src/Components/CategoryPage/CategoryPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import './CategoryPage.css';
import products from '../../data/products';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const filteredProducts = products.filter(product => product.category === categoryName);

  return (
    <div className="category-page">
      <h1>{categoryName}</h1>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p className="price">{product.price}</p>
              <button>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
