import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './forgotpassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Navigate automatically to reset password page with token & email
        navigate(`/reset-password?token=${encodeURIComponent(data.resetLink.split("token=")[1].split("&")[0])}&email=${encodeURIComponent(email)}`);
      } else {
        alert(data.message || "Failed to generate reset link");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-box">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
