import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";

const CategoryPage = ({ addToCart }) => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
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

  // Sort products based on price and sortOrder
  const sortedProducts = products.sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  // Handle sorting order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="category-page-wrapper">
      <h1>{categoryName}</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
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

          <div className="product-list">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} />
                    <h2>{product.name}</h2>
                  </Link>
                  <p>{product.description}</p>
                  <p className="price">{product.price + " TL"}</p>
                  <button onClick={() => addToCart(product)}>
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
