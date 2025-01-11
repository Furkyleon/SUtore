import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RevenueCalc.css";

const RevenueCalculationPage = () => {
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [revenue, setRevenue] = useState(null);
  const [chartUrl, setChartUrl] = useState("");
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

  const handleCalculateRevenue = async () => {
    setError("");
    setRevenue(null);
    setChartUrl("");
    setLoading(true);
    setHasFetched(true);

    if (!startDate || !endDate) {
      setError("Both start date and end date are required.");
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
        "http://127.0.0.1:8000/sales-manager/view-invoices_chart/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            start_date: start.toISOString().split("T")[0],
            end_date: end.toISOString().split("T")[0],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.error || "An error occurred while fetching revenue data."
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      setRevenue(data.total_discounted_revenue);
      setChartUrl("http://127.0.0.1:8000" + data.chart_url);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching revenue data:", err);
      setError("Failed to fetch revenue data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/sales-manager");
  };

  return (
    <div className="revenue-calculation-container">
      <h1>Revenue Calculation</h1>

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

        <button className="fetch-revenue-btn" onClick={handleCalculateRevenue}>
          Calculate Revenue
        </button>
      </div>

      {loading && <p>Loading revenue data...</p>}
      {error && <p className="error-message">{error}</p>}

      {hasFetched && revenue === null && !loading && !error && (
        <p className="no-revenue-message">
          No revenue data found for the given date range.
        </p>
      )}

      {revenue !== null && (
        <div className="revenue-result">
          <h3>
            From {new Date(startDate).toLocaleDateString()} to{" "}
            {new Date(endDate).toLocaleDateString()}:
          </h3>
          <h2>Total Discounted Revenue: {revenue} TL</h2>
        </div>
      )}

      {chartUrl && (
        <div className="chart-container">
          <h3>Discounted Revenue Chart</h3>
          <img src={chartUrl} alt="Discounted Revenue Chart" className="chart" />
        </div>
      )}

      <div className="center-button">
        <button className="action-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default RevenueCalculationPage;
