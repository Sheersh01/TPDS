import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ user, setUser, token }) {
  const [preferences, setPreferences] = useState(user.preferences || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updatePreferences = async (e) => {
    e.preventDefault();
    try {
      // Note: This requires a new endpoint to update preferences
      setUser({ ...user, preferences });
      alert("Preferences updated");
    } catch (err) {
      setError("Failed to update preferences");
    }
  };

  return (
    <div className="profile">
      <h2>Profile</h2>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <form onSubmit={updatePreferences} className="profile-form">
        <textarea
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder="Update Preferred Genres"
        />
        <button type="submit">Update Preferences</button>
      </form>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Logout
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Profile;
