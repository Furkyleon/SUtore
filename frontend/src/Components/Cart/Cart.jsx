import React, { useState } from "react";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Laptop", price: 999.99, quantity: 1 },
    { id: 2, name: "Phone", price: 699.99, quantity: 2 },
    { id: 3, name: "Headphones", price: 199.99, quantity: 1 },
  ]);

  const handlePurchase = () => {
    alert("Purchase complete!");
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-container">
      <div className="cart">
        <h2>Shopping Cart</h2>
        {cartItems.length > 0 ? (
          <>
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">Quantity: {item.quantity}</span>
                  <span className="item-price">{(item.price * item.quantity).toFixed(2)}TL</span>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>Total: {calculateTotal()}TL</span>
            </div>
            <button className="purchase-button" onClick={handlePurchase}>
              Purchase
            </button>
          </>
        ) : (
          <p className="empty-cart-message">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
