<<<<<<< HEAD
import React from "react";
import { Link } from "react-router-dom";
import "./StorePage.css";
import products from "../../data/products";
=======
import React from 'react';
import './StorePage.css';
import products from '../../data/products';
>>>>>>> parent of d9cdb476 (categories sidebar and footer etc)

const StorePage = () => {
  return (
    <div className="store-page">
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">{product.price}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;
