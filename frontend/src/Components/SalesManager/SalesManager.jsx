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

  const handleNavigateToUpdatePricesPage = () => {
    navigate("/sales-manager/update-prices-page");
  };

  return (
    <div className="sales-manager-container">
      <h1>Sales Manager Dashboard</h1>
      <div className="dashboard-grid">
        <div className="section">
          <h2>Product Prices</h2>
          <button
            className="action-button1"
            onClick={handleNavigateToDiscountPage}
          >
            Go to Discount
          </button>
          <button
            className="action-button2"
            onClick={handleNavigateToUpdatePricesPage}
          >
            Go to Update
          </button>
        </div>
        <div className="section">
          <h2>Refund Evaluation</h2>
          <button
            className="action-button"
            onClick={handleNavigateToRefundPage}
          >
            Go to Refund Requests
          </button>
        </div>
        <div className="section">
          <h2>Revenue</h2>
          <button
            className="action-button"
            onClick={handleNavigateToRevenuePage}
          >
            Calculate Revenue
          </button>
        </div>
        <div className="section">
          <h2>Invoices</h2>
          <button
            className="action-button"
            onClick={handleNavigateToInvoicesPage}
          >
            View Invoices
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerPage;
