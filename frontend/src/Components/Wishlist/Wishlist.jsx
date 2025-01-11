import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import TopRightNotification from "../NotificationModal/TopRightNotification";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success", // Can be 'success', 'error', or 'warning'
  });
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    productId: null,
  });

  useEffect(() => {
    const fetchWishlistAndProducts = async () => {
      try {
        const wishlistResponse = await fetch(
          "http://127.0.0.1:8000/wishlist/",
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${btoa(
                `${localStorage.getItem("username")}:${localStorage.getItem(
                  "password"
                )}`
              )}`,
            },
          }
        );

        if (!wishlistResponse.ok) {
          throw new Error("Failed to fetch wishlist.");
        }

        const wishlistData = await wishlistResponse.json();
        setWishlist(
          wishlistData.message === "Your wishlist is empty." ? [] : wishlistData
        );

        const productsResponse = await fetch(
          "http://127.0.0.1:8000/products/get_all/"
        );

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products.");
        }

        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistAndProducts();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  const openConfirmationModal = (productId) => {
    setConfirmation({ isOpen: true, productId });
  };

  const closeConfirmationModal = () => {
    setConfirmation({ isOpen: false, productId: null });
  };

  const confirmRemoveFromWishlist = async () => {
    const productId = confirmation.productId;
    closeConfirmationModal();

    try {
      const response = await fetch("http://127.0.0.1:8000/wishlist/remove/", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(
            `${localStorage.getItem("username")}:${localStorage.getItem(
              "password"
            )}`
          )}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product from wishlist.");
      }

      showNotification("Product removed from wishlist.", "success");
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => item.product !== productId)
      );
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const getProductDetailsById = (productId) => {
    return products.find((p) => p.id === productId) || {};
  };

  if (loading) return <div className="wishlist-loading">Loading...</div>;
  if (error) return <div className="wishlist-error">{error}</div>;

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <ul className="wishlist-items">
          {wishlist.map((item) => {
            const product = getProductDetailsById(item.product);

            return (
              <li key={item.id} className="wishlist-item">
                <Link to={`/product/${item.product}`}>
                  <div className="wishlist-product-image">
                    <img
                      src={`http://localhost:8000${product.image}`}
                      alt={product.name || "Product"}
                      loading="lazy"
                    />
                  </div>
                </Link>

                <Link to={`/product/${item.product}`}>
                  <div className="wishlist-product-name">
                    {product.name || "Product name unavailable"}
                  </div>
                </Link>

                <div className="wishlist-product-price">
                  {product.price ? `${product.price} TL` : "Price unavailable"}
                </div>

                <div className="wishlist-added-date">
                  Added on: {new Date(item.added_date).toLocaleDateString()}
                </div>

                <button
                  className="wishlist-remove-button"
                  onClick={() => openConfirmationModal(item.product)}
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <TopRightNotification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
      <ConfirmationModal
        isOpen={confirmation.isOpen}
        message="Are you sure you want to remove this product from your wishlist?"
        onConfirm={confirmRemoveFromWishlist}
        onCancel={closeConfirmationModal}
      />
    </div>
  );
};

export default Wishlist;
