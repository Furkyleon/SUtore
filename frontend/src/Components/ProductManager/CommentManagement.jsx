import React, { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import "./CommentManagement.css";

const ManageCommentsPage = () => {
  const [products, setProducts] = useState([]); // Store all products
  const [selectedProductId, setSelectedProductId] = useState(""); // Store the selected product ID
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  const handleFetchReviews = async () => {
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!selectedProductId) {
      setError("Please select a product.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/products/${selectedProductId}/get_reviews/`
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to fetch reviews.");
        return;
      }

      const data = await response.json();
      setReviews(data);
      if (data.length === 0) {
        setSuccessMessage("No reviews available for this product.");
      }
    } catch (err) {
      setError("An error occurred while fetching reviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (reviewId) => {
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/reviews/${reviewId}/approve/`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to approve review.");
        return;
      }

      // Update UI
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, comment_status: "Approved" }
            : review
        )
      );
      setSuccessMessage("Review approved successfully!");
    } catch (err) {
      setError("An error occurred while approving the review.");
    }
  };

  return (
    <div className="manage-comments-wrapper">
      <h1>Manage Comments</h1>

      <div className="product-select">
        <label htmlFor="product-select">Select a Product:</label>
        <select
          id="product-select"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="" disabled>
            Choose a product
          </option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (ID: {product.id})
            </option>
          ))}
        </select>
        <button onClick={handleFetchReviews} className="fetch-reviews-btn">
          Fetch Reviews
        </button>
      </div>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {reviews.length > 0 && (
        <div className="reviews-list">
          <h2>Reviews</h2>
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p>
                <strong>Username:</strong> {review.username}
              </p>
              <p>
                <strong>Review:</strong> {review.comment}
              </p>
              <p>
                <strong>Status:</strong> {review.comment_status}
              </p>
              {review.comment_status !== "Approved" && (
                <button
                  onClick={() => handleApproveReview(review.id)}
                  className="approve-btn"
                >
                  <FaCheckCircle /> Approve
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCommentsPage;
