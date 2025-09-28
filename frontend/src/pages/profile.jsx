import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [popup, setPopup] = useState(""); // For messages
  const navigate = useNavigate();

  // Fetch user data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login"); // redirect if not logged in

      try {
        const res = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
        else {
          showPopup(data.message);
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Show temporary popup
  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2500); // hide after 2.5s
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    showPopup("Logged out successfully!");
    setTimeout(() => navigate("/login"), 1500);
  };

  if (!user) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-container">
      {popup && <div className="popup-message">{popup}</div>}

      <h2 className="profile-title">My Profile</h2>

      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
      </div>

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
