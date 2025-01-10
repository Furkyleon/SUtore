import React, { useState } from "react";
import "./RefundReasonModal.css";

const RefundReasonModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim() === "") {
      alert("Please provide a reason for your refund request.");
      return;
    }
    onSubmit(reason);
    setReason(""); // Reset input after submission
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="refund-reason-overlay">
      <div className="refund-reason-modal">
        <h3>Refund Request</h3>
        <textarea
          placeholder="Enter the reason for your refund..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
        ></textarea>
        <div className="refund-reason-buttons">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundReasonModal;
