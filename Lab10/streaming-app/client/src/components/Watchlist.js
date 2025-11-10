import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Watchlist({ token }) {
  const [watchlist, setWatchlist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/watchlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlist(response.data);
      } catch (err) {
        setError('Failed to load watchlist');
      }
    };
    fetchWatchlist();
  }, [token]);

  const removeFromWatchlist = async (contentId) => {
    try {
      await axios.delete(`http://localhost:5004/watchlist/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWatchlist(watchlist.filter(item => item.id !== contentId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from watchlist');
    }
  };

  return (
    <div className="watchlist">
      <h2>My Watchlist</h2>
      <div className="content-list">
        {watchlist.length > 0 ? (
          watchlist.map(item => (
            <div key={item.id} className="content-card">
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <p><strong>Genre:</strong> {item.genre}</p>
              <button className="delete-btn" onClick={() => removeFromWatchlist(item.id)}>Remove</button>
            </div>
          ))
        ) : (
          <p>Your watchlist is empty</p>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Watchlist;