import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./StockManagement.css";

const StockManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
          setStockInputs(
            data.reduce((acc, product) => {
              acc[product.id] = product.stock || 0;
              return acc;
            }, {})
          );
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

  const handleInputChange = (productId, value) => {
    setStockInputs((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const updateStock = async (productId) => {
    const newStock = stockInputs[productId];
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/manage-stock/${productId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            stock: newStock,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update stock!");

      const data = await response.json();

      // Update products state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                stock: data.stock || product.stock,
              }
            : product
        )
      );

      alert(`Stock updated successfully for "Product ID: ${productId}"`);
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("There was an error updating the stock.");
    }
  };

  return (
    <div className="stock-management-wrapper">
      <h1>Manage Stock</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

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

                <div className="stock-controls">
                  <div className="stock">
                    <label htmlFor={`stock-${product.id}`}>New Stock:</label>
                    <input
                      type="number"
                      id={`stock-${product.id}`}
                      min="0"
                      value={stockInputs[product.id] || "0"}
                      onChange={(e) =>
                        handleInputChange(
                          product.id,
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  <button
                    className="apply-btn"
                    onClick={() => updateStock(product.id)}
                  >
                    Update Stock
                  </button>
                </div>
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

export default StockManagementPage;
