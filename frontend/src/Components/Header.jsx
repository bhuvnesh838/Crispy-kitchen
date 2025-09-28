import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from '../assets/hand-drawn-hungry-emoji-illustration_23-2151048229.jpg'; // Make sure path & extension are correct
import './Header.css';

const Header = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
        setRole(payload.role);
      } catch (err) {
        console.error("Invalid token", err);
        setRole(null);
      }
    }
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Food Recipe</h1>
      </div>

      <nav>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/signup" style={styles.link}>Sign Up</Link>
        <Link to="/profile" style={styles.link}>My-Profile</Link>

        {role === "admin" && (
          <>
            <Link to="/add-recipe" style={styles.link}>Add Recipe</Link>
            <Link to="/Admin-Home" style={styles.link}>Admin Dashboard</Link>
          </>
        )}
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#ff7043",
    color: "#fff",
  },
  leftSection: {
    display: "flex",
    alignItems: "center"
  },
  logo: {
    height: "50px",
    width: "50px",
    marginRight: "10px",
    borderRadius: "8px",
  },
  title: {
    margin: 0,
  },
  link: {
    marginLeft: "15px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Header;
