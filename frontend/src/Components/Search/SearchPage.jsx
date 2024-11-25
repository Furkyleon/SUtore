import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import './SearchPage.css';

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/products/get_all/?query=${encodeURIComponent(
            searchTerm
          )}`
        );

        if (!response.ok) {
          console.error("HTTP Error:", response.status, response.statusText);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchProducts();
    } else {
      setLoading(false); // Avoid infinite loading if no search term
    }
  }, [searchTerm]);

  // Sort products based on price and sortOrder
  const sortedProducts = products.sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  // Handle sorting order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="search-page-wrapper">
      <h1>Search Results for "{searchTerm}"</h1>

      {products.length > 0 ? (
        <>
          {/* Sorting Dropdown */}
          <div className="sort-dropdown">
            <label htmlFor="sortOrder">Sort by Price: </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          {/* Product List */}
          <ul className="product-list">
            {sortedProducts.map((product) => (
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
          </ul>
        </>
      ) : (
        <p className="no-results">No products found.</p>
      )}
    </div>
  );
};

export default SearchPage;
