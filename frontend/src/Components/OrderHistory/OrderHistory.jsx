import React, { useEffect, useState } from "react";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order history when the component mounts
  useEffect(() => {
    fetch("http://127.0.0.1:8000/order/history/", {
      headers: {
        Authorization: `Basic ${btoa(
          `${localStorage.getItem("username")}:${localStorage.getItem(
            "password"
          )}`
        )}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order history.");
        }
        return response.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
        setError("Failed to load order history. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="order-history-container">
      <h2>Order History</h2>
      {loading && <p>Loading order history...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.order_id} className="order-item">
              <div className="order-header">
                <span className="order-id">Order ID: {order.order_id}</span>
                <span className="order-date">
                  Date: {new Date(order.date_ordered).toLocaleDateString()}
                </span>
                <span className="order-total">
                  Total:{" "}
                  {order.items
                    .reduce(
                      (total, item) => total + parseFloat(item.subtotal),
                      0
                    )
                    .toFixed(2)}{" "}
                  TL
                </span>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    <span className="item-name">{item.product}</span>
                    <span className="item-quantity">Qty: {item.quantity}</span>
                    <span className="item-price">
                      {item.subtotal} TL
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-history-message">You have no order history.</p>
      )}
    </div>
  );
};

export default OrderHistory;
