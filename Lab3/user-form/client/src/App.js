import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Fetch users
  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Add a new user
  const addUser = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      axios
        .post("http://localhost:5000/users", { name, email })
        .then((response) => {
          setUsers([...users, response.data]);
          setName("");
          setEmail("");
        })
        .catch((error) => console.error("Error adding user:", error));
    }
  };

  return (
    <div className="App">
      <h1>User Registration</h1>
      <form onSubmit={addUser}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <button type="submit">Register</button>
      </form>
      <h2>Registered Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
