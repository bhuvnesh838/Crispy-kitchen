import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './AdminHome.css';

const AdminHome = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  // ------------------- Get role from JWT -------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setRole(payload.role?.toLowerCase());
        if (payload.role?.toLowerCase() !== "admin") {
          alert("You are not authorized to access this page!");
          navigate("/");
        }
      } catch (err) {
        console.error("Invalid token", err);
        setRole(null);
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ------------------- Fetch Recipes -------------------
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/recipes");
        const data = await response.json();
        if (response.ok) {
          setRecipes(data);
          setFilteredRecipes(data);
        } else {
          console.error("Failed to fetch recipes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  // ------------------- Search -------------------
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(term) ||
      recipe.category.toLowerCase().includes(term) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(term))
    );
    setFilteredRecipes(filtered);
  };

  // ------------------- Delete Recipe -------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/recipes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFilteredRecipes(filteredRecipes.filter(r => r._id !== id));
      } else {
        alert(data.message || "Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // ------------------- Update Recipe -------------------
  const handleUpdate = (recipe) => {
    navigate(`/update-recipe/${recipe._id}`);
  };

  // ------------------- Dropdown actions -------------------
  const handleDropdownSelect = (option) => {
    setDropdownOpen(false);
    switch (option) {
      case "Add Recipe":
        navigate("/add-recipe");
        break;
      case "Review Analysis":
        alert("Open Review / Analysis Page");
        break;
      case "Manage Users":
        alert("Open Manage Users Page");
        break;
      case "Other Options":
        alert("Other Options");
        break;
      default:
        break;
    }
  };

  // ------------------- Close dropdown if clicked outside -------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="admin-home-container">
      <h1>Admin Dashboard</h1>

      <div className="admin-controls">
        <div className="dropdown" ref={dropdownRef}>
          <button className="add-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
            Actions ▾
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span>Options</span>
                <button className="close-btn" onClick={() => setDropdownOpen(false)}>×</button>
              </div>
              <button onClick={() => handleDropdownSelect("Add Recipe")}>Add Recipe</button>
              <button onClick={() => handleDropdownSelect("Analysis")}>Review Analysis</button>
              <button onClick={() => handleDropdownSelect("Manage Users")}>Manage Users</button>
              <button onClick={() => handleDropdownSelect("Other Options")}>Other Options</button>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Search by title, category or ingredient..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>

      {selectedRecipe ? (
        <div className="recipe-detail">
          <button className="back-btn" onClick={() => setSelectedRecipe(null)}>Back</button>
          <h2>{selectedRecipe.title}</h2>
          {selectedRecipe.imageUrl && <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} />}
          <div className="recipe-flex">
            <div className="ingredients">
              <h3>Ingredients:</h3>
              <ul>{selectedRecipe.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}</ul>
            </div>
            <div className="instructions">
              <h3>Instructions:</h3>
              <ol>{selectedRecipe.steps.map((step, idx) => <li key={idx}>{step}</li>)}</ol>
            </div>
            <div className="important-notes">
              <p><strong>Category:</strong> {selectedRecipe.category}</p>
              <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} min</p>
              <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
              <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="recipe-list">
          {filteredRecipes.length > 0 ? filteredRecipes.map(recipe => (
            <div key={recipe._id} className="recipe-card">
              {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} onClick={() => setSelectedRecipe(recipe)} />}
              <h3 onClick={() => setSelectedRecipe(recipe)}>{recipe.title}</h3>
              <div className="admin-buttons">
                <button onClick={() => handleUpdate(recipe)}>Update</button>
                <button onClick={() => handleDelete(recipe._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          )) : (
            <p>No recipes found!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
