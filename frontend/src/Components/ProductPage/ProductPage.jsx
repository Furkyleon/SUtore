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
  const commentsRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    const fetchProductDetails = async () => {
      try {
        // Fetch all products and select the current product
        const productResponse = await fetch(
          `http://127.0.0.1:8000/products/get_all/`
        );
        const products = await productResponse.json();
        const selectedProduct = products.find(
          (item) => item.id === parseInt(productId)
        );
        setProduct(selectedProduct);

        // Fetch wishlist and check if the product is in it
        const wishlistResponse = await fetch(
          "http://127.0.0.1:8000/wishlist/",
          {
            headers: {
              Authorization: authHeader,
            },
          }
        );
        const wishlistData = await wishlistResponse.json();
        setWishlist(wishlistData);

        // Check if the product is in the wishlist
        setIsInWishlist(
          wishlistData.some((item) => item.product === selectedProduct.id)
        );

        fetch(`http://127.0.0.1:8000/products/${productId}/get_reviews/`)
          .then((response) => response.json())
          .then((data) => setCommentsList(data))
          .catch((error) => console.error("Error fetching reviews:", error));

        fetch(`http://127.0.0.1:8000/products/${productId}/get_rating/`)
          .then((response) => response.json())
          .then((data) =>
            setProduct((prevProduct) => ({
              ...prevProduct,
              rating_average: data.average_rating || 0,
            }))
          )
          .catch((error) => console.error("Error fetching rating:", error));
      } catch (error) {
        console.error("Error fetching product or wishlist data:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const toggleWishlist = async () => {
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

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
        .then(() => alert("Product added to cart successfully!"))
        .catch((error) => {
          console.log("Username:", username, "Password:", password);

          console.error("Error adding to cart:", error);
          alert("There was an error adding the product to the cart.");
        });
    } else {
      let myorderID = localStorage.getItem("order_id"); // Define the variable

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
          // Save the order_id to localStorage
          if (data.order_id) {
            localStorage.setItem("order_id", data.order_id);
            console.log("Order ID saved locally.");
          }
          alert("Product added to cart successfully!");
        })
        .catch((error) => {
          console.error("Error adding to cart:", error);
          console.log(myorderID);
          console.log("Username:");
          alert("There was an error adding the product to the cart.");
        });
    }
  };

  const handleCommentSubmit = () => {
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

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
        window.location.reload(); // Refresh the page
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

  if (!product) return <p>Loading product details...</p>;
  return (
    <div className="product-page-container">
      <div className="product-full-width">
        <div className="product-image-section">
          <img
            src={`http://localhost:8000${product.image}`}
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
          commentsList.map((c, index) => (
            <div key={index} className="comment">
              <p>{c.username}</p>
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
