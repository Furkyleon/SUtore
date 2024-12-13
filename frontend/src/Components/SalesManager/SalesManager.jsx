import React, { useState } from "react";
import "./SalesManager.css";
import { useNavigate } from "react-router-dom";

const SalesManagerPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  const handleNavigateToDiscountPage = () => {
    navigate("/discountpage"); // Matches the route you defined
  };

  const fetchInvoices = async () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
  
    if (!startDate || !endDate) {
      setError("Both start date and end date are required.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/sales-manager/view-invoices/?start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: authHeader,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred while fetching invoices.");
        return;
      }
  
      const data = await response.json();
      setInvoices(data.invoices || []);
      setError(data.message || ""); // Clear the error if a message is returned
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices. Please try again.");
    }
  };
  

  return (
    <div className="sales-manager-container">
      <h1>Sales Manager Dashboard</h1>

      {/* Section: Discount on Products */}
      <div className="section">
        <h2>Discount on Products</h2>
        <button className="action-button" onClick={handleNavigateToDiscountPage}>
          Apply Discount
        </button>
      </div>

      {/* Section: Viewing Invoices */}
      <div className="section">
        <h2>View Invoices</h2>
        <label htmlFor="start-date">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="end-date">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="action-button" onClick={fetchInvoices}>
          Fetch Invoices
        </button>

        {error && <p className="error">{error}</p>}

        {/* Placeholder for invoice list */}
        <div className="invoice-list">
          {invoices.length > 0 ? (
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Discounted Total</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.order_id}>
                    <td>{invoice.order_id}</td>
                    <td>{invoice.customer_username}</td>
                    <td>{new Date(invoice.date).toLocaleDateString()}</td>
                    <td>{invoice.total_amount.toFixed(2)} TL</td>
                    <td>{invoice.discounted_total.toFixed(2)} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No invoices to display.</p>
          )}
        </div>
      </div>

      {/* Section: Revenue Calculation */}
      <div className="section">
        <h2>Revenue Calculation</h2>
        <label htmlFor="revenue-start-date">Start Date:</label>
        <input type="date" id="revenue-start-date" />
        <label htmlFor="revenue-end-date">End Date:</label>
        <input type="date" id="revenue-end-date" />
        <button className="action-button">Calculate Revenue</button>

        {/* Placeholder for chart */}
        <div className="chart-placeholder">
          <p>Chart will be displayed here.</p>
        </div>
      </div>

      {/* Section: Refund Request Evaluation */}
      <div className="section">
        <h2>Refund Request Evaluation</h2>
        <button className="action-button">Fetch Refund Requests</button>

        {/* Placeholder for refund list */}
        <div className="refund-list">
          <p>No refund requests to display.</p>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerPage;
