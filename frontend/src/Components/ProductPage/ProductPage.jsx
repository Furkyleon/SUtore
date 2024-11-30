import React, { useState, useEffect, useRef } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./ProductPage.css";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  const commentsRef = useRef(null);

  // Fetch product details
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/get_all/`)
      .then((response) => response.json())
      .then((data) => {
        const selectedProduct = data.find(
          (item) => item.id === parseInt(productId)
        );
        setProduct(selectedProduct);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [productId]);

  const addToCart = (serialNumber) => {
    const username = localStorage.getItem("username"); // Retrieve username from localStorage
    const password = localStorage.getItem("password"); // Retrieve password from localStorage
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`; // Base64 encode username:password

    fetch("http://127.0.0.1:8000/cart/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader, // Add the Authorization header
      },
      body: JSON.stringify({
        serial_number: serialNumber,
        quantity: 1, // Default quantity to add
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add item to cart!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item added to cart:", data);
        alert("Product added to cart successfully!");
      })
      .catch((error) => {
        console.error("There is an error:", error);
        alert("There is an error!");
      });
  };

  // Fetch reviews and calculate rating_average
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/products/${productId}/get_reviews/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        return response.json();
      })
      .then((data) => {
        setCommentsList(data); // Update state with fetched reviews

        // Calculate the average rating
        const totalRating = data.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating = data.length > 0 ? totalRating / data.length : 0;
        setProduct((prevProduct) => ({
          ...prevProduct,
          rating_average: averageRating,
        }));
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [productId]);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCommentSubmit = () => {
    if (rating > 0) {
      if (comment || rating > 0) {
        const username = localStorage.getItem("username");
        const password = localStorage.getItem("password");
        const encodedCredentials = btoa(`${username}:${password}`);

        fetch(`http://127.0.0.1:8000/products/${productId}/add_review/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedCredentials}`,
          },
          body: JSON.stringify({ rating, comment }),
        })
          .then((response) => {
            if (response.status === 201) {
              return response.json();
            } else if (response.status === 403) {
              throw new Error("You can only review products you've purchased.");
            } else {
              throw new Error("You have already reviewed this product.");
            }
          })
          .then((newReview) => {
            setCommentsList([...commentsList, newReview]);
            setComment("");
            setRating(0);
            alert("Your review has been submitted successfully.");
          })
          .catch((error) => {
            console.error("Error submitting review:", error);
            alert(error.message);
          });
      } else {
        alert("Please add a comment.");
      }
    } else {
      alert("Please provide a rating.");
    }
  };

  // Scroll to comments section
  const scrollToComments = () => {
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  if (!product) {
    return <p>Product not found.</p>;
  }

  return (
    <div className="product-page-container">
      <div className="product-full-width">
        <div className="product-image-section">
          <img
            src={"/images/" + product.category + ".png"}
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
                  return <FaStar />;
                } else if (
                  product.rating_average > index &&
                  product.rating_average < index + 1
                ) {
                  return <FaStarHalfAlt />;
                } else {
                  return <FaRegStar />;
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
                <span className="original-price">{product.price + " TL"}</span>
                <span className="discounted-price">
                  {(
                    product.price -
                    product.price * (product.discount / 100)
                  ).toFixed(0) + " TL"}
                </span>
                <span className="discount-rate">
                  {product.discount + " % OFF"}
                </span>
              </>
            ) : (
              <span className="discounted-price">{product.price + " TL"}</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

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
          commentsList.map((c, index) => (
            <div key={index} className="comment">
              <p>User ID: {c.user}</p>
              <p className="comment-rating">Rating: {c.rating} ★</p>
              {c.comment.length > 0 && (
                <p className="comment-text">Comment: {c.comment}</p>
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
