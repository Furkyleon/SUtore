import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DeleteProduct.css";

const DeleteProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setError(data.error || "An error occurred while fetching products.");
        }
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId) => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/delete/${productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: authHeader,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete product!");

      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      setDeleteError("There was an error deleting the product.");
    }
  };

  return (
    <div className="delete-product-page-wrapper">
      <h1>Delete Products</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {deleteError && <p className="error">{deleteError}</p>}

      {!loading && !error && (
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <img
                    src={`http://localhost:8000${
                      product.image || "/placeholder.jpg"
                    }`}
                    alt={product.name || "Unnamed Product"}
                  />
                  <h2>{product.name || "Unnamed Product"}</h2>
                </Link>

                <p className="price">
                  {product.discount > 0 ? (
                    <>
                      <span className="original-price">
                        {product.price.toFixed(2)} TL
                      </span>{" "}
                      <span className="discounted-price">
                        {(
                          product.price -
                          product.price * (product.discount / 100)
                        ).toFixed(2)}{" "}
                        TL
                      </span>
                    </>
                  ) : (
                    <span className="original-price2">
                      {product.price.toFixed(2)} TL
                    </span>
                  )}
                </p>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeleteProductPage;
