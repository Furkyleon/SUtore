import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Invoice.css";

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        // Find the order with the specified orderId

        const foundOrder = data.find(
          (order) => order.order_id === parseInt(orderId, 10)
        );
        if (!foundOrder) {
          throw new Error("Order not found.");
        }
        setOrder(foundOrder);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        setError(
          error.message || "Failed to load order details. Please try again."
        );
        setLoading(false);
      });
  }, [orderId]);

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="invoice-container">
      <h1>Invoice for Order #{order.order_id}</h1>
      <div className="invoice-details">
        <h4>Ordered Products:</h4>
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              <strong>{item.product}</strong>
              <br />
              Quantity: {item.quantity}
              <br />
              Total: {parseFloat(item.discount_subtotal).toFixed(2)} TL
            </li>
          ))}
        </ul>
      </div>
      <p className="total-price">
        <strong>Total Price: </strong>
        {order.items
          .reduce(
            (total, item) => total + parseFloat(item.discount_subtotal),
            0
          )
          .toFixed(2)}{" "}
        TL
      </p>
    </div>
  );
};

export default Invoice;
