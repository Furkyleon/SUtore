import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SalesManager.css";

const SalesManagerPage = () => {
  const navigate = useNavigate();

  // For Revenue Calculation
  const [revStartDate, setRevStartDate] = useState("");
  const [revEndDate, setRevEndDate] = useState("");
  const [revenueError, setRevenueError] = useState("");

  // For Invoices
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoiceError, setInvoiceError] = useState("");

  const handleNavigateToDiscountPage = () => {
    navigate("/sales-manager/discount-page");
  };

  const handleNavigateToRefundPage = () => {
    navigate("/sales-manager/refund-page");
  };

  const handleNavigateToRevenuePage = () => {
    // Reset error each time we attempt a new calculation
    setRevenueError("");

    if (!revStartDate || !revEndDate) {
      setRevenueError(
        "Both start date and end date are required for revenue calculation."
      );
      return;
    }

    navigate("/sales-manager/calculate-revenue", {
      state: {
        start_date: revStartDate,
        end_date: revEndDate,
      },
    });
  };

  const fetchInvoices = async () => {
    // Reset error each time we attempt to fetch invoices
    setInvoiceError("");

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    if (!startDate || !endDate) {
      setInvoiceError(
        "Both start date and end date are required to view invoices."
      );
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
        setInvoiceError(
          errorData.error || "An error occurred while fetching invoices."
        );
        return;
      }

      const data = await response.json();

      navigate("/sales-manager/invoices", {
        state: { invoices: data.invoices || [] },
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoiceError("Failed to fetch invoices. Please try again.");
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
          <input
            type="date"
            id="revenue-start-date"
            value={revStartDate}
            onChange={(e) => setRevStartDate(e.target.value)}
          />
          <label htmlFor="revenue-end-date">End Date:</label>
          <input
            type="date"
            id="revenue-end-date"
            value={revEndDate}
            onChange={(e) => setRevEndDate(e.target.value)}
          />
        </div>

        {revenueError && <p className="error-message">{revenueError}</p>}

        <button className="action-button" onClick={handleNavigateToRevenuePage}>
          Calculate Revenue
        </button>
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

        {invoiceError && <p className="error-message">{invoiceError}</p>}

        <button className="action-button" onClick={fetchInvoices}>
          Display Invoices
        </button>
      </div>
    </div>
  );
};

export default SalesManagerPage;
