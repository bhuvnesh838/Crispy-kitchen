import React, { useState, useEffect } from "react";
import './Home.css';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch recipes from backend
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

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = recipes.filter((recipe) => {
      // Search in title, category, and ingredients
      const titleMatch = recipe.title.toLowerCase().includes(term);
      const categoryMatch = recipe.category.toLowerCase().includes(term);
      const ingredientMatch = recipe.ingredients.some((ing) =>
        ing.toLowerCase().includes(term)
      );

      return titleMatch || categoryMatch || ingredientMatch;
    });

    setFilteredRecipes(filtered);
  };

  // Show recipe detail
  const handleRecipeClick = (recipe) => setSelectedRecipe(recipe);

  // Go back to recipe list
  const handleBack = () => setSelectedRecipe(null);

  return (
    <div>
      <h1>Food Recipe App</h1>

      {!selectedRecipe && (
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by name, category or ingredient..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
      )}

      {selectedRecipe ? (
        <div className="recipe-detail">
          <button onClick={handleBack}>Back</button>
          <h2>{selectedRecipe.title}</h2>
          {selectedRecipe.imageUrl && <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} />}

          <div className="recipe-flex">
            {/* Ingredients */}
            <div className="ingredients">
              <h3>Ingredients:</h3>
              <ul>
                {selectedRecipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="instructions">
              <h3>Instructions:</h3>
              <ol>
                {selectedRecipe.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Important Notes */}
            <div className="important-notes">
              <h3>Important Notes:</h3>
              <p><strong>Category:</strong> {selectedRecipe.category}</p>
              <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
              <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
              <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="recipe-list">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="recipe-card"
                onClick={() => handleRecipeClick(recipe)}
              >
                {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} />}
                <h3>{recipe.title}</h3>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>No recipes found!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
