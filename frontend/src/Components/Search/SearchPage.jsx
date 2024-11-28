import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import "./SearchPage.css";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCriterion, setSortCriterion] = useState("price");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/products/get_all/?query=${encodeURIComponent(
            searchTerm
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [searchTerm]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
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
        alert("Product added to cart successfully!");
      })
      .catch((error) => {
        alert("You are not registered.");
      });
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCriterionChange = (event) => {
    setSortCriterion(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="search-page-wrapper">
      <h1>Search Results for "{queryParams.get("query")}"</h1>
      {sortedProducts.length > 0 ? (
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
        </>
      ) : (
        <p className="no-results">
          No products found for "{queryParams.get("query")}".
        </p>
      )}
    </div>
  );
};

export default SearchPage;
