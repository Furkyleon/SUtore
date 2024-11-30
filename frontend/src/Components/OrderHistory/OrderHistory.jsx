import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const viewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

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
                <span className="order-status">Order Status: {order.status}</span>
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
                <button
                  className="view-invoice-button"
                  onClick={() => viewInvoice(order.order_id)}
                >
                  View Invoice
                </button>
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    <span className="item-name">{item.product}</span>
                    <span className="item-quantity">
                      Quantity: {item.quantity}
                    </span>
                    <span className="item-price">{item.subtotal} TL</span>
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
