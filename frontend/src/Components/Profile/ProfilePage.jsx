import React, { useState, useEffect } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [address, setAddress] = useState("");
  const [taxId, setTaxId] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  
  const authUsername = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  useEffect(() => {
    // Fetch user info on component mount
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/user/info/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${authUsername}:${password}`)}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setEmail(data.email);
          setAddress(data.address);
          setTaxId(data.tax_id);
          setRole(data.role);
        } else {
          setMessage("Failed to load user information.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching user information.");
      }
    };

    fetchUserInfo();
  }, [authUsername, password]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/update_user_fields/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`${authUsername}:${password}`)}`,
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
      <h2 className="profile-page-title">Profile</h2>
      <form onSubmit={handleSubmit} className="profile-page-form">
        <div className="profile-page-form-group">
          <label htmlFor="username" className="profile-page-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            disabled
            className="profile-page-input"
          />
        </div>
        <div className="profile-page-form-group">
          <label htmlFor="email" className="profile-page-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            className="profile-page-input"
          />
        </div>
        <div className="profile-page-form-group">
          <label htmlFor="role" className="profile-page-label">
            Role:
          </label>
          <input
            type="text"
            id="role"
            value={role}
            disabled
            className="profile-page-input"
          />
        </div>
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
