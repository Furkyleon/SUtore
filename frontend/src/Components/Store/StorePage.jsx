import React from "react";
import { Link } from "react-router-dom";
import "./StorePage.css";
import products from "../../data/products";

const StorePage = () => {
  return (
    <div className="store-page">
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
            </Link>
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
