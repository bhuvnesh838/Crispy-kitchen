import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import './addRecipe.css'; // reuse styling from AddRecipe

const UpdateRecipe = () => {
  const { id } = useParams(); // get recipe ID from URL
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(""); // popup message

  // ------------------- Admin Access Control using JWT -------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      showPopup("You must be logged in as admin!");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role?.toLowerCase() !== "admin") {
        showPopup("You are not authorized to access this page!");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      console.error("Invalid token", err);
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [navigate]);

  // ------------------- Fetch Recipe -------------------
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/recipes/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            title: data.title || "",
            description: data.description || "",
            ingredients: data.ingredients ? data.ingredients.join(', ') : "",
            steps: data.steps ? data.steps.join(', ') : "",
            cookingTime: data.cookingTime || "",
            servings: data.servings || "",
            category: data.category || "",
            difficulty: data.difficulty || "Medium",
            imageUrl: data.imageUrl || ""
          });
        } else {
          showPopup(data.message || "Failed to fetch recipe");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        showPopup("Error fetching recipe data");
      }
    };
    fetchRecipe();
  }, [id]);

  // ------------------- Handle Input Change -------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ------------------- Show popup -------------------
  const showPopup = (message) => {
    setPopup(message);
    setTimeout(() => setPopup(""), 2500);
  };

  // ------------------- Handle Form Submission -------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const ingredientsArray = formData.ingredients.split(',').map(i => i.trim());
      const stepsArray = formData.steps.split(',').map(s => s.trim());

      const response = await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "PUT",
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
        showPopup("Recipe updated successfully!");
        setTimeout(() => navigate("/admin-home"), 1500);
      } else {
        showPopup(data.message || "Failed to update recipe");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      showPopup("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recipe-container">
      {popup && <div className="popup-message">{popup}</div>}

      <h2>Update Recipe</h2>
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
          placeholder="Category"
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
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default UpdateRecipe;
