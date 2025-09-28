import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './resetPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract token and email from query params
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const emailFromUrl = queryParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: emailFromUrl,
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Reset token is missing. Please request a new reset link.");
      navigate("/forgot-password"); // redirect to forgot password page if token is missing
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert("Please enter your email.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          token,
          newPassword: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Password reset successful! You can now login with your new password.");
        setFormData({ email: "", password: "", confirmPassword: "" });
        navigate("/login"); // redirect to login page
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Reset Password</h2>
        <p>Enter your email and new password below.</p>
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-field">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              readOnly={!!emailFromUrl} // if email comes from URL, make it readonly
            />
          </div>

          {/* New Password Field */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-btn" onClick={togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-btn" onClick={togglePassword}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
