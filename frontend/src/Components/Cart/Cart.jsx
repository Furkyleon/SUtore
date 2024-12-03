import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});
  const [assignError, setAssignError] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      const myorderID = localStorage.getItem("order_id");
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");

      if (username && username !== "null" && password && password !== "null") {
        // Authenticated user
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/order/items/${0}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Basic ${btoa(`${username}:${password}`)}`,
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch cart items");
          const cartData = await response.json();
          setCartItems(cartData);
          console.log(cartData);
        } catch (err) {
          setError("Your cart is empty.");
        } finally {
          setLoading(false);
        }
      } else {
        // Authenticated user
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/order/items/${myorderID}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) throw new Error("Failed to fetch cart items");
          const cartData = await response.json();
          setCartItems(cartData);
          console.log(cartData);
        } catch (err) {
          setError("Your cart is empty.");
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchProductDetails = async () => {
      let myorderID = localStorage.getItem("order_id");
      console.log("My order ID: ", myorderID);
      try {
        const response = await fetch("http://127.0.0.1:8000/products/get_all/");
        if (!response.ok) throw new Error("Failed to fetch product details");
        const productData = await response.json();
        const productMap = {};
        productData.forEach((product) => {
          productMap[product.id] = product.name;
        });
        setProducts(productMap);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchCartItems();
    fetchProductDetails();
  }, []);

  const updateQuantity = async (itemId, operation) => {
    try {
      const quantityChange = operation === "increment" ? 1 : -1;

      const response = await fetch("http://127.0.0.1:8000/cart/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: itemId,
          quantity_change: quantityChange,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update item quantity.");
        return;
      }

      const data = await response.json();

      if (data.message === "Item removed from cart.") {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? { ...item, quantity: data.quantity, subtotal: data.subtotal }
              : item
          )
        );
      }
    } catch (error) {
      alert("An error occurred while updating the quantity. Please try again.");
    }
  };

  const deleteItem = async (itemId) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cart/delete/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item_id: itemId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to remove the item from the cart.");
        return;
      }

      const data = await response.json();
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      alert("An error occurred while removing the item. Please try again.");
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="cart-container-wrapper">
      <h2>Shopping Cart</h2>
      {loading && <p>Loading cart items...</p>}
      {error && <p className="error">{error}</p>}
      {assignError && <p className="error">{assignError}</p>}
      {!loading && !error && cartItems.length > 0 ? (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="item-name">{products[item.product]}</span>
                <span className="item-quantity">
                  <strong>Quantity:</strong> <span>{item.quantity}</span>
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(item.id, "increment")}
                  >
                    +
                  </button>
                  <button
                    className="quantity-button"
                    onClick={() => updateQuantity(item.id, "decrement")}
                  >
                    -
                  </button>
                </span>
                <span className="item-price">
                  Price per Unit: {parseFloat(item.price).toFixed(2)} TL
                </span>
                <span className="item-subtotal">
                  Subtotal:{" "}
                  {(parseFloat(item.price) * item.quantity).toFixed(2)} TL
                </span>
                <button
                  className="delete-button"
                  onClick={() => deleteItem(item.id)}
                  title="Remove item"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total: {calculateTotal()} TL</span>
          </div>
          <a href="/payment">
            <button className="purchase-button">Go to Payment</button>
          </a>
        </>
      ) : (
        <a className="start-shopping" href="/">
          Start shopping now!
        </a>
      )}
    </div>
  );
};

export default Cart;
