import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import TopRightNotification from "../NotificationModal/TopRightNotification"; // Import TopRightNotification

const RegisterForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Notification state
  const [notification, setNotification] = useState({
    isOpen: false,
    message: "",
    type: "success", // 'success', 'error', or 'warning'
  });

  const showNotification = (message, type = "success") => {
    setNotification({ isOpen: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ isOpen: false, message: "", type: "success" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const data = { username, email, password };

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Show welcome notification instead of alert
        showNotification(
          `Welcome, ${responseData.user.username || "user"}!`,
          "success"
        );

        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || "Register failed", "error");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      showNotification("An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="register-form-container">
      <h1 className="page-title">
        <a href="/">SUtore</a>
      </h1>

      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className="input-box">
            <input
              type="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FaEnvelope className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="icon" />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button type="submit">Register</button>
          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>

      {/* Top-Right Notification */}
      <TopRightNotification
        isOpen={notification.isOpen}
        message={notification.message}
        type={notification.type}
        onClose={closeNotification}
        customClass="custom-register-notification" // Add custom class
      />
    </div>
  );
};

export default RegisterForm;
