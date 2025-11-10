import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Browse({ token }) {
  const [content, setContent] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const limit = 6;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/content?page=${page}&limit=${limit}&search=${search}`);
        setContent(response.data.content);
        setTotal(response.data.total);
      } catch (err) {
        setError('Failed to load content');
      }
    };
    fetchContent();
  }, [page, search]);

  const addToWatchlist = async (contentId) => {
    try {
      await axios.post(`http://localhost:5004/watchlist`, { content_id: contentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Added to watchlist');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to watchlist');
    }
  };

  return (
    <div className="browse">
      <h2>Browse Content</h2>
      <div className="search-bar">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search movies/series..." />
      </div>
      <div className="content-list">
        {content.length > 0 ? (
          content.map(item => (
            <div key={item.id} className="content-card">
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <p><strong>Genre:</strong> {item.genre}</p>
              <button onClick={() => addToWatchlist(item.id)}>Add to Watchlist</button>
            </div>
          ))
        ) : (
          <p>No content found</p>
        )}
      </div>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        <button disabled={page * limit >= total} onClick={() => setPage(page + 1)}>Next</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Browse;