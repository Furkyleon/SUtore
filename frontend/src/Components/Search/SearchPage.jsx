import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import TopRightNotification from "../NotificationModal/TopRightNotification"; // Adjust the path if necessary
import "./SearchPage.css";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortCriterion, setSortCriterion] = useState("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/products/get_all/?query=${encodeURIComponent(
            searchTerm
          )}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [searchTerm]);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
  );

  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortCriterion === "price") {
      return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
    } else if (sortCriterion === "name") {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    } else if (sortCriterion === "popularity") {
      return sortOrder === "asc"
        ? a.popularity - b.popularity
        : b.popularity - a.popularity;
    }
    return 0;
  });

  const addToCart = (serialNumber) => {
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    if (username && username !== "null" && password && password !== "null") {
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
        .then((data) => {
          if (data.order_id) {
            localStorage.setItem("order_id", data.order_id);
            console.log("Order ID saved locally.");
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
    } else {
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

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleCriterionChange = (event) => {
    setSortCriterion(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="search-page-wrapper">
      <h1>Search results for "{queryParams.get("query")}"</h1>
      {sortedProducts.length > 0 ? (
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
            {sortedProducts.map((product) => (
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
            ))}
          </div>
        </>
      ) : (
        <p className="no-results">
          No products found for "{queryParams.get("query")}".
        </p>
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

export default SearchPage;
