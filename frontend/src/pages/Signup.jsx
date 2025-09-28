import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(""); // For messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show temporary popup
  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2500); // hide after 2.5s
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showPopup("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showPopup(data.message || "Signup successful!");
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showPopup(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Error:", error);
      showPopup("An error occurred. Please try again.");
    }
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="signup-container">
      {popup && <div className="popup-message">{popup}</div>}

      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="button" className="toggle-btn" onClick={togglePassword}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="button" className="toggle-btn" onClick={togglePassword}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;
