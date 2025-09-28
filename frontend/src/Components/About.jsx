import React from "react";
import './About.css';

const About = () => {
  return (
    <div className="about-container">

      {/* Header Section */}
      <div className="about-header">
        <h1>About Food Recipe </h1>
        <p>
          The <strong>Food Recipe App</strong> is your ultimate companion for exploring delicious recipes from around the world. 
          Whether you're a beginner cook or a seasoned chef, this app provides easy-to-follow instructions to create amazing meals.
        </p>
      </div>

      {/* Features Section */}
      <div className="about-section">
        <img src="https://media.istockphoto.com/id/1060592710/vector/cartoon-smiling-chef-character.jpg?s=612x612&w=0&k=20&c=nB7lZ9nONBxPYroTno_JnbTfKueGBwzATPNPYlq7BAM=" alt="Features" />
        <div className="text">
          <h2>Key Features</h2>
          <ul>
            <li>Browse a wide variety of recipes by category (Vegetarian, Non-Vegetarian, Desserts, Snacks, etc.)</li>
            <li>Step-by-step instructions to make cooking easier</li>
            <li>Detailed ingredients list with measurements</li>
            <li>Add your favorite recipes to your personal collection</li>
            <li>User authentication with signup, login, and password reset</li>
            <li>Search and filter recipes quickly</li>
          </ul>
        </div>
      </div>

      {/* Technology Section */}
      <div className="about-section">
        <img src="https://cdn5.vectorstock.com/i/1000x1000/72/99/setting-icon-vector-24647299.jpg" alt="Technology" />
        <div className="text">
          <h2>Technology Stack</h2>
          <p>
            This app is built using <strong>React.js</strong> for the frontend, <strong>Node.js</strong> and <strong>Express</strong> for the backend, 
            and <strong>MongoDB Atlas</strong> for storing recipes and user data. The UI is designed with modern CSS for a responsive, clean layout.
          </p>
        </div>
      </div>

      {/* Goal Section */}
      <div className="about-section">
        <img src="https://img.freepik.com/free-vector/hand-drawn-hungry-emoji-illustration_23-2151018070.jpg" alt="Goal" />
        <div className="text">
          <h2>Our Goal</h2>
          <p>
            Our goal is to make cooking accessible and fun for everyone. 
            With the Food Recipe App, you can discover new dishes, improve your culinary skills, 
            and share your favorite recipes with friends and family.
          </p>
        </div>
      </div>

      {/* Call-to-action Section */}
     <div className="about-cta">
  <h2>Get Started Today!</h2>
  <a href="/signup">Sign Up</a>
</div>

    </div>
  );
};

export default About;
