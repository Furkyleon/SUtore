import React from "react";
import { useNavigate } from "react-router-dom";
import "./SalesManager.css";

const SalesManagerPage = () => {
  const navigate = useNavigate();

  const handleNavigateToDiscountPage = () => {
    navigate("/sales-manager/discount-page");
  };

  const handleNavigateToRefundPage = () => {
    navigate("/sales-manager/refund-page");
  };

  const handleNavigateToRevenuePage = () => {
    navigate("/sales-manager/calculate-revenue");
  };

  const handleNavigateToInvoicesPage = () => {
    navigate("/manager/invoices");
  };

  return (
    <div className="sales-manager-container">
      <h1>Sales Manager Dashboard</h1>
      <div className="dashboard-grid">
        <div className="section">
          <h2>Product Discount Page</h2>
          <button
            className="action-button"
            onClick={handleNavigateToDiscountPage}
          >
            Go to Discount Page
          </button>
        </div>
        <div className="section">
          <h2>Refund Request Evaluation</h2>
          <button
            className="action-button"
            onClick={handleNavigateToRefundPage}
          >
            Go to Refund Requests
          </button>
        </div>
        <div className="section">
          <h2>Revenue Calculation</h2>
          <button
            className="action-button"
            onClick={handleNavigateToRevenuePage}
          >
            Calculate Revenue
          </button>
        </div>
        <div className="section">
          <h2>View Invoices</h2>
          <button
            className="action-button"
            onClick={handleNavigateToInvoicesPage}
          >
            Display Invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerPage;
