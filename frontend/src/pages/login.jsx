import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
const [formData, setFormData] = useState({ email: "", password: "" });
const [showPassword, setShowPassword] = useState(false);

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  const response = await fetch("http://localhost:8080/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    toast.success("Login successful!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Save token in localStorage
    localStorage.setItem("token", data.token);

    // Redirect and force reload homepage
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } else {
    toast.error(data.message || "Login failed", {
      position: "top-right",
      autoClose: 3000,
    });
  }
} catch (error) {
  console.error("Error:", error);
  toast.error("An error occurred. Please try again.", {
    position: "top-right",
    autoClose: 3000,
  });
}


};

const togglePassword = () => setShowPassword((prev) => !prev);

return ( <div className="login-container"> <h2>Login</h2>


  <form onSubmit={handleSubmit} className="login-form">
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
      <button
        type="button"
        className="toggle-btn"
        onClick={togglePassword}
      >
        {showPassword ? "Hide" : "Show"}
      </button>
    </div>

    <button type="submit">Login</button>

    <p>
      Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
    </p>

    <div className="forgot-password">
      <Link to="/forgot-password">Forgot Password?</Link>
    </div>
  </form>

  {/* Toast Container */}
  <ToastContainer />
</div>


);
};

export default Login;
