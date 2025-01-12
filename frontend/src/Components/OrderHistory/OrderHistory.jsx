import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopRightNotification from "../NotificationModal/TopRightNotification";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";
import RefundReasonModal from "./RefundReasonModal";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    productId: null,
  });
  const [refundModal, setRefundModal] = useState({
    isOpen: false,
    productId: null,
    orderId: null,
  });

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
        setError("You did not order anything.");
        setLoading(false);
      });
  }, []);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  // Open and close confirmation modal
  const openConfirmationModal = (productId) => {
    setConfirmation({ isOpen: true, productId });
  };

  const closeConfirmationModal = () => {
    setConfirmation({ isOpen: false, productId: null });
  };

  // Open and close refund modal
  const openRefundModal = (productId, orderId) => {
    setRefundModal({ isOpen: true, productId, orderId });
  };

  const closeRefundModal = () => {
    setRefundModal({ isOpen: false, productId: null, orderId: null });
  };

  // Handle order cancellation
  const cancelOrder = (orderId) => {
    openConfirmationModal(orderId);
  };

  const handleConfirmCancel = () => {
    const orderId = confirmation.productId;

    fetch(`http://127.0.0.1:8000/order/cancel/${orderId}/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${localStorage.getItem("username")}:${localStorage.getItem(
            "password"
          )}`
        )}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showNotification(`Error: ${data.error}`, "error");
        } else {
          showNotification(data.message, "success");
          // Update the order status locally
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === orderId
                ? { ...order, status: "Cancelled" }
                : order
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error cancelling order:", error);
        showNotification("Failed to cancel order.", "error");
      });

    closeConfirmationModal();
  };

  // View invoice
  const viewInvoice = (orderId) => {
    navigate(`/invoice/${orderId}`);
  };

  // Handle refund submission
  const handleRefundSubmit = (reason) => {
    const { productId, orderId } = refundModal;

    fetch(`http://127.0.0.1:8000/order/itemsforrefund/${orderId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(
          `${localStorage.getItem("username")}:${localStorage.getItem(
            "password"
          )}`
        )}`,
      },
    })
      .then((response) => response.json())
      .then((orderItems) => {
        const orderItem = orderItems.find((item) => item.product === productId);

        if (!orderItem) {
          showNotification("Error: Order item not found.", "error");
          return;
        }

        const orderItemId = orderItem.id;

        fetch("http://127.0.0.1:8000/request-refund/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
              `${localStorage.getItem("username")}:${localStorage.getItem(
                "password"
              )}`
            )}`,
          },
          body: JSON.stringify({ order_item_id: orderItemId, reason }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              showNotification(`Error: ${data.error}`, "error");
            } else {
              showNotification(
                "Refund request submitted successfully.",
                "success"
              );
            }
          })
          .catch((error) => {
            console.error("Error requesting refund:", error);
            showNotification("Failed to submit refund request.", "error");
          });
      })
      .catch((error) => {
        console.error("Error fetching order items:", error);
        showNotification("Failed to retrieve order items.", "error");
      });

    closeRefundModal();
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
                <span className="order-status">Status: {order.status}</span>
                <span className="order-date">
                  Date: {new Date(order.date_ordered).toLocaleDateString()}
                </span>
                <span className="order-total">
                  Order Total: {" "}
                  {order.items
                    .reduce((total, item) => {
                      const itemTotal = parseFloat(
                        item.discount_subtotal || item.subtotal
                      );
                      return total + itemTotal;
                    }, 0)
                    .toFixed(2)}{" "}TL
                </span>

                <button
                  className="view-invoice-button"
                  onClick={() => viewInvoice(order.order_id)}
                >
                  View Invoice
                </button>
                {order.status === "Processing" && (
                  <button
                    className="cancel-order-button"
                    onClick={() => cancelOrder(order.order_id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-item-detail">
                    <span className="item-name">{item.product}</span>
                    <span className="item-quantity">
                      Quantity: {item.quantity}
                    </span>
                    <span className="item-price">
                      Total: {parseFloat(
                        item.discount_subtotal || item.subtotal
                      ).toFixed(2)}{" "}TL
                    </span>
                    {item.refund_status && item.refund_status !== "None" ? (
                      <span className="refund-status">
                        Refund Status: {item.refund_status}
                      </span>
                    ) : (
                      <button
                        className="refund-button"
                        onClick={() => openRefundModal(item.id, order.order_id)}
                      >
                        Request Refund
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <a className="start-shopping" href="/">
          Start shopping now!
        </a>
      )}

      <ConfirmationModal
        isOpen={confirmation.isOpen}
        message="Are you sure you want to cancel this order?"
        onConfirm={handleConfirmCancel}
        onCancel={closeConfirmationModal}
      />

      <RefundReasonModal
        isOpen={refundModal.isOpen}
        onClose={closeRefundModal}
        onSubmit={handleRefundSubmit}
      />

      <TopRightNotification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
      />
    </div>
  );
};

export default OrderHistory;
