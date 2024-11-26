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

  const addToCart = (serialNumber) => {

    const username = localStorage.getItem("username"); // Retrieve email from localStorage
    const password = localStorage.getItem("password"); // Retrieve password from localStorage
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`; // Base64 encode email:password
    fetch("http://127.0.0.1:8000/cart/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader, // Add the Authorization header
      },
      body: JSON.stringify({
        serial_number: serialNumber,
        quantity: 1, // Default quantity to add
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item added to cart:", data);
        alert("Product added to cart successfully!");
      })
      .catch((error) => {
        console.error("This product is out of stock:", error);
        alert("This product is out of stock.");
      });
  };
  

  return (
    <div className="store-page-wrapper">
      <h1>All Products</h1>
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
            <button onClick={() => addToCart(product.serial_number)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;
