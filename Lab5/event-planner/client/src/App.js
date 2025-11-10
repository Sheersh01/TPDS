import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events
  const fetchEvents = () => {
    axios.get('http://localhost:5000/events')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
  };

  // Add a new event
  const addEvent = (e) => {
    e.preventDefault();
    if (title.trim() && date.trim()) {
      axios.post('http://localhost:5000/events', { title, date, description })
        .then(response => {
          setEvents([...events, response.data]);
          setTitle('');
          setDate('');
          setDescription('');
        })
        .catch(error => console.error('Error adding event:', error));
    }
  };

  // Filter events by date
  const filterEvents = () => {
    axios.get(`http://localhost:5000/events/filter?date=${filterDate}`)
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error filtering events:', error));
  };

  return (
    <div className="App">
      <h1>Event Planner</h1>
      <form onSubmit={addEvent} className="event-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Event Description"
        />
        <button type="submit">Add Event</button>
      </form>
      <div className="filter">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button onClick={filterEvents}>Filter by Date</button>
        <button onClick={fetchEvents}>Show All</button>
      </div>
      <h2>Upcoming Events</h2>
      <div className="events">
        {events.length > 0 ? (
          events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>Date: {event.date}</p>
              <p>{event.description || 'No description'}</p>
            </div>
          ))
        ) : (
          <p>No events yet!</p>
        )}
      </div>
    </div>
  );
}

export default App;