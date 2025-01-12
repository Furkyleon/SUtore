import React, { useState, useEffect } from "react";
import "./ManagerInvoices.css";

const ProductManagerInvoicesPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  // Set default start and end dates when the component mounts
  useEffect(() => {
    const currentDate = new Date();

    // Calculate the first day of the current month
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    // Calculate the last day of the current month
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Format dates as YYYY-MM-DD
    setStartDate(firstDayOfMonth.toISOString().split("T")[0]);
    setEndDate(lastDayOfMonth.toISOString().split("T")[0]);
  }, []);

  const fetchInvoices = async () => {
    setError("");
    setInvoices([]);
    setLoading(true);
    setHasFetched(true);

    if (!startDate || !endDate) {
      setError("Both start date and end date are required to view invoices.");
      setLoading(false);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setError("Start date cannot be later than end date.");
      setLoading(false);
      return;
    }

    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/sales-manager/view-invoices/?start_date=${start.toISOString().split('T')[0]}&end_date=${end.toISOString().split('T')[0]}`,
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
        setLoading(false);
        return;
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Failed to fetch invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-invoices-wrapper">
      <h1>View Invoices</h1>

      <div className="date-input-section">
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

        <button className="fetch-invoices-btn" onClick={fetchInvoices}>
          Fetch Invoices
        </button>
      </div>

      {loading && <p>Loading invoices...</p>}
      {error && <p className="error-message">{error}</p>}

      {hasFetched && invoices.length === 0 && !loading && !error && (
        <p className="no-invoices-message">
          No invoices found for the given date range.
        </p>
      )}

      {invoices.length > 0 && (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Username</th>
              <th>Date</th>
              <th>Total Amount (TL)</th>
              <th>Discounted Total (TL)</th>
              <th>Actions</th>
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
                <td>
                  <button
                    className="view-invoice-btn"
                    onClick={() => window.open(invoice.pdf_url, "_blank")}
                    disabled={!invoice.pdf_url || invoice.pdf_url === "PDF not found"}
                  >
                    View PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductManagerInvoicesPage;