import React, { useState, useEffect } from "react";
import TopRightNotification from "../NotificationModal/TopRightNotification"; // Adjust the path if necessary
import "./UpdatePricesPage.css";

const UpdatePricesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [priceInputs, setPriceInputs] = useState({});
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success", // Can be 'success', 'error', or 'warning'
  });

  const showNotification = (message, type = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
          setPriceInputs(
            data.reduce((acc, product) => {
              acc[product.id] = product.price || 0;
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

  const handlePriceChange = (productId, value) => {
    setPriceInputs((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const updatePrice = async (productId) => {
    const newPrice = priceInputs[productId];
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/sales-manager/adjust_product_price/${productId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            new_price: newPrice,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update the price!");
      }

      const data = await response.json();

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                price: data.product.price,
                discount_price: data.product.discount_price, // Ensure the backend includes this field
              }
            : product
        )
      );

      showNotification(
        `Price updated successfully: ${data.product.name} - ${data.product.price.toFixed(
          2
        )} TL`,
        "success"
      );
    } catch (error) {
      console.error("Error updating price:", error);
      showNotification(
        error.message || "There was an error updating the price.",
        "error"
      );
    }
  };

  return (
    <div className="update-prices-page-wrapper">
      <h1>Update Product Prices</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://localhost:8000${product.image || "/placeholder.jpg"}`}
                alt={product.name || "Unnamed Product"}
              />
              <h2>{product.name || "Unnamed Product"}</h2>
              <p className="current-price">
                Current Price: {product.price.toFixed(2)} TL
              </p>
              {product.discount > 0 && (
                <p className="discounted-price">
                  Discounted Price: {product.discount_price.toFixed(2)} TL
                </p>
              )}

              <div className="price-controls">
                <label htmlFor={`price-input-${product.id}`}>
                  New Price (TL):
                </label>
                <input
                  id={`price-input-${product.id}`}
                  type="number"
                  min="0"
                  value={priceInputs[product.id] || ""}
                  onChange={(e) =>
                    handlePriceChange(product.id, parseFloat(e.target.value))
                  }
                />
                <button
                  className="update-btn"
                  onClick={() => updatePrice(product.id)}
                >
                  Update Price
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TopRightNotification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default UpdatePricesPage;
