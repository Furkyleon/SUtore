import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import TopRightNotification from "../NotificationModal/TopRightNotification"; // Adjust the path if necessary
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCriterion, setSortCriterion] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const role = localStorage.getItem("role");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/category/${categoryName}/`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "An error occurred while fetching products."
        );
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, categoryName]);

  const sortedProducts = products.slice().sort((a, b) => {
    if (sortCriterion === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortCriterion === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    } else if (sortCriterion === "popularity") {
      return sortOrder === "asc"
        ? a.popularity - b.popularity
        : b.popularity - a.popularity;
    }
    return 0;
  });

  const handleSortChange = (event) => setSortOrder(event.target.value);
  const handleCriterionChange = (event) => setSortCriterion(event.target.value);

  const addToCart = (serialNumber) => {
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    if (username && username !== "null" && password && password !== "null") {
      // Logged-in user logic
      fetch("http://127.0.0.1:8000/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ serial_number: serialNumber, quantity: 1 }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to add item to cart!");
          return response.json();
        })
        .then(() => {
          showNotification("Product added to cart successfully!", "success");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          showNotification(
            "There was an error adding the product to the cart.",
            "error"
          );
        });
    } else {
      // Guest user logic
      let myorderID = localStorage.getItem("order_id");

      if (myorderID && myorderID === "null") {
        myorderID = 0;
        localStorage.setItem("order_id", 0);
      }

      fetch("http://127.0.0.1:8000/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serial_number: serialNumber,
          quantity: 1,
          order_id: myorderID,
        }),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to add item to cart!");
          return response.json();
        })
        .then((data) => {
          if (data.order_id) {
            localStorage.setItem("order_id", data.order_id);
          }
          showNotification("Product added to cart successfully!", "success");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          showNotification(
            "There was an error adding the product to the cart.",
            "error"
          );
        });
    }
  };

  return (
    <div className="category-page-wrapper">
      <h1>{categoryName}</h1>

      {loading && <p>Loading products...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="sort-dropdown">
            <label htmlFor="sortCriterion">Sort by: </label>
            <select
              id="sortCriterion"
              value={sortCriterion}
              onChange={handleCriterionChange}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
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
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={`http://localhost:8000${product.image}`}
                      alt={product.name}
                    />
                    <h2>{product.name}</h2>
                  </Link>
                  <p className="price">
                    {product.discount > 0 ? (
                      <>
                        <span className="original-price">
                          {product.price.toFixed(2)} TL
                        </span>
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
                  {role !== "product_manager" &&
                    role !== "sales_manager" &&
                    (product.stock > 0 ? (
                      <button onClick={() => addToCart(product.serial_number)}>
                        Add to Cart
                      </button>
                    ) : (
                      <span className="out-of-stock-label">Out of Stock!</span>
                    ))}
                </div>
              ))
            ) : (
              <p>No products available in this category.</p>
            )}
          </div>
        </>
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

export default CategoryPage;
