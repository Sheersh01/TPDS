import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', author: '', rating: '', review_text: '' });
  const [filterRating, setFilterRating] = useState('');
  const [error, setError] = useState('');

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  // Fetch all reviews
  const fetchReviews = () => {
    axios.get('http://localhost:5001/reviews')
      .then(response => setReviews(response.data))
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setError('Failed to load reviews');
      });
  };

  // Fetch reviews by rating
  const filterReviews = () => {
    if (!filterRating) {
      fetchReviews();
      return;
    }
    axios.get(`http://localhost:5001/reviews/filter?rating=${filterRating})
      .then(response => setReviews(response.data))
      .catch(error => {
        console.error('Error filtering reviews:', error);
        setError('Failed to filter reviews');
      }`);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add or update a review
  const saveReview = (e) => {
    e.preventDefault();
    const { id, title, author, rating, review_text } = form;
    if (!title.trim() || !author.trim() || !rating || rating < 1 || rating > 5 || !review_text.trim()) {
      setError('All fields are required, and rating must be between 1 and 5');
      return;
    }

    if (id) {
      // Update existing review
      axios.put(`http://localhost:5001/reviews/${id}, { title, author, rating, review_text })
        .then(response => {
          setReviews(reviews.map(review => (review.id === id ? response.data : review)));
          resetForm();
          setError('');
        }`)
        .catch(error => {
          console.error('Error updating review:', error);
          setError(error.response?.data?.error || 'Failed to update review');
        });
    } else {
      // Add new review
      axios.post('http://localhost:5001/reviews', { title, author, rating, review_text })
        .then(response => {
          setReviews([...reviews, response.data]);
          resetForm();
          setError('');
        })
        .catch(error => {
          console.error('Error adding review:', error);
          setError(error.response?.data?.error || 'Failed to add review');
        });
    }
  };

  // Edit a review
  const editReview = (review) => {
    setForm(review);
  };

  // Delete a review
  const deleteReview = (id) => {
    axios.delete(`http://localhost:5001/reviews/${id})
      .then(() => {
        setReviews(reviews.filter(review => review.id !== id));
      }`)
      .catch(error => {
        console.error('Error deleting review:', error);
        setError('Failed to delete review');
      });
  };

  // Reset form
  const resetForm = () => {
    setForm({ id: null, title: '', author: '', rating: '', review_text: '' });
  };

  return (
    <div className="App">
      <h1>Book Review Hub</h1>
      <form onSubmit={saveReview} className="review-form">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleInputChange}
          placeholder="Book Title"
        />
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleInputChange}
          placeholder="Author"
        />
        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleInputChange}
          placeholder="Rating (1-5)"
          min="1"
          max="5"
        />
        <textarea
          name="review_text"
          value={form.review_text}
          onChange={handleInputChange}
          placeholder="Your Review"
        />
        <button type="submit">{form.id ? 'Update Review' : 'Add Review'}</button>
        {form.id && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>
      <div className="filter">
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map(r => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
        <button onClick={filterReviews}>Filter</button>
      </div>
      {error && <p className="error">{error}</p>}
      <h2>All Reviews</h2>
      <div className="reviews">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <h3>{review.title}</h3>
              <p><strong>Author:</strong> {review.author}</p>
              <p><strong>Rating:</strong> {'★'.repeat(review.rating)}</p>
              <p>{review.review_text}</p>
              <div className="review-actions">
                <button onClick={() => editReview(review)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteReview(review.id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p>No reviews yet! Add one above.</p>
        )}
      </div>
    </div>
  );
}

export default App;