import React from "react";
import "./TopRightNotification.css";

const TopRightNotification = ({
  isOpen,
  message,
  type = "success", // 'success', 'error', or 'warning'
  onClose,
  customClass = "", // Custom class for specific pages
}) => {
  return (
    <div
      className={`top-right-notification ${type} ${
        isOpen ? "show" : ""
      } ${customClass}`}
    >
      <p>{message}</p>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default TopRightNotification;
