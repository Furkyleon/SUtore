import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./StorePage.css";

const StorePage = () => {
  const [products, setProducts] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");

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
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    fetch("http://127.0.0.1:8000/cart/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        serial_number: serialNumber,
        quantity: 1,
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

  const sortProducts = (products) => {
    return products.slice().sort((a, b) => {
      if (sortCriterion === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else if (sortCriterion === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
        if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
  };

  const handleSortChange = (event) => {
    setSortCriterion(event.target.value);
  };

  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const sortedProducts = sortProducts(products);

  return (
    <div className="store-page-wrapper">
      <h1>All Products</h1>

      <div className="sort-dropdown">
        <label htmlFor="sortCriterion">Sort by: </label>
        <select
          id="sortCriterion"
          value={sortCriterion}
          onChange={handleSortChange}
        >
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>

        <label htmlFor="sortOrder">Order: </label>
        <select id="sortOrder" value={sortOrder} onChange={handleOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div className="product-list">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <Link to={`/product/${product.id}`}>
              <img
                src={"/images/" + product.category + ".png"}
                alt={product.name}
              />
              <h2>{product.name}</h2>
            </Link>
            <p className="price">{product.price + " TL"}</p>
            {product.stock > 0 ? (
              <button onClick={() => addToCart(product.serial_number)}>
                Add to Cart
              </button>
            ) : (
              <span className="out-of-stock-label">Out of Stock!</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePage;
