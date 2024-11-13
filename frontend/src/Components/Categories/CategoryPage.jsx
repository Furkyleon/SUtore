import React from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";
import products from "../../data/products";

const CategoryPage = ({ addToCart }) => {
  const { categoryName } = useParams();
  const filteredProducts = products.filter(
    (product) => product.category === categoryName
  );

  return (
    <div className="category-page-wrapper">
      <h1>{categoryName}</h1>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
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
