import React, { useEffect, useState } from "react";
import TopRightNotification from "../NotificationModal/TopRightNotification"; // Adjust the path if necessary
import "./RefundPage.css";

const RefundRequests = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success", // Can be 'success', 'error', or 'warning'
  });

  const showNotification = (message, type = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  // Fetch pending refund requests
  useEffect(() => {
    fetch("http://127.0.0.1:8000/sales-manager/pending-refund-requests/", {
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
          throw new Error("Failed to fetch refund requests.");
        }
        return response.json();
      })
      .then((data) => {
        setRefundRequests(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching refund requests:", error);
        setError("Failed to load refund requests.");
        setLoading(false);
      });
  }, []);

  // Approve or Reject Refund Request
  const handleRefundDecision = (refundRequestId, decision) => {
    fetch("http://127.0.0.1:8000/sales-manager/review-refund-request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(
          `${localStorage.getItem("username")}:${localStorage.getItem(
            "password"
          )}`
        )}`,
      },
      body: JSON.stringify({ refund_request_id: refundRequestId, decision }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          showNotification(`Error: ${data.error}`, "error");
        } else {
          showNotification(data.message, "success");
          // Update the list of refund requests
          setRefundRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== refundRequestId)
          );
        }
      })
      .catch((error) => {
        console.error("Error processing refund request:", error);
        showNotification("Failed to process refund request.", "error");
      });
  };

  return (
    <div className="refund-requests-container">
      <h2 className="refund-requests-title">Pending Refund Requests</h2>
      {loading && <p>Loading refund requests...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && refundRequests.length > 0 ? (
        <ul className="refund-requests-list">
          {refundRequests.map((request) => (
            <li key={request.id} className="refund-request-item">
              <div className="refund-request-details">
                <p><strong>Product:</strong> {request.product_name}</p>
                <p><strong>Quantity:</strong> {request.quantity}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                <p>
                  <strong>Date Requested:</strong>{" "}
                  {new Date(request.request_date).toLocaleDateString()}
                </p>
              </div>
              <div className="refund-actions">
                <button
                  className="approve-button"
                  onClick={() => handleRefundDecision(request.id, "Approved")}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleRefundDecision(request.id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-refunds-message">No pending refund requests available.</p>
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

export default RefundRequests;
