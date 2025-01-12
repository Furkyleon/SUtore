import React, { useEffect, useState } from "react";
import TopRightNotification from "../NotificationModal/TopRightNotification";
import "./DeliveryManagement.css";

const DeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Fetch orders and deliveries when the component mounts
  useEffect(() => {
    const fetchOrdersAndDeliveries = async () => {
      try {
        const [ordersResponse, deliveriesResponse] = await Promise.all([
          fetch("http://127.0.0.1:8000/order/history/", {
            headers: {
              Authorization: `Basic ${btoa(
                `${localStorage.getItem("username")}:${localStorage.getItem(
                  "password"
                )}`
              )}`,
            },
          }),
          fetch("http://127.0.0.1:8000/product-manager/deliveries/", {
            headers: {
              Authorization: `Basic ${btoa(
                `${localStorage.getItem("username")}:${localStorage.getItem(
                  "password"
                )}`
              )}`,
            },
          }),
        ]);

        if (!ordersResponse.ok || !deliveriesResponse.ok) {
          throw new Error("Failed to fetch data.");
        }

        const ordersData = await ordersResponse.json();
        const deliveriesData = await deliveriesResponse.json();

        setOrders(ordersData);
        setDeliveries(deliveriesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load orders and deliveries.");
        setLoading(false);
      }
    };

    fetchOrdersAndDeliveries();
  }, []);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  // Handle order status update
  const updateOrderStatus = (orderId, newStatus) => {
    fetch(
      `http://127.0.0.1:8000/product-manager/update_delivery_status/${orderId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(
            `${localStorage.getItem("username")}:${localStorage.getItem(
              "password"
            )}`
          )}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showNotification(`Error: ${data.error}`, "error");
        } else {
          showNotification("Order status updated successfully.", "success");
          // Refresh orders list
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === orderId
                ? { ...order, status: newStatus }
                : order
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        showNotification("Failed to update order status.", "error");
      });
  };

  // Get deliveries for a specific order
  const getOrderDeliveries = (orderId) => {
    return deliveries.filter((delivery) => delivery.order_id === orderId);
  };

  return (
    <div className="delivery-management-container">
      <h2>Delivery Management</h2>
      {loading && <p>Loading orders and deliveries...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && orders.length > 0 ? (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.order_id} className="order-item">
              <div className="order-header">
                <span className="order-id">Order ID: {order.order_id}</span>
                <span className="order-status">Status: {order.status}</span>
                <span className="order-total">
                  Total Price:{" "}
                  {order.items
                    .reduce(
                      (total, item) => total + parseFloat(item.subtotal || 0),
                      0
                    )
                    .toFixed(2)}{" "}
                  TL
                </span>
                <select
                  className="status-dropdown"
                  onChange={(e) =>
                    updateOrderStatus(order.order_id, e.target.value)
                  }
                  value={order.status}
                >
                  <option value="Processing">Processing</option>
                  <option value="In-transit">In-transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <ul className="delivery-items">
                {getOrderDeliveries(order.order_id).map((delivery) => (
                  <li key={delivery.delivery_id} className="delivery-item">
                    <span>Delivery ID: {delivery.delivery_id}</span>
                    <span>Customer ID: {delivery.customer_id}</span>
                    <span>Product ID: {delivery.product_id}</span>
                    <span>Quantity: {delivery.quantity}</span>
                    <span>
                      Total Price: {delivery.total_price.toFixed(2)} TL
                    </span>
                    <span>Delivery Address: {delivery.delivery_address}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}

      <TopRightNotification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default DeliveryManagement;
