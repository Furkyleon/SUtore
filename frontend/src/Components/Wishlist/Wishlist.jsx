import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlistAndProducts = async () => {
      try {
        // Fetch wishlist
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
          const errorData = await wishlistResponse.json();
          if (errorData.message === "Your wishlist is empty.") {
            setWishlist([]);
          } else {
            throw new Error(errorData.message || "Something went wrong.");
          }
        } else {
          const wishlistData = await wishlistResponse.json();
          setWishlist(wishlistData);
        }

        // Fetch all products
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

  const getProductNameById = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : "Product name unavailable";
  };

  const getProductImageById = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.image : "Product image unavailable";
  };

  const getProductPriceById = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.price : "Product image unavailable";
  };

  if (loading)
    return <div className="wishlist-loading">Loading your wishlist...</div>;
  if (error) return <div className="wishlist-error">{error}</div>;

  return (
    <div className="wishlist-container">
      <h1>Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <ul className="wishlist-items">
          {wishlist.map((item) => (
            <li key={item.id} className="wishlist-item">
              <Link to={`/product/${item.product}`}>
                <div className="wishlist-product-image">
                  <img
                    src={`http://localhost:8000${getProductImageById(
                      item.product
                    )}`}
                    alt={getProductNameById(item.product)}
                  />
                </div>
              </Link>

              <Link to={`/product/${item.product}`}>
                <div className="wishlist-product-name">
                  {getProductNameById(item.product)}
                </div>
              </Link>

              <div className="wishlist-product-name">
                {getProductPriceById(item.product) + " TL"}
              </div>

              <div className="wishlist-added-date">
                Added on: {new Date(item.added_date).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
