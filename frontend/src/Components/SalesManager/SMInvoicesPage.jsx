import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./SMInvoicesPage.css";

const InvoicesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const invoices = location.state?.invoices || [];

  const handleBackClick = () => {
    navigate("/sales-manager"); // Adjust this path as needed
  };

  return (
    <div className="invoices-container">
      <h1>Invoices for Selected Date Range</h1>

      {invoices.length === 0 ? (
        <p className="no-invoices-message">
          No invoices found for the given date range.
        </p>
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Username</th>
              <th>Date</th>
              <th>Total Amount (TL)</th>
              <th>Discounted Total (TL)</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index}>
                <td>{invoice.order_id}</td>
                <td>{invoice.customer_username}</td>
                <td>{new Date(invoice.date).toLocaleString()}</td>
                <td>{invoice.total_amount.toFixed(2)}</td>
                <td>{invoice.discounted_total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="invoices-footer">
        <button onClick={handleBackClick} className="back-button">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default InvoicesPage;
