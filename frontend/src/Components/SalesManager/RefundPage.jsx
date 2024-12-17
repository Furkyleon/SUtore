import React, { useEffect, useState } from "react";
import "./RefundPage.css";

const RefundRequests = () => {
  const [refundRequests, setRefundRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          alert(`Error: ${data.error}`);
        } else {
          alert(data.message);
          // Update the list of refund requests
          setRefundRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== refundRequestId)
          );
        }
      })
      .catch((error) => {
        console.error("Error processing refund request:", error);
        alert("Failed to process refund request.");
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
            <p><strong>Product:</strong> {request.order_item.product}</p>
            <p><strong>Quantity:</strong> {request.order_item.quantity}</p>
            <p><strong>Reason:</strong> {request.reason}</p>
            <p>
              <strong>Date Requested:</strong>{" "}
              {new Date(request.date_requested).toLocaleDateString()}
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
</div>

  );
};

export default RefundRequests;
