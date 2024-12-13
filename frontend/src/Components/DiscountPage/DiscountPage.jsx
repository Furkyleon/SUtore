import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DiscountPage.css";

const DiscountPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [discountInputs, setDiscountInputs] = useState({});

  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCriterion, setSortCriterion] = useState("name");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        const data = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
          setDiscountInputs(
            data.reduce((acc, product) => {
              acc[product.id] = product.discount || 0;
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
    setDiscountInputs((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const applyDiscount = async (productId) => {
    const discountPercentage = discountInputs[productId];
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/sales-manager/apply-discount/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            serial_number: products.find((product) => product.id === productId)
              .serial_number,
            discount_percentage: discountPercentage,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to apply discount!");

      const data = await response.json();

      // Update products state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                price: data.discounted_price || product.price,
                originalPrice: data.original_price || product.originalPrice,
                discount: data.discount_percentage || product.discount,
              }
            : product
        )
      );

      // Update discountInputs state
      setDiscountInputs((prevInputs) => ({
        ...prevInputs,
        [productId]: data.discount_percentage || 0,
      }));

      alert(
        `Discount applied successfully: ${
          data.product_name
        } - ${data.discounted_price.toFixed(2)} TL`
      );
    } catch (error) {
      console.error("Error applying discount:", error);
      alert("There was an error applying the discount.");
    }
  };

  const sortedProducts = products.sort((a, b) => {
    if (sortCriterion === "name") {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    return 0;
  });

  return (
    <div className="discount-page-wrapper">
      <h1>Manage Discounts</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="product-list">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
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
                <div className="discount-controls">
                  <div className="discount">
                    <label htmlFor={`discount-${product.id}`}>
                      Discount (%):
                    </label>
                    <input
                      type="number"
                      id={`discount-${product.id}`}
                      min="0"
                      max="100"
                      value={discountInputs[product.id] || "0"}
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
                    onClick={() => applyDiscount(product.id)}
                  >
                    Apply
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

export default DiscountPage;
