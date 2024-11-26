import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StorePage.css";

const StorePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/get_all/")
      .then((response) => {
        if (!response.ok) {
          console.error("HTTP Error:", response.status, response.statusText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => console.error("Fetch Error:", error));
  }, []);

  return (
    <div className="store-page-wrapper">
      <h1>Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img
                src={"/images/" + product.category + ".png"}
                alt={product.name}
              />
              <h2>{product.name}</h2>
            </Link>
            <p>{product.description}</p>
            <p className="price">{product.price + " TL"}</p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;
