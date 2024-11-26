import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
  const [sortCriterion, setSortCriterion] = useState("price"); // State for sorting criterion
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products based on category
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/category/${categoryName}/`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError(data.error || "An error occurred while fetching products.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products. Please try again.");
        setLoading(false);
      });
  }, [categoryName]);

  // Sort products based on selected criterion and order
  const sortedProducts = products.sort((a, b) => {
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

  // Handle sorting order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  // Handle sorting criterion change
  const handleCriterionChange = (event) => {
    setSortCriterion(event.target.value);
  };

  // Function to handle adding a product to the cart
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

  return (
    <div className="category-page-wrapper">
      <h1>{categoryName}</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="sort-dropdown">
            <label htmlFor="sortCriterion">Sort by: </label>
            <select
              id="sortCriterion"
              value={sortCriterion}
              onChange={handleCriterionChange}
            >
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>

            <label htmlFor="sortOrder">Order: </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div className="product-list">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={"/images/" + product.category + ".png"}
                      alt={product.name}
                    />
                    <h2>{product.name}</h2>
                  </Link>
                  <p className="price">{product.price + " TL"}</p>
                  <button
                    onClick={() => {
                      addToCart(product.serial_number);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            ) : (
              <p>No products available in this category.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
