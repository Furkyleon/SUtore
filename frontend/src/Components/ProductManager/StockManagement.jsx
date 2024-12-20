import React, { useState, useEffect } from "react";
import "./StockManagement.css";

const StockManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [stockInputs, setStockInputs] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      setError("");
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Failed to fetch products.");
          return;
        }
        const data = await response.json();
        setProducts(data);
        setStockInputs(
          data.reduce((acc, product) => {
            acc[product.id] = product.stock || 0; // Initialize stock input for each product
            return acc;
          }, {})
        );
      } catch (err) {
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleStockChange = (productId, value) => {
    setStockInputs((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const handleUpdateStock = async (productId) => {
    setError("");
    setSuccessMessage("");

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    const newStock = stockInputs[productId];

    if (!Number.isInteger(parseInt(newStock))) {
      setError("Invalid stock value. Stock must be an integer.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/manage-stock/${productId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({ stock: parseInt(newStock) }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to update stock.");
        return;
      }

      const data = await response.json();
      setSuccessMessage(data.message);

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? { ...product, stock: parseInt(newStock) }
            : product
        )
      );
    } catch (err) {
      setError("An error occurred while updating stock.");
    }
  };

  return (
    <div className="stock-management-wrapper">
      <h1>Stock Management</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {!loading && (
        <div className="products-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <h2>{product.name}</h2>
                <p>Current Stock: {product.stock}</p>
                <div className="stock-input">
                  <label htmlFor={`stock-${product.id}`}>New Stock:</label>
                  <input
                    type="number"
                    id={`stock-${product.id}`}
                    value={stockInputs[product.id]}
                    onChange={(e) =>
                      handleStockChange(product.id, e.target.value)
                    }
                  />
                  <button
                    className="update-stock-btn"
                    onClick={() => handleUpdateStock(product.id)}
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
