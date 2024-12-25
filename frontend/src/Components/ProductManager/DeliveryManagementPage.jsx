import React, { useState, useEffect } from "react";
import "./DeliveryManagementPage.css";

const DeliveryManagementPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState(null); // To track the delivery being updated
  const [newStatus, setNewStatus] = useState(""); // New status for the delivery
  const [newAddress, setNewAddress] = useState(""); // New address for the delivery
  const [updateError, setUpdateError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      setError("");
      setLoading(true);

      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/product-manager/deliveries/",
          {
            method: "GET",
            headers: {
              Authorization: authHeader,
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "An error occurred while fetching deliveries.");
          return;
        }

        const data = await response.json();
        setDeliveries(data);
      } catch (err) {
        setError("Failed to fetch deliveries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleUpdateDelivery = async (deliveryId) => {
    setUpdateError("");
    setUpdateMessage("");

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/product-manager/update_delivery_status/${deliveryId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            status: newStatus,
            delivery_address: newAddress,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setUpdateError(data.error || "Failed to update delivery.");
        return;
      }

      setUpdateMessage("Delivery updated successfully.");
      // Update the delivery in the local state
      setDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.delivery_id === deliveryId
            ? { ...delivery, status: newStatus || delivery.status, delivery_address: newAddress || delivery.delivery_address }
            : delivery
        )
      );

      // Clear the form
      setSelectedDelivery(null);
      setNewStatus("");
      setNewAddress("");
    } catch (err) {
      setUpdateError("Failed to update delivery. Please try again.");
    }
  };

  return (
    <div className="delivery-management-wrapper">
      <h1>Delivery Management</h1>

      {loading && <p>Loading deliveries...</p>}
      {error && <p className="error-message">{error}</p>}

      {deliveries.length === 0 && !loading && !error && (
        <p className="no-deliveries-message">No deliveries found.</p>
      )}

      {deliveries.length > 0 && (
        <table className="deliveries-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price (TL)</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.delivery_id}>
                <td>{delivery.delivery_id}</td>
                <td>{delivery.customer_username}</td>
                <td>{delivery.product_name}</td>
                <td>{delivery.quantity}</td>
                <td>{delivery.total_price.toFixed(2)}</td>
                <td>{delivery.delivery_address}</td>
                <td>{delivery.status}</td>
                <td>
                <button
                    className="update-button"
                    onClick={() => setSelectedDelivery(delivery)}
                >
                    Update
                </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedDelivery && (
        <div className="update-delivery-form">
          <h2>Update Delivery</h2>
          <p>Delivery ID: {selectedDelivery.delivery_id}</p>
          <label>
            New Status:
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="In-transit">In-transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
          <label>
            New Address:
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Enter new address"
            />
          </label>
          <button onClick={() => handleUpdateDelivery(selectedDelivery.delivery_id)}>
            Submit
          </button>
          <button onClick={() => setSelectedDelivery(null)}>Cancel</button>
          {updateError && <p className="error-message">{updateError}</p>}
          {updateMessage && <p className="success-message">{updateMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default DeliveryManagementPage;
