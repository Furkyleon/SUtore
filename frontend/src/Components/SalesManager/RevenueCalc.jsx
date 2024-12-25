import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RevenueCalc.css";

const RevenueCalculationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { start_date, end_date } = location.state || {};

  const [revenue, setRevenue] = useState(null);
  const [chartUrl, setChartUrl] = useState(""); // State to store chart URL
  const [error, setError] = useState("");

  useEffect(() => {
    // If no dates were passed, navigate back
    if (!start_date || !end_date) {
      setError("No date range provided.");
      return;
    }

    const fetchRevenueData = async () => {
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
              start_date: start_date,
              end_date: end_date,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(
            errorData.error || "An error occurred while fetching revenue data."
          );
          return;
        }

        const data = await response.json();
        setRevenue(data.total_discounted_revenue); // Set the total discounted revenue
        setChartUrl(data.chart_url); // Set the chart URL for display
      } catch (err) {
        console.error("Error fetching revenue data:", err);
        setError("Failed to fetch revenue data. Please try again.");
      }
    };

    fetchRevenueData();
  }, [start_date, end_date]);

  const handleBack = () => {
    navigate("/sales-manager");
  };

  return (
    <div className="revenue-calculation-container">
      <h1>Revenue Calculation</h1>
      {error && <p className="error-message">{error}</p>}

      {revenue !== null && (
        <div className="revenue-result">
          <h3>
            From {new Date(start_date).toLocaleDateString()} to{" "}
            {new Date(end_date).toLocaleDateString()}:
          </h3>
          <h2>Total Discounted Revenue: ${revenue.toFixed(2)}</h2>
        </div>
      )}

      {chartUrl && (
        <div className="chart-container">
          <h3>Discounted Revenue Chart</h3>
          <img src={chartUrl} alt="Discounted Revenue Chart" className="chart" />
        </div>
      )}

      <button className="action-button" onClick={handleBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default RevenueCalculationPage;
