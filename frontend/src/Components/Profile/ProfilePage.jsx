import React, { useState } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/update_user_fields/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${username}:${password}`)}`,
          },
          body: JSON.stringify({
            address: address,
            tax_id: taxId,
          }),
        }
      );

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        setMessage(
          errorData.error || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      setMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-page-container">
      <h2 className="profile-page-title">Update Profile</h2>
      <form onSubmit={handleSubmit} className="profile-page-form">
        <div className="profile-page-form-group">
          <label htmlFor="address" className="profile-page-label">
            Address:
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="profile-page-input"
            placeholder="Enter your address"
          />
        </div>
        <div className="profile-page-form-group">
          <label htmlFor="taxId" className="profile-page-label">
            Tax ID:
          </label>
          <input
            type="text"
            id="taxId"
            value={taxId}
            onChange={(e) => setTaxId(e.target.value)}
            className="profile-page-input"
            placeholder="Enter your Tax ID"
          />
        </div>
        {message && <p className="profile-page-message">{message}</p>}
        <button type="submit" className="profile-page-submit-button">
          Update
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
