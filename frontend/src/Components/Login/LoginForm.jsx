import React, { useState } from "react";
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    const credentials = { username, password };
    console.log(username, password);

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

        console.log(username, password);

        alert(`Welcome, ${responseData.user.username || "user"}!`);
        navigate("/"); // Redirect to the main page

        // giriş yapılan kullanıcının sepeti doluysa


          try {
            const response = await fetch(
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

            if (!response.ok) {
              const errorData = await response.json();
              console.log("Error1");
              return;
            }

            const data = await response.json();
            console.log("Order assigned successfully:", data);
          } catch (error) {
            console.log("Error2");
          }
        
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
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
              type="username"
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
    </div>
  );
};

export default LoginForm;
