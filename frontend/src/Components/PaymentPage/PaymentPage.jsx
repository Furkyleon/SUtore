import React, { useState } from "react";
import "./PaymentPage.css";
import { Link } from "react-router-dom";

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Payment Successful!");
      setForm({
        name: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        billingAddress: "",
      });
    }
  };

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
            placeholder="John Doe"
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
            <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
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
          <label htmlFor="billingAddress">Billing Address</label>
          <textarea
            id="billingAddress"
            name="billingAddress"
            value={form.billingAddress}
            onChange={handleChange}
            placeholder="123 Main St, City, Country"
          ></textarea>
          {errors.billingAddress && (
            <span className="error-text">{errors.billingAddress}</span>
          )}
        </div>
        <button type="submit" className="payment-button">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;