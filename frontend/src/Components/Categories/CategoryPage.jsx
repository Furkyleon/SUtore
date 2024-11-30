import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCriterion, setSortCriterion] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const sortedProducts = products.sort((a, b) => {
    if (sortCriterion === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortCriterion === "name") {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortCriterion === "popularity") {
      return sortOrder === "asc"
        ? a.popularity - b.popularity
        : b.popularity - a.popularity;
    }
    return 0;
  });

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCriterionChange = (event) => {
    setSortCriterion(event.target.value);
  };

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
      .then(() => {
        alert("Product added to cart successfully!");
      })
      .catch(() => {
        alert("There is an error.");
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
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
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
                  {product.stock > 0 ? (
                    <button
                      onClick={() => {
                        addToCart(product.serial_number);
                      }}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="out-of-stock-label">Out of Stock!</span>
                  )}
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
