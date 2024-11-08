// StorePage.jsx
import React from 'react';
import './StorePage.css';

const products = [
  {
    id: 1,
    name: "Telephone",
    description: "Good telephone.",
    price: "25000 TL",
    image: "/images/1.png"
  },
  {
    id: 2,
    name: "Television",
    description: "Great television.",
    price: "35000 TL",
    image: "/images/2.png"
  },
  {
    id: 3,
    name: "Laptop",
    description: "Perfomance laptop.",
    price: "50000 TL",
    image:"/images/3.png"
  },
  {
    id: 4,
    name: "Xbox",
    description: "Playing games.",
    price: "20000 TL",
    image:"/images/4.png"
  },
  {
    id: 5,
    name: "Toast Machine",
    description: "Hungry solver.",
    price: "1500 TL",
    image:"/images/5.png"
  },
  {
    id: 6,
    name: "Washing Machine",
    description: "Clean clothes.",
    price: "15000 TL",
    image:"/images/6.png"
  },
  {
    id: 7,
    name: "Dishwasher",
    description: "Clean dishes.",
    price: "17000 TL",
    image:"/images/7.png"
  },
  {
    id: 8,
    name: "PS5",
    description: "Game play.",
    price: "40000 TL",
    image:"/images/8.png"
  },
];

const StorePage = () => {
  return (
    <div className="store-page">
      <h1>Products</h1>
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
