import React, { useState, useEffect } from "react";
import './addRecipe.css';
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ Named import

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    servings: "",
    category: "",
    difficulty: "Medium",
    imageUrl: ""
  });

  const navigate = useNavigate();

  // ------------------- Admin Access Control -------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login first!");
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        alert("You are not authorized to access this page!");
        navigate("/"); // redirect non-admin users
      }
    } catch (err) {
      console.error("Invalid token:", err);
      alert("Invalid token! Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  // ------------------- Handle Input Change -------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------- Handle Form Submission -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const ingredientsArray = formData.ingredients.split(',').map(i => i.trim());
      const stepsArray = formData.steps.split(',').map(s => s.trim());

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          ingredients: ingredientsArray,
          steps: stepsArray
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Recipe added successfully!");
        setFormData({
          title: "",
          description: "",
          ingredients: "",
          steps: "",
          cookingTime: "",
          servings: "",
          category: "",
          difficulty: "Medium",
          imageUrl: ""
        });
        navigate("/recipes"); // redirect to recipes list
      } else {
        alert(data.message || "Failed to add recipe");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="add-recipe-container">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <input
          type="text"
          name="title"
          placeholder="Recipe Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <textarea
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={formData.ingredients}
          onChange={handleChange}
          required
        />
        <textarea
          name="steps"
          placeholder="Steps (comma separated)"
          value={formData.steps}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cookingTime"
          placeholder="Cooking Time (minutes)"
          value={formData.cookingTime}
          onChange={handleChange}
          min="1"
          required
        />
        <input
          type="number"
          name="servings"
          placeholder="Servings"
          value={formData.servings}
          onChange={handleChange}
          min="1"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Vegetarian, Dessert)"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
