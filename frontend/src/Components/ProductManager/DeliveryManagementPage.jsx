import React, { useState, useEffect } from "react";
import "./DeliveryManagementPage.css";

const DeliveryManagementPage = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeliveries = async () => {
      setError("");
      setLoading(true);

      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

      try {
        const response = await fetch("http://127.0.0.1:8000/deliveries/", {
          method: "GET",
          headers: {
            Authorization: authHeader,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "An error occurred while fetching deliveries.");
          return;
        }

        const data = await response.json();
        if (data.message === "No deliveries found.") {
          setDeliveries([]);
        } else {
          setDeliveries(data);
        }
      } catch (err) {
        setError("Failed to fetch deliveries. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

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
              <th>Created At</th>
              <th>Updated At</th>
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
                <td>{new Date(delivery.created_at).toLocaleString()}</td>
                <td>{new Date(delivery.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveryManagementPage;
