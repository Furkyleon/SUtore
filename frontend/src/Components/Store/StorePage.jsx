// StorePage.jsx
import React from 'react';
import './StorePage.css';

const products = [
  {
    id: 1,
    name: "Telephone",
    description: "Good telephone.",
    price: "25000 TL",
    image: "/images/1.jpg"
  },
  {
    id: 2,
    name: "Laptop",
    description: "Expensive laptop.",
    price: "50000 TL",
    image: "/images/2.jpg"
  },
  {
    id: 3,
    name: "Television",
    description: "Great television.",
    price: "35000 TL",
    image:"/images/3.jpg"
  },
];

const StorePage = () => {
  return (
    <div className="store-page">
      <h1>Our Products</h1>
      <div className="product-list">
        {products.map(product => (
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
