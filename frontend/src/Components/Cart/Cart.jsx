import React, { useEffect, useState } from "react";
import "./Cart.css";

const Cart = ({ handlePurchase }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/cart/get/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch cart items");
        }
        return response.json();
      })
      .then((data) => setCartItems(data))
      .catch((error) => console.error("Error fetching cart items:", error));
  }, []);
  

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container-wrapper">
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="item-name">{item.product_name}</span>
                <span className="item-quantity">Quantity: {item.quantity}</span>
                <span className="item-price">
                  {(item.price * item.quantity).toFixed(2)}TL
                </span>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total: {calculateTotal()}TL</span>
          </div>
          <a href="/payment">
            <button className="purchase-button" onClick={handlePurchase}>
              Purchase
            </button>
          </a>
          <a href="/">SUtore</a>
        </>
      ) : (
        <p className="empty-cart-message">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
