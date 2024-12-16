import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RevenueCalc.css";

const RevenueCalculationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { start_date, end_date } = location.state || {};

  const [revenue, setRevenue] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // If no dates were passed, navigate back
    if (!start_date || !end_date) {
      setError("No date range provided.");
      return;
    }

    const fetchRevenue = async () => {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      const authHeader = `Basic ${btoa(`${username}:${password}`)}`;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/sales-manager/revenue/",
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
            errorData.error || "An error occurred while calculating revenue."
          );
          return;
        }

        const data = await response.json();
        setRevenue(data.revenue);
      } catch (err) {
        console.error("Error calculating revenue:", err);
        setError("Failed to calculate revenue. Please try again.");
      }
    };

    fetchRevenue();
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
            From {new Date(start_date).toLocaleString()} to{" "}
            {new Date(end_date).toLocaleString()}:
          </h3>
          <h2>{revenue}</h2>
        </div>
      )}

      <button className="action-button" onClick={handleBack}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default RevenueCalculationPage;
