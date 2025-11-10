import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home({ token }) {
  const [recommendedContent, setRecommendedContent] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/content/recommended`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendedContent(response.data);
      } catch (err) {
        setError('Failed to load recommendations');
      }
    };
    fetchRecommended();
  }, [token]);

  return (
    <div className="home">
      <h2>Welcome to StreamFlix</h2>
      <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Logout</button>
      <h3>Recommended for You</h3>
      <div className="content-list">
        {recommendedContent.length > 0 ? (
          recommendedContent.map(item => (
            <div key={item.id} className="content-card">
              <img src={item.thumbnail} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <p><strong>Genre:</strong> {item.genre}</p>
              <button onClick={() => navigate('/browse')}>Browse More</button>
            </div>
          ))
        ) : (
          <p>No recommendations yet</p>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Home;