import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading during submission
  const [errorMessage, setErrorMessage] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // State for payment success
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderId = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/order/", {
          headers: {
            Authorization: `Basic ${btoa(
              `${localStorage.getItem("username")}:${localStorage.getItem(
                "password"
              )}`
            )}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch the order ID.");
        }

        const orderData = await response.json();
        setOrderId(orderData.id); // Assuming the order ID is in the response
      } catch (error) {
        console.error("Error fetching order ID:", error);
        setErrorMessage("Failed to fetch the order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderId();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required.";
    if (!form.cardNumber || !/^\d{16}$/.test(form.cardNumber))
      newErrors.cardNumber = "Card number must be 16 digits.";
    if (!form.expiryDate || !/^\d{2}\/\d{2}$/.test(form.expiryDate))
      newErrors.expiryDate = "Expiry date must be in MM/YY format.";
    if (!form.cvv || !/^\d{3}$/.test(form.cvv))
      newErrors.cvv = "CVV must be 3 digits.";
    if (!form.billingAddress) newErrors.billingAddress = "Address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderId) {
      alert("Order ID not found. Please refresh and try again.");
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true); // Set loading state to true
      try {
        const response = await fetch("http://127.0.0.1:8000/checkout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(
              `${localStorage.getItem("username")}:${localStorage.getItem(
                "password"
              )}`
            )}`,
          },
          body: JSON.stringify({ order_id: orderId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          alert(errorData.error || "Payment failed. Please try again.");
          return;
        }

        localStorage.setItem("order_id", 0);
        setPaymentSuccess(true); // Show payment success message
        setTimeout(() => {
          navigate(`/invoice/${orderId}`);
        }, 3000);

        // Reset form
        setForm({
          name: "",
          cardNumber: "",
          expiryDate: "",
          cvv: "",
          billingAddress: "",
        });
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("An unexpected error occurred. Please try again.");
      } finally {
        setIsSubmitting(false); // Reset loading state
      }
    }
  };

  if (loading) {
    return <div className="loading-message">Loading order details...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (paymentSuccess) {
    return (
      <div className="payment-success-message">
        <div className="success-container">
          <img
            src={`${process.env.PUBLIC_URL}/payment-succesfull.png`}
            alt="Success Icon"
            className="success-image"
          />
          <h1 className="success-header">Your payment was successful</h1>
          <p className="success-paragraph">
            Thank you for your payment. <br />
            We will be in contact with more details shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="name">Name on Card</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name Surname"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="16"
          />
          {errors.cardNumber && (
            <span className="error-text">{errors.cardNumber}</span>
          )}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
            />
            {errors.expiryDate && (
              <span className="error-text">{errors.expiryDate}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="3"
            />
            {errors.cvv && <span className="error-text">{errors.cvv}</span>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="billingAddress">Address</label>
          <textarea
            id="billingAddress"
            name="billingAddress"
            value={form.billingAddress}
            onChange={handleChange}
            placeholder=""
          ></textarea>
          {errors.billingAddress && (
            <span className="error-text">{errors.billingAddress}</span>
          )}
        </div>
        <button
          type="submit"
          className={`payment-button ${isSubmitting ? "disabled" : ""}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Purchase"}
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
