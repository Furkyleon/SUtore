import React, { useEffect, useState } from "react";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/order/items/", {
          headers: {
            Authorization: `Basic ${btoa(
              `${localStorage.getItem("username")}:${localStorage.getItem(
                "password"
              )}`
            )}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch cart items");
        const cartData = await response.json();
        setCartItems(cartData);
      } catch (err) {
        setError("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/"); // Endpoint for products
        if (!response.ok) throw new Error("Failed to fetch product details");
        const productData = await response.json();
        const productMap = {};
        productData.forEach((product) => {
          productMap[product.id] = product.name;
        });
        setProducts(productMap); // Store products as { id: name }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchCartItems();
    fetchProductDetails();
  }, []);

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return "0.00"; // Handle empty cart
    }
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0; // Convert price to a number
        const subtotal = price * item.quantity; // Calculate subtotal
        return total + subtotal;
      }, 0)
      .toFixed(2); // Format as a fixed-point number
  };

  const handlePurchaseClick = () => {
    // Update the alert or behavior here
    alert("Your purchase is being processed. Redirecting to payment...");
  };

  return (
    <div className="cart-container-wrapper">
      <h2>Shopping Cart</h2>
      {loading && <p>Loading cart items...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && cartItems.length > 0 ? (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="item-name">{products[item.product]}</span>
                <span className="item-quantity">Quantity: {item.quantity}</span>
                <span className="item-price">
                  Price per Unit: {parseFloat(item.price).toFixed(2)} TL
                </span>
                <span className="item-subtotal">
                  Subtotal:{" "}
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} TL
                </span>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total: {calculateTotal()} TL</span>
          </div>
          <a href="/payment">
            <button className="purchase-button" onClick={handlePurchaseClick}>
              Go to Payment
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
