import React, { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import TopRightNotification from "../NotificationModal/TopRightNotification"; // Import TopRightNotification

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
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

    const credentials = { username, password };

    try {
      // Make the login request
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const responseData = await response.json();

        // Save credentials in localStorage for Basic Authentication
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("role", responseData.user.role);
        localStorage.setItem("order_id", responseData.user.order_id);

        console.log(username, password, responseData.user.role);

        // Show welcome notification instead of alert
        showNotification(`Welcome, ${responseData.user.username || "user"}!`, "success");

        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 1200);

        // Assign the cart to the logged-in user
        try {
          const cartResponse = await fetch(
            "http://127.0.0.1:8000/cart/assign_to_user/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${btoa(
                  `${localStorage.getItem("username")}:${localStorage.getItem(
                    "password"
                  )}`
                )}`,
              },
              body: JSON.stringify({
                order_id: localStorage.getItem("order_id"),
              }),
            }
          );

          if (!cartResponse.ok) {
            const cartErrorData = await cartResponse.json();
            console.log("Error assigning cart to user:", cartErrorData.error);
            return;
          }

          const cartData = await cartResponse.json();
          console.log("Order assigned successfully:", cartData);
        } catch (error) {
          console.log("Error assigning cart to user:", error);
        }
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || "Login failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during login:", error);
      showNotification("An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="login-form-container">
      <h1 className="page-title">
        <a href="/">SUtore</a>
      </h1>

      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="icon" />
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

          <button type="submit">Login</button>
          <div className="register-link">
            <p>
              Do not have an account? <Link to="/register">Register</Link>
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
      customClass="custom-login-notification" // Add custom class
    />

    </div>
  );
};

export default LoginForm;
