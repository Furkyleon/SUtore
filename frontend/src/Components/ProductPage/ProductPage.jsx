import React, { useState, useEffect, useRef } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const commentsRef = useRef(null);

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const role = localStorage.getItem("role");

  const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

  const fetchProductDetails = async () => {
    try {
      const productResponse = await fetch(
        "http://127.0.0.1:8000/products/get_all/"
      );
      const allProducts = await productResponse.json();
      const selectedProduct = allProducts.find(
        (item) => item.id === parseInt(productId)
      );
      setProduct(selectedProduct || null);

      // 2. Fetch the user’s wishlist to see if this product is already in it
      const wishlistResponse = await fetch("http://127.0.0.1:8000/wishlist/", {
        headers: { Authorization: authHeader },
      });
      const wishlistData = await wishlistResponse.json();
      setWishlist(wishlistData);

      // Check if the current product is already in the wishlist
      if (selectedProduct) {
        setIsInWishlist(
          wishlistData.some((item) => item.product === selectedProduct.id)
        );
      }
    } catch (error) {
      console.error("Error fetching product or wishlist data:", error);
    }
  };

  // Fetch product reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${productId}/get_reviews/`
      );
      if (!response.ok) {
        throw new Error("Error fetching reviews");
      }
      const data = await response.json();
      setCommentsList(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Fetch average rating
  const fetchRating = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${productId}/get_rating/`
      );
      if (!response.ok) {
        throw new Error("Error fetching rating");
      }
      const data = await response.json();
      setProduct((prev) =>
        prev ? { ...prev, rating_average: data.average_rating || 0 } : null
      );
    } catch (error) {
      console.error("Error fetching rating:", error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
    fetchRating();
  }, [productId]);

  const toggleWishlist = async () => {
    if (!product) return;

    try {
      const url = isInWishlist
        ? "http://127.0.0.1:8000/wishlist/remove/"
        : "http://127.0.0.1:8000/wishlist/add/";
      const method = isInWishlist ? "DELETE" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to update wishlist");
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const addToCart = (serialNumber) => {
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
        .then(() => alert("Product added to cart successfully!"))
        .catch((error) => {
          console.error("Error adding to cart:", error);
          alert("There was an error adding the product to the cart.");
        });
    } else {
      let myorderID = localStorage.getItem("order_id");
      if (!myorderID || myorderID === "null") {
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
          alert("Product added to cart successfully!");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          alert("There was an error adding the product to the cart.");
        });
    }
  };

  const handleCommentSubmit = () => {
    if (!rating) {
      alert("Please provide a rating.");
      return;
    }

    fetch(`http://127.0.0.1:8000/products/${productId}/add_review/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ rating, comment }),
    })
      .then((response) => {
        if (response.status === 201) return response.json();
        throw new Error(
          response.status === 403
            ? "You can only review products you've purchased."
            : "You have already reviewed this product."
        );
      })
      .then(() => {
        alert("Your review has been submitted successfully.");
        fetchReviews();
        fetchRating();
        setComment("");
        setRating(0);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert(error.message);
      });
  };

  // Scroll to comments section
  const scrollToComments = () => {
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <div className="product-page-container">
      <div className="product-full-width">
        <div className="product-image-section">
          <img
            src={`http://127.0.0.1:8000${product.image}`}
            alt={product.name}
          />
        </div>

        <div className="product-details-section">
          <h1 className="product-name">{product.name}</h1>
          <h2 className="product-model">Product Model: {product.model}</h2>
          <p className="product-code">Serial Number: {product.serial_number}</p>

          <div
            className="rating"
            onClick={scrollToComments}
            style={{ cursor: "pointer" }}
          >
            <span className="stars">
              {Array.from({ length: 5 }).map((_, index) => {
                if (product.rating_average >= index + 1) {
                  return <FaStar key={index} />;
                } else if (
                  product.rating_average > index &&
                  product.rating_average < index + 1
                ) {
                  return <FaStarHalfAlt key={index} />;
                } else {
                  return <FaRegStar key={index} />;
                }
              })}
            </span>
            <span className="rating-average">({product.rating_average})</span>
            <span className="review-count">
              {commentsList.length} Reviews ▼
            </span>
            <div className="rating-tooltip">Click to view comments</div>
          </div>

          <div className="price-section">
            {product.discount > 0 ? (
              <>
                <span className="original-price">{product.price} TL</span>
                <span className="discounted-price">
                  {(
                    product.price -
                    product.price * (product.discount / 100)
                  ).toFixed(0)}{" "}
                  TL
                </span>
                <span className="discount-rate">{product.discount}% OFF</span>
              </>
            ) : (
              <span className="discounted-price">{product.price} TL</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          <div className="add-to-cart-wishlist-section">
            {role !== "product_manager" && role !== "sales_manager" && (
              <>
                <div className="button-stock-section">
                  {product.stock > 0 ? (
                    <button
                      className="add-to-cart-button"
                      onClick={() => addToCart(product.serial_number)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <span className="out-of-stock-label">Out of Stock!</span>
                  )}
                </div>
                <div className="wishlist-icon" onClick={toggleWishlist}>
                  {isInWishlist ? (
                    <FaHeart className="filled-heart" />
                  ) : (
                    <FaRegHeart className="empty-heart" />
                  )}
                </div>
              </>
            )}
          </div>

          <div className="additional-info">
            <p>
              <strong>Stock:</strong> {product.stock}
            </p>
            <p>
              <strong>Distributor:</strong> {product.distributor_info}
            </p>
            <p>
              <strong>Warranty Status:</strong> {product.warranty_status}
            </p>
          </div>
        </div>
      </div>

      <div ref={commentsRef} className="comments-section">
        <h2>Customer Reviews</h2>
        {commentsList.length > 0 ? (
          commentsList.map((review, index) => (
            <div key={index} className="comment">
              <p>{review.username}</p>
              <p className="comment-rating">Rating: {review.rating} ★</p>
              {review.comment && review.comment.length > 0 && (
                <p className="comment-text">Comment: {review.comment}</p>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}

        <div className="add-comment">
          <h3>Leave a Review</h3>
          <label>
            Rating:
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              placeholder="1 - 5"
            />
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
          />
          <button onClick={handleCommentSubmit}>Submit Comment</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
