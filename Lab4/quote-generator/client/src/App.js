import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [quote, setQuote] = useState({ text: "", author: "" });
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch random quote on mount
  useEffect(() => {
    fetchQuote();
    fetchFavorites();
  }, []);

  // Fetch random quote
  const fetchQuote = () => {
    axios
      .get("http://localhost:5000/quote")
      .then((response) => setQuote(response.data))
      .catch((error) => console.error("Error fetching quote:", error));
  };

  // Fetch favorite quotes
  const fetchFavorites = () => {
    axios
      .get("http://localhost:5000/favorites")
      .then((response) => setFavorites(response.data))
      .catch((error) => console.error("Error fetching favorites:", error));
  };

  // Add quote to favorites
  const addToFavorites = () => {
    axios
      .post("http://localhost:5000/favorites", quote)
      .then((response) => {
        setFavorites([...favorites, response.data]);
        setMessage("Added to favorites!");
        setTimeout(() => setMessage(""), 2000);
      })
      .catch((error) => {
        setMessage(error.response.data.error);
        setTimeout(() => setMessage(""), 2000);
      });
  };

  return (
    <div className="App">
      <h1>Random Quote Generator</h1>
      <div className="quote-card">
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
        <button onClick={fetchQuote}>New Quote</button>
        <button onClick={addToFavorites}>Add to Favorites</button>
      </div>
      {message && <p className="message">{message}</p>}
      <h2>Your Favorite Quotes</h2>
      <div className="favorites">
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div key={fav.id} className="favorite-card">
              <p>
                "{fav.text}" — {fav.author}
              </p>
            </div>
          ))
        ) : (
          <p>No favorites yet!</p>
        )}
      </div>
    </div>
  );
}

export default App;
