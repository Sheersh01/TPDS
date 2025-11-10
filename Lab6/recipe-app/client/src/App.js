import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');

  // Fetch recipes on mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Fetch all recipes
  const fetchRecipes = () => {
    axios.get('http://localhost:5000/recipes')
      .then(response => setRecipes(response.data))
      .catch(error => {
        console.error('Error fetching recipes:', error);
        setError('Failed to load recipes');
      });
  };

  // Add a new recipe
  const addRecipe = (e) => {
    e.preventDefault();
    if (!name.trim() || !ingredients.trim() || !instructions.trim()) {
      setError('All fields are required');
      return;
    }
    axios.post('http://localhost:5000/recipes', { name, ingredients, instructions })
      .then(response => {
        setRecipes([...recipes, response.data]);
        setName('');
        setIngredients('');
        setInstructions('');
        setError('');
      })
      .catch(error => {
        console.error('Error adding recipe:', error);
        setError(error.response?.data?.error || 'Failed to add recipe');
      });
  };

  // Delete a recipe
  const deleteRecipe = (id) => {
    axios.delete(`http://localhost:5000/recipes/${id}`)
      .then(() => {
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      })
      .catch(error => {
        console.error('Error deleting recipe:', error);
        setError('Failed to delete recipe');
      });
  };

  return (
    <div className="App">
      <h1>Recipe Sharing Hub</h1>
      <form onSubmit={addRecipe} className="recipe-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe Name"
        />
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Ingredients (e.g., Flour, Sugar, Eggs)"
        />
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
        />
        <button type="submit">Add Recipe</button>
      </form>
      {error && <p className="error">{error}</p>}
      <h2>All Recipes</h2>
      <div className="recipes">
        {recipes.length > 0 ? (
          recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.name}</h3>
              <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
              <p><strong>Instructions:</strong> {recipe.instructions}</p>
              <button className="delete-btn" onClick={() => deleteRecipe(recipe.id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No recipes yet! Add one above.</p>
        )}
      </div>
    </div>
  );
}

export default App;