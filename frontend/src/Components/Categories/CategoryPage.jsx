import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";
import products from "../../data/products";

const CategoryPage = ({ addToCart }) => {
  const { categoryName } = useParams();
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order

  // Filter products based on the category
  const filteredProducts = products.filter(
    (product) => product.category === categoryName
  );

  // Sort products based on price and sortOrder
  const sortedProducts = filteredProducts.sort((a, b) => {
    return sortOrder === "asc"
      ? a.price - b.price
      : b.price - a.price;
  });

  // Handle sorting order change
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    <div className="category-page-wrapper">
      <h1>{categoryName}</h1>

      {/* Sort Dropdown */}
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
              <p className="price">{product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
