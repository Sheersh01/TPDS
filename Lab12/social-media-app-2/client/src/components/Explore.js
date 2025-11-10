import React, { useState, useEffect } from "react";
import axios from "axios";

function Explore({ token }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5005/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, [token]);

  const handleFollow = async (followeeId) => {
    try {
      await axios.post(
        "http://localhost:5005/follow",
        { followee_id: followeeId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Followed user");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to follow user");
    }
  };

  return (
    <div className="explore">
      <h2>Explore Users</h2>
      <div className="user-list">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <h4>{user.username}</h4>
            <p>{user.bio}</p>
            <button onClick={() => handleFollow(user._id)}>Follow</button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Explore;
