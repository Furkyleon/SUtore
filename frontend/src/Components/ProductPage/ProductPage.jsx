// src/Components/ProductPage/ProductPage.jsx
import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import products from '../../data/products';
import './ProductPage.css';

const ProductPage = () => {
  const { productId } = useParams();
  const product = products.find((item) => item.id === parseInt(productId));
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [commentsList, setCommentsList] = useState([]);
  const commentsRef = useRef(null); // Reference for comments section

  if (!product) {
    return <p>Product not found.</p>;
  }

  const handleAddToCart = () => {
    alert(`Added ${quantity} of ${product.name} to the cart.`);
  };

  const handleCommentSubmit = () => {
    if (comment && rating > 0) {
      const newComment = { rating, text: comment, approved: false };
      setCommentsList([...commentsList, newComment]);
      setComment('');
      setRating(0);
      alert('Your comment has been submitted and is awaiting approval.');
    } else {
      alert('Please add both a comment and a rating.');
    }
  };

  const scrollToComments = () => {
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="product-page">
      <div className="product-full-width">
        {/* Product Image and Details */}
        <div className="product-image-section">
          <img src={product.image} alt={product.name} />
          <button className="top-seller">Top Seller</button>
          <p className="saved-count">8 times saved</p>
        </div>
        <div className="product-details-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-code">Product Code: {product.serialNumber || "123456789"}</p>
          <div className="rating" onClick={scrollToComments} style={{ cursor: 'pointer' }}>
            <span className="stars">★★★★☆</span>
            <span className="review-count">
              (1 Review) <span className="review-arrow">▼</span>
            </span>
            <div className="rating-tooltip">Click to view comments</div>
          </div>
          <div className="price-section">
            <span className="original-price">{product.originalPrice || "42000 TL"}</span>
            <span className="discounted-price">{product.price}</span>
            <span className="discount-rate">16.67% OFF</span>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <div className="additional-info">
            <p><strong>Distributor:</strong> {product.distributor || "FITFIYATHOME"}</p>
            <p><strong>Shipping:</strong> 1-2 business days</p>
          </div>
        </div>
      </div>

      {/* Comments Section with reference for scrolling */}
      <div ref={commentsRef} className="comments-section">
        <h2>Customer Reviews</h2>
        {commentsList.length > 0 ? (
          commentsList.map((c, index) => (
            <div key={index} className="comment">
              <p className="comment-text">{c.text}</p>
              <p className="comment-rating">Rating: {c.rating} ★</p>
              {!c.approved && <p className="comment-awaiting-approval">(Awaiting approval)</p>}
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to review this product!</p>
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
