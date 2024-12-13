import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesManager.css";

const SalesManagerPage = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState("");

  const handleNavigateToDiscountPage = () => {
    navigate("/sales-manager/discount-page");
  };

  const handleNavigateToRefundPage = () => {
    navigate("/sales-manager/refund-page");
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
        setError(
          errorData.error || "An error occurred while fetching invoices."
        );
        return;
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
      setError(data.message || "");
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices. Please try again.");
    }
  };

  return (
    <div className="sales-manager-container">
      <h1>Sales Manager Dashboard</h1>

      <div className="discount-refund">
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
      </div>

      <div className="section">
        <h2>Revenue Calculation</h2>

        <div className="date-input">
          <label htmlFor="revenue-start-date">Start Date:</label>
          <input type="date" id="revenue-start-date" />
          <label htmlFor="revenue-end-date">End Date:</label>
          <input type="date" id="revenue-end-date" />
        </div>

        <button className="action-button">Calculate Revenue</button>
      </div>

      <div className="section">
        <h2>View Invoices</h2>

        <div className="date-input">
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
        </div>

        <button className="action-button" onClick={fetchInvoices}>
          Display Invoices
        </button>
      </div>
    </div>
  );
};

export default SalesManagerPage;
